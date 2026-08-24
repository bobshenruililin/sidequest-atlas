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

## What this version does (2026-08-24 density)

Keeps the 23 Aug fact lock (Tung & Ngai awarded; Laidlaw + Bishai; Martin; WZQ coordinator; Gannan; NEWDAY dates; GEST invited / London attending; Year 2; CGPA 4.09/4.30). Fills the empty page: identity line in the header, T&N components plus an honest **four-year package ceiling ~HK$520,000** (not a disbursed lump), selection ratios Bob stated (1 of 4 T&N HKU; 1 of 3 NEWDAY HKU; 1 of 3 WZQ coordinators), Nordic fieldwork named separately from the nine-day academy, Skills line for ATS.

Change log: `docs/cv-density-2026-08.md`. Prior fact table: `docs/cv-rebuild-2026-08.md`.

## Privacy

Contact block is required on a human CV. `atlas privacy audit` scans `content/` text files only, not `cv/`. Do not copy phone or email into `content/captures/`. Do not add HKID, home address, or family financials.
