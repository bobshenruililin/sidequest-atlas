# Create trip

Validate an inbox research request and create a trip skeleton via the CLI.

```bash
npm run atlas -- trip create --input requests/inbox/<trip-slug>.yaml
# or if request already under content:
npm run atlas -- trip create --input content/trips/<trip-slug>/request.yaml
```

Do not invent current facts. Produce draft skeleton only.
