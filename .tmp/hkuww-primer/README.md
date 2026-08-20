# HKUWW primer research workspace

Operator-plane scratch for `docs/hkuww-exchange-primer.md`.

| File | Role |
|---|---|
| `raw/oct2025.txt` | Extracted text of the 9 Oct 2025 full partner PDF |
| `raw/mar2026.txt` | Extracted text of the 11 Mar 2026 leftover PDF |
| `premier-partners.json` | Named set + FY elites + peer quotas |
| `claims.jsonl` | Volatile claims with `sourceId`, accessed date, confidence, `reverifyAfter` |
| `build_pdf.py` | Markdown → print HTML |
| `reviews/` | Crawl / subagent notes (synthesis lives in `docs/`) |

Rebuild PDF:

```bash
python3 .tmp/hkuww-primer/build_pdf.py
timeout 40 google-chrome --headless --disable-gpu --no-pdf-header-footer \
  --user-data-dir=/tmp/chrome-pdf-profile \
  --print-to-pdf=generated/hkuww-exchange-primer.pdf \
  "file://$PWD/.tmp/hkuww-primer/primer.html"
```

Do not treat March leftovers as the catalogue. Do not invent fees.
