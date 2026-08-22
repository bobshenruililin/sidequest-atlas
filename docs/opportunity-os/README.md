# Opportunity OS — Grok Bot teammates

Operator docs for hunting **winter 2026/27** and **summer 2027** opportunities: internships, residential academies in the NEWDAY family, company visits, unpaid sprints, and value-first briefs.

This Cursor environment cannot create Grok Bots or grant Google / LinkedIn. Copy these files onto the Grok computer, paste the prompts into named Bots, and keep **send** with Bob.

## Load order

Exact paste recipes: [PASTE.md](PASTE.md). Short version:

1. Copy this folder onto the Grok computer as `~/opportunity-os/`.
2. **Closer / conductor:** paste [CONSTITUTION.md](CONSTITUTION.md) (complete; closed lanes are §12 — do not paste DO-NOT.md). Then paste the fenced block in [FIRST-HANDOFF.md](FIRST-HANDOFF.md) (complete first *task*).
3. **Scout, Maker, Voice:** paste only [bots/scout.md](bots/scout.md), [bots/maker.md](bots/maker.md), [bots/voice.md](bots/voice.md). They read the constitution from disk. If the files are not on the computer yet, paste the constitution once per Bot, then the role file.

Cursor operators drafting outreach in this repo obey the same send-never / invent-never rules.

## What this is not

Not an auto-apply robot. Not Interview Coder / Cluely. Not a public atlas page. Vault material, booking refs, student UID, and phone numbers stay out of these files and out of every packet.

## Windows (availability, not employer calendars)

| Window | Dates | Realistic yield |
|--------|-------|-----------------|
| Winter | 24 Dec 2026 – 17 Jan 2027 (earlier if assessments end) | Visits, winter schools, remote sprints, GBA/HK days. Full internships are rare. |
| Summer | 26 May – 31 Aug 2027 | Internships + academies. Flag collisions with Laidlaw LiA. |

Protected tracks (hunt *around*, do not silently overwrite): **LINK-S** (winter Shanghai / LINK immersion — confirm the year’s site and dates), **Laidlaw LiA with makesense** (Medellín / Mexico City, Peace and Social Resilience), Laidlaw conference **London** Oct 2026, **GEST Valencia** Oct 2026 (invited speaker).

## Team

```text
Scout (crawl, claims) → Maker (real artifact) → Voice (resume + mail) → Closer (queue)
                                                                         ↓
                                                                   Bob approves send
                                                                         ↓
                                                                   outcomes log
```

All four Bots share one Grok computer. A login granted to one is available to all. Grant Google / LinkedIn only after the constitution is loaded.

## File tree

```text
docs/opportunity-os/
  README.md                 this file
  PASTE.md                  what to paste into which Bot
  CONSTITUTION.md           complete rules (includes closed lanes)
  FIRST-HANDOFF.md          complete first task
  DO-NOT.md                 skim index only — do not paste
  LAYOUT.md                 Grok disk layout
  bots/                     Scout, Maker, Voice, Closer
  schemas/                  claim + CSV contract
  templates/                copy to ~/opportunity-os/
  watchlist/                NEWDAY DNA + comparables
  plays/                    artifact-first examples
```

## Related

- Voice: [`docs/writing-voice/STYLE.md`](../writing-voice/STYLE.md)
- Doctrine: [`agents/OPERATOR_DOCTRINE.md`](../../agents/OPERATOR_DOCTRINE.md)
- Intake: [`docs/operator-intake.md`](../operator-intake.md)
- CV source of truth: [`cv/README.md`](../../cv/README.md)
