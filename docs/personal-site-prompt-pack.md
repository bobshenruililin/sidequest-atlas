# Personal site — agency-grade prompt pack (1–3)

**File:** https://www.figma.com/design/5DOvLt7kC09K1BRSYRTJZ1  
**Locked direction:** Keep **A — Ordinary Renaissance** as world; merge **B’s irreversible slash** as brand mark; borrow **C’s photobook IA**.  
**Use:** Local Cursor Agent + authenticated Figma MCP. Paste **one prompt per chat turn**. Do not soften constraints.

---

## How to use (Bob)

1. Open the Figma file above in a browser tab (so you can watch).
2. Open a **new local Agent** chat in Cursor Desktop (repo cloned).
3. Paste **PROMPT 1** → wait until screenshots + file URL return.
4. Paste **PROMPT 2** in the **same** chat (or new if context is bloated).
5. Paste **PROMPT 3** for polish / mobile / motion cues / kill criteria.
6. Optional: drop 2–3 of your real still-life photos into the hero light plane between Prompt 1 and 2.

If the agent skimps, reply only: `You under-delivered vs the agency bar. Re-read PROMPT N quality bar and rebuild the weak frames. No new concepts.`

---

## PROMPT 1 — Art lock: hybrid cover + design system (paste first)

```text
You are a principal brand designer + art director shipping a personal site for Shen Ruililin that must look like a 6-person studio spent 3 months on it — not a student Figma exercise.

CONTEXT
- Repo: sidequest-atlas (local). Read docs/personal-site-design-brief.md and docs/writing-voice/STYLE.md and docs/philosophy.md before designing.
- Existing Figma file (EDIT THIS FILE — do not create a new one unless broken):
  https://www.figma.com/design/5DOvLt7kC09K1BRSYRTJZ1
  Title: Shen Ruililin — Personal Site Concepts
- Prior decision: KEEP cover A (Ordinary Renaissance). MERGE cover B’s irreversible ink/paint slash INTO A as the brand mark. Use C only as photobook information architecture cues. Kill standalone B and C as primary covers (archive them on a page named “Archive — rejected covers”).

MISSION FOR THIS TURN (Prompt 1 of 3)
Produce an art-locked hybrid cover system + tokenized foundations. Do not build the whole site yet. Do not write production code.

LOAD SKILLS BEFORE TOOLS
- figma-use (mandatory before every use_figma)
- figma-generate-design if assembling multi-section frames
Work incrementally with use_figma. Screenshot after each major frame. Return all created/mutated node IDs.

CREATIVE THESIS (non-negotiable)
“A Renaissance painter was hired to witness ordinary days — then one irreversible ink stroke signs the cover.”
- World = Caravaggio/Vermeer chiaroscuro on CONTEMPORARY ordinary objects (ferry ticket, bowl/noodles or wok sheen, chopsticks, market fish, cafeteria tray — NOT castles, cherubs, marble heroes, tourism landmarks).
- Brand mark = one edge-to-edge calligraphy-like ink/cadmium slash that intersects the oversized name (structural plane, not sticker, not badge, not card, not floating chip).
- Feel = opening a physical photobook in a quiet chamber.

FIRST VIEWPORT HARD RULES
- One composition, not a dashboard.
- Name “Shen Ruililin” is hero-level (largest type on screen). If you remove the nav, the brand must still be unmistakable.
- Allowed in first viewport ONLY: name, one headline, one supporting sentence, one CTA group (primary + secondary), one dominant full-bleed image/paint plane, the ink slash.
- FORBIDDEN in first viewport: cards, stats, pill clusters, floating badges, schedule strips, address blocks, inset rounded media thumbnails, side-panel heroes, bento grids, achievement dumps, emoji.
- Hero media is FULL BLEED edge-to-edge.

COPY (use exactly unless a tiny grammar fix is required)
- Name: Shen Ruililin
- Headline: Look without blinking.
- Supporting: Ordinary life is a destination — food, transit, campuses, trust — witnessed and turned into theses.
- Primary CTA: Enter the photobook
- Secondary CTA: Field notes → Atlas

PALETTE (lock as Figma color variables with explicit scopes — not ALL_SCOPES)
- Lamp black (ink)
- Raw umber (shadow)
- Aged linen OR cool stone ground — NOT generic warm cream #F4F1EA lifestyle blog
- Cadmium / cinnabar (slash only)
- Baltic / harbor blue (single cold accent)
- Optional safelight red ONLY as a 1–2px edge cue later — not in Prompt 1 hero
FORBIDDEN: purple, indigo gradients, neon glow, mesh gradients, terracotta-on-cream AI brochure look, Atlas paper clone (#f5efe3 as dominant field).

TYPOGRAPHY (lock text styles)
- Display / name: Fraunces or Instrument Serif (expressive; optical size large)
- Headline: Instrument Serif or Fraunces Soft
- UI / CTA / nav: IBM Plex Sans
FORBIDDEN as designed look: Inter, Roboto, Arial, system-ui, Geist, default Figma Inter leftovers.

SPACING / GRID
- Desktop artboard 1440×900 for cover; also produce 1440×2400 scroll preview if helpful for composition.
- Generous margins (min 64–96px desktop). Long quiet margins are intentional.
- Optical alignment: name + slash relationship must feel inevitable, not accidental.

WHAT TO BUILD IN FIGMA (Prompt 1 deliverables)
1) Page: “01 — Foundations”
   - Color variables + swatch board
   - Text styles specimen (name / H1 / body / UI / micro-label)
   - Slash mark component (variants: cadmium, ink, thin, thick) — reusable
2) Page: “02 — Cover Art Lock”
   - Frame: Cover / Desktop / Hybrid A×B (1440×900)
   - Frame: Cover / Mobile / Hybrid (390×844)
   - Frame: Cover / Desktop / Hover or Focus state (CTA only change — still no cards)
3) Page: “99 — Archive”
   - Move prior A/B/C exploratory covers here; label A as ancestor of Hybrid.

QUALITY BAR (agency — fail any = rebuild that frame)
- Still life must feel OIL-PAINT / photographic witnessing, not clipart.
- Slash must cut the composition (overlap name or light plane) and read from 2 meters away as a brand mark.
- Name must dominate; headline second; supporting quiet; CTAs tertiary.
- No generic “AI personal site” vibe. Brand test: remove nav → still Shen Ruililin’s world.
- No costume Renaissance. No LinkedIn energy.
- Type must not clip. Slash must not make name illegible — allow knock-out / overlap with care.
- Mobile: same hierarchy; slash still full-bleed; no cramped stacking into a card stack.

PROCESS
1. Inspect the existing file with read-only use_figma first.
2. Create/rename pages as above.
3. Build foundations, then hybrid covers.
4. Screenshot Cover Desktop + Mobile + Foundations.
5. Return: file URL, node IDs, what you changed, and a blunt self-critique (3 weaknesses left for Prompt 2).

DO NOT
- Invent biography, awards, GPAs, or current events.
- Dump CV content.
- Start coding the website.
- Create new competing concepts (D/E/F). Commit to Hybrid A×B.
```

