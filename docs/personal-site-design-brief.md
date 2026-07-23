# Personal site — theme fit & Figma plan

**Subject:** Shen Ruililin (Bob)  
**Status:** concept plan (not production)  
**Date:** 2026-07-23  
**Purpose:** Rank creative visual themes suited to Bob’s canon, recommend tools, and lock a detailed Figma prompt before any Make / generate step.

This brief is for a **personal creative site** (portfolio / life surface), distinct from Sidequest Atlas’s field-notebook UI. Atlas stays the travel OS; this site can be more expressive.

---

## What the repo says you are (design constraints)

| Signal | Implication for the site |
|--------|---------------------------|
| Travel is **fieldwork**; ordinary life is a destination | Hero should not be landmarks or brochure tourism |
| Photography = **witnessing**, not invention | Prefer light, texture, human detail over invented fantasy worlds |
| Calligraphy = **irreversible stroke** | Paint/ink slash can be structural, not decoration |
| Bridge / translator (East ↔ West, data ↔ life) | Dual registers: brush + serif, Shanghai lane + Nordic quiet |
| Scene → thesis → short load-bearing line | Layout: one scene, one claim, one hit line |
| Anti-checklist, anti-prestige cosplay | No achievement dump hero; no soft identity politics opener |
| Food / transit / campuses as evidence | Still-life of the ordinary is on-brand |
| Compounding over clever chat | Site should feel like a photobook + theses, not a resume carousel |
| Existing Atlas look: warm paper `#f5efe3`, IBM Plex + Source Serif | **Do not clone Atlas.** Personal site can rhyme, not twin |

**Hard anti-patterns for this brief:** purple-indigo AI gradients; generic cream + terracotta serif brochure; broadsheet newspaper pastiche; emoji; card-grid dashboards in the first viewport; “passionate leader” copy.

---

## Themes ranked by fit

### 1. Renaissance of the Ordinary ★ strongest fit

**Thesis:** Dutch Golden Age / Caravaggesque attention applied to fieldwork — market fish, ferry tickets, cafeteria trays, grandmother’s wok, street light — not castles and saints.

**Why you:** Philosophy (“ordinary life is a destination”) + photography (“look without blinking”) + food-as-evidence + Vermeer-grade noticing. “Renaissance” here means *renewed looking*, not costume drama.

**Visual grammar:**
- Chiaroscuro: one hard light source, deep umber shadows
- Oil-paint texture on photographic still lifes of ordinary objects
- Occasional gold-leaf rule or illuminated-manuscript micro-label (sparse)
- Serif display for thesis lines; quiet sans for navigation
- Palette: lamp black, raw umber, aged linen, one warm cadmium slash, one cold Baltic blue

**Risk:** Slides into museum pastiche. Counter: keep subjects ruthlessly contemporary and local (HK ferry, Nordic cafeteria, Shanghai lane).

---

### 2. Irreversible Ink / Paint Slash ★ strong fit (your “slashes of paint” ask)

**Thesis:** One decisive brush stroke across a calm field — calligraphy irreversibility as life metaphor. Policy, travel, and identity as marks that cannot be undone, only answered.

**Why you:** Explicit calligraphy motif; East–West bridge; anti-perfectionism (Doraemon / flawed cycles) balanced by deliberate strokes.

**Visual grammar:**
- Full-bleed linen or dark paper ground
- One asymmetrical ink/paint slash as the hero visual plane (edge-to-edge, not a floating card)
- Name set in large expressive display type that the slash partially intersects
- Secondary panels: photobook spreads, trip theses as short aphorisms
- Motion later: slash draws once on load (2–3 intentional motions max)

**Risk:** Becomes abstract-expressionist portfolio cliché. Counter: ground every slash in a place thesis caption (*Gannan: crossing made me hungry, not full*).

---

### 3. Witness Chamber (darkroom photobook)

**Thesis:** The site is a physical photobook opened in a darkroom — contact sheets, handwritten margins, red safelight accents.

**Why you:** Camera as passport; photobooks + written reflections; resilience and quiet dignity.

**Visual grammar:**
- Matte black / charcoal with red safelight accent (use sparingly)
- Full-bleed documentary photography as the dominant plane
- Handwritten margin notes; page-turn or spread metaphor for sections
- Minimal chrome; brand = your name as the only large text in first viewport

**Risk:** Too portfolio-photographer, underplays systems/policy mind. Counter: each photo chapter ends with a systems thesis, not a caption alone.

---

### 4. Bridge Cities / Torn Cartography

**Thesis:** Shanghai ↔ Hong Kong ↔ Nordics as overlapping maps, torn and overpainted — seams as the subject.

**Why you:** Bridge identity; comparative cities; design-as-governance walks.

