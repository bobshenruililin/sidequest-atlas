import { loadTrips } from "@/lib/trip-data";
import { formatMoneyRange } from "@/lib/format";

export const metadata = {
  title: "Food",
  description: "Food experiments, normal-day budgets, and meal fieldwork.",
};

export default async function FoodPage() {
  const trips = await loadTrips();
  const destinations = trips.flatMap(({ trip }) => trip.destinations);

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">food</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Meals as system interfaces
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Food pages track normal prices, seasonal rituals, supermarket
          experiments, and meals that help explain how a place works.
        </p>
      </header>

      <section className="grid gap-5">
        {destinations.map((destination) => {
          const strategy = destination.foodStrategy;
          const venues = [
            ...strategy.studentCafeterias,
            ...strategy.workerLunches,
            ...strategy.markets,
            ...strategy.worthySplurges,
          ];

          return (
            <article key={destination.city} className="notebook-card rounded-[2rem] p-5">
              <div className="flex flex-col justify-between gap-3 border-b border-rule pb-4 md:flex-row">
                <div>
                  <p className="eyebrow">{destination.city}</p>
                  <h2 className="mt-2 font-serif text-3xl">
                    {destination.coreQuestion}
                  </h2>
                </div>
                <p className="text-sm text-muted">
                  Normal day: {formatMoneyRange(strategy.normalDailyBudget)}
                </p>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <div>
                  <p className="eyebrow">seasonal foods</p>
                  <ul className="mt-3 space-y-3 text-sm leading-6">
                    {strategy.seasonalFoods.map((food) => (
                      <li key={food.id}>
                        <span className="font-semibold">{food.name}</span>
                        {food.notes ? <span className="text-muted"> - {food.notes}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">experiments</p>
                  <ul className="mt-3 space-y-3 text-sm leading-6">
                    {strategy.supermarketExperiments.map((experiment) => (
                      <li key={experiment.id}>
                        <span className="font-semibold">{experiment.title}</span>
                        <span className="text-muted"> - {experiment.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">venues</p>
                  <ul className="mt-3 space-y-3 text-sm leading-6">
                    {venues.map((venue) => (
                      <li key={venue.id}>
                        <span className="font-semibold">{venue.name}</span>
                        <span className="text-muted"> - {venue.description}</span>
                      </li>
                    ))}
                    {venues.length === 0 && (
                      <li className="text-muted">No venue shortlist yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
