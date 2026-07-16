import { z } from "zod";
import { BudgetRangeSchema, ExchangeRateSchema, MoneySchema } from "./money.js";
import { ZonedDateTimeSchema } from "./datetime.js";
import {
  ConfidenceSchema,
  CurrencyCodeSchema,
  PlanningStatusSchema,
  VerificationStatusSchema,
  WeatherDependencySchema,
} from "./primitives.js";
import { PlaceSchema } from "./sources.js";

export const BookingReferenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  provider: z.string().optional(),
  status: PlanningStatusSchema,
  verificationStatus: VerificationStatusSchema,
  start: ZonedDateTimeSchema.optional(),
  end: ZonedDateTimeSchema.optional(),
  placeId: z.string().optional(),
  privateRef: z.string().optional(),
  notes: z.string().optional(),
});
export type BookingReference = z.infer<typeof BookingReferenceSchema>;

export const TransportStepSchema = z.object({
  mode: z.enum([
    "walk",
    "metro",
    "bus",
    "tram",
    "train",
    "ferry",
    "taxi",
    "bike",
    "other",
  ]),
  from: z.string().optional(),
  to: z.string().optional(),
  durationMinutes: z.number().int().nonnegative().optional(),
  estimatedCost: BudgetRangeSchema.optional(),
  notes: z.string().optional(),
  verificationStatus: VerificationStatusSchema.default("unresearched"),
});
export type TransportStep = z.infer<typeof TransportStepSchema>;

export const EventPeriodSchema = z.enum([
  "early-morning",
  "morning",
  "lunch",
  "afternoon",
  "dinner",
  "night",
]);

export const EventBlockSchema = z.object({
  id: z.string().min(1),
  period: EventPeriodSchema,
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  title: z.string().min(1),
  description: z.string(),
  location: PlaceSchema.optional(),
  transportFromPrevious: TransportStepSchema.optional(),
  estimatedCost: BudgetRangeSchema.optional(),
  whyItMatters: z.string(),
  observationPrompt: z.string().optional(),
  bookingRequired: z.boolean(),
  fixed: z.boolean(),
  planningStatus: PlanningStatusSchema.default("recommended"),
  verificationStatus: VerificationStatusSchema.default("unresearched"),
  status: z.enum(["idea", "planned", "booked", "completed", "skipped"]),
  claimIds: z.array(z.string()).default([]),
});
export type EventBlock = z.infer<typeof EventBlockSchema>;

export const FallbackPlanSchema = z.object({
  id: z.string().min(1),
  trigger: z.enum(["weather", "low-energy", "closure", "crowd", "other"]),
  title: z.string().min(1),
  description: z.string(),
  estimatedCost: BudgetRangeSchema.optional(),
});
export type FallbackPlan = z.infer<typeof FallbackPlanSchema>;

export const FoodModeSchema = z.enum([
  "supermarket",
  "student-cafeteria",
  "worker-lunch",
  "market",
  "picnic",
  "cafe",
  "restaurant",
  "splurge",
  "skip",
]);
export type FoodMode = z.infer<typeof FoodModeSchema>;

export const FoodItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  seasonal: z.boolean().optional(),
  notes: z.string().optional(),
  typicalPrice: BudgetRangeSchema.optional(),
});
export type FoodItem = z.infer<typeof FoodItemSchema>;

export const FoodVenueSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string(),
  description: z.string(),
  location: PlaceSchema.optional(),
  budget: BudgetRangeSchema,
  planningStatus: PlanningStatusSchema.default("candidate"),
  verificationStatus: VerificationStatusSchema.default("unresearched"),
  whyItMatters: z.string().optional(),
  claimIds: z.array(z.string()).default([]),
});
export type FoodVenue = z.infer<typeof FoodVenueSchema>;

