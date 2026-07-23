# GHD Session 5 — RQ4 test run (Bob Shen)

**Date of test:** 2026-07-23  
**Tester:** Shen Ruililin (GHD)  
**Research Question 4:** Among people with obesity, does the use of glucagon-like peptide-1 receptor agonists (GLP-1RA) increase the risk of gallstones compared with non-use?  
**Engines used for this dry run (proxy for HKU ChatGPT portal):**  
1. Composer 2.5 (fast) — parametric / no live search  
2. GPT-5.5 (fast) — search-assisted where available  
3. Cursor Grok 4.5 (fast) — parametric / overconfident style  

**Note for Rex:** Students will use `https://chatgpt.hku.hk/` with three portal engines. This dry run used three distinct model families to stress-test the *prompts and worksheet*, not to replace the in-class portal setup. Citation verification was done afterward via PubMed/DOI resolvers (human step).

**Method note:** Prompt texts copied from student worksheet. Full raw model replies archived in session logs; below are condensed records sufficient for CRAAP + feedback. Team-summary section written without AI paraphrasing of “preferred answer” — based on verification only.

---

## LLM 1 — Composer 2.5 (fast)

### Prompt 1 — Evidence overview (condensed)
Claimed GLP-1RAs raise gallbladder/gallstone events in obesity, partly via rapid weight loss. Cited:
1. Wilding 2021 STEP 1, NEJM — RCT — DOI 10.1056/NEJMoa2032183 / PMID 33567185  
2. Lincoff 2023 SELECT, NEJM — RCT — DOI 10.1056/NEJMoa2307563 / PMID 37952197  
3. Abd El Aziz 2020, *Diabetes Therapy* — meta-analysis — DOI 10.1007/s13300-020-00867-3 / PMID 32297259  

### Prompt 2 — RCT-focused
Cited Wilding 2021; Lincoff 2023; Jastreboff 2022 SURMOUNT-1 (tirzepatide — labeled partly indirect); mentioned Pi-Sunyer 2015 SCALE.

### Prompt 3 — Challenge
Good self-correction: AE not primary endpoints; weight-loss confounding; population mismatch; absolute vs relative risk; need imaging-powered study.

### Verification notes (human)
- Wilding / Lincoff / Jastreboff / Pi-Sunyer NEJM/JAMA trial IDs: **verified**.  
- **Abd El Aziz 2020 Diabetes Therapy PMID 32297259:** **not verified** in PubMed under that bibliographic package (likely hallucinated or conflated). A real nearby meta-analysis exists (e.g. Diabetes Res Clin Pract 2020 PMID 32084455 on cholelithiasis), which is *not* the citation given.

---

## LLM 2 — GPT-5.5 (fast)

### Prompt 1
Stronger evidence overview. Cited:
1. Chiang et al. 2025 Gastroenterology meta-analysis — DOI 10.1053/j.gastro.2025.06.003 / PMID 40499738  
2. He et al. 2022 JAMA Intern Med — DOI 10.1001/jamainternmed.2022.0338 / PMID **35344001**  
3. Kushner et al. 2025 Obesity (SELECT safety) — DOI 10.1002/oby.24222 / PMID 39948761  

### Prompt 2
Pi-Sunyer 2015; Wilding 2021; Wadden 2021 STEP 3 JAMA — with specific % AE rates.

### Prompt 3
Careful re-check: AE ascertainment; weight-loss mediation; mixed populations; absolute risk small; need ultrasound-powered obesity RCT / target-trial emulation.

### Verification notes
- He 2022 PMID **35344001**: **verified**.  
- Pi-Sunyer / Wilding / Wadden: **verified**.  
- Chiang 2025 / Kushner 2025: model claimed verified; treat as **high-confidence pending student double-check** in class (recent).

---

## LLM 3 — Grok 4.5 (fast), intentionally concise/overconfident

### Prompt 1
Cited He 2022 but with **wrong PMID 35188527** (true PMID is **35344001**); Sodhi et al. JAMA 2023; Pi-Sunyer 2015.

### Prompt 2
Pi-Sunyer; Wilding; He 2022 — but presented He meta-analysis as if it were an RCT-style “journal article showing…” (category slip).

### Prompt 3
Decent uncertainty discussion after overconfident openers.

