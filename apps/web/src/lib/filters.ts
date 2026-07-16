import type { BudgetMode, DayPlan } from "@sidequest-atlas/domain";

export interface ItineraryFilters {
  city: string;
  budgetMode: BudgetMode;
  weatherFallback: boolean;
  lowEnergy: boolean;
  fixedOnly: boolean;
  openChoices: boolean;
}

export const defaultItineraryFilters: ItineraryFilters = {
  city: "all",
  budgetMode: "balanced",
  weatherFallback: false,
  lowEnergy: false,
  fixedOnly: false,
  openChoices: false,
};

export function filterDays(
  days: DayPlan[],
  filters: ItineraryFilters,
): DayPlan[] {
  return days.filter((day) => {
    if (filters.city !== "all" && day.city !== filters.city) {
      return false;
    }

    if (filters.weatherFallback && !hasFallback(day, "weather")) {
      return false;
    }

    if (
      filters.lowEnergy &&
      day.expectedEnergy !== "recovery" &&
      day.expectedEnergy !== "light" &&
      !hasFallback(day, "low-energy")
    ) {
      return false;
    }

    if (filters.fixedOnly && !day.blocks.some((block) => block.fixed)) {
      return false;
    }

    if (filters.openChoices && !hasOpenChoice(day)) {
      return false;
    }

    return true;
  });
}

export function describeBudgetMode(mode: BudgetMode): string {
  switch (mode) {
    case "student":
      return "Student mode favors grocery baselines, cafeterias, and free civic interfaces.";
    case "splurge":
      return "Splurge mode highlights where paid experiences may deepen the thesis.";
    case "balanced":
      return "Balanced mode keeps normal days legible without hiding meaningful meals.";
  }
}

function hasFallback(day: DayPlan, trigger: "weather" | "low-energy"): boolean {
  return day.fallbackPlans.some((fallback) => fallback.trigger === trigger);
}

function hasOpenChoice(day: DayPlan): boolean {
  return day.blocks.some(
    (block) =>
      !block.fixed ||
      block.status === "idea" ||
      block.planningStatus === "candidate" ||
      block.verificationStatus === "unresearched",
  );
}
