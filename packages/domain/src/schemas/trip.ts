import { z } from "zod";
import {
  BudgetModeSchema,
  CURRENT_SCHEMA_VERSION,
  DateStringSchema,
  EnergyLevelSchema,
  PaceSchema,
  Rating1to5Schema,
  SchemaVersionSchema,
  WeatherDependencySchema,
} from "./primitives.js";
import { DateRangeSchema } from "./datetime.js";
import { BudgetRangeSchema, MoneySchema } from "./money.js";
import { ClaimSchema, PlaceSchema, SourceRecordSchema } from "./sources.js";
import {
  BookingReferenceSchema,
  EventBlockSchema,
  FallbackPlanSchema,
  FoodModeSchema,
  FoodStrategySchema,
  InstitutionSchema,
  LocalSystemSchema,
  TripBudgetSchema,
} from "./entities.js";

export const TravelerProfileSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  name: z.string().min(1),
  biography: z.string().optional(),
  home: z.string().optional(),
  interests: z.array(z.string()),
  travelValues: z.array(z.string()),
  foodPreferences: z.array(z.string()),
  constraints: z.array(z.string()),
  defaultPace: PaceSchema,
  defaultBudgetMode: BudgetModeSchema,
});
export type TravelerProfile = z.infer<typeof TravelerProfileSchema>;

export const TripAnchorSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum([
    "flight",
    "train",
    "ferry",
    "accommodation",
    "reservation",
    "conference",
    "festival",
    "friend",
    "deadline",
    "other",
  ]),
  fixed: z.boolean(),
  start: z
    .object({
      localDate: DateStringSchema,
      localTime: z.string().optional(),
      timeZone: z.string(),
      precision: z.enum(["date", "approximate-time", "confirmed-time"]),
      confirmationStatus: z.enum([
        "traveler-provided",
        "sourced",
        "booked",
      ]),
    })
    .optional(),
  bookingId: z.string().optional(),
  notes: z.string().optional(),
  claimIds: z.array(z.string()).default([]),
});
export type TripAnchor = z.infer<typeof TripAnchorSchema>;

export const ChoiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  meaning: z.string().optional(),
  estimatedCostMinor: z.number().int().optional(),
  currency: z.string().length(3).optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

export const MajorChoiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  deadline: DateStringSchema.optional(),
  options: z.array(ChoiceOptionSchema),
  recommendation: z.string().optional(),
  decisionStatus: z.enum(["open", "decided", "expired"]),
});
export type MajorChoice = z.infer<typeof MajorChoiceSchema>;

export const DecisionRecordSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(ChoiceOptionSchema),
  selectedOptionId: z.string().optional(),
  decidedAt: DateStringSchema.optional(),
  rationale: z.string().optional(),
  expectedOutcome: z.string().optional(),
  actualOutcome: z.string().optional(),
  reconsiderAfter: DateStringSchema.optional(),
});
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;

export const DestinationStaySchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().length(2),
  arrivalDate: DateStringSchema,
  departureDate: DateStringSchema,
  timeZone: z.string().min(1),
  accommodation: BookingReferenceSchema.optional(),
  themes: z.array(z.string()),
  coreQuestion: z.string(),
  foodStrategy: FoodStrategySchema,
  universities: z.array(InstitutionSchema).default([]),
  companies: z.array(InstitutionSchema).default([]),
  publicInstitutions: z.array(InstitutionSchema).default([]),
  localSystems: z.array(LocalSystemSchema).default([]),
});
export type DestinationStay = z.infer<typeof DestinationStaySchema>;

export const DayPlanSchema = z.object({
  id: z.string().min(1),
  date: DateStringSchema,
  city: z.string(),
  country: z.string(),
  title: z.string().min(1),
  theme: z.string().min(1),
  thesisQuestion: z.string(),
  coherenceNote: z.string().optional(),
  weatherDependency: WeatherDependencySchema,
  expectedEnergy: EnergyLevelSchema,
  blocks: z.array(EventBlockSchema),
  foodMode: z.array(FoodModeSchema),
  budget: BudgetRangeSchema,
  actualSpend: z.array(MoneySchema).optional(),
  sidequestPotential: Rating1to5Schema,
  fieldworkPrompts: z.array(z.string()),
  socialPrompts: z.array(z.string()).default([]),
  fallbackPlans: z.array(FallbackPlanSchema).default([]),
  memoryArtifact: z.string().optional(),
  reservations: z.array(BookingReferenceSchema).default([]),
  sourceIds: z.array(z.string()).default([]),
  claimIds: z.array(z.string()).default([]),
});
export type DayPlan = z.infer<typeof DayPlanSchema>;