**Visual grammar:**
- Layered maps, ticket stubs, ferry routes, ink overprints
- Split compositions that almost align (signal loss motif)
- Teal / harbor ink / paper white — not Atlas cream clone

**Risk:** Map sites are common. Counter: maps are substrate; paint and theses dominate.

---

### 5. High-trust Quiet / Nordic Governance Aesthetic

**Thesis:** Restraint as drama — long margins, precise type, one seasonal food still life, invisible rules made visible.

**Why you:** Active Nordic fieldwork thesis; design-as-governance; student-morning / king-night rhythm.

**Risk:** Too quiet for “truly creative / paint slash” desire. Better as a **secondary mode** or winter skin than primary brand.

---

### Themes that fit less well (park or reject)

| Theme | Why weak for you |
|-------|------------------|
| Costume Renaissance (togas, cherubs, marble heroes) | Invention over witnessing; brochure prestige |
| Cyber-neon AI futurism | Conflicts with fieldwork / paper / ink canon |
| Soft wellness / cream lifestyle blog | Twin of generic AI personal sites; Atlas already owns paper |
| Achievement dashboard / bento cards | Checklist energy; anti-coherent-day |
| Pure abstract paint chaos | Missing thesis; you metabolize experience into claims |

---

## Recommended direction (bounce)

**Primary:** *Renaissance of the Ordinary* as the world  
**Accent:** *Irreversible Ink slash* as the brand mark / hero interruption  
**Structure:** *Witness Chamber* information architecture (photobook chapters + thesis lines)

One-line pitch:

> A personal site that looks like a Renaissance painter was hired to witness your ordinary days — then one irreversible ink stroke signs each chapter.

---

## Tools — what to use when

| Stage | Tool | Why |
|-------|------|-----|
| Mood & composition | **Figma** (Design + FigJam) | Best place to lock layout, type, and hero rules before build |
| Concept generation | **Figma Make** / image fill from the prompt below | Fast visual variants without committing to code |
| Texture / still-life refs | Midjourney / Flux / your own photos | Feed real photography; prefer your shots over stock |
| Expressive no-code publish (optional) | **Framer** | Motion + full-bleed art sites without fighting CSS early |
| Long-term ownable site | Next.js (or static) once art direction is locked | Code after the creative brief is non-negotiable |
| Type | One display (expressive) + one text; avoid Inter/Roboto/Arial | Candidates: Fraunces / Newsreader / Instrument Serif + IBM Plex Sans or similar |

**Recommendation:** Plan and art-direct in **Figma first**. Do not start in code. Use Framer only if you want to ship a motion-heavy v1 without engineering. Keep Atlas separate.

---

## Site map (minimal)

First viewport budget (hard): **name · one headline · one supporting sentence · one CTA · one dominant full-bleed image**. No stats, no schedule strips, no cards in the hero.

1. **Cover** — name + thesis line + dominant image/slash  
2. **Look** — photobook chapter (witnessing)  
3. **Field** — selected trip theses (Nordics, Gannan, etc.) as short chapters  
4. **Bridge** — how you work / what you’re studying (scene → claim, not CV dump)  
5. **Table** — contact / write / where the Atlas lives  

---

## Figma work plan (before generating)

