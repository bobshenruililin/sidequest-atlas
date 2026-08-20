#!/usr/bin/env python3
"""Build print-ready HTML from the operator primer markdown."""
from __future__ import annotations

from pathlib import Path
import json
import markdown

ROOT = Path(__file__).resolve().parents[2]
MD = ROOT / "docs" / "hkuww-exchange-primer.md"
HTML_OUT = Path(__file__).resolve().parent / "primer.html"

CSS = """
:root {
  --ink: #1c1917;
  --muted: #57534e;
  --rule: #d6d3d1;
  --paper: #f7f3ec;
  --card: #fffdf8;
  --accent: #7f1d1d;
  --accent-soft: #f4e7e1;
  --ok: #1e3a2f;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Times New Roman", serif;
  font-size: 10.5pt;
  line-height: 1.42;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
@page {
  size: A4;
  margin: 15mm 14mm 18mm 14mm;
  @bottom-center {
    content: "HKUWW Premier Exchange Primer  ·  " counter(page);
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 8pt;
    color: #78716c;
  }
  @bottom-right {
    content: "Operator plane · 19 Aug 2026";
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 7.5pt;
    color: #a8a29e;
  }
}
.cover {
  min-height: 255mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16mm 3mm 10mm;
  page-break-after: always;
  break-after: page;
  border-top: 10px solid var(--accent);
}
.kicker {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 8.5pt;
  color: var(--accent);
  font-weight: 600;
}
.cover h1 {
  font-size: 32pt;
  line-height: 1.04;
  margin: 16pt 0 8pt;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.cover .dek {
  font-size: 12.5pt;
  max-width: 145mm;
  color: var(--muted);
  line-height: 1.35;
}
.meta {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 9pt;
  color: var(--muted);
  border-top: 1px solid var(--rule);
  padding-top: 10pt;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4pt 16pt;
}
.banner {
  background: var(--accent-soft);
  border-left: 4px solid var(--accent);
  padding: 8pt 12pt;
  margin: 12pt 0 0;
  font-size: 10pt;
}
h1, h2, h3, h4 {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  letter-spacing: -0.01em;
  page-break-after: avoid;
  break-after: avoid;
}
article > h1:first-of-type { display: none; }
h1 { font-size: 18pt; margin-top: 18pt; }
h2 {
  font-size: 13.5pt;
  color: var(--accent);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 3pt;
  margin-top: 16pt;
  page-break-before: auto;
}
h3 { font-size: 11.5pt; margin-top: 12pt; }
h4 { font-size: 10.5pt; margin-top: 10pt; }
p { margin: 0 0 7pt; }
a { color: var(--ok); text-decoration: none; }
ul, ol { margin: 0 0 9pt; padding-left: 16pt; }
li { margin-bottom: 2.5pt; }
strong { font-weight: 650; }
hr { border: 0; border-top: 1px solid var(--rule); margin: 12pt 0; }
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 7.8pt;
  margin: 6pt 0 12pt;
  page-break-inside: auto;
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
}
th, td {
  border-bottom: 1px solid var(--rule);
  text-align: left;
  vertical-align: top;
  padding: 4pt 5pt 4pt 0;
}
th {
  color: var(--accent);
  font-weight: 600;
  font-size: 7.2pt;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
tr { page-break-inside: avoid; break-inside: avoid; }
blockquote {
  margin: 6pt 0 10pt;
  padding: 5pt 10pt;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  font-style: italic;
}
code {
  font-family: "IBM Plex Mono", Menlo, monospace;
  font-size: 8pt;
  background: #efeae2;
  padding: 0 2pt;
}
.footer-note {
  font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
  font-size: 8pt;
  color: var(--muted);
  margin-top: 18pt;
}
"""

COVER = """
<section class="cover">
  <div>
    <div class="kicker">Sidequest Atlas · Operator primer</div>
    <h1>HKUWW Premier<br>Exchange Primer</h1>
    <p class="dek">A source-backed brief for Shen Ruililin on how to spend one HKU Worldwide slot in 2027/28 — Chicago, Columbia, LSE, Tokyo, Kyoto, Waseda, and the Tung &amp; Ngai Mainland mandate — without inventing fees or twinning prestige hunger.</p>
    <div class="banner">Two stacks are equals. No default winner. Quotas are from the last full published list (9 Oct 2025). The 2027/28 partner PDF is not out yet. Confirm T&amp;N Mainland duration in writing before betting a Chicago year on LINK or a summer school. Confirm GHAD3001 with SPH before betting a full year against the China CDC window.</div>
  </div>
  <div class="meta">
    <div>For: Shen Ruililin · BASc Global Health and Development · HKU</div>
    <div>Apply 12 Oct–11 Dec 2026 for AY 2027/28</div>
    <div>Compiled 19 August 2026 · Operator plane · Not Pages</div>
    <div>Research: IAO/host/T&amp;N pages · Sol · Fable · Opus · regional crawls</div>
  </div>
</section>
"""


def main() -> None:
    body = MD.read_text(encoding="utf-8")
    parts = body.split("\n---\n", 1)
    rest = parts[1] if len(parts) > 1 else body
    html_body = markdown.markdown(
        rest,
        extensions=["tables", "sane_lists", "smarty", "toc"],
        extension_configs={"toc": {"permalink": False}},
    )
    claims_path = Path(__file__).resolve().parent / "claims.jsonl"
    claim_rows = []
    for line in claims_path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        c = json.loads(line)
        claim_rows.append(
            "<tr>"
            f"<td><code>{c['id']}</code></td>"
            f"<td>{c['claim']}</td>"
            f"<td>{c['confidence']}</td>"
            f"<td>{c['reverifyAfter']}</td>"
            "</tr>"
        )
    html_body += f"""
<h2>20. Claims register (volatile)</h2>
<p>Machine copy: <code>.tmp/hkuww-primer/claims.jsonl</code>. Re-check anything past <code>reverifyAfter</code> before you submit. Quotas die when the 2027/28 partner PDF posts.</p>
<table>
<thead><tr><th>Id</th><th>Claim</th><th>Conf.</th><th>Reverify</th></tr></thead>
<tbody>
{''.join(claim_rows)}
</tbody>
</table>
"""
    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>HKUWW Premier Exchange Primer</title>
<style>{CSS}</style>
</head>
<body>
{COVER}
<article>
{html_body}
</article>
</body>
</html>
"""
    HTML_OUT.write_text(doc, encoding="utf-8")
    print(f"wrote {HTML_OUT} ({HTML_OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
