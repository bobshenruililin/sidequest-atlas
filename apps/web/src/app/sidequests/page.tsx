import { loadTrips } from "@/lib/trip-data";
import { formatMoneyRange } from "@/lib/format";

export const metadata = {
  title: "Sidequests",
  description: "Optional fieldwork routes and observation prompts.",
};

export default async function SidequestsPage() {
  const trips = await loadTrips();
  const sidequests = trips.flatMap(({ trip }) =>
    trip.sidequests.map((sidequest) => ({ ...sidequest, tripSlug: trip.slug })),
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">sidequests</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Optional routes with evidence value
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          A sidequest earns its place when it reveals something about systems,
          taste, trust, constraint, or ordinary life.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {sidequests.map((sidequest) => (
          <article key={sidequest.id} className="notebook-card rounded-[2rem] p-5">
            <p className="eyebrow">{sidequest.city}</p>
            <h2 className="mt-2 font-serif text-3xl">{sidequest.title}</h2>
            <p className="mt-3 leading-7">{sidequest.description}</p>
            <p className="mt-4 border-l-2 border-[var(--accent-se)] pl-4 font-serif text-lg leading-7">
              {sidequest.observationPrompt}
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <Score label="place" value={sidequest.placeSpecificity} />
              <Score label="story" value={sidequest.storyPotential} />
              <Score label="social" value={sidequest.socialPotential} />
            </dl>
            <p className="mt-4 text-sm text-muted">
              Budget: {formatMoneyRange(sidequest.budget)}
              {sidequest.durationMinutes ? ` / ${sidequest.durationMinutes} min` : ""}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-rule p-3">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 font-serif text-xl">{value}/5</dd>
    </div>
  );
}
