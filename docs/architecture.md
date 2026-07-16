# Architecture

## Layers

| Layer | Responsibility | Runtime |
|-------|----------------|---------|
| Control plane | CLI, jobs, agents, validation, publish | Local / CI / background agent |
| Public read plane | Static atlas pages, maps, budgets, sources | Static export |
| Private vault | Raw notes, bookings, precise private locations | External |

## Packages

- `@sidequest-atlas/domain` — Zod schemas, money, time, validation, migrations
- `@sidequest-atlas/content` — loaders, registry, privacy scan, provenance helpers
- `@sidequest-atlas/cli` — canonical automation API
- `@sidequest-atlas/intelligence` — LocalTemplateProvider, ManualResearchProvider
- `@sidequest-atlas/exporters` — Markdown, YAML, GeoJSON, ICS, offline pack, PDF stub
- `@sidequest-atlas/web` — static Next.js App Router site

## Deployment modes

- `static-public` (default): `output: 'export'`, no mutable APIs
- `server-private` (future): auth sync, server AI, remote PDF

See ADRs in `docs/adr/`.
