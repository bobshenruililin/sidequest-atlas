import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import {
  ResearchRequestSchema,
  TripSchema,
  type ResearchRequest,
  type Trip,
} from "@sidequest-atlas/domain";

export const DEFAULT_CONTENT_DIR = "content";
const YAML_EXTENSIONS = new Set([".yaml", ".yml"]);

export interface LoadedYaml<T> {
  filePath: string;
  relativePath: string;
  data: T;
}

export function resolveContentDir(
  repoRoot = process.cwd(),
  contentDir = DEFAULT_CONTENT_DIR,
): string {
  return path.isAbsolute(contentDir) ? contentDir : path.join(repoRoot, contentDir);
}

export async function readYamlFile<T>(
  filePath: string,
  schema?: z.ZodType<T>,
): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  const parsed = parseYaml(raw) as unknown;
  return schema ? schema.parse(parsed) : (parsed as T);
}

export async function listYamlFiles(directory: string): Promise<string[]> {
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
    } else if (entry.isFile() && YAML_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files.sort();
}

export async function loadYamlFiles<T>(
  directory: string,
  schema?: z.ZodType<T>,
): Promise<Array<LoadedYaml<T>>> {
  const files = await listYamlFiles(directory);
  const loaded: Array<LoadedYaml<T>> = [];
  for (const filePath of files) {
    loaded.push({
      filePath,
      relativePath: path.relative(directory, filePath),
      data: await readYamlFile(filePath, schema),
    });
  }
  return loaded;
}

export async function loadTrips(
  contentDir = resolveContentDir(),
): Promise<Array<LoadedYaml<Trip>>> {
  const files = await listYamlFiles(contentDir);
  const trips: Array<LoadedYaml<Trip>> = [];
  for (const filePath of files) {
    const raw = await readYamlFile<unknown>(filePath);
    const parsed = TripSchema.safeParse(raw);
    if (parsed.success) {
      trips.push({
        filePath,
        relativePath: path.relative(contentDir, filePath),
        data: parsed.data,
      });
    }
  }
  return trips.sort((a, b) => a.data.slug.localeCompare(b.data.slug));
}

export async function loadResearchRequests(
  contentDir = resolveContentDir(),
): Promise<Array<LoadedYaml<ResearchRequest>>> {
  const files = await listYamlFiles(contentDir);
  const requests: Array<LoadedYaml<ResearchRequest>> = [];
  for (const filePath of files) {
    const raw = await readYamlFile<unknown>(filePath);
    const parsed = ResearchRequestSchema.safeParse(raw);
    if (parsed.success) {
      requests.push({
        filePath,
        relativePath: path.relative(contentDir, filePath),
        data: parsed.data,
      });
    }
  }
  return requests.sort((a, b) => a.data.tripId.localeCompare(b.data.tripId));
}
