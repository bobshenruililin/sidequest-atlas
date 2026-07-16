import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItineraryControls } from "@/components/filters/ItineraryControls";
import { TripMap } from "@/components/map/TripMap";
import { BudgetSummary } from "@/components/trip/BudgetSummary";
import { ClaimList } from "@/components/trip/ClaimList";
import { TripHero } from "@/components/trip/TripHero";
import { ExportButtons } from "@/features/export/ExportButtons";
import {
  getClaimsByIds,
  getSourcesForClaims,
  getTripStaticParams,
  requireTripBySlug,
} from "@/lib/trip-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getTripStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await requireTripBySlug(slug).catch(() => undefined);
  if (!trip) {
    return { title: "Trip" };
  }

  return {
    title: trip.title,
    description: trip.subtitle ?? trip.thesis,
  };
}

export default async function TripPage({ params }: PageProps) {
  const { slug } = await params;
  const trip = await requireTripBySlug(slug).catch(() => undefined);
  if (!trip) {
    notFound();
  }

  const cities = Array.from(new Set(trip.days.map((day) => day.city)));
  const claimIds = Array.from(
    new Set([
      ...trip.days.flatMap((day) => day.claimIds),
      ...trip.days.flatMap((day) => day.blocks.flatMap((block) => block.claimIds)),
    ]),
  );
  const claims = getClaimsByIds(trip, claimIds);
  const claimSources = getSourcesForClaims(trip, claimIds);

  return (
    <div className="space-y-10">
      <TripHero trip={trip} />

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <TripMap trip={trip} />
        <ExportButtons trip={trip} />
      </div>

      <ItineraryControls days={trip.days} tripSlug={trip.slug} cities={cities} />

      <BudgetSummary budget={trip.budget} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">open decisions</p>
          <h2 className="mt-2 font-serif text-3xl">Choices to preserve uncertainty</h2>
          <div className="mt-5 space-y-4">
            {trip.majorChoices.map((choice) => (
              <article key={choice.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                <p className="font-serif text-xl">{choice.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {choice.recommendation}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                  {choice.decisionStatus}
                  {choice.deadline ? ` / due ${choice.deadline}` : ""}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">claims</p>
          <h2 className="mt-2 font-serif text-3xl">Trip claims requiring sources</h2>
          <div className="mt-5">
            <ClaimList claims={claims} sources={claimSources} />
          </div>
        </div>
      </section>
    </div>
  );
}
