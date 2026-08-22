#!/usr/bin/env python3
"""Print-ready HTML: one A4 sheet per ## heading in the fact-sheet markdown."""
from __future__ import annotations

from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parents[2]
MD = ROOT / "docs" / "winter-2026-27-fact-sheets.md"
HTML_OUT = Path(__file__).resolve().parent / "fact-sheets.html"

CSS = r"""
:root {
  --ink: #1c1917;
  --muted: #57534e;
  --rule: #d6d3d1;
  --paper: #f4efe6;
  --card: #fffdf8;
  --accent: #1e3a5f;
  --accent-soft: #e4eaf1;
  --stamp: #7f1d1d;
  --enrol: #1e3a2f;
  --live: #1e3a5f;
  --cousin: #7c2d12;
  --closed: #44403c;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Times New Roman", serif;
  font-size: 9.1pt;
  line-height: 1.32;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
@page {
  size: A4;
  margin: 11mm 12mm 14mm 12mm;
}
.sheet {
  background: var(--card);
  padding: 6mm 7mm 7mm;
  min-height: 265mm;
  page-break-after: always;
  break-after: page;
  border-top: 7px solid var(--accent);
  position: relative;
}
.sheet:last-child { page-break-after: auto; break-after: auto; }
.kicker {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 7.4pt;
  color: var(--accent);
  font-weight: 650;
  margin: 0 0 4pt;
}
.sheet h1, .sheet h2 {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 16.5pt;
  line-height: 1.08;
  margin: 0 0 7pt;
  letter-spacing: -0.02em;
  color: var(--accent);
  border: 0;
  padding: 0;
}
.sheet h3 {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 9.2pt;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 8pt 0 3pt;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 1.5pt;
}
.sheet p { margin: 0 0 4.5pt; }
.sheet ul, .sheet ol { margin: 0 0 6pt; padding-left: 14pt; }
.sheet li { margin-bottom: 1.5pt; }
.sheet strong { font-weight: 650; }
.sheet a { color: var(--enrol); text-decoration: none; }
.sheet blockquote {
  margin: 4pt 0 7pt;
  padding: 4pt 9pt;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  font-style: italic;
}
.sheet table {
  width: 100%;
  border-collapse: collapse;
  font-size: 7.5pt;
  margin: 4pt 0 8pt;
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
}
.sheet th, .sheet td {
  border-bottom: 1px solid var(--rule);
  text-align: left;
  vertical-align: top;
  padding: 2.5pt 5pt 2.5pt 0;
}
.sheet th {
  color: var(--accent);
  font-weight: 650;
  font-size: 6.8pt;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.meta-line {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 7.8pt;
  color: var(--muted);
  margin: 0 0 8pt;
  line-height: 1.35;
}
.stamp {
  display: inline-block;
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 7pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 2pt 7pt;
  margin: 0 0 6pt;
  color: #fff;
  background: var(--accent);
}
.stamp.enrol { background: var(--enrol); }
.stamp.live { background: var(--live); }
.stamp.cousin { background: var(--cousin); }
.stamp.closed { background: var(--closed); }
.stamp.gold { background: #1e3a5f; }
.stamp.decision { background: #1e3a5f; }
.stamp.craving { background: var(--stamp); }
.stamp.logistics { background: #3f3f46; }
.toc {
  margin-top: 16pt;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2pt 16pt;
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 8.2pt;
  line-height: 1.45;
  color: var(--ink);
}
.toc .n { color: var(--accent); font-weight: 650; width: 18pt; display: inline-block; }
.cover .meta {
  position: absolute;
  bottom: 8mm;
  left: 8mm;
  right: 8mm;
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 8pt;
  color: var(--muted);
  border-top: 1px solid var(--rule);
  padding-top: 8pt;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3pt 14pt;
}
.cover h1 { font-size: 28pt; margin: 10pt 0 0; }
.cover .dek {
  font-size: 11.5pt;
  max-width: 155mm;
  color: var(--muted);
  line-height: 1.32;
  margin: 10pt 0 14pt;
}
.banner {
  background: var(--accent-soft);
  border-left: 4px solid var(--accent);
  padding: 7pt 10pt;
  margin: 10pt 0 0;
  font-size: 9.4pt;
}
.footer-rule {
  margin-top: 8pt;
  border-top: 1px solid var(--rule);
  padding-top: 5pt;
  font-style: italic;
  color: var(--ink);
}
hr { display: none; }
code {
  font-family: "IBM Plex Mono", Menlo, monospace;
  font-size: 7.6pt;
  background: #efeae2;
  padding: 0 2pt;
}
"""


