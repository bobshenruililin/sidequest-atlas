import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { AgentJobSchema, type AgentError, type AgentJob } from "@sidequest-atlas/domain";

export type JobOperation = AgentJob["operation"];

export function inputHash(input: unknown): string {
  return crypto.createHash("sha256").update(stableStringify(input)).digest("hex");
}

export async function createJob(
  repoRoot: string,
  operation: JobOperation,
  tripSlug: string,
  input: unknown,
  requestedBy = "local-cli",
): Promise<AgentJob> {
  const hash = inputHash(input);
  const id = `${Date.now()}-${operation}-${hash.slice(0, 10)}`;
  const job = AgentJobSchema.parse({
    schemaVersion: "1.0.0",
    id,
    tripSlug,
    operation,
    requestedAt: new Date().toISOString(),
    requestedBy,
    inputHash: hash,
    status: "queued",
    attempt: 0,
    maximumAttempts: 1,
    artifacts: [],
    warnings: [],
    errors: [],
  });
  await writeJob(repoRoot, job);
  return job;
}

export async function lock(
  repoRoot: string,
  jobId: string,
  lockedBy = "local-cli",
): Promise<AgentJob> {
  const job = await readJob(repoRoot, jobId);
  if (job.status !== "queued") {
    throw new Error(`Cannot lock job ${job.id}; status is ${job.status}`);
  }
  const locked = AgentJobSchema.parse({
    ...job,
    status: "running",
    attempt: job.attempt + 1,
    lockedBy,
    lockedAt: new Date().toISOString(),
  });
  await writeJob(repoRoot, locked);
  return locked;
}

export async function complete(
  repoRoot: string,
  jobId: string,
  artifacts: string[] = [],
  warnings: string[] = [],
): Promise<AgentJob> {
  const job = await readJob(repoRoot, jobId);
  const completed = AgentJobSchema.parse({
    ...job,
    status: "completed",
    completedAt: new Date().toISOString(),
    artifacts: [...job.artifacts, ...artifacts],
    warnings: [...job.warnings, ...warnings],
  });
  await writeJob(repoRoot, completed);
  return completed;
}

export async function fail(
  repoRoot: string,
  jobId: string,
  error: AgentError,
): Promise<AgentJob> {
  const job = await readJob(repoRoot, jobId);
  const failed = AgentJobSchema.parse({
    ...job,
    status: "failed",
    completedAt: new Date().toISOString(),
    errors: [...job.errors, error],
  });
  await writeJob(repoRoot, failed);
  return failed;
}

export async function readJob(repoRoot: string, jobId: string): Promise<AgentJob> {
  const raw = parseYaml(await readFile(jobFilePath(repoRoot, jobId), "utf8")) as unknown;
  return AgentJobSchema.parse(raw);
}

export function jobFilePath(repoRoot: string, jobId: string): string {
  return path.join(repoRoot, "jobs", `${jobId}.yaml`);
}

async function writeJob(repoRoot: string, job: AgentJob): Promise<void> {
  await mkdir(path.join(repoRoot, "jobs"), { recursive: true });
  await writeFile(jobFilePath(repoRoot, job.id), stringifyYaml(job), "utf8");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (typeof value === "object" && value !== null) {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}
