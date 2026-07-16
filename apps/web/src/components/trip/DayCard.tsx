"use client";

import Link from "next/link";
import type { DayPlan } from "@sidequest-atlas/domain";
import { cityAccentClass, formatDate, formatMoneyRange } from "@/lib/format";

export function DayCard({
  day,
  tripSlug,
  compact = false,
}: {
  day: DayPlan;
  tripSlug: string;
  compact?: boolean;
}) {
  const fixedCount = day.blocks.filter((block) => block.fixed).length;
  const skippableCount = day.blocks.filter(
    (block) =>
      !block.fixed ||
      block.status === "idea" ||
      block.planningStatus === "candidate",
  ).length;
  const actualSpend = day.actualSpend?.length
    ? day.actualSpend
        .map((money) => `${money.amountMinor / 100} ${money.currency}`)
        .join(", ")
    : "none logged";

  const accentClass = cityAccentClass(countryCodeForCity(day.city));

  return (
    <article
      className={`notebook-card ${accentClass} relative overflow-hidden rounded-[1.75rem] p-5`}
      style={{ borderTopColor: "var(--city-accent)", borderTopWidth: 4 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <p className="eyebrow">
              {formatDate(day.date)} / {day.city}
            </p>
            <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">
              <Link
                href={`/trips/${tripSlug}/days/${day.date}/`}
                className="underline-link"
              >
                {day.title}
              </Link>
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              {day.expectedEnergy} energy
            </p>
            <p className="mt-1 text-sm text-muted">
              weather: {day.weatherDependency}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--city-accent)]">
              {day.theme}
            </p>
            <p className="mt-2 font-serif text-lg leading-7">
              {day.coherenceNote ?? day.thesisQuestion}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <Stat label="fixed" value={fixedCount.toString()} />
            <Stat label="skippable" value={skippableCount.toString()} />
            <Stat label="spend" value={formatMoneyRange(day.budget)} />
          </dl>
        </div>

        {!compact && (
          <>
            <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {day.blocks.slice(0, 6).map((block) => (
                <div key={block.id} className="border-t border-rule pt-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    {block.period}
                    {block.startTime ? ` / ${block.startTime}` : ""}
                  </p>
                  <p className="mt-1 font-semibold">{block.title}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <span className="rounded-full border border-rule px-3 py-1">
                sidequest {day.sidequestPotential}/5
              </span>
              <span className="rounded-full border border-rule px-3 py-1">
                actual spend: {actualSpend}
              </span>
              {day.foodMode.map((mode) => (
                <span key={mode} className="rounded-full border border-rule px-3 py-1">
                  {mode}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function countryCodeForCity(city: string): string | undefined {
  if (city === "Oslo") {
    return "NO";
  }
  if (city === "Stockholm") {
    return "SE";
  }
  if (city === "Helsinki") {
    return "FI";
  }
  return undefined;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-rule bg-paper/40 p-3">
      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-lg leading-tight">{value}</dd>
    </div>
  );
}
