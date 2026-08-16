# Project board

Canonical portfolio router for Sidequest Atlas.

**Rule:** Atlas captures sparks and hosts this board. It does **not** absorb
every product. New tools get new repos after activation criteria pass.

| Status | Meaning |
|--------|---------|
| `captured` | Spark only |
| `validating` | Manual test running |
| `approved` | Ready to build in its home |
| `building` | Scaffold in progress |
| `live` | In active use |
| `parked` | Frozen until activation |
| `killed` | Explicitly stopped |

```bash
# After ProjectRecord CLI lands:
npm run atlas -- project list
npm run atlas -- project show <id>
npm run atlas -- project prompt <id>
```

Until then, these YAML files *are* the board. Promote captures here deliberately;
do not auto-convert every interesting chat into a project.

| id | Status | Home | Notes |
| --- | --- | --- | --- |
| `travel-daily-journal` | live | Atlas | Nordics journal loop |
| `law-study-lab` | validating | new-repo-after-validation | Parked behind five manual sessions |
| `housing-tour-kit` | parked | new-repo-after-validation | Kill venture framing |
| `narrative-archaeology` | parked | — | Activation gated |
| `seam-ready` | validating | Atlas board; work in Laidlaw-Heat + T&N | Named Endeavour project |
| `hk-early-stage-ledger` | captured | LearnAI | HK analog of US underclassmen lists |
