"use client";

import { useMemo, useSyncExternalStore } from "react";
import type {
  CalendarAccent,
  CalendarNight,
  CalendarPhase,
  FamilyCalendar,
} from "@/lib/family-calendar";

function parseYmd(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function formatLong(date: string): string {
  return parseYmd(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function formatShort(date: string): string {
  return parseYmd(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function ymdToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function subscribeToDayChange(onStoreChange: () => void): () => void {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    1,
  );
  const timeoutId = window.setTimeout(onStoreChange, nextMidnight.getTime() - now.getTime());
  const intervalId = window.setInterval(onStoreChange, 60 * 60 * 1000);
  return () => {
    window.clearTimeout(timeoutId);
    window.clearInterval(intervalId);
  };
}

function daysBetween(a: string, b: string): number {
  return Math.round((parseYmd(b).getTime() - parseYmd(a).getTime()) / 86400000);
}

function accentClass(accent: CalendarAccent): string {
  return `accent-${accent}`;
}

function phaseForDate(
  phases: CalendarPhase[],
  date: string,
): CalendarPhase | undefined {
  return phases.find((phase) => date >= phase.startDate && date <= phase.endDate);
}

function buildMonth(year: number, monthIndex: number): (string | null)[] {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const startPad = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: startPad }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const m = String(monthIndex + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    cells.push(`${year}-${m}-${d}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function nightByDate(nights: CalendarNight[]): Map<string, CalendarNight> {
  return new Map(nights.map((night) => [night.date, night]));
}

function phaseById(phases: CalendarPhase[]): Map<string, CalendarPhase> {
  return new Map(phases.map((phase) => [phase.id, phase]));
}

export function FamilyCalendarView({ calendar }: { calendar: FamilyCalendar }) {
  const today = useSyncExternalStore(subscribeToDayChange, ymdToday, () => null);

  const nightsMap = useMemo(() => nightByDate(calendar.nights), [calendar.nights]);
  const phasesMap = useMemo(() => phaseById(calendar.phases), [calendar.phases]);

  const firstDate = calendar.nights[0]?.date ?? calendar.phases[0]?.startDate;
  const lastDate =
    calendar.nights.at(-1)?.date ?? calendar.phases.at(-1)?.endDate;

  const status = useMemo(() => {
    if (!today || !firstDate || !lastDate) {
      return {
        label: "Location calendar",
        detail: "Dates below are fixed; tonight highlights after the page loads.",
        city: calendar.travelerShortName,
        place: "Nordic Fieldwork 2026",
        tone: "muted" as const,
      };
    }
    if (today < firstDate) {
      const days = daysBetween(today, firstDate);
      return {
        label: "Not departed yet",
        detail: `Leaves in ${days} day${days === 1 ? "" : "s"} · first flight ${formatLong(firstDate)}`,
        city: "Hong Kong",
        place: "Home before departure",
        tone: "ahead" as const,
      };
    }
    if (today > lastDate) {
      return {
        label: "Back home",
        detail: `Journey ended ${formatLong(lastDate)}`,
        city: "Hong Kong",
        place: "Trip complete",
        tone: "done" as const,
      };
    }
    const night = nightsMap.get(today);
    const phase =
      (night && phasesMap.get(night.phaseId)) ||
      phaseForDate(calendar.phases, today);
    return {
      label: "Tonight",
      detail: formatLong(today),
      city: night?.city ?? phase?.city ?? "On the road",
      place: night?.place ?? phase?.sleepPlace ?? "See timeline below",
      tone: "now" as const,
    };
  }, [today, firstDate, lastDate, nightsMap, phasesMap, calendar.phases, calendar.travelerShortName]);

  const july = buildMonth(2026, 6);
  const august = buildMonth(2026, 7);

  return (
    <div className="family-calendar space-y-12">
      <section className={`status-hero status-${status.tone}`}>
        <p className="eyebrow">for family · share this page</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
          {calendar.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          One calm page for girlfriend and mom: city, hotel or cabin, and the
          next big move — no booking codes.
        </p>

        <div className="status-panel mt-8">
          <div>
            <p className="eyebrow">{status.label}</p>
            <p className="mt-2 font-serif text-4xl md:text-5xl">{status.city}</p>
            <p className="mt-3 text-base leading-7">{status.place}</p>
            <p className="mt-2 text-sm text-muted">{status.detail}</p>
          </div>
          <dl className="status-meta">
            <div>
              <dt>Traveler</dt>
              <dd>{calendar.travelerName}</dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>
                {firstDate && lastDate
                  ? `${formatShort(firstDate)} – ${formatShort(lastDate)}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Privacy</dt>
              <dd>{calendar.privacyNote}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <p className="eyebrow">at a glance</p>
        <h2 className="mt-2 font-serif text-3xl">The route</h2>
        <ol className="route-ribbon mt-6">
          {[
            "Hong Kong",
            "Helsinki*",
            "Oslo",
            "Stockholm",
            "Helsinki",
            "Bangkok*",
            "Hong Kong",
          ].map((stop) => (
            <li key={stop}>
              <span>{stop}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">
          * Connection only — airport transit, not a hotel night.
        </p>
      </section>

      <section className="space-y-5">
        <div>
          <p className="eyebrow">chapters</p>
          <h2 className="mt-2 font-serif text-3xl">Where he is, when</h2>
        </div>
        <div className="phase-stack">
          {calendar.phases.map((phase) => {
            const active =
              today !== null &&
              today >= phase.startDate &&
              today <= phase.endDate;
            return (
              <article
                key={phase.id}
                className={`phase-card ${accentClass(phase.accent)} ${active ? "is-active" : ""}`}
              >
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      {phase.kind === "transit" ? "Moving" : "Staying"} ·{" "}
                      {formatShort(phase.startDate)}
                      {phase.startDate !== phase.endDate
                        ? ` – ${formatShort(phase.endDate)}`
                        : ""}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl">{phase.label}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {phase.city}
                      {phase.country ? ` · ${phase.country}` : ""}
                    </p>
                  </div>
                  {active && <span className="now-pill">Now</span>}
                </header>
                <p className="mt-4 text-base leading-7">{phase.summary}</p>
                <p className="mt-4 rounded-2xl border border-rule/70 bg-paper-elevated/60 px-4 py-3 text-sm leading-6">
                  <span className="eyebrow">sleeps at</span>
                  <span className="mt-1 block font-medium">{phase.sleepPlace}</span>
                </p>
                {phase.movements.length > 0 && (
                  <ul className="movement-list mt-4">
                    {phase.movements.map((move) => (
                      <li key={`${phase.id}-${move.when}-${move.title}`}>
                        <div className="time">{move.when.replace("T", " · ")}</div>
                        <div>
                          <p className="font-medium">{move.title}</p>
                          <p className="text-sm text-muted">{move.detail}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted">
                            {move.timeZone} · {move.precision}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <MonthGrid
          title="July 2026"
          cells={july}
          nightsMap={nightsMap}
          phasesMap={phasesMap}
          today={today}
        />
        <MonthGrid
          title="August 2026"
          cells={august}
          nightsMap={nightsMap}
          phasesMap={phasesMap}
          today={today}
        />
      </section>

      <section>
        <p className="eyebrow">night by night</p>
        <h2 className="mt-2 font-serif text-3xl">Where he sleeps</h2>
        <div className="night-table mt-6">
          {calendar.nights.map((night) => {
            const phase = phasesMap.get(night.phaseId);
            const isToday = today === night.date;
            return (
              <div
                key={night.date}
                className={`night-row ${phase ? accentClass(phase.accent) : ""} ${isToday ? "is-today" : ""}`}
              >
                <div className="night-date">
                  <span className="daynum">{night.date.slice(8)}</span>
                  <span className="weekday">
                    {parseYmd(night.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-xl">{night.city}</p>
                  <p className="text-sm leading-6 text-muted">{night.place}</p>
                </div>
                {isToday && <span className="now-pill">Tonight</span>}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted">{calendar.timezoneNote}</p>
      </section>
    </div>
  );
}

function MonthGrid({
  title,
  cells,
  nightsMap,
  phasesMap,
  today,
}: {
  title: string;
  cells: (string | null)[];
  nightsMap: Map<string, CalendarNight>;
  phasesMap: Map<string, CalendarPhase>;
  today: string | null;
}) {
  return (
    <div className="month-card">
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="month-weekdays mt-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="month-grid mt-2">
        {cells.map((date, index) => {
          if (!date) return <div key={`e-${index}`} className="month-cell empty" />;
          const night = nightsMap.get(date);
          const phase = night ? phasesMap.get(night.phaseId) : undefined;
          return (
            <div
              key={date}
              className={`month-cell ${phase ? accentClass(phase.accent) : ""} ${today === date ? "is-today" : ""} ${night ? "has-trip" : ""}`}
              title={night ? `${night.city} · ${night.place}` : undefined}
            >
              <span className="num">{Number(date.slice(8))}</span>
              {night && <span className="city">{night.city.split(" ")[0]}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
