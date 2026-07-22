import { createHash, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  CaptureRecordSchema,
  CanonInsightSchema,
  JournalEntrySchema,
  JournalFragmentSchema,
  JournalReflectionSchema,
  TripSchema,
  journalFragmentRef,
  type CaptureRecord,
  type JournalEntry,
  type JournalFragment,
  type JournalReflection,
  type PromotionCandidate,
  type Trip,
} from "@sidequest-atlas/domain";
import { requireTripBySlug } from "@sidequest-atlas/content";
import { complete, createJob, fail, lock } from "./jobs.js";

interface ParsedFlags {
  positionals: string[];
  options: Record<string, string | boolean>;
}

export async function handleJournalCommand(
  repoRoot: string,
  action: string | undefined,
  args: string[],
): Promise<void> {
  if (!action) {
    throw new Error(
      "Missing journal action (add|list|show|context|commit|promote|close)",
    );
  }
  const parsed = parseFlags(args);

  switch (action) {
    case "add":
      await journalAdd(repoRoot, parsed);
      return;
    case "list":
      await journalList(repoRoot, parsed);
      return;
    case "show":
      await journalShow(repoRoot, parsed);
      return;
    case "context":
      await journalContext(repoRoot, parsed);
      return;
    case "commit":
      await journalCommit(repoRoot, parsed);
      return;
    case "promote":
      await journalPromote(repoRoot, parsed);
      return;
    case "close":
      await journalClose(repoRoot, parsed);
      return;
    default:
      throw new Error(`Unknown journal action: ${action}`);
  }
}

async function journalAdd(repoRoot: string, parsed: ParsedFlags): Promise<void> {
  const tripSlug = requiredPositional(parsed, "atlas journal add <trip-slug>");
  const trip = await loadTrip(repoRoot, tripSlug);
  const localDate = stringOption(parsed, "date") ?? inferLocalDate(trip);
  const timeZone = timezoneForDate(trip, localDate);
  const text = await readFragmentText(parsed);
  if (!text.trim()) {
    throw new Error(
      "Provide fragment via --input <file|-> (preferred) or --text",
    );
  }

  const entryPath = journalFilePath(repoRoot, tripSlug, localDate);
  const existing = existsSync(entryPath)
    ? await readJournalFile(entryPath)
    : null;
  const now = new Date().toISOString();
  const fragment: JournalFragment = JournalFragmentSchema.parse({
    id: `frag-${randomBytes(4).toString("hex")}`,
    recordedAt: now,
    text: text.trim(),
    prompt: stringOption(parsed, "prompt") ?? "free",
    tags: parseList(stringOption(parsed, "tags")),
  });

  const next = JournalEntrySchema.parse({
    id: `${tripSlug}-${localDate}`,
    tripSlug,
    localDate,
    timeZone,
    visibility: "vault",
    status: existing?.status === "closed" ? "open" : (existing?.status ?? "open"),
    revision: (existing?.revision ?? 0) + 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    fragments: [...(existing?.fragments ?? []), fragment],
    reflections: existing?.reflections ?? [],
    promotions: existing?.promotions ?? [],
  });

  const relativePath = path.relative(repoRoot, entryPath);
  const job = await runJournalJob(repoRoot, tripSlug, { action: "add", id: next.id, revision: next.revision }, async () => {
    await writeYaml(entryPath, next);
    return { artifacts: [relativePath] };
  });

  printJson({
    id: next.id,
    tripSlug,
    localDate,
    revision: next.revision,
    fragmentCount: next.fragments.length,
    status: next.status,
    file: relativePath,
    jobId: job.id,
    note: "Vault body not printed. Use journal context --include-body for agent handoff.",
  });
}

async function journalList(repoRoot: string, parsed: ParsedFlags): Promise<void> {
  const tripSlug = requiredPositional(parsed, "atlas journal list <trip-slug>");
  const dir = journalTripDir(repoRoot, tripSlug);
  if (!existsSync(dir)) {
    printJson({ tripSlug, count: 0, entries: [] });
    return;
  }
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".yaml")).sort();
  const entries = [];
  for (const name of files) {
    const entry = await readJournalFile(path.join(dir, name));
    entries.push({
      id: entry.id,
      localDate: entry.localDate,
      revision: entry.revision,
      status: entry.status,
      fragmentCount: entry.fragments.length,
      reflectionCount: entry.reflections.length,
      promotionCount: entry.promotions.length,
    });
  }
  printJson({ tripSlug, count: entries.length, entries });
}

