#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  CURRENT_SCHEMA_VERSION,
  CaptureRecordSchema,
  ResearchRequestSchema,
  TripSchema,
  checkSchemaVersion,
  migrateDocument,
  validateTrip,
  type AgentJob,
  type CaptureRecord,
  type ResearchRequest,
  type Trip,
} from "@sidequest-atlas/domain";
import {
  findUnsupportedClaims,
  listTrips,
  listYamlFiles,
  readYamlFile,
  requireTripBySlug,
  scanPublicContent,
} from "@sidequest-atlas/content";
import { LocalTemplateProvider, ManualResearchProvider } from "@sidequest-atlas/intelligence";
import {
  buildOfflinePack,
  exportTripToGeoJson,
  exportTripToIcs,
  exportTripToMarkdown,
  exportTripToPdfStub,
  exportTripToYaml,
} from "@sidequest-atlas/exporters";
import {
  complete,
  createJob,
  fail,
  lock,
  type JobOperation,
} from "./jobs.js";

export { complete, createJob, fail, inputHash, lock } from "./jobs.js";

interface ParsedFlags {
  positionals: string[];
  options: Record<string, string | boolean>;
}

interface CompletedJobResult<T> {
  result: T;
  artifacts?: string[];
  warnings?: string[];
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const repoRoot = resolveRepoRoot(process.cwd());
  const [resource, actionOrSlug, ...rest] = argv;

  if (!resource || resource === "help" || resource === "--help" || resource === "-h") {
    printUsage();
    return;
  }

  switch (resource) {
    case "trip":
      await handleTripCommand(repoRoot, actionOrSlug, rest);
      return;
    case "capture":
      await handleCaptureCommand(repoRoot, actionOrSlug, rest);
      return;
    case "sources":
      await handleSourcesCommand(repoRoot, actionOrSlug, rest);
      return;
    case "privacy":
      await handlePrivacyCommand(repoRoot, actionOrSlug, rest);
      return;
    case "schema":
      await handleSchemaCommand(repoRoot, actionOrSlug, rest);
      return;
    case "export":
      await handleExportCommand(repoRoot, actionOrSlug, rest);
      return;
    default:
      throw new Error(`Unknown command: ${resource}`);
  }
}

async function handleCaptureCommand(
  repoRoot: string,
  action: string | undefined,
  args: string[],
): Promise<void> {
  if (!action) {
    throw new Error("Missing capture action (inbox|commit|list|show)");
  }
  const parsed = parseFlags(args);

  switch (action) {
    case "inbox": {
      const text =
        stringOption(parsed, "text") ??
        (await readOptionalInputText(parsed));
      if (!text?.trim()) {
        throw new Error('Usage: atlas capture inbox --text "..." or --input <file>');
      }
      const title =
        stringOption(parsed, "title") ?? deriveTitle(text);
      const domains = parseDomainList(stringOption(parsed, "domains") ?? "idea");
      const visibility = parseVisibility(stringOption(parsed, "visibility") ?? "operator");
      const id =
        stringOption(parsed, "id") ??
        `${utcDatePrefix()}-${slugify(title)}`;
      const record = CaptureRecordSchema.parse({
        id,
        capturedAt: new Date().toISOString(),
        title,
        rawText: text.trim(),
        spark: stringOption(parsed, "spark"),
        domains,
        ask: stringOption(parsed, "ask") ?? "investigate",
        visibility,
        status: "inbox",
        links: parseLinkList(stringOption(parsed, "links")),
      });
      const relativePath = captureRelativePath(record);
      const { job } = await runCompletedJob(
        repoRoot,
        "capture",
        "life",
        { id: record.id, action: "inbox" },
        async () => {
          await writeYaml(path.join(repoRoot, relativePath), record);
          return { result: record, artifacts: [relativePath] };
        },
      );
      printJson({
        id: record.id,
        file: relativePath,
        status: record.status,
        jobId: job.id,
        next: "Agent: triangulate deeply, then atlas capture commit --input <file>",
      });
      return;
    }
    case "commit": {
      const inputPath = requiredInputPath(parsed);
      const raw = parseYaml(await readFile(inputPath, "utf8")) as unknown;
      const record = CaptureRecordSchema.parse(raw);
      const nextStatus =
        record.triangulation && record.status === "inbox"
          ? "triaged"
          : record.status;
      const committed = CaptureRecordSchema.parse({
        ...record,
        status: nextStatus,
      });
      const relativePath = captureRelativePath(committed);
      const { job } = await runCompletedJob(
        repoRoot,
        "capture",
        "life",
        { id: committed.id, action: "commit" },
        async () => {
          await writeYaml(path.join(repoRoot, relativePath), committed);
          return { result: committed, artifacts: [relativePath] };
        },
      );
      printJson({
        id: committed.id,
        file: relativePath,
        status: committed.status,
        jobId: job.id,
        implementations:
          committed.triangulation?.suggestedImplementations?.length ?? 0,
      });
      return;
    }
    case "list": {
      const records = await listCaptureRecords(repoRoot);
      printJson({
        count: records.length,
        captures: records.map((item) => ({
          id: item.record.id,
          title: item.record.title,
          status: item.record.status,
          domains: item.record.domains,
          file: item.relativePath,
        })),
      });
      return;
    }
    case "show": {
      const id = firstString(parsed.positionals) ?? stringOption(parsed, "id");
      if (!id) {
        throw new Error("Usage: atlas capture show <id>");
      }
      const found = (await listCaptureRecords(repoRoot)).find(
        (item) => item.record.id === id,
      );
      if (!found) {
        throw new Error(`Capture not found: ${id}`);
      }
      printJson(found.record);
      return;
    }
    default:
      throw new Error(`Unknown capture action: ${action}`);
  }
}

