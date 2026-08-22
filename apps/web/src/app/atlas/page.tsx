import Link from "next/link";
import { TripMap } from "@/components/map/TripMap";
import { getTripBySlug, listTrips, loadTrips } from "@/lib/trip-data";
import { formatDateRange } from "@/lib/format";

export const metadata = {
  title: "Atlas",
  description: "Chronological trips and route maps for Sidequest Atlas.",
};

export default async function AtlasPage() {
  const trips = await listTrips();
  const primaryTrip =
    (await getTripBySlug("nordics-2026")) ?? (await loadTrips())[0]?.trip;

  return (
    <div className="space-y-10">
      <section className="border-b border-rule pb-8">
        <p className="eyebrow">atlas</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-7xl">
          Chronological trips and route evidence
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Trips are ordered as field notebooks, not brochures: dates first,
          then route logic, thesis, and the places where systems become visible.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          Side project:{" "}
          <Link href="/yuen-chuen/" className="underline-link">
            Yuen Chuen Atlas
          </Link>{" "}
          — bro-voice yearbook myths linked by wealth lore (not the trip OS).
        </p>
      </section>

      {primaryTrip && <TripMap trip={primaryTrip} />}

      <section className="grid gap-5">
        {trips.map((trip, index) => (
          <article
            key={trip.slug}
            className="notebook-card rounded-[2rem] p-5 md:grid md:grid-cols-[10rem_1fr_auto] md:items-center md:gap-6"
          >
            <div>
              <p className="eyebrow">trip {index + 1}</p>
              <p className="mt-2 font-serif text-xl">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="font-serif text-3xl">{trip.title}</h2>
              {trip.subtitle && (
                <p className="mt-2 text-sm leading-6 text-muted">{trip.subtitle}</p>
              )}
              <p className="mt-3 text-sm text-muted">
                {trip.destinations.join(" -> ")} / {trip.dayCount} days
              </p>
            </div>
            <Link href={`/trips/${trip.slug}/`} className="ghost-button mt-5 md:mt-0">
              Open
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
