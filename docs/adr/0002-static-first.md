# ADR 0002: Static-first public application

## Status

Accepted

## Context

The public atlas must deploy to static hosts and remain useful offline. Mutable API routes and filesystem writes conflict with static export.

## Decision

Ship `DeploymentMode = "static-public"` by default (`output: 'export'`). Control-plane mutations happen via CLI, not the deployed site. Optional `server-private` mode is future-only.

## Consequences

- No request-time filesystem APIs in public mode
- Browser exports and IndexedDB notes work client-side
- PDF generation for archives uses CLI + Playwright