function captureRelativePath(record: CaptureRecord): string {
  if (record.visibility === "vault") {
    return path.join("vault", "life-canon", "captures", `${record.id}.yaml`);
  }
  return path.join("content", "captures", `${record.id}.yaml`);
}

async function listCaptureRecords(
  repoRoot: string,
): Promise<Array<{ relativePath: string; record: CaptureRecord }>> {
  const dirs = [
    path.join(repoRoot, "content", "captures"),
    path.join(repoRoot, "vault", "life-canon", "captures"),
  ];
  const out: Array<{ relativePath: string; record: CaptureRecord }> = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      continue;
    }
    for (const filePath of await listYamlFiles(dir)) {
      const raw = await readYamlFile<unknown>(filePath);
      const parsed = CaptureRecordSchema.safeParse(raw);
      if (!parsed.success) {
        continue;
      }
      out.push({
        relativePath: path.relative(repoRoot, filePath),
        record: parsed.data,
      });
    }
  }
  return out.sort((a, b) => b.record.id.localeCompare(a.record.id));
}

async function readOptionalInputText(parsed: ParsedFlags): Promise<string | undefined> {
  const input = stringOption(parsed, "input");
  if (!input) {
    return undefined;
  }
  return readFile(path.resolve(process.cwd(), input), "utf8");
}

function deriveTitle(text: string): string {
  const line = text.trim().split(/\n/)[0] ?? "capture";
  return line.slice(0, 80).trim() || "capture";
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "capture";
}

