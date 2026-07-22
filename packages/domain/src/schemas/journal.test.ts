import { describe, expect, it } from "vitest";
import {
  JournalEntrySchema,
  JournalReflectionSchema,
  journalFragmentRef,
} from "./journal.js";

describe("JournalEntrySchema", () => {
  it("accepts a vault day entry with fragments", () => {
    const entry = JournalEntrySchema.parse({
      id: "nordics-2026-2026-08-06",
      tripSlug: "nordics-2026",
      localDate: "2026-08-06",
      timeZone: "Europe/Oslo",
      createdAt: "2026-08-06T18:00:00.000Z",
      updatedAt: "2026-08-06T18:05:00.000Z",
      revision: 1,
      fragments: [
        {
          id: "frag-1",
          recordedAt: "2026-08-06T18:00:00.000Z",
          text: "Økern felt like an edge neighborhood, not a postcard.",
          prompt: "ordinary-life",
        },
      ],
    });
    expect(entry.visibility).toBe("vault");
    expect(entry.fragments).toHaveLength(1);
  });

  it("accepts a reflection with observation candidate", () => {
    const reflection = JournalReflectionSchema.parse({
      id: "ref-1",
      reflectedAt: "2026-08-06T19:00:00.000Z",
      depth: "quick",
      sourceRevision: 1,
      sourceDigest: "abc",
      insights: [
        {
          id: "ins-1",
          kind: "noticed",
          text: "Edge neighborhood vs postcard contrast",
          evidenceFragmentIds: ["frag-1"],
          confidence: "medium",
        },
      ],
      candidates: [
        {
          kind: "observation",
          id: "cand-1",
          dayId: "2026-08-06",
          category: "behavior",
          text: "Oslo edge neighborhood felt ordinary, not touristic.",
          certainty: "noticed",
          evidenceFragmentIds: ["frag-1"],
        },
      ],
    });
    expect(reflection.candidates[0]?.kind).toBe("observation");
  });

  it("builds journal fragment refs", () => {
    expect(journalFragmentRef("nordics-2026", "2026-08-06", "frag-1")).toBe(
      "journal://nordics-2026/2026-08-06#frag-1",
    );
  });
});