1. FigJam: pick Primary direction (#1+#2 hybrid) or force-rank alternatives.  
2. Collect 8–12 reference images: your photos + 2–3 Golden Age still lifes + 1 calligraphy stroke + 1 Nordic interior.  
3. Create Figma file `Shen Ruililin — Personal Site Concepts`.  
4. Frames: `Cover / Desktop 1440`, `Cover / Mobile 390`, `Look chapter`, `Field chapter`, `Type specimen`, `Palette`.  
5. Paste the **Master Prompt** into Figma Make (or use as design brief for a human/AI designer).  
6. Generate 3 cover variants; kill two; refine winner.  
7. Only then decide Framer vs code.

### Agent build gate (2026-07-23)

Cloud agent attempted `/figma-use` to create the file and build covers A/B/C.
**Blocked:** Figma MCP `serverStatus: needsAuth`. Interactive OAuth is only available in
**Cursor Desktop** (not in this cloud environment).

**Unblock:** In Cursor Desktop → MCP / Figma → authenticate the Figma server, then reply
`retry figma` (or reopen this agent with Figma connected). Next steps when unblocked:

1. `whoami` → `create_new_file` (`Shen Ruililin — Personal Site Concepts`)
2. Palette + type specimen frames
3. Three desktop covers (Ordinary Renaissance / Ink Slash / Darkroom) + mobile of winner
4. Look + Field section frames
5. Screenshots back into this brief + file URL

---

## Master Figma prompt (paste-ready)

Use this as one block in Figma Make / an AI design agent. Do not soften the anti-patterns.

```text
Design a personal website cover + first three sections for Shen Ruililin (also called Bob), a Hong Kong–formed traveler-fieldworker, photographer, and pracademic bridging East/West systems. This is NOT a tourism brochure and NOT a resume dashboard.

CREATIVE DIRECTION (hybrid):
- World: “Renaissance of the Ordinary” — Caravaggio/Vermeer lighting and oil-paint atmosphere applied to contemporary ordinary life (ferries, markets, worker lunches, campus corridors, grandmother’s kitchen wok, street texture).
- Brand mark: one irreversible calligraphy-like ink/paint slash that cuts edge-to-edge across the hero as a full-bleed visual plane (not a floating sticker, not a card, not an overlay badge).
- Information feel: opening a physical photobook in a quiet chamber; handwritten margins allowed sparingly.

FIRST VIEWPORT RULES (strict):
- One composition, not a dashboard.
- Brand/name is hero-level (large), not a tiny nav word.
- Only: name, one headline, one short supporting sentence, one CTA group, one dominant full-bleed image/paint plane.
- No cards, no stats, no pill clusters, no floating badges, no schedule snippets, no address blocks, no inset rounded media thumbnails.
- Hero imagery is edge-to-edge (full bleed). No side-panel hero.

COPY (use or lightly edit, keep density):
- Name: Shen Ruililin
- Headline: Look without blinking.
- Supporting: Ordinary life is a destination — food, transit, campuses, trust — witnessed and turned into theses.
- CTA primary: Enter the photobook
- CTA secondary: Field notes (Atlas)

PALETTE:
- Lamp black / raw umber shadows
- Aged linen or cool stone ground (NOT generic warm cream #F4F1EA lifestyle blog)
- One cadmium or cinnabar paint slash
- One cold Baltic/harbor blue accent
- Avoid purple, neon glow, gradient meshing, terracotta-on-cream clichés

TYPOGRAPHY:
- Expressive serif or calligraphic display for name + headline
- Quiet humanist sans for UI
- No Inter, Roboto, Arial, system-ui as the designed look

SECTIONS AFTER HERO:
1) LOOK — full-bleed photographic still life with a one-line thesis about witnessing vs inventing
2) FIELD — three short thesis chapters (not itineraries): e.g. “Crossing made me hungry, not full.” / Nordic high-trust systems / bridge cities
3) BRIDGE — how he translates between systems; end with a short load-bearing line

MOTION INTENT (for later; show as static cues now):
- Ink slash draws once on load
- Slow light drift across the ordinary still life
- Soft page-turn between photobook chapters
(Only 2–3 intentional motions total.)

OUTPUT FRAMES:
- Desktop 1440×900 cover
- Mobile 390×844 cover
- Desktop Look + Field sections
- Palette + type specimen board

TONE CHECK:
If you remove the nav and it could belong to any AI personal brand, the branding is too weak — strengthen name presence and the irreversible slash.
If it looks like a museum costume drama or a LinkedIn bento, reject and redesign toward ordinary-life still life + ink.
```

---

## Alternate short prompts (A/B)

**A — Ink-first:**  
`Full-bleed linen field. Giant name “Shen Ruililin”. One black-crimson calligraphy slash across the entire hero. Subline: “Irreversible strokes. Ordinary days.” No cards. Photobook chapters below.`

**B — Ordinary Renaissance:**  
`Vermeer light on a contemporary Hong Kong ferry ticket and a bowl of noodles, oil-paint texture, full bleed. Name large. Headline: “Ordinary life is a destination.” No purple, no cream-terracotta template.`

**C — Darkroom:**  
`Matte charcoal photobook cover, red safelight edge light, contact-sheet strip as secondary rhythm, name as only large type, CTA “Open the book.”`

---

## Decision checklist (Bob)

- [ ] Confirm hybrid (#1 world + #2 slash) or pick a single theme  
- [ ] Decide personal site vs Atlas relationship (link out vs shared domain)  
- [ ] Gather 8–12 of your own photos for the still-life hero  
- [ ] Run Master Prompt in Figma Make → keep one cover  
- [ ] Choose Framer (fast expressive) vs code (ownable) after art lock  

---

## Sources (repo)

- `docs/philosophy.md`
- `docs/writing-voice/STYLE.md`
- `docs/writing-voice/samples/photography-nonacademic-250.md`
- `content/people/shen-ruililin.yaml`
- `docs/tung-ngai-bob-profile.md`
- `apps/web/src/app/globals.css` (Atlas visual language — rhyme, don’t twin)
- Nordics trip thesis in `content/trips/nordics-2026/trip.yaml`
