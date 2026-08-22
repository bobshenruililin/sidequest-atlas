# Claim and tracker schemas

Opportunity OS reuses Atlas provenance habits (`source` + `claim`, `accessedAt`, `confidence`, `reverifyAfter`) without requiring the trip CLI. Live files live on the Grok computer (`~/opportunity-os/`). Examples here are the contract.

Confidence: `low` | `medium` | `high` (same as `packages/domain` Claim schema).

Claim status: `traveler-provided` | `researched` | `inferred` | `unverified` | `superseded`.

Source type: `official` | `primary` | `academic` | `government` | `reputable-secondary` | `community`.

## Files

| File | Purpose |
|------|---------|
| [source-record.example.yaml](source-record.example.yaml) | Nansen kurs page (NEWDAY 2026 dates) |
| [source-fudan-newday-2026.example.yaml](source-fudan-newday-2026.example.yaml) | Fudan 2026 call (Fudan students only) |
| [claim-record.example.yaml](claim-record.example.yaml) | NEWDAY 2026 dates (do not copy to 2027) |
| [opportunities.columns.md](opportunities.columns.md) | CSV column dictionary |
| [../opportunities.csv](../opportunities.csv) | Header + seed **watch** rows (2026 pages ≠ 2027 facts) |

## Rules

- A `researched` claim must have `sourceIds`.
- Do not mark `high` on a third-hand aggregator.
- `reverifyAfter` is mandatory for deadlines, fees, eligibility, and “is hiring.”
- 2026 programme dates may be `researched` for 2026; 2027 equivalents start as `unverified` until a 2027 official page exists.
