# Private Life Vault

This directory is **gitignored** inside the public repository (except this
README and `.gitkeep`). Use it for operator memory that must not ship to
GitHub Pages.

## Layout

```text
vault/life-canon/
  INDEX.md                 # optional local index
  journals/<trip>/<date>.yaml   # raw daily journals (atlas journal *)
  insights/<id>.yaml            # accepted canon insights from promote
  captures/                     # vault-visibility CaptureRecords
```

## Life canon

Timestamped self-reports and decision digests live under `life-canon/`.
They are for agent triangulation (pushback, opportunity gaps), not for
public publish. See `agents/OPERATOR_DOCTRINE.md` and `docs/daily-journaling.md`.

## Do not store here if you lack a private backup

- Booking confirmation numbers
- Precise private-person locations
- Unredacted media with EXIF GPS

Prefer also mirroring sensitive canon to:

1. Separate **private** repository: `sidequest-atlas-vault`
2. Local path outside the public repo: `~/SidequestAtlasVault/`

Public trip YAML may reference vault content only as opaque IDs:

```yaml
privateNoteRef: "vault://nordics-2026/2026-08-07-oslo"
sourceJournalRefs:
  - "journal://nordics-2026/2026-08-06#frag-…"
```

The public application must build and run when the vault is absent.

See [docs/privacy.md](../docs/privacy.md).
