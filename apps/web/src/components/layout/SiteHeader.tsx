import Link from "next/link";

const nav = [
  { href: "/", label: "Where is Shen?" },
  { href: "/trips/nordics-2026/", label: "Full itinerary" },
];

export function SiteHeader() {
  return (
    <header className="site-header print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-4 border-b border-rule pb-5 md:flex-row md:items-end">
          <Link href="/" className="group w-fit">
            <span className="eyebrow">Shen Ruililin · Nordic 2026</span>
            <span className="mt-1 block font-serif text-3xl tracking-tight text-ink md:text-4xl">
              Sidequest Atlas
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-muted">
            A simple place to see where Shen is — cities, hotels, flights,
            train, and ferry.
          </p>
        </div>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-[0.18em]">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
