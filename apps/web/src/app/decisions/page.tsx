import { loadTrips } from "@/lib/trip-data";

export const metadata = {
  title: "Decisions",
  description: "Open and recorded trip decisions.",
};

export default async function DecisionsPage() {
  const trips = await loadTrips();

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">decisions</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Choices with rationale
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Decisions are logged so the trip can preserve uncertainty without
          pretending everything is confirmed.
        </p>
      </header>

      {trips.map(({ trip }) => (
        <section key={trip.slug} className="grid gap-5 lg:grid-cols-2">
          <div className="notebook-card rounded-[2rem] p-5">
            <p className="eyebrow">{trip.title}</p>
            <h2 className="mt-2 font-serif text-3xl">Open choices</h2>
            <div className="mt-5 space-y-5">
              {trip.majorChoices.map((choice) => (
                <article key={choice.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                  <p className="font-serif text-2xl">{choice.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {choice.recommendation}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {choice.options.map((option) => (
                      <li key={option.id}>
                        <span className="font-semibold">{option.label}</span>
                        {option.meaning ? (
                          <span className="text-muted"> - {option.meaning}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="notebook-card rounded-[2rem] p-5">
            <p className="eyebrow">decision log</p>
            <h2 className="mt-2 font-serif text-3xl">Recorded rationale</h2>
            <div className="mt-5 space-y-5">
              {trip.decisions.map((decision) => (
                <article key={decision.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                  <p className="font-serif text-2xl">{decision.question}</p>
                  <p className="mt-2 text-sm leading-6">{decision.rationale}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                    selected {decision.selectedOptionId ?? "none"}
                    {decision.reconsiderAfter ? ` / reconsider ${decision.reconsiderAfter}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
