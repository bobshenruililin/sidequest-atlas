import { z } from "zod";
import {
  CURRENT_SCHEMA_VERSION,
  SchemaVersionSchema,
} from "./primitives.js";

/** Where an interesting signal should live. */
export const CaptureVisibilitySchema = z.enum([
  "public",
  "operator",
  "vault",
]);
export type CaptureVisibility = z.infer<typeof CaptureVisibilitySchema>;

export const CaptureDomainSchema = z.enum([
  "career",
  "travel",
  "opportunity",
  "research",
  "capital",
  "relationship",
  "idea",
  "health",
  "other",
]);
export type CaptureDomain = z.infer<typeof CaptureDomainSchema>;

/**
 * What Bob wants done with the spark.
 * investigate = deepen before deciding
 */
export const CaptureAskSchema = z.enum([
  "use",
  "defer",
  "ignore",
  "synthesize",
  "investigate",
]);
export type CaptureAsk = z.infer<typeof CaptureAskSchema>;

export const CaptureStatusSchema = z.enum([
  "inbox",
  "triaged",
  "acted",
  "archived",
]);
export type CaptureStatus = z.infer<typeof CaptureStatusSchema>;

export const CaptureImplementationSchema = z.object({
  action: z.string().min(1),
  rationale: z.string().min(1),
  effort: z.enum(["S", "M", "L"]),
  leverage: z.enum(["low", "medium", "high"]),
  owner: z.enum(["bob", "agent", "shared"]).default("shared"),
});
export type CaptureImplementation = z.infer<typeof CaptureImplementationSchema>;

export const CaptureTriangulationSchema = z.object({
  againstCanon: z.array(z.string()).default([]),
  informationGaps: z.array(z.string()).default([]),
  opportunityGaps: z.array(z.string()).default([]),
  falseBargains: z.array(z.string()).default([]),
  corrections: z.array(z.string()).default([]),
  suggestedImplementations: z.array(CaptureImplementationSchema).default([]),
});
export type CaptureTriangulation = z.infer<typeof CaptureTriangulationSchema>;

/**
 * One compounding atom: something interesting → read against canon → record.
 * Chat alone does not compound; CaptureRecord does.
 */
export const CaptureRecordSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "id must be YYYY-MM-DD-kebab-slug",
    ),
  capturedAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString() : value),
    z.string().datetime({ offset: true }),
  ),
  title: z.string().min(1),
  rawText: z.string().min(1),
  spark: z.string().min(1).optional(),
  domains: z.array(CaptureDomainSchema).min(1),
  ask: CaptureAskSchema.default("investigate"),
  visibility: CaptureVisibilitySchema.default("operator"),
  status: CaptureStatusSchema.default("inbox"),
  links: z.array(z.string().url()).default([]),
  relatedTrips: z.array(z.string()).default([]),
  relatedRepos: z.array(z.string()).default([]),
  relatedCaptures: z.array(z.string()).default([]),
  relatedJournalEntries: z.array(z.string()).default([]),
  triangulation: CaptureTriangulationSchema.optional(),
  privacyNote: z.string().optional(),
});
export type CaptureRecord = z.infer<typeof CaptureRecordSchema>;
