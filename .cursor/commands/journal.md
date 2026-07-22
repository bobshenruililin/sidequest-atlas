# Journal — daily fieldwork note

Use during a trip (e.g. Nordics 2026). Prefer this over dumping diary text into chat.

## Quick (2–5 min)

```bash
npm run atlas -- journal add <trip-slug> --date YYYY-MM-DD --input note.txt
# or:
npm run atlas -- journal add <trip-slug> --date YYYY-MM-DD --text "One sentence."
npm run atlas -- journal list <trip-slug>
npm run atlas -- journal show <trip-slug>-YYYY-MM-DD --metadata
```

Prefer `--input` over `--text` so vault material is not stuck in shell history.

## Deep bounce

```bash
npm run atlas -- journal context <id> --include-body --out generated/journal-context/<id>.yaml
```

Read the handoff (gitignored). Reflect with [`agents/prompts/daily-journaler.md`](../../agents/prompts/daily-journaler.md).
Write a reflection YAML, then:

```bash
npm run atlas -- journal commit --input reflection.yaml --expect-revision <n>
npm run atlas -- journal promote <id> --candidate <cid> --approve
```

## Rules

- Raw journals stay in `vault/` (gitignored). Do not print bodies unless Bob asks.
- Do not invent facts, motives, prices, or hours.
- Promote only public-safe rewritten derivatives (`--approve` required).
- Chat without `journal commit` does not compound.
