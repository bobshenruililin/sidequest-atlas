import Link from "next/link";

const primaryNav = [
  { href: "/calendar/", label: "Where is Shen?" },
  { href: "/atlas/", label: "Atlas" },
  { href: "/sidequests/", label: "Sidequests" },
  { href: "/food/", label: "Food" },
  { href: "/systems/", label: "Systems" },
  { href: "/field-notes/", label: "Field notes" },
];

const secondaryNav = [
  { href: "/decisions/", label: "Decisions" },
  { href: "/budget/", label: "Budget" },
  { href: "/sources/", label: "Sources" },
  { href: "/life/", label: "Life" },
];

export function SiteHeader() {
  return (
    <header className="site-header print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-4 border-b border-rule pb-5 md:flex-row md:items-end">
          <Link href="/" className="group w-fit">
            <span className="eyebrow">public field notebook</span>
            <span className="mt-1 block font-serif text-3xl tracking-tight text-ink md:text-4xl">
              Sidequest Atlas
            </span>
          </Link>
          <p className="max-w-xl text-sm leading-6 text-muted">
            The Life and Field Notes of Shen Ruililin - travel plans, systems
            observations, food experiments, and decisions kept in public.
          </p>
        </div>
        <nav aria-label="Main navigation" className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-[0.18em]">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted">
            {secondaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link-muted">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
