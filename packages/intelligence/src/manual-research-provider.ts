import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import {
  CURRENT_SCHEMA_VERSION,
  ClaimSchema,
  SourceRecordSchema,
  TripSchema,
  validateTrip,
  type Claim,
  type ResearchRequest,
  type ResearchResult,
  type SourceRecord,
  type Trip,
} from "@sidequest-atlas/domain";
import { LocalTemplateProvider } from "./local-template-provider.js";
import type { TripIntelligenceProvider } from "./types.js";

const ManualResearchModuleSchema = z
  .object({
    slug: z.string().optional(),
    module: z.string().optional(),
    trip: TripSchema.optional(),
    sources: z.array(SourceRecordSchema).default([]),
    claims: z.array(ClaimSchema).default([]),
    warnings: z.array(z.string()).default([]),
    unresolvedQuestions: z.array(z.string()).default([]),
  })
  .passthrough();

export type ManualResearchModule = z.infer<typeof ManualResearchModuleSchema>;

export interface ManualResearchProviderOptions {
  modulesDir: string;
  templateProvider?: TripIntelligenceProvider;
}

export class ManualResearchProvider implements TripIntelligenceProvider {
  readonly id = "manual-research";
  private readonly modulesDir: string;
  private readonly templateProvider: TripIntelligenceProvider;

  constructor(options: ManualResearchProviderOptions) {
    this.modulesDir = options.modulesDir;
    this.templateProvider = options.templateProvider ?? new LocalTemplateProvider();
  }

  async readModules(slug: string): Promise<ManualResearchModule[]> {
    const searchDir = await directoryExists(path.join(this.modulesDir, slug))
      ? path.join(this.modulesDir, slug)
      : this.modulesDir;
    const files = await listYamlFiles(searchDir);
    const modules: ManualResearchModule[] = [];
    for (const filePath of files) {
      const raw = parseYaml(await readFile(filePath, "utf8")) as unknown;
      const parsed = ManualResearchModuleSchema.parse(raw);
      const moduleSlug = parsed.slug ?? parsed.trip?.slug;
      if (moduleSlug === undefined || moduleSlug === slug) {
        modules.push(parsed);
      }
    }
    return modules;
  }

  async createTrip(request: ResearchRequest): Promise<Trip> {
    const baseTrip = await this.templateProvider.createTrip(request);
    const modules = await this.readModules(baseTrip.slug);
    const explicitTrip = modules.find((module) => module.trip !== undefined)?.trip;
    const startingTrip = explicitTrip ?? baseTrip;
    const sources = mergeById(
      startingTrip.sources,
      modules.flatMap((module) => module.sources),
      (source) => source.id,
    );
    const claims = mergeById(
      startingTrip.claims,
      modules.flatMap((module) => module.claims),
      (claim) => claim.id,
    );

    return TripSchema.parse({
      ...startingTrip,
      sources,
      claims,
      status: startingTrip.status === "idea" ? "researching" : startingTrip.status,
    });
  }

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const trip = await this.createTrip(request);
    const modules = await this.readModules(trip.slug);
    const validationReport = validateTrip(trip);
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      requestId: request.tripId,
      status: validationReport.passed ? "validated" : "needs-review",
      generatedAt: new Date().toISOString(),
      trip,
      warnings: modules.flatMap((module) => module.warnings),
      unresolvedQuestions: [
        ...request.openQuestions,
        ...modules.flatMap((module) => module.unresolvedQuestions),
      ],
      validationReport,
    };
  }
}

async function listYamlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  });

  const files: string[] = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listYamlFiles(absolute)));
    } else if (entry.isFile() && [".yaml", ".yml"].includes(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files.sort();
}

async function directoryExists(directory: string): Promise<boolean> {
  return stat(directory)
    .then((stats) => stats.isDirectory())
    .catch(() => false);
}

function mergeById<T>(
  first: T[],
  second: T[],
  getId: (value: T) => string,
): T[] {
  const merged = new Map<string, T>();
  for (const item of first) {
    merged.set(getId(item), item);
  }
  for (const item of second) {
    merged.set(getId(item), item);
  }
  return [...merged.values()];
}
