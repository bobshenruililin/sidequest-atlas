import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { getContentRoot } from "@/lib/trip-data";
import type {
  YuenChuenEdge,
  YuenChuenFigure,
  YuenChuenGraph,
} from "@/lib/yuen-chuen-types";

export type {
  EdgeKind,
  FigureCluster,
  FigureEra,
  FigureKind,
  WealthBand,
  YuenChuenEdge,
  YuenChuenFigure,
  YuenChuenGraph,
} from "@/lib/yuen-chuen-types";
export { CLUSTERS, WEALTH_BANDS } from "@/lib/yuen-chuen-types";

async function getYuenChuenRoot(): Promise<string> {
  const contentRoot = await getContentRoot();
  const root = path.join(contentRoot, "yuen-chuen");
  await access(root);
  return root;
}

function assertFigure(raw: unknown, filePath: string): YuenChuenFigure {
  const value = raw as YuenChuenFigure;
  if (
    !value ||
    typeof value.slug !== "string" ||
    typeof value.name !== "string" ||
    typeof value.body !== "string" ||
    !Array.isArray(value.hashtags)
  ) {
    throw new Error(`Invalid Yuen Chuen figure at ${filePath}`);
  }
  return value;
}

export async function loadYuenChuenGraph(): Promise<YuenChuenGraph> {
  const root = await getYuenChuenRoot();
  const figuresDir = path.join(root, "figures");
  const entries = await readdir(figuresDir, { withFileTypes: true });
  const figureFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yaml"))
    .map((entry) => path.join(figuresDir, entry.name))
    .sort();

  const figures = await Promise.all(
    figureFiles.map(async (filePath) => {
      const raw = await readFile(filePath, "utf8");
      return assertFigure(parseYaml(raw), filePath);
    }),
  );

  const edgesRaw = parseYaml(
    await readFile(path.join(root, "edges.yaml"), "utf8"),
  ) as { edges?: YuenChuenEdge[] };

  const figureIds = new Set(figures.map((figure) => figure.id));
  const edges = (edgesRaw.edges ?? []).filter(
    (edge) => figureIds.has(edge.from) && figureIds.has(edge.to),
  );

  return {
    figures: figures.sort((a, b) => a.name.localeCompare(b.name)),
    edges,
  };
}

export async function getYuenChuenFigure(
  slug: string,
): Promise<YuenChuenFigure | undefined> {
  const graph = await loadYuenChuenGraph();
  return graph.figures.find((figure) => figure.slug === slug);
}

export function edgesForFigure(
  graph: YuenChuenGraph,
  figureId: string,
): Array<YuenChuenEdge & { otherId: string; direction: "out" | "in" }> {
  const related: Array<
    YuenChuenEdge & { otherId: string; direction: "out" | "in" }
  > = [];

  for (const edge of graph.edges) {
    if (edge.from === figureId) {
      related.push({ ...edge, otherId: edge.to, direction: "out" });
    } else if (edge.to === figureId) {
      related.push({ ...edge, otherId: edge.from, direction: "in" });
    }
  }

  return related;
}
