# CV rebuild — 23 Aug 2026

**Attach to the Youde local nomination email:** `cv/shen-ruililin-cv.pdf`  
**Pages:** 1 (A4). **Words:** 392 vs 527 on the uploaded PDF, 441 on the July repo PDF.  
**Winner:** LaTeX. DOCX→PDF is the editable twin (`cv/shen-ruililin-cv.docx`, `cv/shen-ruililin-cv-docx.pdf`).

The Youde paste already offers a one-page CV. When you send, add: **A one-page CV is attached.** Do not rewrite the rest of that email. Do not attach HKID.

---

## What changed (facts)

Pulled forward from operator canon + the uploaded CV. Nothing invented.

| Item | On the CV | Source / constraint |
| --- | --- | --- |
| Tung and Ngai Foundation Scholarship | Awarded 2025–26. Full tuition; living HK$40,000; overseas/Mainland subsidy **max** HK$80,000; Endeavour **up to** HK$100,000 | AAS card / Foundation benefits / General Round memo. **Not** a HK$500,000 lump |
| Laidlaw | Undergraduate research scholar, Jan 2026–present. Heat × cardiovascular admissions among older adults, Hospital Authority data, Prof. **David Bishai**, HKU SPH | Canon + July CV. Spelling confirmed across repo |
| Martin Scholar | Honours line, St. John’s College, 2025–26 | Operator / General Round. Letter may say Scholarship / Prize / Scholar — CV follows “Martin Scholar.” Amount omitted |
| Wu Zhi Qiao | **Student Coordinator**, Macha, Gansu, May–Jun 2026 | Not a generic volunteer |
| HKU Horizons Gannan | Participant, Mar 2026. Livelihoods and trust | Official activity title on the Horizons/Tam letter not copied; none invented |
| NEWDAY | Nansen East-West Dialogue Academy, Nansen Academy, Lillehammer, **29 Jul–6 Aug 2026**, participant | Official Nansen dates + alumni play. Not “delegate.” Not Horizons-sponsored unless a letter says so |
| GEST Valencia | Forthcoming Oct 2026, **invited speaker**, Global Conference on Environmental Science and Technology | Operator canon. Official expansion from the GEST 2026 site. Invitation letter not in this repo. Not a keynote. Dates 19–21 Oct are the conference’s public dates — **not printed** because the invitation was not checked |
| Laidlaw London | Forthcoming Oct 2026, **attending** the Laidlaw Scholars Annual Conference | Operator canon + Foundation “Annual Conference” name. Not claimed as a talk |
| Tam Wun Tsun HKU Horizons Student Enrichment Award | 2025–26 | Form/letter name. Not tied on-page to Gannan (likely; unconfirmed) |
| MIT Hong Kong Innovation Node Youth Fellowship | 2023, Youth Fellow, Hong Kong | Form. Uploaded CV put “Cambridge, MA” — dropped as an overclaim of an MIT campus term |
| CKY Academic Scholarships | 2022–23 and 2024–25, under education | Form. Dollar amounts omitted |
| BASc GHD, Year 2, CGPA 4.09/4.30 | Education | Operator-stated; Youde email already says confirm in SIS before send. **4.24 is dead** |
| IBDP 41/45, IGCSE 8A*, 2A | Education | Uploaded CV |

## What was cut

- Profile paragraph (“Passionate, resourceful…”).
- Class Monitor.
- World Scholars’ Cup.
- Inter-school AI Formula Edge Racing.
- TVB / Miss Hong Kong neural-net side project.
- Combined WZQ + Horizons blob (split; coordinator is the load-bearing title).
- “Upcoming” as a standing section. Two Oct 2026 lines live under Laidlaw as forthcoming, with different verbs.
- “Published” on the HKUST seminar.
- Tung & Ngai shortlist-era omission (now awarded).
- Secondary-school prize spray beyond IYPT + Young Writers (kept, one line).
- Languages/skills invented from nowhere. Old PDF had none.
- World Health Summit Berlin delegate — in a NEWDAY application sample and flagged “only if Bob confirms.” Not on the uploaded CV. **Out.**

## Pipelines

1. **LaTeX** `cv/shen-ruililin-cv.tex` → `cv/shen-ruililin-cv.pdf` (`pdflatex`, A4, 10pt, 13.5mm). One page, no overfull boxes after the honours-table collision was killed.
2. **DOCX** `cv/build_docx.py` → `cv/shen-ruililin-cv.docx` → LibreOffice Writer → `cv/shen-ruililin-cv-docx.pdf`. First convert spilled Asian Spring onto page 2; spacing tightened to one page. En-dash in NEWDAY became a missing glyph in Writer; ASCII hyphen used in the DOCX twin only.

**Winner: LaTeX.** Youde is an academic nomination. LaTeX keeps en-dashes, even rules, and hyperlink emails. DOCX is the twin if AAS asks for Word. Content is locked; do not edit one and not the other.

`privacy audit` scans `content/` `.yaml/.md/.txt` only. Email and phone stay on the human CV. They do not go in the capture YAML.

## Consult (Fable / Sol)

This subagent runtime has **no Task tool** and no `fable` / `sol` model slugs (fallback `claude-opus-4-7-thinking-xhigh` / `gpt-5.4-xhigh` also unavailable here). Two independent critique frames were still run on draft 1 and merged only where they survived canon:

**Nominator scan (Youde/AAS, 30 seconds).** Kill the intro. Education + honours at the top. Stop the two-column honours table — titles were colliding with years (`Tam Wun Tsun…Award` / `2025–26`). Do not list Martin twice. School racing and World Scholars’ Cup do not help a heat-health Youde read. GEST must not look like a Laidlaw invited talk.

**Invent-smell audit.** T&N packaging must keep *max* / *up to*, never a 500k lump. London = attending, Valencia = invited speaker. MIT Node ≠ MIT Cambridge degree. WZQ = coordinator, Horizons Gannan = participant. NEWDAY = participant, dates from Nansen, not a leadership title. CGPA is operator-stated — on the CV as 4.09/4.30, SIS before send. Do not print GEST’s 19–21 Oct unless the invitation is in hand. Do not revive 4.24. Do not add WHS Berlin without a confirm.

Draft 2 applied those cuts. Draft 3 was spacing/glyph only (AGU shortened; DOCX one-page; NEWDAY hyphen in Word).

## Youde send note

Fill `[UID]` in the already-written email. Confirm CGPA in SIS. Attach **only** `cv/shen-ruililin-cv.pdf`. One line in the body is enough: *A one-page CV is attached.*
