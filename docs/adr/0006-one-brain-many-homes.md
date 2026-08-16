# ADR 0006: One brain, many homes (no sister-repo merge)

## Status

Accepted

## Context

On 2026-07-22 the portfolio split Atlas (travel OS + router), My-Life (career OS), LearnAI (opportunity radar), and Laidlaw-Heat (research). On 2026-08-16 a career crawl showed the split failing as a *brain*: My-Life still described a Govt&Laws transfer student three days after Atlas closed that door; LearnAI is a gift atlas for another person; cloud agents on this repo cannot see sister checkouts. The reaction “merge the three git repos” treats folder count as the bug.

## Decision

**Do not** prompt a bot to squash Atlas + My-Life + LearnAI (or Laidlaw-Heat) into one GitHub repository.

**Do** treat Atlas as the binding operator brain: captures, project board, doctrine, and a single programme/wedge/calendar profile that other homes must not contradict.

Sister repos remain separate products with separate threat models:

| Home | Product | Why it stays separate |
|------|---------|------------------------|
| Atlas | Travel OS + attention router | Public static Pages; CLI; vault boundary (ADR 0004) |
| My-Life | Career OS (Python CRM, drafts, ICS) | Private-ish career machinery; not a travel site |
| LearnAI | Gift opportunity atlas (Merey) | Another person’s profile; must not mix into Bob’s canon |
| Laidlaw-Heat | Heat-health research code/data | Research artefact, not an operator UI |

A **read/sync bot** is allowed: flag canon drift, patch the stale profile, copy allowlisted fields. A **merge bot** is not.

Optional later absorption (My-Life → Atlas package only) requires an explicit reopen: Career OS used for 30 days after the ghost profile is fixed, *and* a new ADR. LearnAI and Laidlaw-Heat are not candidates.

## Consequences

- Cloud agents still default to one workspace; fix that with environment checkouts or a sync job, not a monorepo
- Publication and privacy rules stay per-repo
- Operator docs must name LearnAI as a gift product, not Bob’s radar
