import { loadTrips } from "@/lib/trip-data";
import { formatDateRange } from "@/lib/format";

export const metadata = {
  title: "Life",
  description: "Traveler themes and life timeline placeholder.",
};

export default async function LifePage() {
  const trips = await loadTrips();
  const themes = Array.from(
    new Set(
      trips.flatMap(({ trip }) => [
        ...trip.principles,
        ...trip.destinations.flatMap((destination) => destination.themes),
      ]),
    ),
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">life</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Timeline placeholder for Shen Ruililin
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          This page will become a broader life timeline. For now it anchors the
          traveler themes already present in trip planning.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <aside className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">traveler themes</p>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            {themes.map((theme) => (
              <li key={theme} className="border-t border-rule pt-3 first:border-t-0 first:pt-0">
                {theme}
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-5">
          {trips.map(({ trip }) => (
            <article key={trip.slug} className="notebook-card rounded-[2rem] p-5">
              <p className="eyebrow">{formatDateRange(trip.startDate, trip.endDate)}</p>
              <h2 className="mt-2 font-serif text-3xl">{trip.title}</h2>
              <p className="mt-3 max-w-3xl leading-7">{trip.thesis}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {trip.destinations.map((destination) => (
                  <section key={destination.city} className="rounded-3xl border border-rule p-4">
                    <p className="font-semibold">{destination.city}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {destination.coreQuestion}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
