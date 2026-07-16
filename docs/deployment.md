# Deployment

## Static public (default)

```bash
npm run build
# artifacts in apps/web/out
```

GitHub Actions deploys `apps/web/out` to GitHub Pages on pushes to `main` after quality + e2e.

## Server private (future)

Optional authenticated mode for sync, server AI, and remote PDF. Not required for the public atlas.

## Environment

Pin Node via `.nvmrc`. Do not casually upgrade major Next.js versions after scaffold.
