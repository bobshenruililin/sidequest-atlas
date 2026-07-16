import { loadTrips } from "@/lib/trip-data";

export const metadata = {
  title: "Sources",
  description: "Source records and verification notes.",
};

export default async function SourcesPage() {
  const trips = await loadTrips();
  const sources = trips.flatMap(({ trip }) =>
    trip.sources.map((source) => ({ ...source, tripTitle: trip.title })),
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">sources</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Evidence ledger
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Official and reputable sources are kept visible, including confidence
          levels and re-verification dates.
        </p>
      </header>

      <section className="grid gap-5">
        {sources.map((source) => (
          <article
            key={source.id}
            className="notebook-card rounded-[2rem] p-5 md:grid md:grid-cols-[1fr_auto] md:gap-6"
          >
            <div>
              <p className="eyebrow">
                {source.sourceType} / {source.publisher}
              </p>
              <h2 className="mt-2 font-serif text-3xl">
                <a href={source.url} target="_blank" rel="noreferrer" className="underline-link">
                  {source.title}
                </a>
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                {source.supports.map((support) => (
                  <li key={support}>{support}</li>
                ))}
              </ul>
            </div>
            <dl className="mt-5 grid h-fit gap-3 rounded-3xl border border-rule p-4 text-sm md:mt-0 md:min-w-56">
              <div>
                <dt className="eyebrow">accessed</dt>
                <dd className="mt-1">{source.accessedAt}</dd>
              </div>
              <div>
                <dt className="eyebrow">confidence</dt>
                <dd className="mt-1">{source.confidence}</dd>
              </div>
              <div>
                <dt className="eyebrow">reverify</dt>
                <dd className="mt-1">{source.reverifyAfter ?? "not set"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
