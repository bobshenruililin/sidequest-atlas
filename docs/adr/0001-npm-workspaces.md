# ADR 0001: npm workspaces monorepo

## Status

Accepted

## Context

Sidequest Atlas needs shared schemas across web, CLI, agents, and exporters without coupling domain logic to Next.js.

## Decision

Use npm workspaces with `apps/web` and `packages/{domain,content,cli,intelligence,exporters}`.

## Consequences

- Domain validates independently of the UI
- Future native clients can reuse packages
- Slightly more scaffolding complexity