---

## PROMPT 2 — Full site: photobook pages at studio quality (paste second)

```text
Continue in the SAME Figma file:
https://www.figma.com/design/5DOvLt7kC09K1BRSYRTJZ1

Prompt 2 of 3. Foundations + Hybrid cover already exist from Prompt 1. Do not redesign the brand from scratch. Elevate and extend.

MISSION
Design the full personal site as a vertical photobook experience — the quality bar is “studio site for a cultural figure,” not a student portfolio.

LOAD figma-use (and figma-generate-design if needed). Build section-by-section inside a single Desktop page wrapper, then a Mobile wrapper. Screenshot each finished section.

SITE MAP (build ALL as high-fidelity frames)
Desktop wrapper 1440 wide, scrolling page named “Site / Desktop / v1”
Mobile wrapper 390 wide named “Site / Mobile / v1”

SECTIONS (one job each — one headline + one short support line max)

0) COVER — use the locked Hybrid A×B cover as the first viewport (do not invent a new hero).

1) LOOK — Witnessing
- Full-bleed still-life or documentary plane.
- Headline: Witnessing, not inventing.
- Body (≤40 words): Camera as passport; light, texture, quiet dignity; look closely without blinking.
- Optional sparse handwritten margin note (1 line max).
- NO gallery grid of many cards. Prefer one dominant image + one secondary detail strip max (contact-sheet rhythm from Darkroom C is OK if subtle).

2) FIELD — Theses (not itineraries)
Three chapter rows / spreads — NOT cards in a bento:
  a) “Crossing made me hungry, not full.” — Gannan / rural service hunger for building, not tourism.
  b) “High-trust as infrastructure.” — Nordic fieldwork: design, education, patient capital, ordinary systems.
  c) “Bridge cities.” — Shanghai ↔ Hong Kong as practice of translation, not slogan.
Each chapter: large thesis line + 2–3 sentences + one full-bleed or half-bleed visual plane. End each with a micro ink slash or gold-hairline rule — sparse.

3) BRIDGE — How he works
- Scene → claim structure.
- Headline: Translator between systems.
- Body: data ↔ lived life; East ↔ West; design ↔ delivery. Research as prerequisite for service (urban health / policy north star) — interpretive, not CV dump. No GPA, no award laundry list.
- End with load-bearing line: “Raise the standard without raising the temperature.”

4) TABLE — Close
- Quiet closing chamber.
- Primary: Write / Contact (mailto placeholder ok — do not invent private address)
- Secondary: Sidequest Atlas (field notes) — link treatment only
- Tertiary: Photobooks / looking
- Final line alone: “Leave room for reality.”

NAV (global, minimal)
- Wordmark: Shen Ruililin (small in nav ONLY after hero — hero still owns the large name)
- Links: Look · Field · Bridge · Table · Atlas
- No hamburger art overload on desktop. Mobile: simple menu.

INTERACTION / STATE FRAMES (desktop)
- CTA hover
- Nav active section
- Field chapter “open” (expanded thesis) vs resting
Keep states elegant; still no cards-as-default.

CONTENT CRAFT RULES (Bob voice)
- Concrete verbs: crossed, witnessed, translated, rearranged.
- Rhythm: one long analytic sentence, then a short hit.
- No emoji. No “passionate about.” No purple brochure diction.
- Do not invent fares, hours, current events, or unverified claims.

VISUAL CONTINUITY
- Reuse Prompt 1 variables + text styles + slash component.
- Each major section may shift light temperature slightly (LOOK warmer umber; FIELD cooler Baltic; BRIDGE balanced; TABLE near-darkroom charcoal) but must feel one book.
- Backgrounds may be linen/stone/charcoal — never default white SaaS, never purple.

QUALITY BAR (fail = rebuild section)
- Scrolling the desktop page should feel like turning a photobook, not browsing Notion.
- Every section passes the “one job” test.
- No section introduces a new visual language (no sudden glassmorphism, no neo-brutal stickers).
- Type hierarchy remains ruthlessly clear at 0.5× zoom.
- Mobile is not a squashed desktop; recompose, keep full-bleed discipline.
- Brand test still holds on cover.

DELIVER
- Complete Desktop + Mobile site frames
- Screenshots: cover, LOOK, FIELD, BRIDGE, TABLE, and full-page zoomed-out desktop
- A recommended art order for replacing placeholder still lifes with Bob’s real photos (slot list)
- Blunt list of what still looks “AI-generic” if anything remains
```

