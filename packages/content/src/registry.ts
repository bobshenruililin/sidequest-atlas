import type { Trip } from "@sidequest-atlas/domain";
import { loadTrips, resolveContentDir, type LoadedYaml } from "./loaders.js";

export interface TripSummary {
  slug: string;
  title: string;
  status: Trip["status"];
  startDate: string;
  endDate: string;
  destinations: string[];
  filePath: string;
}

export async function listTrips(
  contentDir = resolveContentDir(),
): Promise<TripSummary[]> {
  const trips = await loadTrips(contentDir);
  return trips.map(({ data, filePath }) => ({
    slug: data.slug,
    title: data.title,
    status: data.status,
    startDate: data.startDate,
    endDate: data.endDate,
    destinations: data.destinations.map((destination) => destination.city),
    filePath,
  }));
}

export async function getTripBySlug(
  slug: string,
  contentDir = resolveContentDir(),
): Promise<LoadedYaml<Trip> | undefined> {
  const trips = await loadTrips(contentDir);
  return trips.find((trip) => trip.data.slug === slug);
}

export async function requireTripBySlug(
  slug: string,
  contentDir = resolveContentDir(),
): Promise<LoadedYaml<Trip>> {
  const trip = await getTripBySlug(slug, contentDir);
  if (!trip) {
    throw new Error(`Trip not found: ${slug}`);
  }
  return trip;
}
