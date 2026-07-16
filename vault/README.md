# Private Life Vault

This directory is a **placeholder** inside the public repository.

## Do not store here

- Booking confirmation numbers
- Raw private notes
- Precise private-person locations
- Unredacted media with EXIF GPS
- Contact details of private individuals

## Preferred setups

1. Separate private repository: `sidequest-atlas-vault`
2. Local path outside the public repo: `~/SidequestAtlasVault/`

Public trip YAML may reference vault content only as opaque IDs:

```yaml
privateNoteRef: "vault://nordics-2026/2026-08-07-oslo"
```

The public application must build and run when the vault is absent.

See [docs/privacy.md](../docs/privacy.md).