async function journalShow(repoRoot: string, parsed: ParsedFlags): Promise<void> {
  const id = requiredPositional(parsed, "atlas journal show <id>");
  const entry = await loadJournalById(repoRoot, id);
  const includeBody = Boolean(parsed.options["include-body"]);
  if (includeBody) {
    printJson(entry);
    return;
  }
  printJson({
    id: entry.id,
    tripSlug: entry.tripSlug,
    localDate: entry.localDate,
    timeZone: entry.timeZone,
    revision: entry.revision,
    status: entry.status,
    fragmentCount: entry.fragments.length,
    reflectionCount: entry.reflections.length,
    promotionCount: entry.promotions.length,
    fragmentIds: entry.fragments.map((fragment) => fragment.id),
    candidateIds: entry.reflections.flatMap((reflection) =>
      reflection.candidates.map((candidate) => candidate.id),
    ),
    promotions: entry.promotions,
    updatedAt: entry.updatedAt,
  });
}

async function journalContext(
  repoRoot: string,
  parsed: ParsedFlags,
): Promise<void> {
  const id = requiredPositional(parsed, "atlas journal context <id>");
  const entry = await loadJournalById(repoRoot, id);
  const trip = await loadTrip(repoRoot, entry.tripSlug);
  const days = Number(stringOption(parsed, "days") ?? "3");
  const includeBody = Boolean(parsed.options["include-body"]);
  const out =
    stringOption(parsed, "out") ??
    path.join("generated", "journal-context", `${entry.id}.yaml`);

  const day = trip.days.find((item) => item.date === entry.localDate);
  const context = {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    journalId: entry.id,
    tripSlug: entry.tripSlug,
    localDate: entry.localDate,
    revision: entry.revision,
    sourceDigest: digestFragments(entry.fragments),
    tripTitle: trip.title,
    tripThesis: trip.finalSynthesis ?? trip.subtitle ?? trip.title,
    dayTitle: day?.title,
    dayThesisQuestion: day?.thesisQuestion,
    fieldworkPrompts: day?.fieldworkPrompts?.slice(0, 5) ?? [],
    openDecisions: trip.decisions
      .filter((decision) => !decision.selectedOptionId)
      .slice(0, 5)
      .map((decision) => ({ id: decision.id, question: decision.question })),
    recentPromotions: entry.promotions.slice(-5),
    fragments: includeBody
      ? entry.fragments
      : entry.fragments.map((fragment) => ({
          id: fragment.id,
          recordedAt: fragment.recordedAt,
          prompt: fragment.prompt,
          textLength: fragment.text.length,
        })),
    lookbackDays: days,
  };

  const absolute = path.isAbsolute(out) ? out : path.join(repoRoot, out);
  await writeYaml(absolute, context);
  printJson({
    journalId: entry.id,
    revision: entry.revision,
    sourceDigest: context.sourceDigest,
    out: path.relative(repoRoot, absolute),
    includeBody,
    note: includeBody
      ? "Handoff includes vault fragment bodies — keep under generated/ (gitignored)."
      : "Metadata-only handoff. Re-run with --include-body for agent reflection.",
  });
}

