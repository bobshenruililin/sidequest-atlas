import { z } from "zod";
import {
  CURRENT_SCHEMA_VERSION,
  SchemaVersionSchema,
} from "./primitives.js";
import { DateStringSchema } from "./primitives.js";

export const JournalPromptSchema = z.enum([
  "surprise",
  "ordinary-life",
  "tomorrow",
  "free",
]);
export type JournalPrompt = z.infer<typeof JournalPromptSchema>;

export const JournalFragmentSchema = z.object({
  id: z.string().min(1),
  recordedAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString() : value),
    z.string().datetime({ offset: true }),
  ),
  text: z.string().min(1),
  prompt: JournalPromptSchema.optional(),
  respondsTo: z.string().optional(),
  tags: z.array(z.string()).default([]),
});
export type JournalFragment = z.infer<typeof JournalFragmentSchema>;

export const GroundedInsightKindSchema = z.enum([
  "noticed",
  "interpretation",
  "hypothesis",
  "contradiction",
  "question",
]);

export const GroundedInsightSchema = z.object({
  id: z.string().min(1),
  kind: GroundedInsightKindSchema,
  text: z.string().min(1),
  evidenceFragmentIds: z.array(z.string()).min(1),
  confidence: z.enum(["low", "medium", "high"]),
});
export type GroundedInsight = z.infer<typeof GroundedInsightSchema>;

export const ObservationCandidateSchema = z.object({
  kind: z.literal("observation"),
  id: z.string().min(1),
  dayId: z.string().min(1),
  category: z.enum([
    "food",
    "labor",
    "transport",
    "design",
    "trust",
    "wealth",
    "education",
    "technology",
    "behavior",
    "contradiction",
    "personal",
  ]),
  text: z.string().min(1),
  certainty: z.enum(["noticed", "interpreted", "hypothesis"]).default("noticed"),
  evidenceFragmentIds: z.array(z.string()).default([]),
});

export const DecisionCandidateSchema = z.object({
  kind: z.literal("decision"),
  id: z.string().min(1),
  decisionId: z.string().min(1),
  action: z.enum(["consider", "select", "reopen", "record-outcome"]),
  optionId: z.string().optional(),
  note: z.string().min(1),
  evidenceFragmentIds: z.array(z.string()).default([]),
});

export const CaptureCandidateSchema = z.object({
  kind: z.literal("capture"),
  id: z.string().min(1),
  title: z.string().min(1),
  rawText: z.string().min(1),
  spark: z.string().optional(),
  domains: z
    .array(
      z.enum([
        "career",
        "travel",
        "opportunity",
        "research",
        "capital",
        "relationship",
        "idea",
        "health",
        "other",
      ]),
    )
    .min(1),
  ask: z
    .enum(["use", "defer", "ignore", "synthesize", "investigate"])
    .default("investigate"),
  evidenceFragmentIds: z.array(z.string()).default([]),
});

export const CanonInsightCandidateSchema = z.object({
  kind: z.literal("canon-insight"),
  id: z.string().min(1),
  statement: z.string().min(1),
  rationale: z.string().min(1),
  evidenceFragmentIds: z.array(z.string()).default([]),
});

export const PromotionCandidateSchema = z.discriminatedUnion("kind", [
  ObservationCandidateSchema,
  DecisionCandidateSchema,
  CaptureCandidateSchema,
  CanonInsightCandidateSchema,
]);
export type PromotionCandidate = z.infer<typeof PromotionCandidateSchema>;

export const JournalReflectionSchema = z.object({
  id: z.string().min(1),
  reflectedAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString() : value),
    z.string().datetime({ offset: true }),
  ),
  depth: z.enum(["quick", "deep"]),
  sourceRevision: z.number().int().nonnegative(),
  sourceDigest: z.string().min(1),
  insights: z.array(GroundedInsightSchema).default([]),
  challenge: z.string().optional(),
  bounceQuestion: z.string().optional(),
  candidates: z.array(PromotionCandidateSchema).default([]),
});
export type JournalReflection = z.infer<typeof JournalReflectionSchema>;

export const PromotionRecordSchema = z.object({
  candidateId: z.string().min(1),
  kind: z.enum(["observation", "decision", "capture", "canon-insight"]),
  promotedAt: z.string().datetime({ offset: true }),
  destinationId: z.string().min(1),
  destinationPath: z.string().min(1),
});
export type PromotionRecord = z.infer<typeof PromotionRecordSchema>;

/**
 * One local calendar day of traveler testimony for a trip.
 * Raw bodies live only in the vault; chat alone does not compound.
 */
export const JournalEntrySchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-\d{2}-\d{2}$/,
      "id must be {trip-slug}-{YYYY-MM-DD}",
    ),
  tripSlug: z.string().min(1),
  localDate: DateStringSchema,
  timeZone: z.string().min(1),
  visibility: z.literal("vault").default("vault"),
  status: z.enum(["open", "reflected", "closed"]).default("open"),
  revision: z.number().int().nonnegative().default(0),
  createdAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString() : value),
    z.string().datetime({ offset: true }),
  ),
  updatedAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString() : value),
    z.string().datetime({ offset: true }),
  ),
  fragments: z.array(JournalFragmentSchema).default([]),
  reflections: z.array(JournalReflectionSchema).default([]),
  promotions: z.array(PromotionRecordSchema).default([]),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const CanonInsightSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  statement: z.string().min(1),
  rationale: z.string().min(1),
  evidenceRefs: z.array(z.string()).default([]),
  relatedTrips: z.array(z.string()).default([]),
  status: z.enum(["accepted", "superseded"]).default("accepted"),
  supersedes: z.array(z.string()).default([]),
});
export type CanonInsight = z.infer<typeof CanonInsightSchema>;

/** Opaque ref: journal://{trip}/{date}#{fragmentId} */
export function journalFragmentRef(
  tripSlug: string,
  localDate: string,
  fragmentId: string,
): string {
  return `journal://${tripSlug}/${localDate}#${fragmentId}`;
}
