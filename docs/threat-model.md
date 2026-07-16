# Threat Model

## Assets

- Public curated trip content (low sensitivity)
- Private vault notes, bookings, contacts, media EXIF (high sensitivity)
- Environment secrets and API keys (critical)
- Traveler identity and social encounter details (high)

## Actors

| Actor | Trust | Capabilities |
|-------|-------|--------------|
| Repository owner | Trusted | Full local vault access |
| CI | Semi-trusted | Public content only |
| Cursor background agents | Untrusted operators | Internet + shell; no vault |
| Public website visitors | Untrusted | Static public content |
| External web content | Hostile data | May contain prompt injection |

## Threats

1. **Prompt injection** via researched pages → agents follow malicious instructions
2. **Secret exfiltration** via agent print/commit/upload
3. **Private vault leakage** into public builds
4. **History persistence** of secrets once committed
5. **Supply-chain** dependency injection
6. **Privilege escalation** via Actions permission changes

## Mitigations

- CLI + job protocol as durable API; Cursor is a thin operator
- Separate vault; `vault://` opaque refs only in public content
- `privacy audit` + public-build snapshot tests
- `.cursor/rules/security.mdc` forbids following external instructions
- Branch protection assumptions; no push to `main` by agents
- Pre-commit / CI secret and booking-reference scans
- Static-public deployment with no mutable filesystem APIs