async function journalCommit(
  repoRoot: string,
  parsed: ParsedFlags,
): Promise<void> {
  const inputPath = requiredInputPath(parsed);
  const expectRevision = Number(stringOption(parsed, "expect-revision"));
  if (!Number.isFinite(expectRevision)) {
    throw new Error("Missing --expect-revision <n>");
  }
  const raw = parseYaml(await readFile(inputPath, "utf8")) as Record<
    string,
    unknown
  >;
  const entryId =
    (typeof raw.journalId === "string" ? raw.journalId : undefined) ||
    stringOption(parsed, "journal");
  if (!entryId) {
    throw new Error("Reflection must include journalId or pass --journal <id>");
  }

  const entry = await loadJournalById(repoRoot, entryId);
  if (entry.revision !== expectRevision) {
    throw new Error(
      `Stale revision: expected ${expectRevision}, entry is ${entry.revision}`,
    );
  }
  const digest = digestFragments(entry.fragments);
  const reflectionRaw =
    raw.reflection !== undefined ? (raw.reflection as unknown) : raw;
  const reflection = JournalReflectionSchema.parse({
    ...(reflectionRaw as object),
    sourceRevision: expectRevision,
    sourceDigest:
      typeof (reflectionRaw as { sourceDigest?: string }).sourceDigest ===
      "string"
        ? (reflectionRaw as { sourceDigest: string }).sourceDigest
        : digest,
  });
  if (reflection.sourceDigest !== digest) {
    throw new Error(
      `sourceDigest mismatch: reflection ${reflection.sourceDigest} vs entry ${digest}`,
    );
  }
  if (reflection.sourceRevision !== entry.revision) {
    throw new Error("sourceRevision does not match entry revision");
  }

  const now = new Date().toISOString();
  const next = JournalEntrySchema.parse({
    ...entry,
    status: "reflected",
    updatedAt: now,
    reflections: [...entry.reflections, reflection],
  });
  const entryPath = journalFilePath(repoRoot, entry.tripSlug, entry.localDate);
  const relativePath = path.relative(repoRoot, entryPath);
  const job = await runJournalJob(
    repoRoot,
    entry.tripSlug,
    { action: "commit", id: entry.id, reflectionId: reflection.id },
    async () => {
      await writeYaml(entryPath, next);
      return { artifacts: [relativePath] };
    },
  );
  printJson({
    id: next.id,
    revision: next.revision,
    status: next.status,
    reflectionId: reflection.id,
    candidateCount: reflection.candidates.length,
    jobId: job.id,
  });
}

async function journalPromote(
  repoRoot: string,
  parsed: ParsedFlags,
): Promise<void> {
  const id = requiredPositional(parsed, "atlas journal promote <id>");
  const candidateId = stringOption(parsed, "candidate");
  if (!candidateId) {
    throw new Error("Missing --candidate <id>");
  }
  if (!parsed.options.approve) {
    throw new Error("Refusing promote without --approve");
  }

  const entry = await loadJournalById(repoRoot, id);
  const existing = entry.promotions.find(
    (promotion) => promotion.candidateId === candidateId,
  );
  if (existing) {
    printJson({
      idempotent: true,
      candidateId,
      destinationId: existing.destinationId,
      destinationPath: existing.destinationPath,
    });
    return;
  }

  const candidate = findCandidate(entry, candidateId);
  if (!candidate) {
    throw new Error(`Candidate not found: ${candidateId}`);
  }

  const result = await applyPromotion(repoRoot, entry, candidate);
  const now = new Date().toISOString();
  const next = JournalEntrySchema.parse({
    ...entry,
    updatedAt: now,
    promotions: [
      ...entry.promotions,
      {
        candidateId,
        kind: candidate.kind,
        promotedAt: now,
        destinationId: result.destinationId,
        destinationPath: result.destinationPath,
      },
    ],
  });
  const entryPath = journalFilePath(repoRoot, entry.tripSlug, entry.localDate);
  const relativePath = path.relative(repoRoot, entryPath);
  const job = await runJournalJob(
    repoRoot,
    entry.tripSlug,
    { action: "promote", id: entry.id, candidateId },
    async () => {
      await writeYaml(entryPath, next);
      return { artifacts: [relativePath, result.destinationPath] };
    },
  );
  printJson({
    candidateId,
    kind: candidate.kind,
    destinationId: result.destinationId,
    destinationPath: result.destinationPath,
    jobId: job.id,
  });
}

async function journalClose(
  repoRoot: string,
  parsed: ParsedFlags,
): Promise<void> {
  const id = requiredPositional(parsed, "atlas journal close <id>");
  const entry = await loadJournalById(repoRoot, id);
  const next = JournalEntrySchema.parse({
    ...entry,
    status: "closed",
    updatedAt: new Date().toISOString(),
  });
  const entryPath = journalFilePath(repoRoot, entry.tripSlug, entry.localDate);
  await writeYaml(entryPath, next);
  printJson({ id: next.id, status: next.status, revision: next.revision });
}

