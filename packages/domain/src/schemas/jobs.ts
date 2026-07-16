import { z } from "zod";
import {
  CURRENT_SCHEMA_VERSION,
  SchemaVersionSchema,
} from "./primitives.js";

export const AgentErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.string().optional(),
});
export type AgentError = z.infer<typeof AgentErrorSchema>;

export const AgentJobSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  tripSlug: z.string().min(1),
  operation: z.enum([
    "intake",
    "research",
    "synthesize",
    "validate",
    "revise",
    "publish",
    "archive",
  ]),
  requestedAt: z.string(),
  requestedBy: z.string(),
  inputHash: z.string(),
  status: z.enum([
    "queued",
    "running",
    "awaiting-review",
    "completed",
    "failed",
    "cancelled",
  ]),
  attempt: z.number().int().nonnegative(),
  maximumAttempts: z.number().int().positive(),
  lockedBy: z.string().optional(),
  lockedAt: z.string().optional(),
  completedAt: z.string().optional(),
  artifacts: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  errors: z.array(AgentErrorSchema).default([]),
});
export type AgentJob = z.infer<typeof AgentJobSchema>;
