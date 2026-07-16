import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { TripSchema, type DayPlan, type Trip } from "@sidequest-atlas/domain";

export interface LoadedTrip {
  filePath: string;
  relativePath: string;
  trip: Trip;
}

export interface TripSummary {
  slug: string;
  title: string;
  subtitle?: string;
  status: Trip["status"];
  startDate: string;
  endDate: string;
  destinations: string[];
  dayCount: number;
}

let tripsPromise: Promise<LoadedTrip[]> | undefined;

export async function getContentRoot(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), "content"),
    path.resolve(process.cwd(), "../../content"),
    path.resolve(process.cwd(), "../../../content"),
  ];

  for (const candidate of candidates) {
    try {
      await access(path.join(candidate, "trips"));
      return candidate;
    } catch {
      // Keep looking; builds may run from the repo root or apps/web.
    }
  }

  throw new Error(`Unable to find content/trips from ${process.cwd()}`);
}

export async function listTripFilePaths(): Promise<string[]> {
  const contentRoot = await getContentRoot();
  const tripsRoot = path.join(contentRoot, "trips");
  const entries = await readdir(tripsRoot, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const tripFile = path.join(tripsRoot, entry.name, "trip.yaml");
    try {
      await access(tripFile);
      files.push(tripFile);
    } catch {
      // Ignore incomplete content directories.
    }
  }

  return files.sort();
}

export async function loadTrips(): Promise<LoadedTrip[]> {
  tripsPromise ??= (async () => {
    const contentRoot = await getContentRoot();
    const files = await listTripFilePaths();
    const loaded = await Promise.all(
      files.map(async (filePath) => {
        const raw = await readFile(filePath, "utf8");
        const parsed = TripSchema.parse(parseYaml(raw));
        return {
          filePath,
          relativePath: path.relative(contentRoot, filePath),
          trip: parsed,
        };
      }),
    );

    return loaded.sort((a, b) => a.trip.startDate.localeCompare(b.trip.startDate));
  })();

  return tripsPromise;
}

export async function listTrips(): Promise<TripSummary[]> {
  const loaded = await loadTrips();
  return loaded.map(({ trip }) => ({
    slug: trip.slug,
    title: trip.title,
    subtitle: trip.subtitle,
    status: trip.status,
    startDate: trip.startDate,
    endDate: trip.endDate,
    destinations: trip.destinations.map((destination) => destination.city),
    dayCount: trip.days.length,
  }));
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  const loaded = await loadTrips();
  return loaded.find(({ trip }) => trip.slug === slug)?.trip;
}

export async function requireTripBySlug(slug: string): Promise<Trip> {
  const trip = await getTripBySlug(slug);
  if (!trip) {
    throw new Error(`Trip not found: ${slug}`);
  }
  return trip;
}

export async function getTripStaticParams(): Promise<Array<{ slug: string }>> {
  const trips = await listTrips();
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function getDayStaticParams(): Promise<
  Array<{ slug: string; date: string }>
> {
  const loaded = await loadTrips();
  return loaded.flatMap(({ trip }) =>
    trip.days.map((day) => ({ slug: trip.slug, date: day.date })),
  );
}

export function getDayByDate(trip: Trip, date: string): DayPlan | undefined {
  return trip.days.find((day) => day.date === date);
}

export function getDestinationForCity(trip: Trip, city: string) {
  return trip.destinations.find((destination) => destination.city === city);
}

export function getClaimsByIds(trip: Trip, claimIds: string[]) {
  const ids = new Set(claimIds);
  return trip.claims.filter((claim) => ids.has(claim.id));
}

export function getSourcesByIds(trip: Trip, sourceIds: string[]) {
  const ids = new Set(sourceIds);
  return trip.sources.filter((source) => ids.has(source.id));
}

export function getSourcesForClaims(trip: Trip, claimIds: string[]) {
  const sourceIds = getClaimsByIds(trip, claimIds).flatMap((claim) => claim.sourceIds);
  return getSourcesByIds(trip, sourceIds);
}