async function applyPromotion(
  repoRoot: string,
  entry: JournalEntry,
  candidate: PromotionCandidate,
): Promise<{ destinationId: string; destinationPath: string }> {
  const refs = (candidate.evidenceFragmentIds ?? []).map((fragmentId) =>
    journalFragmentRef(entry.tripSlug, entry.localDate, fragmentId),
  );

  if (candidate.kind === "observation") {
    const loaded = await requireTripBySlug(
      entry.tripSlug,
      path.join(repoRoot, "content"),
    );
    const trip = loaded.data;
    const day =
      trip.days.find((item) => item.id === candidate.dayId) ??
      trip.days.find((item) => item.date === candidate.dayId) ??
      trip.days.find((item) => item.date === entry.localDate);
    if (!day) {
      throw new Error(`No trip day matching ${candidate.dayId}`);
    }
    const observationId = `obs-journal-${candidate.id}`;
    if (trip.observations.some((item) => item.id === observationId)) {
      return {
        destinationId: observationId,
        destinationPath: path.relative(repoRoot, loaded.filePath),
      };
    }
    const nextTrip = TripSchema.parse({
      ...trip,
      observations: [
        ...trip.observations,
        {
          id: observationId,
          tripId: trip.id,
          dayId: day.id,
          recordedAt: new Date().toISOString(),
          category: candidate.category,
          text: candidate.text,
          private: false,
          certainty: candidate.certainty,
          sourceJournalRefs: refs.length
            ? refs
            : [`journal://${entry.tripSlug}/${entry.localDate}`],
        },
      ],
    });
    await writeYaml(loaded.filePath, nextTrip);
    return {
      destinationId: observationId,
      destinationPath: path.relative(repoRoot, loaded.filePath),
    };
  }

  if (candidate.kind === "capture") {
    const captureId = `${entry.localDate}-${slugify(candidate.title)}`;
    const record = CaptureRecordSchema.parse({
      id: captureId,
      capturedAt: new Date().toISOString(),
      title: candidate.title,
      rawText: candidate.rawText,
      spark: candidate.spark,
      domains: candidate.domains,
      ask: candidate.ask,
      visibility: "operator",
      status: "inbox",
      relatedTrips: [entry.tripSlug],
      relatedJournalEntries: [entry.id],
    } satisfies Partial<CaptureRecord>);
    const relativePath = path.join("content", "captures", `${captureId}.yaml`);
    await writeYaml(path.join(repoRoot, relativePath), record);
    return { destinationId: captureId, destinationPath: relativePath };
  }

  if (candidate.kind === "decision") {
    const loaded = await requireTripBySlug(
      entry.tripSlug,
      path.join(repoRoot, "content"),
    );
    const trip = loaded.data;
    const decision = trip.decisions.find(
      (item) => item.id === candidate.decisionId,
    );
    if (!decision) {
      throw new Error(`Decision not found: ${candidate.decisionId}`);
    }
    let updated = { ...decision };
    if (candidate.action === "select" && candidate.optionId) {
      updated = {
        ...updated,
        selectedOptionId: candidate.optionId,
        decidedAt: entry.localDate,
        rationale: candidate.note,
      };
    } else if (candidate.action === "record-outcome") {
      updated = { ...updated, actualOutcome: candidate.note };
    } else if (candidate.action === "reopen") {
      updated = {
        ...updated,
        selectedOptionId: undefined,
        rationale: candidate.note,
      };
    } else {
      updated = {
        ...updated,
        rationale: [decision.rationale, candidate.note].filter(Boolean).join("\n"),
      };
    }
    const nextTrip = TripSchema.parse({
      ...trip,
      decisions: trip.decisions.map((item) =>
        item.id === decision.id ? updated : item,
      ),
    });
    await writeYaml(loaded.filePath, nextTrip);
    return {
      destinationId: decision.id,
      destinationPath: path.relative(repoRoot, loaded.filePath),
    };
  }

  // canon-insight
  const insightId = candidate.id;
  const insight = CanonInsightSchema.parse({
    id: insightId,
    createdAt: new Date().toISOString(),
    statement: candidate.statement,
    rationale: candidate.rationale,
    evidenceRefs: refs,
    relatedTrips: [entry.tripSlug],
    status: "accepted",
  });
  const relativePath = path.join(
    "vault",
    "life-canon",
    "insights",
    `${insightId}.yaml`,
  );
  await writeYaml(path.join(repoRoot, relativePath), insight);
  return { destinationId: insightId, destinationPath: relativePath };
}

