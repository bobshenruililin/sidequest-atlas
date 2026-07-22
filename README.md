# Sidequest Atlas

**The Life and Field Notes of Shen Ruililin**

> Travel cheaper. Observe deeper. Spend when it matters.

Sidequest Atlas is both:

1. A personal, evolving atlas of Shen Ruililin’s journeys
2. A reusable travel-planning operating system (CLI + file-based agent jobs + static public site)

It treats travel as fieldwork: a way to understand how a place eats, works, studies, moves, designs, invests, celebrates, remembers, and imagines its future.

> I travel to understand how places work—and how being there changes me. Sidequest Atlas records the food, systems, institutions, sidequests, people, questions, and rare experiences that define each journey.

## Architecture in one sentence

**The web application is the atlas. The CLI is the operating system. Cursor is one possible operator. The private vault is Shen’s life.**

Sidequest Atlas is a **travel OS and attention router**: it compounds trips, journals, and sparks into evidence, and routes career / opportunity / research work to sister repos instead of absorbing every project. Day-to-day intake: [docs/operator-intake.md](docs/operator-intake.md).

```text
Control plane (CLI + jobs + agents)
        ↓ validated artifacts
Public read plane (static Next.js atlas)
Private life vault (separate repo / local path)
```

## Quick start

```bash
npm ci
npm run doctor
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Acceptance commands

```bash
npm ci
npm run doctor
npm run lint
npm run typecheck
npm test
npm run test:contract
npm run atlas -- schema check
npm run atlas -- trip validate nordics-2026
npm run atlas -- sources audit nordics-2026
npm run atlas -- privacy audit
npm run build
npm run test:e2e
```

## Add a future trip

1. Copy `content/trips/_template/REQUEST.template.md`
2. Place a request in `jobs/inbox/` or `content/trips/<slug>/request.yaml`
3. `npm run atlas -- trip create --input <path>`
4. `npm run atlas -- trip research <slug>`
5. Review unresolved questions
6. `npm run atlas -- trip validate <slug>`
7. Comment in `review.md`
8. `npm run atlas -- trip revise <slug>`
9. `npm run atlas -- privacy audit`
10. `npm run atlas -- trip publish <slug>`

Cursor commands (`/create-trip`, `/validate-trip`, …) only shell out to this CLI.

## Initial trip

**Nordic Fieldwork — August 2026** (Oslo → Stockholm → Helsinki).  
Many transport times and event details remain **traveler-provided / needs live verification** — see Sources and Claims in the app.

## Deploy to GitHub Pages

1. **Settings → Pages → Source → GitHub Actions** (one-time):  
   https://github.com/bobshenruililin/sidequest-atlas/settings/pages
2. Merge to `main`. CI builds `apps/web/out` and deploys.
3. Site: **https://bobshenruililin.github.io/sidequest-atlas/**

Full steps: [docs/deployment.md](docs/deployment.md).

## Docs

- [Philosophy](docs/philosophy.md)
- [Architecture](docs/architecture.md)
- [Agent workflow](docs/agent-workflow.md)
- [Research policy](docs/research-policy.md)
- [Data model](docs/data-model.md)
- [Privacy](docs/privacy.md)
- [Threat model](docs/threat-model.md)
- [Adding a trip](docs/adding-a-trip.md)
- [Post-trip workflow](docs/post-trip-workflow.md)
- [Deployment](docs/deployment.md)
- [ADRs](docs/adr/)

## Stack

- Next.js (pinned at scaffold; static export)
- TypeScript strict, Tailwind, Zod
- npm workspaces: `apps/web`, `packages/{domain,content,cli,intelligence,exporters}`
- Vitest + Playwright + GitHub Actions

## License / privacy

Public curated content only. Raw notes and booking secrets belong in the private vault — never in this repository’s history.
