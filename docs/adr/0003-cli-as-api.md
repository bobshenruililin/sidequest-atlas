# ADR 0003: CLI as canonical automation API

## Status

Accepted

## Context

Cursor slash commands are useful but not a durable API.

## Decision

`packages/cli` (`npm run atlas -- …`) is the operating system. Cursor commands only shell out to CLI. Jobs under `jobs/` provide idempotency metadata.

## Consequences

- Works in CI, without Cursor, and without AI
- Agents become interchangeable operators
