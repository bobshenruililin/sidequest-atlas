# CV — Shen Ruililin

One-page A4 academic CV for Youde local nomination / AAS. No profile paragraph.

## Attach this

**`cv/shen-ruililin-cv.pdf`** (LaTeX). One page. Contact lines match the applicant’s own CV.

The DOCX twin is `cv/shen-ruililin-cv.docx` → `cv/shen-ruililin-cv-docx.pdf`. Same facts; LaTeX won on hyphenation, rules, and academic colour. Use the `.docx` only if a committee asks for Word.

`ShenRuililin_CV.tex` / `.pdf` are copies of the LaTeX source for older path references.

## Compile

```bash
cd cv
pdflatex -interaction=nonstopmode shen-ruililin-cv.tex
python3 build_docx.py
soffice --headless --convert-to pdf --outdir /tmp/cv-docx shen-ruililin-cv.docx
# then copy the Writer PDF to shen-ruililin-cv-docx.pdf so it does not clobber the LaTeX PDF
```

## What this version does (2026-08-23)

Adds Tung & Ngai (package language, not a fake lump), Laidlaw + Bishai, Martin Scholar, Wu Zhi Qiao **Student Coordinator** (Macha, May–Jun 2026), Gannan Horizons (Mar 2026), NEWDAY / Nansen East-West Dialogue Academy (29 Jul–6 Aug 2026), GEST Valencia invited speaker and Laidlaw London conference as **forthcoming**, Tam Wun Tsun, MIT Node Youth Fellowship, CKY academic scholarships, Year 2, CGPA 4.09/4.30.

Cuts the generic intro, Class Monitor, World Scholars’ Cup, AI Formula Edge Racing, TVB/pageant side project, Cambridge-MA overclaim on the MIT Node, “published” for a seminar, and the fake HK$500,000 Tung & Ngai total.

Full change log: `docs/cv-rebuild-2026-08.md`.

## Privacy

Contact block is required on a human CV. `atlas privacy audit` scans `content/` text files only, not `cv/`. Do not copy phone or email into `content/captures/`. Do not add HKID, home address, or family financials.
