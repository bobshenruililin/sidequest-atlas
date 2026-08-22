# `opportunities.csv` columns

| Column | Required | Values / notes |
|--------|----------|----------------|
| `id` | yes | `opp-` + slug, stable |
| `org` | yes | Official name |
| `programme` | yes | Course or team name, or `n/a` |
| `ask_type` | yes | `internship` \| `visit` \| `academy` \| `unpaid-sprint` \| `remote-brief` \| `funding` |
| `window` | yes | `winter-2026-27` \| `summer-2027` \| `either` \| `protected` |
| `fit` | yes | `high` \| `medium` \| `low` \| `watch` |
| `collision` | yes | `none` \| `LINK-S` \| `LiA` \| `Laidlaw-London` \| `GEST` \| comma-join if several |
| `status` | yes | `watch` \| `scouted` \| `artifact` \| `drafted` \| `queued` \| `approved` \| `sent` \| `replied` \| `killed` |
| `source_url` | yes | Official page; `unverified` if missing |
| `accessed_at` | yes | `YYYY-MM-DD` |
| `confidence` | yes | `low` \| `medium` \| `high` |
| `reverify_after` | yes | `YYYY-MM-DD` |
| `claim_ids` | no | Space or semicolon separated |
| `artifact_path` | no | Relative to `~/opportunity-os/` |
| `resume_variant` | no | Filename under `resumes/` |
| `ask_one_liner` | yes | The single ask |
| `eligibility_note` | no | e.g. ASEF often wants youth-org reps |
| `notes` | no | No phone, UID, vault |

Do not add a `phone` or `private_email` column.