def stamp_class(title: str, first_p: str) -> str:
    blob = f"{title} {first_p}".upper()
    if "ENROL" in blob and "DEFAULT" in blob:
        return "enrol"
    if "LIVE ALTERNATE" in blob:
        return "live"
    if "COUSIN" in blob or "PACKAGE" in blob:
        return "cousin"
    if "CLOSED" in blob or "GRAVEYARD" in blob:
        return "closed"
    if "GOLD" in blob or "CALIBRATION" in blob:
        return "gold"
    if "DECISION" in blob:
        return "decision"
    if "CRAVING" in blob:
        return "craving"
    if "LOGISTICS" in blob:
        return "logistics"
    if "CONSTRAINTS" in blob or "EMAIL" in blob:
        return "decision"
    return ""


def main() -> None:
    raw = MD.read_text(encoding="utf-8")
    _preamble, _, rest = raw.partition("\n## ")
    sheets = rest.split("\n## ")
    cover_html = """
<section class="sheet cover">
  <div class="kicker">Sidequest Atlas · Operator fact sheets</div>
  <h1>Winter 2026/27<br>dossiers</h1>
  <p class="dek">One object per page: a scene, a thesis, the published specs, the insight that is not on the brochure, what you would remember, what it costs the rest of the degree. Catalogue lives in the primer. This pack owns the fork.</p>
  <div class="banner">Enrol in LINK-S before 4 September 2026, 23:59, unless you have written that first-ness beats family-and-credits. Chile is a landscape craving, not a TFAS product. Do not spend SSE. Confirm HKUWW criterion 3 in writing.</div>
  <div class="toc">
    <div><span class="n">00</span> How to hold a winter</div>
    <div><span class="n">01</span> The fork</div>
    <div><span class="n">02</span> NEWDAY calibration</div>
    <div><span class="n">03</span> LINK-S Shanghai — enrol</div>
    <div><span class="n">04</span> Hanyang Session A</div>
    <div><span class="n">05</span> Vilnius language</div>
    <div><span class="n">06</span> HUWISU Term 1 Berlin</div>
    <div><span class="n">07</span> Tübingen — cousin, dates lose</div>
    <div><span class="n">08</span> Lille — package, overruns</div>
    <div><span class="n">09</span> Chile craving ≠ TFAS</div>
    <div><span class="n">10</span> Chile nature / trains / money</div>
    <div><span class="n">11</span> Money physics</div>
    <div><span class="n">12</span> HKUWW collision</div>
    <div><span class="n">13</span> Closed: Yonsei / KU</div>
    <div><span class="n">14</span> Closed: Fudan</div>
    <div><span class="n">15</span> Closed: VT, intern, LINK-V</div>
    <div><span class="n">16</span> Graveyard</div>
    <div><span class="n">17</span> This week, before 4 Sep</div>
    <div><span class="n">18</span> Method and sources</div>
  </div>
  <div class="meta">
    <div>For: Shen Ruililin · BASc Global Health and Development · HKU</div>
    <div>Window 24 Dec 2026 – 17 Jan 2027 · LINK Round 2 closes 4 Sep 2026</div>
    <div>Compiled 22 August 2026 · Operator plane · Not Pages</div>
    <div>Companion: docs/winter-2026-27-primer.md · original currency only</div>
  </div>
</section>
"""

    sheet_html = []
    for i, block in enumerate(sheets):
        title, _, body = block.partition("\n")
        title = title.strip()
        html_body = markdown.markdown(
            body.strip(),
            extensions=["tables", "sane_lists", "smarty"],
        )
        first_p = body.strip().split("\n", 1)[0]
        sc = stamp_class(title, first_p)
        sheet_html.append(
            f'<section class="sheet" id="s{i:02d}">'
            f'<div class="kicker">Winter 2026/27 · operator plane · 22 Aug 2026</div>'
            f'<span class="stamp {sc}">Sheet {i:02d}</span>'
            f"<h2>{title}</h2>"
            f"{html_body}"
            f"</section>"
        )

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Winter 2026/27 Fact Sheets</title>
<style>{CSS}</style>
</head>
<body>
{cover_html}
{''.join(sheet_html)}
</body>
</html>
"""
    HTML_OUT.write_text(doc, encoding="utf-8")
    print(f"wrote {HTML_OUT} ({HTML_OUT.stat().st_size} bytes) sheets={len(sheets)+1}")


if __name__ == "__main__":
    main()
