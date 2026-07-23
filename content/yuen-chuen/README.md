# Yuen Chuen Atlas (content)

Bro-voice yearbook roasts of **public Hong Kong myths** — foundation namesakes,
clan archetypes, tycoons, professors, hall legends — linked by wealth /
patronage / marriage lore.

## Rules

- Satire of public lore only. Mark uncertainty. No private addresses, no vault.
- Not wired into `atlas trip *`. The web app loads these files at build time.
- Tone: short, mean, Currents bro — not philosophy essays.

## Layout

```
content/yuen-chuen/
  figures/<slug>.yaml
  edges.yaml
```

## Figure fields

| Field | Meaning |
|-------|---------|
| `kind` | `person` \| `clan` \| `institution` |
| `wealthBand` | `mythic` \| `clan` \| `institutional` \| `academic` \| `hall` |
| `era` | `colonial-merchant` \| `postwar-tycoon` \| `contemporary` \| `scholarship` \| `campus` |
| `cluster` | `hk-wealth` \| `scholarship` \| `sjc` \| `academia` |
