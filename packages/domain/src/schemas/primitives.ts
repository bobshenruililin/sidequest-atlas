import { z } from "zod";

/** Semantic version string for persisted documents */
export const SchemaVersionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, "schemaVersion must be semver X.Y.Z");

export const CURRENT_SCHEMA_VERSION = "1.0.0" as const;

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const PaceSchema = z.enum(["slow", "balanced", "intense"]);
export type Pace = z.infer<typeof PaceSchema>;

export const BudgetModeSchema = z.enum(["student", "balanced", "splurge"]);
export type BudgetMode = z.infer<typeof BudgetModeSchema>;

export const WeatherDependencySchema = z.enum(["low", "medium", "high"]);
export type WeatherDependency = z.infer<typeof WeatherDependencySchema>;

export const EnergyLevelSchema = z.enum([
  "recovery",
  "light",
  "balanced",
  "intense",
]);
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;

export const Rating1to5Schema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type Rating1to5 = z.infer<typeof Rating1to5Schema>;

export const PlanningStatusSchema = z.enum([
  "candidate",
  "shortlisted",
  "recommended",
  "selected",
  "booked",
  "completed",
  "skipped",
  "cancelled",
]);
export type PlanningStatus = z.infer<typeof PlanningStatusSchema>;

export const VerificationStatusSchema = z.enum([
  "unresearched",
  "traveler-provided",
  "researched",
  "confirmed",
  "stale",
  "conflicting",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const LocationPrecisionSchema = z.enum([
  "exact",
  "neighborhood",
  "city",
  "country",
  "private",
]);
export type LocationPrecision = z.infer<typeof LocationPrecisionSchema>;

export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const TimeStringSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Expected HH:MM");

export const CurrencyCodeSchema = z
  .string()
  .length(3)
  .regex(/^[A-Z]{3}$/);
