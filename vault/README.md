# Private Life Vault

This directory is **gitignored** inside the public repository (except this
README and `.gitkeep`). Use it for operator memory that must not ship to
GitHub Pages.

## Layout

```text
vault/
  README.md                 # this file (tracked)
  life-canon/
    CROWN_JEWELS.md         # highest-priority private operator canon
    INDEX.md                # chronology
    journals/<trip>/<date>.yaml
    insights/<id>.yaml
    captures/               # vault-visibility CaptureRecords
  inbox/                    # optional local mirror of media intake
    YYYY-MM-DD-topic/
      *.jpg *.m4a
      transcript.reviewed.txt
```

Preferred long-term root (separate private backup):

```text
~/SidequestAtlasVault/
  inbox/
  life-canon/
```

See [docs/operator-intake.md](../docs/operator-intake.md) for text / photo / voice workflow.

## Life canon

Timestamped self-reports and decision digests live under `life-canon/`.
Start every deep life question with `CROWN_JEWELS.md` if present.
They are for agent triangulation (pushback, opportunity gaps), not for
public publish. See `agents/OPERATOR_DOCTRINE.md`.

## Do not store here if you lack a private backup

- Booking confirmation numbers
- Precise private-person locations
- Unredacted media with EXIF GPS

Public trip YAML may reference vault content only as opaque IDs:

```yaml
privateNoteRef: "vault://nordics-2026/2026-08-07-oslo"
sourceJournalRefs:
  - "journal://nordics-2026/2026-08-06#frag-…"
```

The public application must build and run when the vault is absent.

See [docs/privacy.md](../docs/privacy.md).
