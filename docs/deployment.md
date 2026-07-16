# Deployment — GitHub Pages

Sidequest Atlas ships as a **static** site (`apps/web/out`). CI deploys it to GitHub Pages on every push to `main`.

Live URL (after enable + merge):

**https://bobshenruililin.github.io/sidequest-atlas/**

---

## One-time GitHub setup

1. Open **Settings → Pages**  
   https://github.com/bobshenruililin/sidequest-atlas/settings/pages
2. Under **Build and deployment → Source**, select **GitHub Actions**  
   (not “Deploy from a branch”)
3. Save. This creates the `github-pages` environment.

No other Pages settings are required. The workflow in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) handles build + deploy.

---

## Publish a new version

1. Merge a PR into `main` (or push to `main`).
2. Wait for the **CI** workflow:
   - `quality` → `build-static` → `e2e` → **`deploy-pages`**
3. `deploy-pages` runs **only** on `push` to `main` (not on pull requests).
4. Open the site URL above, or check **Settings → Pages** / the Actions run summary for the deployment URL.

---

## Local static preview

```bash
# Root-relative (same as local e2e)
npm run build
npx serve apps/web/out -l 4173

# Match production GitHub Pages prefix
NEXT_PUBLIC_BASE_PATH=/sidequest-atlas npm run build
npx serve apps/web/out -l 4173
# open http://127.0.0.1:4173/sidequest-atlas/
```

---

## Why `basePath`?

This is a **project** Pages site (`username.github.io/repo-name/`), not `username.github.io/`.  
CI sets `NEXT_PUBLIC_BASE_PATH=/sidequest-atlas` on the production static build so routes and assets resolve under that prefix. Local/dev/e2e leave it unset.

If you later attach a custom domain at the site root, remove that env var from CI.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `deploy-pages` skipped | Ensure the commit is on `main`, not only a PR branch |
| 404 on CSS/JS | Confirm Pages source is **GitHub Actions** and `basePath` matches the repo name |
| Permission / environment errors | Re-check Settings → Pages → Source = GitHub Actions; approve the `github-pages` environment if protection rules require it |
| Want a manual redeploy | Actions → CI → **Run workflow** is not enabled by default; push an empty commit to `main` or re-run the failed job |

---

## Server-private mode (future)

Optional authenticated hosting (sync, server AI, remote PDF) is **not** required for the public atlas. See ADR 0002.
