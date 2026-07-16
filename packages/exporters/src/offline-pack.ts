import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { TripSchema, type Trip } from "@sidequest-atlas/domain";
import { exportTripToGeoJson } from "./geojson.js";
import { exportTripToIcs } from "./ics.js";
import { exportTripToMarkdown } from "./markdown.js";
import { exportTripToPdfStub } from "./pdf.js";
import { exportTripToYaml } from "./yaml.js";

export interface OfflinePackOptions {
  outputDir: string;
  includePdfStub?: boolean;
}

export interface OfflinePackManifest {
  tripSlug: string;
  generatedAt: string;
  files: string[];
}

export async function buildOfflinePack(
  input: Trip,
  options: OfflinePackOptions,
): Promise<OfflinePackManifest> {
  const trip = TripSchema.parse(input);
  await mkdir(options.outputDir, { recursive: true });

  const files: Array<{ name: string; contents: string }> = [
    { name: "trip.md", contents: exportTripToMarkdown(trip) },
    { name: "trip.yaml", contents: exportTripToYaml(trip) },
    { name: "trip.geojson", contents: `${JSON.stringify(exportTripToGeoJson(trip), null, 2)}\n` },
    { name: "trip.ics", contents: exportTripToIcs(trip) },
  ];

  if (options.includePdfStub ?? true) {
    files.push({ name: "PDF.md", contents: exportTripToPdfStub(trip) });
  }

  for (const file of files) {
    await writeFile(path.join(options.outputDir, file.name), file.contents, "utf8");
  }

  const manifest: OfflinePackManifest = {
    tripSlug: trip.slug,
    generatedAt: new Date().toISOString(),
    files: files.map((file) => file.name),
  };
  await writeFile(
    path.join(options.outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  return manifest;
}