export const SidequestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  city: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
  location: PlaceSchema.optional(),
  durationMinutes: z.number().int().positive().optional(),
  budget: BudgetRangeSchema,
  placeSpecificity: Rating1to5Schema,
  storyPotential: Rating1to5Schema,
  socialPotential: Rating1to5Schema,
  weatherDependency: WeatherDependencySchema,
  bestTime: z.string().optional(),
  seasonalWindow: DateRangeSchema.optional(),
  foodPairing: z.string().optional(),
  observationPrompt: z.string(),
  socialOpening: z.string().optional(),
  memoryArtifact: z.string().optional(),
  fallback: z.string().optional(),
  sourceIds: z.array(z.string()).default([]),
  claimIds: z.array(z.string()).default([]),
});
export type Sidequest = z.infer<typeof SidequestSchema>;

export const ObservationSchema = z.object({
  id: z.string().min(1),
  tripId: z.string().min(1),
  dayId: z.string().min(1),
  recordedAt: z.string(),
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
  placeId: z.string().optional(),
  institutionIds: z.array(z.string()).optional(),
  private: z.boolean().default(false),
  mediaIds: z.array(z.string()).optional(),
  certainty: z.enum(["noticed", "interpreted", "hypothesis"]).optional(),
});
export type Observation = z.infer<typeof ObservationSchema>;

export const TripSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  travelerId: z.string().min(1),
  startDate: DateStringSchema,
  endDate: DateStringSchema,
  status: z.enum(["idea", "researching", "planned", "active", "completed"]),
  destinations: z.array(DestinationStaySchema),
  thesis: z.string().min(1),
  questions: z.array(z.string()),
  principles: z.array(z.string()),
  anchors: z.array(TripAnchorSchema).default([]),
  majorChoices: z.array(MajorChoiceSchema).default([]),
  decisions: z.array(DecisionRecordSchema).default([]),
  days: z.array(DayPlanSchema),
  sidequests: z.array(SidequestSchema).default([]),
  budget: TripBudgetSchema,
  sources: z.array(SourceRecordSchema).default([]),
  claims: z.array(ClaimSchema).default([]),
  observations: z.array(ObservationSchema).default([]),
  finalSynthesis: z.string().optional(),
});
export type Trip = z.infer<typeof TripSchema>;

export const ResearchModuleSchema = z.enum([
  "food",
  "universities",
  "companies",
  "economics",
  "culture",
  "events",
  "sidequests",
  "logistics",
]);

export const DestinationInputSchema = z.object({
  city: z.string(),
  country: z.string(),
  countryCode: z.string().length(2).optional(),
  arrival: DateStringSchema,
  departure: DateStringSchema,
  timeZone: z.string().optional(),
});

export const BudgetInputSchema = z.object({
  amountMinor: z.number().int().optional(),
  amount: z.number().optional(),
  currency: z.string().length(3),
  excludes: z.array(z.string()).default([]),
  preferredMode: BudgetModeSchema.default("balanced"),
});

export const ResearchRequestSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  tripId: z.string(),
  slug: z.string().optional(),
  title: z.string().optional(),
  generatedAt: z.string(),
  travelerId: z.string().optional(),
  traveler: TravelerProfileSchema.optional(),
  destinations: z.array(DestinationInputSchema),
  dates: DateRangeSchema,
  existingBookings: z.array(BookingReferenceSchema).default([]),
  budget: BudgetInputSchema,
  interests: z.array(z.string()).default([]),
  mustDo: z.array(z.string()).default([]),
  dislikes: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  requestedModules: z.array(ResearchModuleSchema),
  companiesAndInstitutions: z.array(z.string()).default([]),
  foodPreferences: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  desiredPace: PaceSchema.default("balanced"),
  desiredSocialLevel: z.string().optional(),
});
export type ResearchRequest = z.infer<typeof ResearchRequestSchema>;

export const ValidationSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
  "critical",
]);

export const ValidationIssueSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  severity: ValidationSeveritySchema,
  entityType: z.string(),
  entityId: z.string(),
  fieldPath: z.string().optional(),
  message: z.string(),
  suggestedFix: z.string().optional(),
  autoFixable: z.boolean().default(false),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

export const ValidationReportSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  tripSlug: z.string(),
  generatedAt: z.string(),
  issues: z.array(ValidationIssueSchema),
  criticalCount: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative(),
  passed: z.boolean(),
});
export type ValidationReport = z.infer<typeof ValidationReportSchema>;

export const ResearchResultSchema = z.object({
  schemaVersion: SchemaVersionSchema.default(CURRENT_SCHEMA_VERSION),
  requestId: z.string(),
  status: z.enum(["draft", "needs-review", "validated"]),
  generatedAt: z.string(),
  trip: TripSchema,
  warnings: z.array(z.string()),
  unresolvedQuestions: z.array(z.string()),
  validationReport: ValidationReportSchema,
});
export type ResearchResult = z.infer<typeof ResearchResultSchema>;
