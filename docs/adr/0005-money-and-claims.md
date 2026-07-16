# ADR 0005: Integer money and claim-level provenance

## Status

Accepted

## Context

Floating-point currency and day-level source bags produce fake precision and weak audits.

## Decision

- Money uses integer minor units (`amountMinor`, `currency`)
- FX rates are decimal strings with `effectiveDate`
- Time-sensitive facts use `Claim` records linking field paths to sources
- Times use `ZonedDateTime` with IANA zones and confirmation status

## Consequences

- Safer arithmetic and clearer source audits
- Slightly more verbose YAML
