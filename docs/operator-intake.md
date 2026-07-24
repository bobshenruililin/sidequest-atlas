# Operator intake — how to write to the primary agent

This is the day-to-day interface between Bob and Sidequest Atlas agents.

## Positioning (one line)

**Atlas is a travel operating system and attention router that compounds fieldwork into durable evidence — not a warehouse for every life project.**

**Operator identity claim:** high-craft HK undergraduate; creates across professional, cultural, and institutional boundaries; embeds in the Mainland; international travel for comparison not escape; returns something usable to Hong Kong through a lifelong scholar community. Path coherence: [`docs/tung-ngai-why-this-path.md`](tung-ngai-why-this-path.md).

Sister repos keep their domains: My-Life (career), LearnAI (opportunity radar), Laidlaw-Heat (research). The [project board](../content/projects/README.md) routes sparks without absorbing them.

## Default channels

| Channel | Use for |
|---------|---------|
| `/compound` | Unclassified interesting sparks → capture record |
| `/journal` | Trip-day notes → vault journal → optional promote |
| Chat | Ambiguity, judgement, research, implementation |
| CLI | Deterministic persistence (`capture`, `journal`, `trip validate`) |

### Prompt skeleton (consequential work)

```text
Mode: capture | investigate | decide | implement | journal
Input: …
Why now: what decision/opportunity this could change
Current belief: …
Attack: gaps, distortions, false bargains — do not twin me
Constraints: floors, privacy, deadlines
Home: Atlas | My-Life | LearnAI | Laidlaw
Persistence: answer-only | capture | journal | project
Done: …
```

### Visibility warning

- `visibility: vault` → gitignored vault path (sensitive).
- `visibility: operator` → still **public git** under `content/captures/`. Do not put secrets there.

## Text, photos, voice

```text
raw media (phone/laptop)
  → ~/SidequestAtlasVault/inbox/YYYY-MM-DD-topic/
  → OCR / transcript (literal first)
  → Bob corrects names/numbers/negations
  → atlas capture inbox --input reviewed.txt --visibility vault
     or atlas journal add <trip> --date … --input reviewed.txt
  → /compound or /journal for interpretation
  → promote only with --approve
```

### Practical Cursor notes

- **Desktop chat:** drag/paste images for OCR; process a few pages at a time; ask for verbatim transcript with `[illegible]` — no interpretation until corrected.
- **Voice:** use Cursor dictation for short instructions, or record elsewhere → Whisper/device transcript → corrected text file → CLI. Do not assume Cursor archives long audio.
- **Cloud agents:** cannot see `~/SidequestAtlasVault` on your laptop. `@folder` only sees workspace folders. Do **not** commit private media to make them visible. Attach selected images or paste reviewed text.
- **Repo folder upload:** yes — put reviewed text under a local vault inbox (gitignored). Optionally mirror the same layout inside `vault/inbox/` on a machine that runs the agent locally. Prefer external private vault per ADR-style guidance.

### Suggested inbox layout (private)

```text
~/SidequestAtlasVault/inbox/2026-08-06-oslo-notes/
  page-01.jpg
  voice-01.m4a
  transcript.raw.txt
  transcript.reviewed.txt
  intake.yaml   # optional: id, type, sensitivity, hashes
```

## What compounds vs clutter

**Keep / compound**

- `content/captures`, `content/projects`, `content/people`
- `content/trips/<slug>/` (canonical trip + research)
- `vault/life-canon/` (crown jewels, journals, insights)
- `agents/OPERATOR_DOCTRINE.md`, ADRs, `/compound` + `/journal`

**Necessary separation (not clutter)**

- `apps/` runtime vs `packages/` libraries
- `content/` public vs `vault/` private
- `jobs/` / `generated/` ephemeral vs durable content
- sister GitHub repos for other products

**Real redundancy (optimize later — do not “clean” mid-trip)**

- Duplicate trip data in `content/sidequests|sources|institutions` vs embedded `trip.yaml`
- Orphaned web routes (`/atlas`, `/food`, `/life`, …) after calendar-first nav
- Browser IndexedDB field-notes vs CLI journal
- Unused `jobs/{running,completed,…}` lifecycle folders (CLI writes flat job YAMLs)
- Docs/commands that advertise CLI verbs not yet implemented (`project list`, some trip paths)

## What Bob can do for agents (ranked)

1. Ground truth only he has (desires, dread, offers, relationships, money floors).
2. Set / revise floors and identity decisions.
3. Open doors through people (calls, intros, visits).
4. Run cheap real-world tests (shadow, travel, one-week prototypes).
5. Fetch primary documents (official terms, not search folklore).
6. Control promote + privacy (correct OCR; approve canon).
7. Return outcomes and corrections (what failed; what changed his mind).

## Related

- [daily-journaling.md](daily-journaling.md)
- [privacy.md](privacy.md)
- [../agents/OPERATOR_DOCTRINE.md](../agents/OPERATOR_DOCTRINE.md)
- [../content/projects/README.md](../content/projects/README.md)
