import { loadTrips } from "@/lib/trip-data";

export const metadata = {
  title: "Systems",
  description: "Local systems, institutions, and thesis questions.",
};

export default async function SystemsPage() {
  const trips = await loadTrips();
  const destinations = trips.flatMap(({ trip }) => trip.destinations);

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">systems</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Institutions at street level
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Systems are tracked through everyday interfaces: transport, welfare,
          food production, universities, public spaces, and design constraints.
        </p>
      </header>

      <section className="grid gap-5">
        {destinations.map((destination) => {
          const institutions = [
            ...destination.universities,
            ...destination.companies,
            ...destination.publicInstitutions,
          ];

          return (
            <article key={destination.city} className="notebook-card rounded-[2rem] p-5">
              <p className="eyebrow">
                {destination.city}, {destination.country}
              </p>
              <h2 className="mt-2 font-serif text-3xl">{destination.coreQuestion}</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="eyebrow">local systems</p>
                  <div className="mt-3 space-y-4">
                    {destination.localSystems.map((system) => (
                      <section key={system.id} className="rounded-3xl border border-rule p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                          {system.category}
                        </p>
                        <h3 className="mt-1 font-serif text-2xl">{system.name}</h3>
                        <p className="mt-2 text-sm leading-6">{system.description}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {system.whyItMatters}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow">institutions</p>
                  <div className="mt-3 space-y-4">
                    {institutions.map((institution) => (
                      <section key={institution.id} className="rounded-3xl border border-rule p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                          {institution.type} / {institution.visitability}
                        </p>
                        <h3 className="mt-1 font-serif text-2xl">{institution.name}</h3>
                        <p className="mt-2 text-sm leading-6">
                          {institution.whatItReveals}
                        </p>
                        {institution.aiEraQuestion && (
                          <p className="mt-2 border-l-2 border-[var(--accent-fi)] pl-4 text-sm leading-6 text-muted">
                            {institution.aiEraQuestion}
                          </p>
                        )}
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
