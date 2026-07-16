import { z } from "zod";
import {
  ConfidenceSchema,
  DateStringSchema,
  LocationPrecisionSchema,
} from "./primitives.js";

export const SourceTypeSchema = z.enum([
  "official",
  "primary",
  "academic",
  "government",
  "reputable-secondary",
  "community",
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const SourceRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
  publishedAt: DateStringSchema.optional(),
  accessedAt: DateStringSchema,
  sourceType: SourceTypeSchema,
  supports: z.array(z.string()).default([]),
  confidence: ConfidenceSchema,
  reverifyAfter: DateStringSchema.optional(),
});
export type SourceRecord = z.infer<typeof SourceRecordSchema>;

export const ClaimSubjectTypeSchema = z.enum([
  "event",
  "venue",
  "price",
  "schedule",
  "transport",
  "institution",
  "economic-statistic",
  "company-strategy",
]);

export const ClaimStatusSchema = z.enum([
  "traveler-provided",
  "researched",
  "inferred",
  "unverified",
  "superseded",
]);

export const ClaimSchema = z.object({
  id: z.string().min(1),
  subjectType: ClaimSubjectTypeSchema,
  subjectId: z.string().min(1),
  fieldPath: z.string().min(1),
  statement: z.string().min(1),
  status: ClaimStatusSchema,
  sourceIds: z.array(z.string()).default([]),
  verifiedAt: DateStringSchema.optional(),
  validFrom: DateStringSchema.optional(),
  validUntil: DateStringSchema.optional(),
  reverifyAfter: DateStringSchema.optional(),
  confidence: ConfidenceSchema,
  notes: z.string().optional(),
});
export type Claim = z.infer<typeof ClaimSchema>;

export const PlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameLocal: z.string().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().length(2),
  address: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  locationPrecision: LocationPrecisionSchema.default("city"),
  notes: z.string().optional(),
});
export type Place = z.infer<typeof PlaceSchema>;
