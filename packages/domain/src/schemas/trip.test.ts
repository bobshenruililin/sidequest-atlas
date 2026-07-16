import { describe, expect, it } from "vitest";
import { dateInRange, isBefore } from "./datetime.js";
import { TripSchema } from "./trip.js";
import { validateTrip } from "../validation/validate-trip.js";

describe("datetime", () => {
  it("orders zoned times", () => {
    expect(
      isBefore(
        {
          localDate: "2026-08-15",
          localTime: "16:30",
          timeZone: "Europe/Stockholm",
          precision: "approximate-time",
          confirmationStatus: "traveler-provided",
        },
        {
          localDate: "2026-08-16",
          localTime: "10:30",
          timeZone: "Europe/Helsinki",
          precision: "approximate-time",
          confirmationStatus: "traveler-provided",
        },
      ),
    ).toBe(true);
  });

  it("checks date ranges", () => {
    expect(
      dateInRange("2026-08-10", { start: "2026-08-08", end: "2026-08-15" }),
    ).toBe(true);
  });
});

describe("TripSchema", () => {
  it("requires schemaVersion-compatible trip shape", () => {
    const result = TripSchema.safeParse({
      id: "t1",
      slug: "example",
      title: "Example",
      travelerId: "shen-ruililin",
      startDate: "2026-08-01",
      endDate: "2026-08-02",
      status: "idea",
      destinations: [],
      thesis: "Test thesis",
      questions: [],
      principles: [],
      days: [],
      budget: {
        baseCurrency: "EUR",
        confidence: "low",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("validateTrip", () => {
  it("flags day outside trip", () => {
    const report = validateTrip({
      schemaVersion: "1.0.0",
      id: "t1",
      slug: "example",
      title: "Example",
      travelerId: "shen",
      startDate: "2026-08-01",
      endDate: "2026-08-02",
      status: "planned",
      destinations: [],
      thesis: "x",
      questions: [],
      principles: [],
      anchors: [],
      majorChoices: [],
      decisions: [],
      days: [
        {
          id: "d1",
          date: "2026-08-10",
          city: "Oslo",
          country: "Norway",
          title: "Bad day",
          theme: "x",
          thesisQuestion: "?",
          weatherDependency: "low",
          expectedEnergy: "balanced",
          blocks: [],
          foodMode: ["supermarket"],
          budget: {
            lowMinor: 30000,
            highMinor: 70000,
            currency: "NOK",
            minorUnit: 2,
            includes: [],
            excludes: [],
            confidence: "low",
          },
          sidequestPotential: 3,
          fieldworkPrompts: [],
          socialPrompts: [],
          fallbackPlans: [],
          reservations: [],
          sourceIds: [],
          claimIds: [],
        },
      ],
      sidequests: [],
      budget: { baseCurrency: "EUR", exchangeRates: [], citySubtotals: [], exclusions: [], actualSpend: [], confidence: "low" },
      sources: [],
      claims: [],
      observations: [],
    });
    expect(report.passed).toBe(false);
    expect(report.issues.some((i) => i.ruleId === "temporal.day-in-trip")).toBe(
      true,
    );
  });
});
