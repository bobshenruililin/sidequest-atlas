# Shared folder layout

Copy this tree onto the Grok computer as `~/opportunity-os/`. Templates in this repo are empty or example-only. Live tracker rows, artifacts, and packets stay on the Grok disk unless Bob deliberately mirrors a **sanitized** subset back into git.

```text
~/opportunity-os/
  CONSTITUTION.md          # copy from docs/opportunity-os/CONSTITUTION.md
  canon.md                 # identity + windows; no phone, no UID
  opportunities.csv        # tracker
  outcomes.md              # append-only send/reply log
  claims/                  # one YAML per volatile fact
    src-*.yaml             # source records
    claim-*.yaml
  artifacts/<opp-id>/      # Maker output
  resumes/                 # Voice variants
  queue/pending/<opp-id>/  # Closer packets awaiting Bob
  queue/approved/<opp-id>/ # after send <id>
```

## Rules

- Treat the Grok computer as **account-scoped**, not Bot-scoped. Files and logins are visible to Scout, Maker, Voice, and Closer.
- Do not sync `queue/` or filled CSVs to public git if they contain unpublished emails, draft strategy, or anything from the vault.
- Example YAML in `docs/opportunity-os/schemas/` is the contract. Live files on the Grok disk may add columns; do not drop required ones.
