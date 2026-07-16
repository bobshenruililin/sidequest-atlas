import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { TripSchema, ResearchRequestSchema, validateTrip } from "@sidequest-atlas/domain";
import { scanPublicContent } from "@sidequest-atlas/content";
import { exportTripToMarkdown, exportTripToYaml } from "@sidequest-atlas/exporters";

const root = path.resolve(import.meta.dirname, "../../..");

describe("contract: nordics-2026", () => {
  it("request and trip validate", async () => {
    const requestRaw = await readFile(
      path.join(root, "content/trips/nordics-2026/request.yaml"),
      "utf8",
    );
    const tripRaw = await readFile(
      path.join(root, "content/trips/nordics-2026/trip.yaml"),
      "utf8",
    );
    const request = ResearchRequestSchema.parse(parse(requestRaw));
    const trip = TripSchema.parse(parse(tripRaw));
    expect(request.destinations.length).toBeGreaterThanOrEqual(3);
    expect(trip.days).toHaveLength(15);
    const report = validateTrip(trip);
    expect(report.criticalCount).toBe(0);
    expect(report.errorCount).toBe(0);
  });

  it("exports markdown and yaml", async () => {
    const tripRaw = await readFile(
      path.join(root, "content/trips/nordics-2026/trip.yaml"),
      "utf8",
    );
    const trip = TripSchema.parse(parse(tripRaw));
    const md = exportTripToMarkdown(trip);
    const yamlOut = exportTripToYaml(trip);
    expect(md).toContain(trip.title);
    expect(yamlOut).toContain(trip.slug);
  });

  it("privacy scan passes", async () => {
    const report = await scanPublicContent(path.join(root, "content"));
    expect(report.passed).toBe(true);
  });
});