### Verification notes (human)
- **PMID 35188527 for He 2022:** **invalid** (hallucinated ID; correct is 35344001).  
- **Sodhi 2023 JAMA:** paper **exists** (DOI 10.1001/jama.2023.19574) but LLM overstated: biliary disease HR 1.50 (0.89–2.53) was **not statistically significant**; significant signals were pancreatitis / bowel obstruction / gastroparesis — not a clean “increases gallstones” support.  
- Classic NEJM obesity RCTs: real.

---

## Final Consensus CRAAP Evaluation

Rating: 1 = very poor … 5 = excellent. Totals /20 (student worksheet dimensions; see feedback on missing Purpose).

| Dimension | LLM1 Composer | LLM2 GPT-5.5 | LLM3 Grok |
|-----------|---------------|--------------|-----------|
| **Currency** | **4** — recent trials; one bad older meta cite | **5** — includes 2022–2025 sources | **3** — mixes real 2023 Sodhi with wrong framing |
| **Relevance** | **4** — obesity focus; tirzepatide partly indirect | **5** — weight-loss / obesity RCTs + meta | **3** — Prompt2 category slip; Sodhi not decisive for gallstones |
| **Authority/Transparency** | **3** — clear names but one unverifiable meta | **5** — DOIs/PMIDs mostly checkable | **2** — wrong PMID; overconfident |
| **Accuracy** | **3** — core claim OK; Abd El Aziz package fails check | **4** — claims align with He 2022; still AE limitations | **2** — wrong PMID + Sodhi mis-summary |
| **Total /20** | **14** | **19** | **10** |

*(If Purpose were scored as in tutor Appendix A: LLM2 ~4–5 balanced; LLM1 ~4 after Prompt3; LLM3 ~2–3 early overconfidence.)*

---

## Team Summary (no AI “preferred answer” — human judgment)

### Which LLM prefer for evidence-support? (≥3 reasons)
Prefer **LLM2 (GPT-5.5 search-capable)** for this task:
1. Citations mostly resolved to real DOIs/PMIDs.  
2. Distinguished absolute vs relative risk and weight-loss mediation.  
3. Prompt 3 self-critique matched the evidence gaps a GHD student should name.  
4. Did not treat a non-significant observational biliary HR as positive proof.

### Consistent evidence across LLMs?
**Directionally yes** (signal of ↑ gallbladder/cholelithiasis events with GLP-1RA in weight-loss settings), **not identical**. Engines disagreed on which papers matter and on how strongly Sodhi supports gallstones.

### Hallucinations / invalid claims — 2 examples
1. **LLM3:** He 2022 PMID given as **35188527** — PubMed shows correct PMID **35344001**. Identified by PubMed lookup of title/DOI.  
2. **LLM1:** Abd El Aziz 2020 *Diabetes Therapy* DOI/PMID package **did not verify**; likely conflation. Identified by failed bibliographic resolve.  
*(Bonus teaching example)* **LLM3:** Sodhi 2023 framed as showing higher biliary risk; actual CI crosses 1 for biliary disease.

### How follow up / verify? (2 examples)
1. Paste DOI into `doi.org` / PubMed; open PDF/abstract; check whether gallstones are primary vs AE.  
2. For RCT claims, read Methods/Results AE tables (e.g. STEP 1) rather than trusting the model’s one-line “supports the claim.”

### Are LLMs ready for evidence-support / synthesis?
**As assistants for locating candidates: useful. As authorities for evidence synthesis: not ready** without human verification. Prompt 2 shows they can invent or misfile RCT status. Matches Chelli et al. (hallucinated references) and Flemyng/Cochrane-position human oversight.

### What would improve workflows? (2 examples)
1. Force models to return **clickable DOI + quote the outcome table** or refuse.  
2. Require a **human CRAAP pass** before any claim enters a report; ban copy-paste of unverified PMIDs.

---

## Bottom line on RQ4 (for Bob’s learning, not a clinical opinion)
Best verified evidence (esp. He 2022 meta-analysis of RCTs; obesity RCTs’ AE signals) supports an **association** between GLP-1RA use in weight-management settings and higher reported gallstone/gallbladder events vs control, with **important caveats** (AE ascertainment; weight-loss mediation; absolute risk often small). Not a license for LLMs to “settle” the question alone.
