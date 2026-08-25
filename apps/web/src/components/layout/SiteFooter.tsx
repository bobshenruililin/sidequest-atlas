import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="font-serif text-xl text-ink">Sidequest Atlas</p>
          <p className="mt-1 leading-6">
            Family location page for Shen Ruililin’s Nordic Fieldwork 2026.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="underline-link">
            Where is Shen?
          </Link>
          <Link href="/trips/nordics-2026/" className="underline-link">
            Full itinerary
          </Link>
          <Link href="/yuen-chuen/" className="underline-link">
            Yuen Chuen Atlas
          </Link>
        </div>
      </div>
    </footer>
  );
}
