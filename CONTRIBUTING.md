# Contributing to Sidequest Atlas

## Principles

1. The web app is the atlas. The CLI is the operating system. Cursor is one possible operator.
2. Preserve uncertainty rather than inventing current facts.
3. Public content must build without vault access.
4. Never push directly to `main`.

## Workflow

1. Create a feature branch: `cursor/<descriptive-name>-8004`
2. Run `npm ci && npm run doctor`
3. Make changes; keep schemas versioned
4. Run acceptance commands locally
5. Open a pull request against `main`

## Architecture decisions

Non-trivial choices belong in `docs/adr/`. Dependency additions require an ADR.

## Content

Trip-critical claims need claim-level provenance (`Claim` → `SourceRecord`). Do not mark volatile facts as confirmed without sources and access dates.
