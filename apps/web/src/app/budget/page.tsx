import { BudgetSummary } from "@/components/trip/BudgetSummary";
import { loadTrips } from "@/lib/trip-data";
import { formatMoneyRange } from "@/lib/format";

export const metadata = {
  title: "Budget",
  description: "Trip budget ranges and exclusions.",
};

export default async function BudgetPage() {
  const trips = await loadTrips();

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">budget</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Spending as field constraint
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Budget ranges keep each day honest: normal resident costs first,
          optional thesis-enhancing splurges only when they explain something.
        </p>
      </header>

      {trips.map(({ trip }) => (
        <section key={trip.slug} className="space-y-5">
          <BudgetSummary budget={trip.budget} />
          <div className="grid gap-4 md:grid-cols-3">
            {trip.days.map((day) => (
              <article key={day.id} className="rounded-3xl border border-rule p-4">
                <p className="eyebrow">
                  {day.date} / {day.city}
                </p>
                <h2 className="mt-2 font-serif text-2xl">{day.title}</h2>
                <p className="mt-3 text-sm text-muted">
                  {formatMoneyRange(day.budget)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
