import Link from "next/link";
import type { Trip } from "@sidequest-atlas/domain";
import { formatDateRange } from "@/lib/format";

export function TripHero({ trip }: { trip: Trip }) {
  return (
    <section className="grid gap-8 border-b border-rule pb-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="eyebrow">{trip.status} trip dossier</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
          {trip.title}
        </h1>
        {trip.subtitle && (
          <p className="mt-5 max-w-3xl font-serif text-2xl leading-9 text-muted">
            {trip.subtitle}
          </p>
        )}
        <p className="mt-6 max-w-3xl text-lg leading-8">{trip.thesis}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/trips/${trip.slug}/`} className="ink-button">
            Trip hub
          </Link>
          <Link href="/field-notes/" className="ghost-button">
            Open notes
          </Link>
        </div>
      </div>
      <aside className="notebook-card rounded-[2rem] p-5">
        <p className="eyebrow">route and questions</p>
        <p className="mt-3 font-serif text-2xl">{formatDateRange(trip.startDate, trip.endDate)}</p>
        <ol className="mt-5 space-y-4">
          {trip.destinations.map((destination, index) => (
            <li key={destination.city} className="flex gap-3">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-rule text-xs font-bold">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold">
                  {destination.city}, {destination.country}
                </p>
                <p className="text-sm leading-6 text-muted">{destination.coreQuestion}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
}
