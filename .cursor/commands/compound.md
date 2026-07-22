# Compound — capture something interesting

**Prefer this repo + `/compound` (or ask the Sidequest Atlas agent).**  
The compounding layer is schema + CLI + canon — not which chat tab you open. Use this command whenever something sparks: a program, person, idea, fear, offer, or half-formed thought.

## Operator protocol (do not skip)

1. **Depth over speed** — obey [`agents/OPERATOR_DOCTRINE.md`](../../agents/OPERATOR_DOCTRINE.md). Search, spawn subagents, read canon before answering.
2. **Read against what we have**
   - `agents/OPERATOR_DOCTRINE.md`
   - `vault/life-canon/` (if present; gitignored)
   - `content/captures/`
   - `content/people/shen-ruililin.yaml`
   - relevant trips under `content/trips/`
   - sister corpora when available: My-Life, LearnAI, Laidlaw-Heat-Project
3. **Triangulate** — information gaps, opportunity gaps, false bargains, corrections, concrete implementations.
4. **Record** — write a `CaptureRecord` YAML and commit via CLI (do not leave truth only in chat).

## Quick inbox (before deep triage)

```bash
npm run atlas -- capture inbox --text "PASTE THE INTERESTING THING" --domains career,opportunity --title "short title"
```

## After deep triage

Write `content/captures/YYYY-MM-DD-slug.yaml` (or `vault/life-canon/captures/` if `visibility: vault`) matching `CaptureRecord`, then:

```bash
npm run atlas -- capture commit --input content/captures/YYYY-MM-DD-slug.yaml
npm run atlas -- capture list
```

## Rules

- Never invent deadlines, fees, admit rates, or hours — mark uncertainty.
- No grey-door / forgery coaching unless Bob explicitly re-opens that lane (default: **closed**).
- Push back. Do not twin.
- Public `content/captures/` must stay privacy-safe; sensitive material → vault visibility.
- Chat without `capture commit` does **not** compound.
