import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { getContentRoot } from "@/lib/trip-data";

export type CalendarAccent = "no" | "se" | "fi" | "transit";

export interface CalendarMovement {
  when: string;
  timeZone: string;
  title: string;
  detail: string;
  precision: string;
}

export interface CalendarPhase {
  id: string;
  kind: "stay" | "transit";
  label: string;
  city: string;
  country: string;
  countryCode: string;
  accent: CalendarAccent;
  startDate: string;
  endDate: string;
  sleepPlace: string;
  summary: string;
  movements: CalendarMovement[];
}

export interface CalendarNight {
  date: string;
  city: string;
  place: string;
  phaseId: string;
}

export interface FamilyCalendar {
  schemaVersion: string;
  tripSlug: string;
  travelerName: string;
  travelerShortName: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  timezoneNote: string;
  privacyNote: string;
  phases: CalendarPhase[];
  nights: CalendarNight[];
}

export async function loadFamilyCalendar(
  tripSlug = "nordics-2026",
): Promise<FamilyCalendar> {
  const contentRoot = await getContentRoot();
  const filePath = path.join(
    contentRoot,
    "trips",
    tripSlug,
    "family-calendar.yaml",
  );
  const raw = await readFile(filePath, "utf8");
  return parseYaml(raw) as FamilyCalendar;
}

export function accentCssVar(accent: CalendarAccent): string {
  switch (accent) {
    case "no":
      return "var(--accent-no)";
    case "se":
      return "var(--accent-se)";
    case "fi":
      return "var(--accent-fi)";
    default:
      return "var(--muted)";
  }
}
