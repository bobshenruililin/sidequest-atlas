import { z } from "zod";
import { DateStringSchema, TimeStringSchema } from "./primitives.js";

export const ZonedDateTimeSchema = z.object({
  localDate: DateStringSchema,
  localTime: TimeStringSchema.optional(),
  timeZone: z.string().min(1),
  utc: z.string().datetime({ offset: true }).optional(),
  precision: z.enum(["date", "approximate-time", "confirmed-time"]),
  confirmationStatus: z.enum([
    "traveler-provided",
    "sourced",
    "booked",
  ]),
});
export type ZonedDateTime = z.infer<typeof ZonedDateTimeSchema>;

export const DateRangeSchema = z
  .object({
    start: DateStringSchema,
    end: DateStringSchema,
  })
  .refine((r) => r.start <= r.end, {
    message: "DateRange.start must be <= end",
  });
export type DateRange = z.infer<typeof DateRangeSchema>;

/** Compare two zoned datetimes via Date parsing of local components as UTC placeholders when utc missing — validation layer should prefer utc when present */
export function toSortableInstant(zdt: ZonedDateTime): string {
  if (zdt.utc) return zdt.utc;
  const time = zdt.localTime ?? "00:00";
  return `${zdt.localDate}T${time}:00`;
}

export function isBefore(a: ZonedDateTime, b: ZonedDateTime): boolean {
  return toSortableInstant(a) < toSortableInstant(b);
}

export function datesOverlap(
  a: DateRange,
  b: DateRange,
): boolean {
  return a.start <= b.end && b.start <= a.end;
}

export function dateInRange(date: string, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}