function utcDatePrefix(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseDomainList(value: string): CaptureRecord["domains"] {
  const domains = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return CaptureRecordSchema.shape.domains.parse(domains);
}

function parseVisibility(value: string): CaptureRecord["visibility"] {
  return CaptureRecordSchema.shape.visibility.parse(value);
}

function parseLinkList(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

async function handleTripCommand(
  repoRoot: string,
  action: string | undefined,
  args: string[],
): Promise<void> {
  if (!action) {
    throw new Error("Missing trip action");
  }
  const parsed = parseFlags(args);
  const contentDir = path.join(repoRoot, "content");

  switch (action) {
    case "create": {
      const request = await readResearchRequest(requiredInputPath(parsed));
      const provider = new LocalTemplateProvider();
      const trip = await provider.createTrip(request);
      const outputRel = `content/trips/${trip.slug}.yaml`;
      const outputPath = path.join(repoRoot, outputRel);
      const { job } = await runCompletedJob(repoRoot, "intake", trip.slug, request, async () => {
        await writeYaml(outputPath, trip);
        return { result: trip, artifacts: [outputRel] };
      });
      printJson({ tripSlug: trip.slug, file: outputRel, jobId: job.id });
      return;
    }
    case "research": {
      const request = await readResearchRequest(requiredInputPath(parsed));
      const provider = new ManualResearchProvider({
        modulesDir: path.join(contentDir, "research"),
      });
      const result = await provider.research(request);
      const tripRel = `content/trips/${result.trip.slug}.yaml`;
      const resultRel = `generated/research/${result.trip.slug}.result.yaml`;
      const { job } = await runCompletedJob(repoRoot, "research", result.trip.slug, request, async () => {
        await writeYaml(path.join(repoRoot, tripRel), result.trip);
        await writeYaml(path.join(repoRoot, resultRel), result);
        return { result, artifacts: [tripRel, resultRel], warnings: result.warnings };
      });
      printJson({
        tripSlug: result.trip.slug,
        status: result.status,
        tripFile: tripRel,
        resultFile: resultRel,
        jobId: job.id,
      });
      return;
    }
    case "synthesize": {
      const slug = requiredSlug(parsed, "trip synthesize");
      const loaded = await requireTripBySlug(slug, contentDir);
      const synthesized = TripSchema.parse({
        ...loaded.data,
        status: loaded.data.status === "researching" ? "planned" : loaded.data.status,
        finalSynthesis:
          loaded.data.finalSynthesis ??
          `Synthesis pending editorial review. Generated ${new Date().toISOString()}.`,
      });
      const { job } = await runCompletedJob(repoRoot, "synthesize", slug, { slug }, async () => {
        await writeYaml(loaded.filePath, synthesized);
        return { result: synthesized, artifacts: [path.relative(repoRoot, loaded.filePath)] };
      });
      printJson({ tripSlug: slug, status: synthesized.status, jobId: job.id });
      return;
    }
    case "validate": {
      const slug = requiredSlug(parsed, "trip validate");
      const loaded = await requireTripBySlug(slug, contentDir);
      const report = validateTrip(loaded.data);
      const reportRel = `generated/validation/${slug}.json`;
      const { job } = await runCompletedJob(repoRoot, "validate", slug, { slug }, async () => {
        await writeJson(path.join(repoRoot, reportRel), report);
        return { result: report, artifacts: [reportRel] };
      });
      printJson({ ...report, jobId: job.id, reportFile: reportRel });
      return;
    }
    case "revise": {
      const slug = requiredSlug(parsed, "trip revise");
      const job = await createJob(repoRoot, "revise", slug, {
        slug,
        instructions: parsed.options.instructions ?? parsed.options.message ?? "",
      });
      printJson({ tripSlug: slug, jobId: job.id, status: job.status });
      return;
    }
    case "publish": {
      const slug = requiredSlug(parsed, "trip publish");
      const loaded = await requireTripBySlug(slug, contentDir);
      const outputDir = stringOption(parsed, "out") ?? path.join(repoRoot, "generated", "public", slug);
      const { result, job } = await runCompletedJob(repoRoot, "publish", slug, { slug, outputDir }, async () => {
        const manifest = await buildOfflinePack(loaded.data, { outputDir });
        return {
          result: manifest,
          artifacts: manifest.files.map((file) => path.relative(repoRoot, path.join(outputDir, file))),
        };
      });
      printJson({ ...result, outputDir, jobId: job.id });
      return;
    }
    case "archive": {
      const slug = requiredSlug(parsed, "trip archive");
      const loaded = await requireTripBySlug(slug, contentDir);
      const archiveRel = `generated/archive/${slug}.yaml`;
      const { job } = await runCompletedJob(repoRoot, "archive", slug, { slug }, async () => {
        await writeYaml(path.join(repoRoot, archiveRel), loaded.data);
        return { result: loaded.data, artifacts: [archiveRel] };
      });
      printJson({ tripSlug: slug, archiveFile: archiveRel, jobId: job.id });
      return;
    }
    default:
      throw new Error(`Unknown trip action: ${action}`);
  }
}

async function handleSourcesCommand(
  repoRoot: string,
  action: string | undefined,
  args: string[],
): Promise<void> {
  const parsed = parseFlags(args);
  const contentDir = path.join(repoRoot, "content");
  switch (action) {
    case "refresh": {
      const slug = firstString(parsed.positionals) ?? stringOption(parsed, "slug");
      const trips = slug
        ? [(await requireTripBySlug(slug, contentDir)).data]
        : (await listTrips(contentDir)).map((summary) => summary.slug);
      const tripCount = Array.isArray(trips) ? trips.length : 0;
      printJson({
        refreshed: false,
        tripCount,
        message: "No network refresh provider is configured; use sources audit for local checks.",
      });
      return;
    }
    case "audit": {
      const slug = firstString(parsed.positionals) ?? stringOption(parsed, "slug");
      const loadedTrips = slug
        ? [await requireTripBySlug(slug, contentDir)]
        : await Promise.all((await listTrips(contentDir)).map((trip) => requireTripBySlug(trip.slug, contentDir)));
      const findings = loadedTrips.flatMap((loaded) =>
        findUnsupportedClaims(loaded.data).map((finding) => ({
          tripSlug: loaded.data.slug,
          claimId: finding.claim.id,
          reason: finding.reason,
        })),
      );
      printJson({ passed: findings.length === 0, findings });
      return;
    }
    default:
      throw new Error(`Unknown sources action: ${action ?? "<missing>"}`);
  }
}

async function handlePrivacyCommand(
  repoRoot: string,
  action: string | undefined,
  _args: string[],
): Promise<void> {
  if (action !== "audit") {
    throw new Error(`Unknown privacy action: ${action ?? "<missing>"}`);
  }
  printJson(await scanPublicContent(path.join(repoRoot, "content")));
}

async function handleSchemaCommand(
  repoRoot: string,
  action: string | undefined,
  _args: string[],
): Promise<void> {
  const contentDir = path.join(repoRoot, "content");
  switch (action) {
    case "check": {
      const reports = await schemaReports(contentDir);
      printJson({
        passed: reports.every((report) => report.ok),
        checked: reports.length,
        reports,
      });
      return;
    }
    case "migrate": {
      const files = await listYamlFiles(contentDir);
      const migrated: string[] = [];
      for (const filePath of files) {
        const raw = await readYamlFile<unknown>(filePath);
        const parsed = TripSchema.safeParse(raw);
        if (!parsed.success) {
          continue;
        }
        const next = TripSchema.parse(migrateDocument(parsed.data, CURRENT_SCHEMA_VERSION));
        await writeYaml(filePath, next);
        migrated.push(path.relative(repoRoot, filePath));
      }
      printJson({ migrated });
      return;
    }
    default:
      throw new Error(`Unknown schema action: ${action ?? "<missing>"}`);
  }
}

async function handleExportCommand(
  repoRoot: string,
  slug: string | undefined,
  args: string[],
): Promise<void> {
  if (!slug) {
    throw new Error("Usage: atlas export <slug> --format <markdown|yaml|geojson|ics|pdf|offline>");
  }
  const parsed = parseFlags(args);
  const format = stringOption(parsed, "format") ?? "markdown";
  const loaded = await requireTripBySlug(slug, path.join(repoRoot, "content"));
  const out = stringOption(parsed, "out");

  switch (format) {
    case "markdown":
    case "md":
      await emitExport(out, exportTripToMarkdown(loaded.data));
      return;
    case "yaml":
    case "yml":
      await emitExport(out, exportTripToYaml(loaded.data));
      return;
    case "geojson":
    case "json":
      await emitExport(out, `${JSON.stringify(exportTripToGeoJson(loaded.data), null, 2)}\n`);
      return;
    case "ics":
      await emitExport(out, exportTripToIcs(loaded.data));
      return;
    case "pdf":
      await emitExport(out, exportTripToPdfStub(loaded.data));
      return;
    case "offline": {
      const outputDir = out ?? path.join(repoRoot, "generated", "offline", slug);
      printJson(await buildOfflinePack(loaded.data, { outputDir }));
      return;
    }
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

async function runCompletedJob<T>(
  repoRoot: string,
  operation: JobOperation,
  slug: string,
  input: unknown,
  work: () => Promise<CompletedJobResult<T>>,
): Promise<{ result: T; job: AgentJob }> {
  const queued = await createJob(repoRoot, operation, slug, input);
  await lock(repoRoot, queued.id);
  try {
    const result = await work();
    const job = await complete(repoRoot, queued.id, result.artifacts, result.warnings);
    return { result: result.result, job };
  } catch (error) {
    await fail(repoRoot, queued.id, {
      code: "command.failed",
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function schemaReports(contentDir: string): Promise<Array<{ filePath: string; ok: boolean; message: string }>> {
  const reports: Array<{ filePath: string; ok: boolean; message: string }> = [];
  for (const filePath of await listYamlFiles(contentDir)) {
    const raw = await readYamlFile<unknown>(filePath);
    const trip = TripSchema.safeParse(raw);
    if (trip.success) {
      const version = checkSchemaVersion(trip.data.schemaVersion, CURRENT_SCHEMA_VERSION);
      reports.push({ filePath, ok: version.ok, message: version.message });
      continue;
    }
    const capture = CaptureRecordSchema.safeParse(raw);
    if (capture.success) {
      const version = checkSchemaVersion(capture.data.schemaVersion, CURRENT_SCHEMA_VERSION);
      reports.push({ filePath, ok: version.ok, message: version.message });
    }
  }
  return reports;
}

async function readResearchRequest(filePath: string): Promise<ResearchRequest> {
  const raw = parseYaml(await readFile(filePath, "utf8")) as unknown;
  return ResearchRequestSchema.parse(raw);
}

async function writeYaml(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, stringifyYaml(value), "utf8");
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function emitExport(filePath: string | undefined, contents: string): Promise<void> {
  if (!filePath) {
    process.stdout.write(contents);
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
  printJson({ file: filePath });
}

function parseFlags(args: string[]): ParsedFlags {
  const positionals: string[] = [];
  const options: Record<string, string | boolean> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg?.startsWith("--")) {
      const [key, inlineValue] = arg.slice(2).split("=", 2);
      if (!key) {
        continue;
      }
      const next = args[index + 1];
      if (inlineValue !== undefined) {
        options[key] = inlineValue;
      } else if (next !== undefined && !next.startsWith("-")) {
        options[key] = next;
        index += 1;
      } else {
        options[key] = true;
      }
    } else if (arg !== undefined) {
      positionals.push(arg);
    }
  }
  return { positionals, options };
}

function requiredInputPath(parsed: ParsedFlags): string {
  const value = stringOption(parsed, "input") ?? firstString(parsed.positionals);
  if (!value) {
    throw new Error("Missing --input <file>");
  }
  return path.resolve(process.cwd(), value);
}

function requiredSlug(parsed: ParsedFlags, command: string): string {
  const slug = firstString(parsed.positionals) ?? stringOption(parsed, "slug");
  if (!slug) {
    throw new Error(`Usage: atlas ${command} <slug>`);
  }
  return slug;
}

function stringOption(parsed: ParsedFlags, key: string): string | undefined {
  const value = parsed.options[key];
  return typeof value === "string" ? value : undefined;
}

function firstString(values: string[]): string | undefined {
  return values[0];
}

function resolveRepoRoot(cwd: string): string {
  let current = path.resolve(cwd);
  while (true) {
    if (
      existsSync(path.join(current, "package.json")) &&
      existsSync(path.join(current, "packages", "domain"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(cwd);
    }
    current = parent;
  }
}

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function printUsage(): void {
  process.stdout.write(
    [
      "Usage: atlas <command>",
      "",
      "Commands:",
      "  trip create|research|synthesize|validate|revise|publish|archive",
      "  capture inbox|commit|list|show",
      "  sources refresh|audit",
      "  privacy audit",
      "  schema check|migrate",
      "  export <slug> --format <markdown|yaml|geojson|ics|pdf|offline>",
      "",
    ].join("\n"),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