---

## PROMPT 3 — Polish pass: motion cues, micro-craft, kill list (paste third)

```text
Continue in:
https://www.figma.com/design/5DOvLt7kC09K1BRSYRTJZ1

Prompt 3 of 3 — the polish pass that separates student work from studio work.

MISSION
Do not add new sections. Raise craft density. Add motion specification frames. Run a ruthless QA kill list and fix everything you can in Figma.

LOAD figma-use. Prefer surgical edits over rebuilds.

A) MOTION SPEC BOARD (new page “03 — Motion”)
Document ONLY 2–3 intentional motions (static storyboard frames + timing labels):
1. Cover load: ink slash draws once (600–900ms), ease-out; name already present; still life light drifts slowly after.
2. Chapter enter: soft photobook page-turn or vertical reveal (280–400ms) — not bounce, not springy toy motion.
3. Optional: CTA underline/ink bleed on hover (120–180ms).
FORBIDDEN motions: parallax junk, particle fields, endless gradient animation, scroll-jacking, emoji confetti.

B) MICRO-CRAFT FIXES (apply to Site Desktop + Mobile)
- Optical kerning on oversized name
- Slash vs type collision: adjust mask/overlap so name remains readable
- Consistent baseline rhythm and margin system (document spacing tokens: 8/16/24/40/64/96)
- CTA hierarchy: primary solid ink or cadmium-edge; secondary ghost/text — never two equal pills
- Replace any Inter leftovers
- Remove any accidental cards, chips, badges, glow
- Ensure still-life planes feel tactile (grain/noise/oil) not flat vector poster
- Align hairline rules; never more than one decorative rule language
- Darkroom safelight: at most one quiet edge in TABLE or LOOK — do not redden the brand

C) COMPONENTIZE
- Slash mark
- Nav
- Primary/Secondary CTA
- Chapter thesis block
- Closing line block
Name components clearly. Variants for Desktop/Mobile where needed.

D) CONTENT/ACCESSIBILITY PASS
- Contrast: body text readable on linen/charcoal
- Focus states for CTAs (visible, on-brand)
- Alt-text notes as sticky annotations on image planes (what Bob should photograph for each slot)

E) EXPORT-READY HANDOFF FRAME
Page “04 — Handoff”
- Final Desktop cover + full page
- Final Mobile cover + full page
- Token summary
- Motion summary
- Photo shot list for Bob (8–12 ordinary-life still lifes: ferry ticket, wok, market, cafeteria tray, campus corridor, Nordic lunch, Shanghai lane texture, hands, etc.)
- Build recommendation: Framer for expressive v1 OR Next.js after art lock — pick ONE recommendation with rationale (do not implement code unless asked)

F) AGENCY QA CHECKLIST (answer yes/no; fix any “no”)
[ ] Brand test: nav removed → still unmistakably Shen Ruililin
[ ] Hero budget obeyed
[ ] Hybrid A×B visible (ordinary Renaissance world + irreversible slash)
[ ] No purple / cream-terracotta / Inter
[ ] No CV dump / no fake facts
[ ] Photobook feel across scroll
[ ] Mobile recomposed, not squashed
[ ] ≤3 motions specified
[ ] Components exist for slash/nav/CTA/chapter
[ ] Looks expensive because of restraint, not decoration

DELIVER
- Screenshots of final Desktop cover, full desktop page, mobile cover, motion board, handoff board
- File URL
- Short verdict: ready for Framer/code or still needs Bob’s photos first
- Top 5 remaining human-only decisions
```

