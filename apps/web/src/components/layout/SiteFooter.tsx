import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule print:hidden">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 text-sm text-muted sm:px-8 md:grid-cols-[1fr_2fr] lg:px-10">
        <div>
          <p className="font-serif text-xl text-ink">Sidequest Atlas</p>
          <p className="mt-2 leading-6">
            A static-first atlas for learning how places work.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <FooterList
            title="Trip"
            links={[
              { href: "/calendar/", label: "Where is Shen?" },
              { href: "/atlas/", label: "Atlas" },
              { href: "/trips/nordics-2026/", label: "Nordics 2026" },
              { href: "/budget/", label: "Budget" },
            ]}
          />
          <FooterList
            title="Research"
            links={[
              { href: "/systems/", label: "Systems" },
              { href: "/sources/", label: "Sources" },
              { href: "/decisions/", label: "Decisions" },
            ]}
          />
          <FooterList
            title="Notebook"
            links={[
              { href: "/field-notes/", label: "Field notes" },
              { href: "/sidequests/", label: "Sidequests" },
              { href: "/life/", label: "Life" },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="eyebrow text-ink">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="underline-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
