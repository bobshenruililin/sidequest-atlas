import Link from "next/link";
import { notFound } from "next/navigation";
import { YuenChuenDisclaimer } from "@/features/yuen-chuen/YuenChuenDisclaimer";
import {
  edgesForFigure,
  loadYuenChuenGraph,
  type YuenChuenFigure,
} from "@/lib/yuen-chuen";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const graph = await loadYuenChuenGraph();
  return graph.figures.map((figure) => ({ slug: figure.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const graph = await loadYuenChuenGraph();
  const figure = graph.figures.find((item) => item.slug === slug);
  if (!figure) {
    return { title: "Yuen Chuen" };
  }
  return {
    title: `${figure.name} · Yuen Chuen`,
    description: figure.role,
  };
}

function figureById(
  figures: YuenChuenFigure[],
  id: string,
): YuenChuenFigure | undefined {
  return figures.find((figure) => figure.id === id);
}

export default async function YuenChuenFigurePage({ params }: PageProps) {
  const { slug } = await params;
  const graph = await loadYuenChuenGraph();
  const figure = graph.figures.find((item) => item.slug === slug);
  if (!figure) {
    notFound();
  }

  const related = edgesForFigure(graph, figure.id);

  return (
    <div className="space-y-10">
      <section className="border-b border-rule pb-8">
        <p className="eyebrow">
          <Link href="/yuen-chuen/" className="underline-link">
            yuen chuen
          </Link>{" "}
          · {figure.kind} · {figure.wealthBand}
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">
          {figure.name}
        </h1>
        <p className="mt-4 text-lg text-muted">{figure.role}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {figure.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rule px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <YuenChuenDisclaimer />

      <article className="notebook-card rounded-[2rem] p-6 md:p-8">
        <p className="eyebrow">yuen chuen</p>
        <div className="mt-4 space-y-4 text-base leading-8 whitespace-pre-line">
          {figure.body.trim()}
        </div>
        {figure.uncertainty && figure.uncertainty.length > 0 && (
          <div className="mt-8 border-t border-rule pt-5 text-sm leading-6 text-muted">
            <p className="font-semibold text-ink">Uncertainty</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {figure.uncertainty.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Linked by wealth / lore</h2>
        <div className="grid gap-3">
          {related.map((edge) => {
            const other = figureById(graph.figures, edge.otherId);
            if (!other) return null;
            return (
              <Link
                key={`${edge.id}-${edge.direction}`}
                href={`/yuen-chuen/${other.slug}/`}
                className="notebook-card flex flex-col gap-2 rounded-[1.5rem] p-5 transition hover:-translate-y-0.5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="eyebrow">
                    {edge.label} · {edge.kind} · {edge.confidence}
                  </p>
                  <p className="mt-2 font-serif text-2xl">{other.name}</p>
                  <p className="mt-1 text-sm text-muted">{other.role}</p>
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                  {edge.direction === "out" ? "out →" : "← in"}
                </span>
              </Link>
            );
          })}
          {related.length === 0 && (
            <p className="text-sm text-muted">No edges yet for this node.</p>
          )}
        </div>
      </section>
    </div>
  );
}
