# Winter 2026/27 primer research workspace

Operator-plane scratch for `docs/winter-2026-27-primer.md`.

| File | Role |
|---|---|
| `raw/` | Fetched HTML/PDF |
| `txt/` | Extracted text |
| `claims.jsonl` | Volatile claims with source URL, accessed date, confidence, reverifyAfter |
| `build_pdf.py` | Markdown → print HTML |
| `reviews/` | Subagent notes (synthesis lives in `docs/`) |

Rebuild PDF:

```bash
python3 .tmp/winter-primer/build_pdf.py
timeout 60 google-chrome --headless --disable-gpu --no-pdf-header-footer \
  --user-data-dir=/tmp/chrome-pdf-winter \
  --print-to-pdf=docs/winter-2026-27-primer.pdf \
  "file://$PWD/.tmp/winter-primer/primer.html"
```

Do not invent fees. Do not treat unpublished 2027 pages as cancellations. LINK Round 2 closes 4 Sep 2026.