function findCandidate(
  entry: JournalEntry,
  candidateId: string,
): PromotionCandidate | undefined {
  for (const reflection of [...entry.reflections].reverse()) {
    const found = reflection.candidates.find(
      (candidate) => candidate.id === candidateId,
    );
    if (found) {
      return found;
    }
  }
  return undefined;
}

async function loadTrip(repoRoot: string, slug: string): Promise<Trip> {
  const loaded = await requireTripBySlug(slug, path.join(repoRoot, "content"));
  return loaded.data;
}

async function loadJournalById(
  repoRoot: string,
  id: string,
): Promise<JournalEntry> {
  const match = /^(.*)-(\d{4}-\d{2}-\d{2})$/.exec(id);
  if (!match) {
    throw new Error(`Invalid journal id: ${id}`);
  }
  const tripSlug = match[1]!;
  const localDate = match[2]!;
  return readJournalFile(journalFilePath(repoRoot, tripSlug, localDate));
}

async function readJournalFile(filePath: string): Promise<JournalEntry> {
  if (!existsSync(filePath)) {
    throw new Error(`Journal not found: ${filePath}`);
  }
  const raw = parseYaml(await readFile(filePath, "utf8")) as unknown;
  return JournalEntrySchema.parse(raw);
}

function journalTripDir(repoRoot: string, tripSlug: string): string {
  return path.join(repoRoot, "vault", "life-canon", "journals", tripSlug);
}

function journalFilePath(
  repoRoot: string,
  tripSlug: string,
  localDate: string,
): string {
  return path.join(journalTripDir(repoRoot, tripSlug), `${localDate}.yaml`);
}

function digestFragments(fragments: JournalFragment[]): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        fragments.map((fragment) => ({
          id: fragment.id,
          recordedAt: fragment.recordedAt,
          text: fragment.text,
        })),
      ),
    )
    .digest("hex");
}

function timezoneForDate(trip: Trip, localDate: string): string {
  const stay = trip.destinations.find(
    (destination) =>
      localDate >= destination.arrivalDate &&
      localDate <= destination.departureDate,
  );
  return stay?.timeZone ?? trip.destinations[0]?.timeZone ?? "UTC";
}

function inferLocalDate(trip: Trip): string {
  const today = new Date().toISOString().slice(0, 10);
  if (today >= trip.startDate && today <= trip.endDate) {
    return today;
  }
  return trip.startDate;
}

async function readFragmentText(parsed: ParsedFlags): Promise<string> {
  const input = stringOption(parsed, "input");
  if (input === "-") {
    return readFile("/dev/stdin", "utf8");
  }
  if (input) {
    return readFile(path.resolve(process.cwd(), input), "utf8");
  }
  return stringOption(parsed, "text") ?? "";
}

async function runJournalJob(
  repoRoot: string,
  tripSlug: string,
  input: unknown,
  work: () => Promise<{ artifacts?: string[] }>,
) {
  const queued = await createJob(repoRoot, "journal", tripSlug, input);
  await lock(repoRoot, queued.id);
  try {
    const result = await work();
    return await complete(repoRoot, queued.id, result.artifacts ?? []);
  } catch (error) {
    await fail(repoRoot, queued.id, {
      code: "journal.failed",
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function writeYaml(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, stringifyYaml(value), "utf8");
}

function parseFlags(args: string[]): ParsedFlags {
  const positionals: string[] = [];
  const options: Record<string, string | boolean> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg?.startsWith("--")) {
      const without = arg.slice(2);
      const eq = without.indexOf("=");
      const key = eq === -1 ? without : without.slice(0, eq);
      const inlineValue = eq === -1 ? undefined : without.slice(eq + 1);
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

function stringOption(parsed: ParsedFlags, key: string): string | undefined {
  const value = parsed.options[key];
  return typeof value === "string" ? value : undefined;
}

function requiredPositional(parsed: ParsedFlags, usage: string): string {
  const value = parsed.positionals[0];
  if (!value) {
    throw new Error(`Usage: ${usage}`);
  }
  return value;
}

function requiredInputPath(parsed: ParsedFlags): string {
  const value = stringOption(parsed, "input");
  if (!value) {
    throw new Error("Missing --input <file>");
  }
  return path.resolve(process.cwd(), value);
}

function parseList(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "capture"
  );
}

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