export const FoodExperimentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  items: z.array(FoodItemSchema),
  accompaniments: z.array(FoodItemSchema).default([]),
  idealLocation: PlaceSchema.optional(),
  scoringCriteria: z.array(z.string()),
  budget: BudgetRangeSchema,
  storageWarnings: z.array(z.string()).optional(),
  foodSafetyNotes: z.array(z.string()).optional(),
});
export type FoodExperiment = z.infer<typeof FoodExperimentSchema>;

export const PicnicPlanSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  items: z.array(FoodItemSchema),
  locationIdeas: z.array(z.string()).default([]),
  budget: BudgetRangeSchema,
  weatherDependency: WeatherDependencySchema,
});
export type PicnicPlan = z.infer<typeof PicnicPlanSchema>;

export const LocalTermSchema = z.object({
  term: z.string(),
  meaning: z.string(),
  language: z.string().optional(),
});
export type LocalTerm = z.infer<typeof LocalTermSchema>;

export const FoodStrategySchema = z.object({
  seasonalFoods: z.array(FoodItemSchema).default([]),
  supermarketExperiments: z.array(FoodExperimentSchema).default([]),
  studentCafeterias: z.array(FoodVenueSchema).default([]),
  workerLunches: z.array(FoodVenueSchema).default([]),
  markets: z.array(FoodVenueSchema).default([]),
  picnicCombinations: z.array(PicnicPlanSchema).default([]),
  worthySplurges: z.array(FoodVenueSchema).default([]),
  avoidOverpayingFor: z.array(z.string()).default([]),
  discountTerms: z.array(LocalTermSchema).default([]),
  normalDailyBudget: BudgetRangeSchema,
});
export type FoodStrategy = z.infer<typeof FoodStrategySchema>;

export const InstitutionTypeSchema = z.enum([
  "company",
  "university",
  "library",
  "museum",
  "government",
  "foundation",
  "market",
  "startup-hub",
  "public-space",
]);

export const InstitutionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: InstitutionTypeSchema,
  city: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  whatItReveals: z.string(),
  aiEraQuestion: z.string().optional(),
  visitability: z.enum([
    "public",
    "tour-request",
    "exterior-only",
    "unknown",
  ]),
  relatedPlaces: z.array(PlaceSchema).default([]),
  questionsToAsk: z.array(z.string()).default([]),
  sourceIds: z.array(z.string()).default([]),
  claimIds: z.array(z.string()).default([]),
  verificationStatus: VerificationStatusSchema.default("unresearched"),
});
export type Institution = z.infer<typeof InstitutionSchema>;

export const LocalSystemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum([
    "transport",
    "housing",
    "energy",
    "welfare",
    "labor",
    "capital",
    "food-production",
    "design",
    "trust",
    "other",
  ]),
  description: z.string(),
  whyItMatters: z.string(),
  claimIds: z.array(z.string()).default([]),
});
export type LocalSystem = z.infer<typeof LocalSystemSchema>;

export const TripBudgetSchema = z.object({
  baseCurrency: CurrencyCodeSchema,
  exchangeRates: z.array(ExchangeRateSchema).default([]),
  studentTotal: BudgetRangeSchema.optional(),
  balancedTotal: BudgetRangeSchema.optional(),
  splurgeTotal: BudgetRangeSchema.optional(),
  citySubtotals: z
    .array(
      z.object({
        city: z.string(),
        currency: CurrencyCodeSchema,
        student: BudgetRangeSchema.optional(),
        balanced: BudgetRangeSchema.optional(),
        food: BudgetRangeSchema.optional(),
        activities: BudgetRangeSchema.optional(),
        localTransport: BudgetRangeSchema.optional(),
      }),
    )
    .default([]),
  contingencyMinor: z.number().int().nonnegative().optional(),
  exclusions: z.array(z.string()).default([
    "prepaid accommodation",
    "long-distance transport",
  ]),
  actualSpend: z.array(MoneySchema).default([]),
  confidence: ConfidenceSchema.default("low"),
});
export type TripBudget = z.infer<typeof TripBudgetSchema>;
