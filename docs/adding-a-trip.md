# Adding a trip

1. Fill the request template (`content/trips/_template/REQUEST.template.md`)
2. Place it in `jobs/inbox/` or `content/trips/<slug>/request.yaml`
3. `npm run atlas -- trip create --input <path>`
4. `npm run atlas -- trip research <slug>`
5. Review unresolved questions and claims
6. `npm run atlas -- trip validate <slug>`
7. Write human comments in `review.md`
8. `npm run atlas -- trip revise <slug>`
9. `npm run atlas -- privacy audit`
10. Human approval → `npm run atlas -- trip publish <slug>`

Or use Cursor `/create-trip` → `/research-trip` → `/validate-trip` → `/revise-trip` → `/publish-trip`.
