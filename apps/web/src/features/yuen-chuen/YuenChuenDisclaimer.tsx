import Link from "next/link";

export function YuenChuenDisclaimer() {
  return (
    <aside className="rounded-[1.5rem] border border-dashed border-rule bg-paper-elevated/70 px-5 py-4 text-sm leading-6 text-muted">
      <p className="font-semibold uppercase tracking-[0.16em] text-ink">
        Satire / public lore
      </p>
      <p className="mt-2">
        Affectionate Currents-style parody of public Hong Kong myths — not
        biographies, not valuations, not investigative claims. Dashed graph
        edges and figure uncertainty notes mean “don&apos;t treat this as fact.”
        No private addresses. No vault material.{" "}
        <Link href="/yuen-chuen/" className="underline-link">
          Back to the graph
        </Link>
        .
      </p>
    </aside>
  );
}
