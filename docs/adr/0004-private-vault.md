# ADR 0004: Separate private life vault

## Status

Accepted

## Context

A `.gitignore` alone is not a security boundary. Committed secrets remain in Git history.

## Decision

Keep raw notes, bookings, contacts, and precise private locations in an external vault (`sidequest-atlas-vault` or `~/SidequestAtlasVault/`). Public content may reference `vault://…` opaque IDs only. Public builds must succeed without vault access.

## Consequences

- Stronger privacy boundary
- Extra operational discipline when authoring private notes
