import type { Metadata } from "next";
import Link from "next/link";
import { FamilyCalendarView } from "@/components/calendar/FamilyCalendarView";
import { loadFamilyCalendar } from "@/lib/family-calendar";

export const metadata: Metadata = {
  title: "Where is Shen?",
  description:
    "A clear location calendar for Shen Ruililin’s Nordic journey — cities, hotels, flights, train, and ferry for family.",
};

export default async function CalendarPage() {
  const calendar = await loadFamilyCalendar("nordics-2026");

  return (
    <div className="space-y-10">
      <FamilyCalendarView calendar={calendar} />
      <aside className="rounded-[1.75rem] border border-rule bg-paper-elevated/50 px-5 py-5 text-sm leading-7 text-muted">
        <p>
          This page is meant for family — girlfriend, mom, and anyone who just
          needs to know the city and the bed for each night. For the full
          fieldwork itinerary (food experiments, universities, budgets), open{" "}
          <Link href="/trips/nordics-2026/" className="underline underline-offset-4">
            Nordic Fieldwork 2026
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
