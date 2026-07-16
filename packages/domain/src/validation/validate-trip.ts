import type { Trip, ValidationIssue, ValidationReport } from "../schemas/trip.js";
import { TripSchema } from "../schemas/trip.js";

function issue(
  partial: Omit<ValidationIssue, "autoFixable"> & { autoFixable?: boolean },
): ValidationIssue {
  return { autoFixable: false, ...partial };
}

export function validateTrip(trip: Trip, asOfDate = "2026-07-16"): ValidationReport {
  const issues: ValidationIssue[] = [];

  const parsed = TripSchema.safeParse(trip);
  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      issues.push(
        issue({
          id: `schema-${err.path.join(".")}`,
          ruleId: "schema.zod",
          severity: "critical",
          entityType: "trip",
          entityId: trip.slug ?? "unknown",
          fieldPath: err.path.join("."),
          message: err.message,
        }),
      );
    }
  }

  if (trip.startDate > trip.endDate) {
    issues.push(
      issue({
        id: "trip-date-order",
        ruleId: "temporal.trip-range",
        severity: "critical",
        entityType: "trip",
        entityId: trip.id,
        message: `Trip start ${trip.startDate} is after end ${trip.endDate}`,
        suggestedFix: "Correct startDate/endDate",
      }),
    );
  }

  for (const day of trip.days) {
    if (day.date < trip.startDate || day.date > trip.endDate) {
      issues.push(
        issue({
          id: `day-outside-${day.id}`,
          ruleId: "temporal.day-in-trip",
          severity: "error",
          entityType: "day",
          entityId: day.id,
          fieldPath: "date",
          message: `Day ${day.date} is outside trip dates`,
        }),
      );
    }

    const dest = trip.destinations.find((d) => d.city === day.city);
    if (dest) {
      if (day.date < dest.arrivalDate || day.date > dest.departureDate) {
        issues.push(
          issue({
            id: `day-city-window-${day.id}`,
            ruleId: "temporal.day-in-city",
            severity: "warning",
            entityType: "day",
            entityId: day.id,
            message: `${day.date} in ${day.city} outside stay ${dest.arrivalDate}–${dest.departureDate}`,
          }),
        );
      }
    }

    if (day.budget.lowMinor > day.budget.highMinor) {
      issues.push(
        issue({
          id: `budget-range-${day.id}`,
          ruleId: "budget.range-order",
          severity: "error",
          entityType: "day",
          entityId: day.id,
          message: "Budget lowMinor exceeds highMinor",
        }),
      );
    }

    const hasWeatherFallback = day.fallbackPlans.some(
      (f) => f.trigger === "weather",
    );
    if (day.weatherDependency !== "low" && !hasWeatherFallback) {
      issues.push(
        issue({
          id: `weather-fallback-${day.id}`,
          ruleId: "experience.weather-fallback",
          severity: "warning",
          entityType: "day",
          entityId: day.id,
          message: "Weather-sensitive day lacks a weather fallback",
          suggestedFix: "Add a fallbackPlans entry with trigger weather",
        }),
      );
    }

    const hasRecovery = day.fallbackPlans.some(
      (f) => f.trigger === "low-energy",
    );
    if (day.expectedEnergy === "intense" && !hasRecovery) {
      issues.push(
        issue({
          id: `recovery-${day.id}`,
          ruleId: "experience.recovery",
          severity: "info",
          entityType: "day",
          entityId: day.id,
          message: "Intense day has no low-energy fallback",
        }),
      );
    }

    const fixedCount = day.blocks.filter((b) => b.fixed).length;
    if (fixedCount > 4) {
      issues.push(
        issue({
          id: `overfixed-${day.id}`,
          ruleId: "experience.too-many-fixed",
          severity: "warning",
          entityType: "day",
          entityId: day.id,
          message: `Day has ${fixedCount} fixed blocks — leave room for reality`,
        }),
      );
    }
  }

  for (const claim of trip.claims) {
    if (
      claim.status === "researched" ||
      claim.status === "traveler-provided"
    ) {
      if (claim.sourceIds.length === 0 && claim.status === "researched") {
        issues.push(
          issue({
            id: `claim-nosource-${claim.id}`,
            ruleId: "research.claim-source",
            severity: "error",
            entityType: "claim",
            entityId: claim.id,
            message: `Researched claim lacks sourceIds: ${claim.statement}`,
          }),
        );
      }
    }
    if (claim.reverifyAfter && claim.reverifyAfter < asOfDate) {
      issues.push(
        issue({
          id: `claim-stale-${claim.id}`,
          ruleId: "research.stale",
          severity: "warning",
          entityType: "claim",
          entityId: claim.id,
          message: `Claim past reverifyAfter ${claim.reverifyAfter}`,
        }),
      );
    }
    for (const sid of claim.sourceIds) {
      if (!trip.sources.some((s) => s.id === sid)) {
        issues.push(
          issue({
            id: `claim-missing-source-${claim.id}-${sid}`,
            ruleId: "research.source-exists",
            severity: "error",
            entityType: "claim",
            entityId: claim.id,
            message: `Claim references missing source ${sid}`,
          }),
        );
      }
    }
  }

  // Currency consistency within each day
  for (const day of trip.days) {
    for (const block of day.blocks) {
      if (
        block.estimatedCost &&
        block.estimatedCost.currency !== day.budget.currency
      ) {
        issues.push(
          issue({
            id: `currency-mix-${day.id}-${block.id}`,
            ruleId: "budget.currency-mix",
            severity: "critical",
            entityType: "event",
            entityId: block.id,
            message: `Block currency ${block.estimatedCost.currency} differs from day ${day.budget.currency}`,
          }),
        );
      }
    }
  }

  // Privacy heuristics on string fields
  const secretPatterns = [
    { re: /\b[A-Z0-9]{6,}-\d{4,}\b/, label: "possible booking reference" },
    { re: /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/, label: "email address" },
    { re: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/, label: "phone-like number" },
  ];
  const blob = JSON.stringify(trip);
  for (const { re, label } of secretPatterns) {
    if (re.test(blob) && label === "email address") {
      // only flag if looks like personal (simple heuristic)
      issues.push(
        issue({
          id: `privacy-email`,
          ruleId: "privacy.email",
          severity: "warning",
          entityType: "trip",
          entityId: trip.id,
          message: `Public trip may contain an ${label}`,
        }),
      );
    }
  }

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  return {
    schemaVersion: "1.0.0",
    tripSlug: trip.slug,
    generatedAt: new Date().toISOString(),
    issues,
    criticalCount,
    errorCount,
    warningCount,
    passed: criticalCount === 0 && errorCount === 0,
  };
}
