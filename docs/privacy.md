# Privacy

A `.gitignore` is not a security boundary.

## Vault

Prefer a separate private repository (`sidequest-atlas-vault`) or `~/SidequestAtlasVault/`.
Public YAML may use opaque refs only:

```yaml
privateNoteRef: "vault://nordics-2026/2026-08-07-oslo"
```

Public builds must succeed without vault access.

## Public content rules

- No booking confirmation numbers
- No passport-like identifiers
- Social encounters default to `locationPrecision: city`
- Media needs caption, date, consent status
- Raw notes are append-only in the vault; essays are derivatives

Run `npm run atlas -- privacy audit` before publish.
