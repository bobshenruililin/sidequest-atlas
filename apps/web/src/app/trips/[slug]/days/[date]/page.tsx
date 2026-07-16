import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimList } from "@/components/trip/ClaimList";
import { SourceBadge } from "@/components/trip/SourceBadge";
import {
  getClaimsByIds,
  getDayByDate,
  getDayStaticParams,
  getSourcesByIds,
  getSourcesForClaims,
  requireTripBySlug,
} from "@/lib/trip-data";
import { formatDate, formatMoneyRange } from "@/lib/format";

type PageProps = {
  params: Promise<{ slug: string; date: string }>;
};

export async function generateStaticParams() {
  return getDayStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, date } = await params;
  const trip = await requireTripBySlug(slug).catch(() => undefined);
  const day = trip ? getDayByDate(trip, date) : undefined;

  return {
    title: day ? `${day.date}: ${day.title}` : "Day",
    description: day?.coherenceNote ?? day?.thesisQuestion,
  };
}

export default async function DayPage({ params }: PageProps) {
  const { slug, date } = await params;
  const trip = await requireTripBySlug(slug).catch(() => undefined);
  const day = trip ? getDayByDate(trip, date) : undefined;

  if (!trip || !day) {
    notFound();
  }

  const blockClaimIds = day.blocks.flatMap((block) => block.claimIds);
  const claimIds = Array.from(new Set([...day.claimIds, ...blockClaimIds]));
  const claims = getClaimsByIds(trip, claimIds);
  const claimSources = getSourcesForClaims(trip, claimIds);
  const directSources = getSourcesByIds(trip, day.sourceIds);

  return (
    <article className="space-y-8">
      <header className="border-b border-rule pb-8">
        <Link href={`/trips/${trip.slug}/`} className="nav-link-muted text-sm">
          Back to {trip.title}
        </Link>
        <p className="eyebrow mt-6">
          {formatDate(day.date)} / {day.city}, {day.country}
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
          {day.title}
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
          {day.theme}
        </p>
        <p className="mt-5 max-w-3xl font-serif text-2xl leading-9">
          {day.coherenceNote ?? day.thesisQuestion}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="budget" value={formatMoneyRange(day.budget)} />
        <Metric label="energy" value={day.expectedEnergy} />
        <Metric label="weather" value={day.weatherDependency} />
        <Metric label="sidequest" value={`${day.sidequestPotential}/5`} />
      </section>

      <section className="notebook-card rounded-[2rem] p-5">
        <p className="eyebrow">emergency compact</p>
        <h2 className="mt-2 font-serif text-3xl">If the day breaks</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <EmergencyItem title="First move" body="Preserve the fixed transport or reservation block, then collapse the rest of the day into nearby food, shelter, and notes." />
          <EmergencyItem title="Weather" body={day.fallbackPlans.find((fallback) => fallback.trigger === "weather")?.description ?? "Move the fieldwork indoors and keep only transit or grocery observations."} />
          <EmergencyItem title="Low energy" body={day.fallbackPlans.find((fallback) => fallback.trigger === "low-energy")?.description ?? "Reduce to one block, one meal, one memo, and no guilt."} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">blocks</p>
          <h2 className="mt-2 font-serif text-3xl">Day sequence</h2>
          <div className="rule-y mt-5">
            {day.blocks.map((block) => (
              <article key={block.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      {block.period}
                      {block.startTime ? ` / ${block.startTime}` : ""}
                      {block.endTime ? `-${block.endTime}` : ""}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl">{block.title}</h3>
                  </div>
                  <span className="h-fit rounded-full border border-rule px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted">
                    {block.fixed ? "fixed" : block.planningStatus}
                  </span>
                </div>
                <p className="mt-3 leading-7">{block.description}</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Why it matters: {block.whyItMatters}
                </p>
                {block.observationPrompt && (
                  <p className="mt-3 border-l-2 border-[var(--accent-se)] pl-4 font-serif text-lg leading-7">
                    {block.observationPrompt}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="notebook-card rounded-[2rem] p-5">
            <p className="eyebrow">prompts</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6">
              {day.fieldworkPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </div>
          <div className="notebook-card rounded-[2rem] p-5">
            <p className="eyebrow">sources</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {directSources.map((source) => (
                <SourceBadge key={source.id} source={source} />
              ))}
              {directSources.length === 0 && (
                <p className="text-sm text-muted">No direct day sources.</p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="notebook-card rounded-[2rem] p-5">
        <p className="eyebrow">claims</p>
        <h2 className="mt-2 font-serif text-3xl">Verification notes</h2>
        <div className="mt-5">
          <ClaimList claims={claims} sources={claimSources} />
        </div>
      </section>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="notebook-card rounded-3xl p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

function EmergencyItem({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-rule p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}
