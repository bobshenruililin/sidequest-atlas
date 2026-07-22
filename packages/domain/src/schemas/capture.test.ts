import { describe, expect, it } from "vitest";
import { CaptureRecordSchema } from "./capture.js";

describe("CaptureRecordSchema", () => {
  it("accepts a triaged compounding record", () => {
    const parsed = CaptureRecordSchema.parse({
      id: "2026-07-22-floor-tests",
      capturedAt: "2026-07-22T06:36:00.000Z",
      title: "Floor tests close medicine",
      rawText: "No medicine without surgery. Okay law with no magic circle.",
      spark: "Closes romantic medicine; keeps law on ordinary floor",
      domains: ["career"],
      ask: "use",
      visibility: "operator",
      status: "triaged",
      triangulation: {
        againstCanon: ["optionality rate", "floor-scenario rule"],
        informationGaps: ["written HKU transfer terms"],
        opportunityGaps: ["plain LLB if available"],
        falseBargains: ["keeping medicine as emotional backup"],
        corrections: ["surgery-required means medicine fails the floor test"],
        suggestedImplementations: [
          {
            action: "Ask HKU Law about plain LLB vs GLaw in writing",
            rationale: "GLaw electives kill science optionality for little TC gain",
            effort: "S",
            leverage: "high",
            owner: "bob",
          },
        ],
      },
    });
    expect(parsed.status).toBe("triaged");
    expect(parsed.triangulation?.suggestedImplementations).toHaveLength(1);
  });

  it("rejects bad ids", () => {
    expect(() =>
      CaptureRecordSchema.parse({
        id: "floor-tests",
        capturedAt: "2026-07-22T06:36:00.000Z",
        title: "x",
        rawText: "y",
        domains: ["career"],
      }),
    ).toThrow();
  });
});