---

## If you only have energy for ONE mega-prompt

Use this condensed all-in-one (weaker than 1→2→3, but viable):

```text
Edit https://www.figma.com/design/5DOvLt7kC09K1BRSYRTJZ1 using figma-use (+ figma-generate-design as needed).

Art-lock Hybrid A×B: Ordinary Renaissance full-bleed still life + irreversible cadmium/ink slash cutting oversized name “Shen Ruililin”. Headline “Look without blinking.” Supporting line about ordinary life as destination. CTAs: Enter the photobook / Field notes → Atlas. Then build full Desktop 1440 + Mobile 390 photobook site: Cover, LOOK, FIELD (3 theses), BRIDGE, TABLE. Voice from docs/philosophy.md + docs/writing-voice/STYLE.md. Fraunces/Instrument Serif + IBM Plex Sans. Palette: lamp black, umber, linen/stone, cadmium slash, Baltic accent. No cards/stats/pills/badges in hero; no purple; no cream-terracotta; no Inter; no CV dump; no costume Renaissance. Componentize slash/nav/CTA/chapter. Add motion board with exactly 3 motions. Screenshot everything. Return file URL + blunt critique. Quality bar: looks like a 3-month studio site, not a weekend mock.
```

---

## Photo brief (do this between Prompt 1 and 2 if possible)

Shoot or pull existing photos — ordinary, close, textured:

1. Ferry ticket / Octopus / transit stub in hard side light  
2. Bowl + chopsticks or wok sheen  
3. Market fish / produce with deep shadow  
4. Student cafeteria tray  
5. Campus corridor empty at dusk  
6. Grandmother’s kitchen detail (no faces required)  
7. Hands holding a camera or photobook  
8. Nordic worker lunch or crayfish ritual (if you have it)  
9. Shanghai lane texture / wall / 拆 fragment (careful, atmospheric)  
10. One irreversible ink/calligraphy stroke on paper (you make it)

Drop 2–3 onto the cover light plane before Prompt 2 for a huge quality jump.
