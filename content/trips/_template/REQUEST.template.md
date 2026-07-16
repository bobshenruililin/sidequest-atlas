# Future trip request template

Copy the YAML below to `jobs/inbox/<slug>.request.yaml` or `content/trips/<slug>/request.yaml`, then:

```bash
npm run atlas -- trip create --input <path>
npm run atlas -- trip research <slug>
npm run atlas -- trip validate <slug>
# add comments to content/trips/<slug>/review.md
npm run atlas -- trip revise <slug>
npm run atlas -- privacy audit
npm run atlas -- trip publish <slug>
```

```yaml
schemaVersion: "1.0.0"
tripId:
slug:
title:
generatedAt:
travelerId: shen-ruililin
destinations:
  - city:
    country:
    countryCode:
    arrival:
    departure:
    timeZone:
dates:
  start:
  end:
existingBookings: []
budget:
  amountMinor:
  currency:
  excludes: []
  preferredMode: balanced
interests: []
mustDo: []
dislikes: []
openQuestions: []
requestedModules:
  - food
  - universities
  - companies
  - economics
  - culture
  - events
  - sidequests
  - logistics
companiesAndInstitutions: []
foodPreferences: []
constraints: []
desiredPace: balanced
desiredSocialLevel: flexible
```
