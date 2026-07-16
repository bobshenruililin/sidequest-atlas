import Link from "next/link";
import { TripMap } from "@/components/map/TripMap";
import { DayCard } from "@/components/trip/DayCard";
import { getTripBySlug, listTrips, loadTrips } from "@/lib/trip-data";
import { formatDateRange } from "@/lib/format";

export default async function Home() {
  const summaries = await listTrips();
  const primaryTrip =
    (await getTripBySlug("nordics-2026")) ?? (await loadTrips())[0]?.trip;

  return (
    <div className="space-y-14">
      <section className="grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Sidequest Atlas</p>
          <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-[0.9] tracking-tight md:text-8xl">
            Sidequest Atlas
          </h1>
          <p className="mt-5 font-serif text-2xl leading-9 text-muted">
            The Life and Field Notes of Shen Ruililin
          </p>
          <p className="mt-8 max-w-3xl text-xl leading-9">
            A public field notebook for traveling to understand how places
            work: the transit, food, trust, capital, weather, institutions, and
            ordinary frictions that make a city legible.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
            The atlas treats sidequests as evidence. A lunch, station transfer,
            supermarket shelf, or low-energy fallback can reveal more about a
            society than a polished landmark.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/atlas/" className="ink-button">
              Open atlas
            </Link>
            <Link href="/trips/nordics-2026/" className="ghost-button">
              Nordics 2026
            </Link>
          </div>
        </div>
        <aside className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">current dossier</p>
          {summaries.map((trip) => (
            <article key={trip.slug} className="mt-4 border-t border-rule pt-4">
              <h2 className="font-serif text-3xl">{trip.title}</h2>
              {trip.subtitle && (
                <p className="mt-2 text-sm leading-6 text-muted">{trip.subtitle}</p>
              )}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="eyebrow">dates</dt>
                  <dd className="mt-1">{formatDateRange(trip.startDate, trip.endDate)}</dd>
                </div>
                <div>
                  <dt className="eyebrow">days</dt>
                  <dd className="mt-1">{trip.dayCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </aside>
      </section>

      {primaryTrip && (
        <>
          <TripMap trip={primaryTrip} />
          <section className="space-y-5">
            <div>
              <p className="eyebrow">first pages</p>
              <h2 className="mt-2 font-serif text-4xl">Opening field days</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {primaryTrip.days.slice(0, 2).map((day) => (
                <DayCard key={day.id} day={day} tripSlug={primaryTrip.slug} compact />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
