import type { Metadata } from "next";
import Link from "next/link";
import { FamilyCalendarView } from "@/components/calendar/FamilyCalendarView";
import { loadFamilyCalendar } from "@/lib/family-calendar";

export const metadata: Metadata = {
  title: "Where is Shen?",
  description:
    "A clear location calendar for Shen Ruililin’s Nordic journey — cities, hotels, flights, train, and ferry for family.",
};

/** Alias of home — kept so old /calendar/ links keep working on static Pages. */
export default async function CalendarPage() {
  const calendar = await loadFamilyCalendar("nordics-2026");

  return (
    <div className="space-y-10">
      <FamilyCalendarView calendar={calendar} />
      <aside className="rounded-[1.75rem] border border-rule bg-paper-elevated/50 px-5 py-5 text-sm leading-7 text-muted">
        <p>
          Same family calendar as the{" "}
          <Link href="/" className="underline underline-offset-4">
            home page
          </Link>
          . Full fieldwork itinerary:{" "}
          <Link
            href="/trips/nordics-2026/"
            className="underline underline-offset-4"
          >
            Nordic Fieldwork 2026
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
