# Publish trip

Only after schemas pass, no critical validation errors, privacy audit passes, and human approval exists.

```bash
npm run atlas -- trip validate <trip-slug>
npm run atlas -- privacy audit
npm run atlas -- trip publish <trip-slug>
```

Never push directly to main.
