# Data model

All persisted documents include `schemaVersion` (currently `1.0.0`).

Key types live in `@sidequest-atlas/domain`:

- TravelerProfile, Trip, DestinationStay, DayPlan, EventBlock
- Sidequest, FoodStrategy, Institution
- Money / BudgetRange (integer minor units)
- ZonedDateTime (IANA zones + confirmation status)
- SourceRecord + Claim (claim-level provenance)
- Observation, DecisionRecord, AgentJob
- ValidationIssue / ValidationReport

JSON Schema mirrors: `agents/contracts/*.schema.json` (generate via `npm run schema:generate`).
