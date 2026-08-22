# Paste this to Scout now

Scout mixed up **two computers**. “Never allowed” on your Mac/Windows laptop is correct. That setting does **not** block the Grok cloud VM. Official path for durable files is **`/workspace`**, not `~/opportunity-os`. Scout then invented a skeleton instead of using the pack. Stop that.

Do **not** turn on local-computer execution for this.

---

## Message to paste into Scout

```text
Stop crawling. You mixed up two computers.

1. “Never let me touch local files” means my laptop. That setting is correct. Do not ask to change it. It does not block YOUR cloud computer.

2. Durable files live at /workspace/opportunity-os on the Grok computer (docs: shared workspace is /workspace). Not ~/opportunity-os unless that is a symlink you already created.

3. First command: ls -la /workspace/opportunity-os and show me whether CONSTITUTION.md, canon.md, opportunities.csv, watchlist/, and plays/ exist.

4. If CONSTITUTION.md is missing: stop. Do not invent a tracker, claims tree, or OS skeleton from memory. Tell me “pack missing” and wait. I will attach the pack. Then write attachments into /workspace/opportunity-os/ keeping the same filenames.

5. If you already created a homemade skeleton: rename it to /workspace/opportunity-os-scratch-DELETE-ME and wait. Do not merge invented rows into the real tracker.

6. Only after CONSTITUTION.md is on disk: read it (§12 closed lanes), read watchlist/newday-dna.md, then crawl official pages. No 2027 NEWDAY application. No send.

Reply with the ls output only, then wait.
```

---

## Then get the pack onto `/workspace`

Composer accepts **six attachments** at a time. From `docs/opportunity-os/copy-to-grok/` attach:

**Batch 1** — tell Scout: `Write these into /workspace/opportunity-os/ with the same names.`

- `CONSTITUTION.md`
- `canon.md`
- `voice-style.md`
- `opportunities.csv`
- `watchlist/newday-dna.md`
- `watchlist/comparables.md`

**Batch 2** — `Same folder: bots/ and plays/.`

- `bots/scout.md`, `bots/maker.md`, `bots/voice.md`, `bots/closer.md`
- `plays/01-heat-health-nordic.md`, `plays/02-newday-alumni-academy.md`

**Batch 3** — remaining plays, `outcomes.md`, `schemas/`, `queue/pending/_PACKET.template.md`, `HUMAN-DECISIONS.md`, `claims/` (the `claim-*` and `src-*` YAML).

Then: `ls /workspace/opportunity-os` must show `CONSTITUTION.md`. Only then say `Continue the first pass from FIRST-HANDOFF.`
