"use client";

import { useMemo, useState } from "react";
import type { BudgetMode, DayPlan } from "@sidequest-atlas/domain";
import { DayCard } from "@/components/trip/DayCard";
import {
  defaultItineraryFilters,
  describeBudgetMode,
  filterDays,
  type ItineraryFilters,
} from "@/lib/filters";

export function ItineraryControls({
  days,
  tripSlug,
  cities,
}: {
  days: DayPlan[];
  tripSlug: string;
  cities: string[];
}) {
  const [filters, setFilters] = useState<ItineraryFilters>(defaultItineraryFilters);
  const visibleDays = useMemo(() => filterDays(days, filters), [days, filters]);

  function update<K extends keyof ItineraryFilters>(
    key: K,
    value: ItineraryFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="space-y-5">
      <div className="notebook-card rounded-[2rem] p-5 print:hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-rule pb-4 lg:flex-row">
          <div>
            <p className="eyebrow">itinerary controls</p>
            <h2 className="mt-2 font-serif text-3xl">Filter the field plan</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {describeBudgetMode(filters.budgetMode)}
            </p>
          </div>
          <p className="text-sm text-muted">
            Showing {visibleDays.length} of {days.length} days
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-semibold">
            City
            <select
              className="field-input mt-2"
              value={filters.city}
              onChange={(event) => update("city", event.target.value)}
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Budget mode
            <select
              className="field-input mt-2"
              value={filters.budgetMode}
              onChange={(event) =>
                update("budgetMode", event.target.value as BudgetMode)
              }
            >
              <option value="student">Student</option>
              <option value="balanced">Balanced</option>
              <option value="splurge">Splurge</option>
            </select>
          </label>

          <div className="grid gap-2 text-sm">
            <Toggle
              checked={filters.weatherFallback}
              label="Weather fallback"
              onChange={(checked) => update("weatherFallback", checked)}
            />
            <Toggle
              checked={filters.lowEnergy}
              label="Low-energy route"
              onChange={(checked) => update("lowEnergy", checked)}
            />
            <Toggle
              checked={filters.fixedOnly}
              label="Fixed-only"
              onChange={(checked) => update("fixedOnly", checked)}
            />
            <Toggle
              checked={filters.openChoices}
              label="Open choices"
              onChange={(checked) => update("openChoices", checked)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {visibleDays.map((day) => (
          <DayCard key={day.id} day={day} tripSlug={tripSlug} />
        ))}
      </div>
    </section>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-rule px-3 py-2">
      <input
        type="checkbox"
        className="field-checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
