export type FigureKind = "person" | "clan" | "institution";
export type WealthBand =
  | "mythic"
  | "clan"
  | "institutional"
  | "academic"
  | "hall";
export type FigureEra =
  | "colonial-merchant"
  | "postwar-tycoon"
  | "contemporary"
  | "scholarship"
  | "campus";
export type FigureCluster = "hk-wealth" | "scholarship" | "sjc" | "academia";
export type EdgeKind =
  | "namesake-of"
  | "patron-of"
  | "family-of"
  | "marriage-alliance"
  | "rival"
  | "tutor-of"
  | "funded"
  | "cluster-bridge";

export interface YuenChuenFigure {
  schemaVersion: string;
  id: string;
  slug: string;
  name: string;
  role: string;
  kind: FigureKind;
  wealthBand: WealthBand;
  era: FigureEra;
  cluster: FigureCluster;
  hashtags: string[];
  body: string;
  uncertainty?: string[];
}

export interface YuenChuenEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  label: string;
  confidence: "public-lore" | "uncertain";
}

export interface YuenChuenGraph {
  figures: YuenChuenFigure[];
  edges: YuenChuenEdge[];
}

export const WEALTH_BANDS: WealthBand[] = [
  "mythic",
  "clan",
  "institutional",
  "academic",
  "hall",
];

export const CLUSTERS: FigureCluster[] = [
  "hk-wealth",
  "scholarship",
  "sjc",
  "academia",
];
