# CV — Shen Ruililin

## Files

| File | Purpose |
|------|---------|
| `ShenRuililin_CV.tex` | Source (edit this) |
| `ShenRuililin_CV.pdf` | Compiled 1-page PDF |

## Compile

```bash
cd cv
# Preferred if available:
tectonic -X compile ShenRuililin_CV.tex
# Or:
pdflatex -interaction=nonstopmode ShenRuililin_CV.tex
```

## Update notes (2026-07-22)

Edited from the existing Jake-style template (not a redesign).

**Added (verified):**
- Cumulative GPA 4.09/4.30 (as a bullet — not on the date row; updated after Semester 2)
- Laidlaw Scholars research (Jan 2026–Present) + Laidlaw award row
- Wu Zhi Qiao / Gannan Horizons (Mar–Jun 2026, completed)

**Removed per request:**
- Upcoming section
- Tam Wun Tsun Horizons enrichment award

**Layout fixes (bleed lessons):**
1. Long degree/GPA strings must not share the heading row with right-aligned dates.
2. Awards `tabularx` left column uses `p{...}` + `@{\hspace{...}}` gutter — plain `l` + long titles collapses the `X` column (`Scholarship2025-26`).
3. Do not stack aggressive negative `\vspace` with tight `itemsep` — that causes heading/bullet overlap. Prefer shorter copy (or 10pt) over crushing space.
4. Keep role titles short on the left of `\cvheading` so they do not collide with dates.

Body is **10pt** (was 11pt) so Laidlaw + Wu Zhi Qiao fit on one page without reintroducing bleed.

Intentionally **omitted until the award letter is in hand:** Tung & Ngai scholarship. Operator-stated awarded 2026-08-16 — add the row (and Martin Scholar, if the college title should appear) in a dedicated CV edit, not as a drive-by. See `docs/career-gameplan-2026-08.md`.

## Privacy

Contact block matches the applicant’s own CV. Do not add HKID, home address, or family financials.
