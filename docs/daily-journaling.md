# Daily journaling

Field workflow for Sidequest Atlas trips. Project: `travel-daily-journal`.

## Quick day (2–5 minutes)

1. Write one to three sentences (what surprised you / what felt ordinary / what changes tomorrow).
2. `npm run atlas -- journal add nordics-2026 --date YYYY-MM-DD --input note.txt`
3. Stop. No mandatory AI summary.

## Deep day (15–25 minutes)

Use on arrivals, city changes, contradictions, consequential decisions, final night.

1. Add fragments as above.
2. `npm run atlas -- journal context <id> --include-body --out generated/journal-context/<id>.yaml`
3. Invoke `/journal` or follow `agents/prompts/daily-journaler.md`.
4. `journal commit` then optionally `journal promote --approve`.

## Privacy

| Layer | Path |
|-------|------|
| Raw testimony | `vault/life-canon/journals/<trip>/<date>.yaml` (gitignored) |
| Agent handoff | `generated/journal-context/` (gitignored) |
| Public derivatives | trip `observations` / `content/captures/` after promote |

Never treat `Observation.private: true` in public git as privacy.

## Dry-run before 2026-08-06

```bash
printf 'Dry-run: supermarket bread tasted like policy.\n' > /tmp/j1.txt
npm run atlas -- journal add nordics-2026 --date 2026-08-06 --input /tmp/j1.txt --prompt ordinary-life
npm run atlas -- journal list nordics-2026
npm run atlas -- journal show nordics-2026-2026-08-06
```
