"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  FigureCluster,
  WealthBand,
  YuenChuenEdge,
  YuenChuenFigure,
} from "@/lib/yuen-chuen-types";
import { CLUSTERS, WEALTH_BANDS } from "@/lib/yuen-chuen-types";

interface WealthGraphProps {
  figures: YuenChuenFigure[];
  edges: YuenChuenEdge[];
}

const CLUSTER_ANGLE: Record<FigureCluster, number> = {
  "hk-wealth": -0.4,
  scholarship: 0.9,
  academia: 2.2,
  sjc: 3.5,
};

const BAND_RING: Record<WealthBand, number> = {
  mythic: 0.38,
  clan: 0.55,
  institutional: 0.7,
  academic: 0.82,
  hall: 0.92,
};

function layoutFigures(figures: YuenChuenFigure[]) {
  const byCluster = new Map<FigureCluster, YuenChuenFigure[]>();
  for (const figure of figures) {
    const list = byCluster.get(figure.cluster) ?? [];
    list.push(figure);
    byCluster.set(figure.cluster, list);
  }

  const positions = new Map<string, { x: number; y: number }>();
  const cx = 50;
  const cy = 50;

  for (const [cluster, members] of byCluster) {
    const base = CLUSTER_ANGLE[cluster];
    members.forEach((figure, index) => {
      const spread = (index - (members.length - 1) / 2) * 0.35;
      const angle = base + spread;
      const radius = BAND_RING[figure.wealthBand] * 42;
      positions.set(figure.id, {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      });
    });
  }

  return positions;
}

export function WealthGraph({ figures, edges }: WealthGraphProps) {
  const router = useRouter();
  const [wealthBand, setWealthBand] = useState<WealthBand | "all">("all");
  const [cluster, setCluster] = useState<FigureCluster | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return figures.filter((figure) => {
      if (wealthBand !== "all" && figure.wealthBand !== wealthBand) return false;
      if (cluster !== "all" && figure.cluster !== cluster) return false;
      if (!q) return true;
      return (
        figure.name.toLowerCase().includes(q) ||
        figure.role.toLowerCase().includes(q) ||
        figure.hashtags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [figures, wealthBand, cluster, query]);

  const filteredIds = useMemo(
    () => new Set(filtered.map((figure) => figure.id)),
    [filtered],
  );

  const visibleEdges = useMemo(
    () =>
      edges.filter(
        (edge) => filteredIds.has(edge.from) && filteredIds.has(edge.to),
      ),
    [edges, filteredIds],
  );

  const positions = useMemo(() => layoutFigures(filtered), [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-2 text-sm">
          <span className="eyebrow">search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="name, role, hashtag"
            className="rounded-2xl border border-rule bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-accent-se"
          />
        </label>
        <label className="flex min-w-[10rem] flex-col gap-2 text-sm">
          <span className="eyebrow">wealth band</span>
          <select
            value={wealthBand}
            onChange={(event) =>
              setWealthBand(event.target.value as WealthBand | "all")
            }
            className="rounded-2xl border border-rule bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-accent-se"
          >
            <option value="all">all</option>
            {WEALTH_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[10rem] flex-col gap-2 text-sm">
          <span className="eyebrow">cluster</span>
          <select
            value={cluster}
            onChange={(event) =>
              setCluster(event.target.value as FigureCluster | "all")
            }
            className="rounded-2xl border border-rule bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-accent-se"
          >
            <option value="all">all</option>
            {CLUSTERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-rule bg-paper-elevated">
        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full"
          role="img"
          aria-label="Wealth link graph of Yuen Chuen figures"
        >
          <rect width="100" height="100" fill="transparent" />
          {visibleEdges.map((edge) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            return (
              <line
                key={edge.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
                strokeOpacity={edge.confidence === "uncertain" ? 0.25 : 0.45}
                strokeWidth={0.35}
                strokeDasharray={
                  edge.confidence === "uncertain" ? "1.2 0.8" : undefined
                }
              />
            );
          })}
          {filtered.map((figure) => {
            const point = positions.get(figure.id);
            if (!point) return null;
            return (
              <g
                key={figure.id}
                role="link"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => router.push(`/yuen-chuen/${figure.slug}/`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/yuen-chuen/${figure.slug}/`);
                  }
                }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={figure.kind === "clan" ? 3.2 : 2.6}
                  fill="color-mix(in srgb, var(--accent-se) 55%, var(--paper-elevated))"
                  stroke="var(--ink)"
                  strokeWidth={0.35}
                />
                <text
                  x={point.x}
                  y={point.y + 5.2}
                  textAnchor="middle"
                  fill="var(--ink)"
                  style={{ fontSize: "2.4px" }}
                >
                  {figure.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-sm text-muted">
        Showing {filtered.length} figure{filtered.length === 1 ? "" : "s"} /{" "}
        {visibleEdges.length} link{visibleEdges.length === 1 ? "" : "s"}. Dashed
        lines = uncertain lore.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((figure) => (
          <Link
            key={figure.id}
            href={`/yuen-chuen/${figure.slug}/`}
            className="notebook-card block rounded-[1.75rem] p-5 transition hover:-translate-y-0.5"
          >
            <p className="eyebrow">
              {figure.wealthBand} · {figure.cluster}
            </p>
            <h2 className="mt-2 font-serif text-2xl">{figure.name}</h2>
            <p className="mt-2 text-sm text-muted">{figure.role}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-6">{figure.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
