import type { TripBudget } from "@sidequest-atlas/domain";
import { formatMoneyRange } from "@/lib/format";

export function BudgetSummary({ budget }: { budget: TripBudget }) {
  return (
    <section className="notebook-card rounded-[2rem] p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-rule pb-4 sm:flex-row">
        <div>
          <p className="eyebrow">budget ledger</p>
          <h2 className="mt-2 font-serif text-3xl">Normal-day ranges</h2>
        </div>
        <p className="text-sm text-muted">
          Base currency: {budget.baseCurrency} / confidence: {budget.confidence}
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {budget.citySubtotals.map((city) => (
          <article key={city.city} className="rounded-3xl border border-rule p-4">
            <p className="eyebrow">{city.city}</p>
            <dl className="mt-4 space-y-3 text-sm">
              {city.balanced && (
                <BudgetLine label="balanced" value={formatMoneyRange(city.balanced)} />
              )}
              {city.student && (
                <BudgetLine label="student" value={formatMoneyRange(city.student)} />
              )}
              {city.food && <BudgetLine label="food" value={formatMoneyRange(city.food)} />}
              {city.activities && (
                <BudgetLine label="activities" value={formatMoneyRange(city.activities)} />
              )}
              {city.localTransport && (
                <BudgetLine
                  label="local transit"
                  value={formatMoneyRange(city.localTransport)}
                />
              )}
            </dl>
          </article>
        ))}
      </div>
      {budget.exclusions.length > 0 && (
        <div className="mt-5 border-t border-rule pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Excludes
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {budget.exclusions.join("; ")}
          </p>
        </div>
      )}
    </section>
  );
}

function BudgetLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-serif text-lg">{value}</dd>
    </div>
  );
}
