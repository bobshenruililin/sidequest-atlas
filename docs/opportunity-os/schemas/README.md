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
| [source-apsig-2026-call.example.yaml](source-apsig-2026-call.example.yaml) | Official APSIG 2026 call (closed) |
| [source-apnic-apsig-2026.example.yaml](source-apnic-apsig-2026.example.yaml) | APNIC portal timestamps |
| [source-scholarships-corner-apsig-2026.example.yaml](source-scholarships-corner-apsig-2026.example.yaml) | Aggregator discovery signal only |
| [claim-apsig-2026-deadline.example.yaml](claim-apsig-2026-deadline.example.yaml) | Closed 21 Aug 2026 23:59 UTC+8 |
| [opportunities.columns.md](opportunities.columns.md) | CSV column dictionary |
| [../templates/opportunities.csv](../templates/opportunities.csv) | Header + seed **watch** / **closed** rows (2026 pages ≠ 2027 facts) |

## Rules

- A `researched` claim must have `sourceIds`.
- Do not mark `high` on a third-hand aggregator.
- `reverifyAfter` is mandatory for deadlines, fees, eligibility, and “is hiring.”
- 2026 programme dates may be `researched` for 2026; 2027 equivalents start as `unverified` until a 2027 official page exists.
