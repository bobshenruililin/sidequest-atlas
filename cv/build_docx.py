#!/usr/bin/env python3
"""Build the DOCX twin of shen-ruililin-cv.tex. Content must stay in lockstep."""

from __future__ import annotations

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

OUT = "shen-ruililin-cv.docx"
PAGE_WIDTH_MM = 210
MARGIN_MM = 13.5


def set_run_font(run, name="Times New Roman", size=10, bold=False, italic=False):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(0, 0, 0)


def add_bottom_border(paragraph):
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "12")
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), "000000")
    pBdr.append(bottom)
    pPr.append(pBdr)


def add_tab_right(paragraph, pos_twips):
    pPr = paragraph._p.get_or_add_pPr()
    tabs = OxmlElement("w:tabs")
    tab = OxmlElement("w:tab")
    tab.set(qn("w:val"), "right")
    tab.set(qn("w:pos"), str(pos_twips))
    tabs.append(tab)
    pPr.append(tabs)


def usable_width_twips(section):
    return int(section.page_width.pt * 20) - int(section.left_margin.pt * 20) - int(
        section.right_margin.pt * 20
    )


def heading(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = p.paragraph_format
    pf.space_before = Pt(7)
    pf.space_after = Pt(1)
    pf.line_spacing = Pt(12)
    run = p.add_run(text.upper())
    set_run_font(run, size=11, bold=True)
    add_bottom_border(p)
    return p


def head_row(doc, left, right, left2, right2, width_twips):
    p1 = doc.add_paragraph()
    pf = p1.paragraph_format
    pf.space_before = Pt(3.5)
    pf.space_after = Pt(0)
    pf.line_spacing = Pt(12)
    add_tab_right(p1, width_twips)
    r = p1.add_run(left)
    set_run_font(r, size=10.5, bold=True)
    p1.add_run("\t")
    r2 = p1.add_run(right)
    set_run_font(r2, size=10.5, bold=True)

    p2 = doc.add_paragraph()
    pf2 = p2.paragraph_format
    pf2.space_before = Pt(0)
    pf2.space_after = Pt(0.5)
    pf2.line_spacing = Pt(12)
    add_tab_right(p2, width_twips)
    r3 = p2.add_run(left2)
    set_run_font(r3, size=10)
    p2.add_run("\t")
    r4 = p2.add_run(right2)
    set_run_font(r4, size=10)
    return p1, p2


def bullet(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(0.5)
    pf.line_spacing = Pt(12)
    pf.left_indent = Mm(4.5)
    pf.first_line_indent = Mm(-3.2)
    r = p.add_run("•  " + text)
    set_run_font(r, size=10)
    return p


def honor_parts(doc, bold, rest=""):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(1.5)
    pf.line_spacing = Pt(12)
    r = p.add_run(bold)
    set_run_font(r, size=10, bold=True)
    if rest:
        r2 = p.add_run(rest)
        set_run_font(r2, size=10, bold=False)
    return p


def main():
    doc = Document()
    section = doc.sections[0]
    section.page_width = Mm(PAGE_WIDTH_MM)
    section.page_height = Mm(297)
    section.left_margin = Mm(MARGIN_MM)
    section.right_margin = Mm(MARGIN_MM)
    section.top_margin = Mm(11.5)
    section.bottom_margin = Mm(11.5)
    width = usable_width_twips(section)

    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(10)

    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name.paragraph_format.space_before = Pt(0)
    name.paragraph_format.space_after = Pt(4)
    name.paragraph_format.line_spacing = Pt(16)
    nr = name.add_run("Shen Ruililin")
    set_run_font(nr, size=16, bold=True)

    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact.paragraph_format.space_before = Pt(0)
    contact.paragraph_format.space_after = Pt(2)
    contact.paragraph_format.line_spacing = Pt(13)
    cr = contact.add_run(
        "bobshenruililin@gmail.com  ·  shenrll@connect.hku.hk  ·  "
        "+852 5573 6530  ·  linkedin.com/in/shenruililin"
    )
    set_run_font(cr, size=10)

    heading(doc, "Education")
    head_row(
        doc,
        "The University of Hong Kong",
        "Hong Kong",
        "BASc Global Health and Development, HKUMed · Year 2",
        "2025–2029",
        width,
    )
    bullet(doc, "CGPA 4.09/4.30. St. John’s College (2025–).")
    head_row(
        doc,
        "Po Leung Kuk Choi Kai Yau School",
        "Hong Kong",
        "IBDP 41/45 · IGCSE 8A*, 2A",
        "2019–2025",
        width,
    )
    bullet(
        doc,
        "Academic Scholarships (2022–23, 2024–25). Co-founder, Medical Club (2023–24; membership to 80+).",
    )

    heading(doc, "Selected honours")
    honor_parts(
        doc,
        "Tung and Ngai Foundation Scholarship, 2025–26",
        " — full tuition; living allowance HK$40,000; overseas/Mainland learning subsidy (max HK$80,000); Endeavour Support Fund (up to HK$100,000).",
    )
    honor_parts(doc, "Laidlaw Undergraduate Research and Leadership Programme, 2025–26.")
    honor_parts(
        doc,
        "Martin Scholar",
        ", St. John’s College, The University of Hong Kong, 2025–26.",
    )
    honor_parts(doc, "Tam Wun Tsun HKU Horizons Student Enrichment Award, 2025–26.")
    honor_parts(doc, "MIT Hong Kong Innovation Node Youth Fellowship, 2023.")
    honor_parts(
        doc,
        "IYPT",
        " (Hong Kong): Champion 2022; first runner-up 2021. Hong Kong Young Writers’ Award, Bauhinia Club Award, 2024 (1st/1400+).",
    )

    heading(doc, "Research")
    head_row(
        doc,
        "Laidlaw Scholars Programme, HKU",
        "Hong Kong",
        "Undergraduate research scholar",
        "Jan 2026–present",
        width,
    )
    bullet(
        doc,
        "Heat and cardiovascular admissions among older adults (Hospital Authority data), with Prof. David Bishai, HKU School of Public Health.",
    )
    bullet(
        doc,
        "Forthcoming, Oct 2026: invited speaker at the Global Conference on Environmental Science and Technology (GEST), Valencia; attending the Laidlaw Scholars Annual Conference, London.",
    )
    head_row(
        doc,
        "Hong Kong Observatory and PolyU MicroLARGE Lab",
        "Hong Kong",
        "Research intern, Junior Researcher Mentoring Programme",
        "Feb–Jul 2024",
        width,
    )
    bullet(
        doc,
        "Modelled GraphCast integration into Hong Kong forecasting; atmospheric-rivers identification presented at AGU.",
    )
    head_row(
        doc,
        "HKUST IAS Center for Quantum Technologies",
        "Hong Kong",
        "Research intern, Quantum Computing for Gifted Students Scheme",
        "Jul 2023–Mar 2024",
        width,
    )
    bullet(
        doc,
        "Qiskit models and SpinQ auto-calibration; presented entanglement versus measurement work at physics-department seminars.",
    )
    head_row(
        doc,
        "MIT Hong Kong Innovation Node",
        "Hong Kong",
        "Youth Fellow",
        "Jul–Sep 2023",
        width,
    )
    bullet(
        doc,
        "Prototyped MEDocGPT, an LLM healthcare chatbot and mobile app for early health intervention.",
    )

    heading(doc, "Fieldwork and leadership")
    head_row(
        doc,
        "Wu Zhi Qiao (HKU)",
        "Macha, Gansu",
        "Student Coordinator",
        "May–Jun 2026",
        width,
    )
    bullet(doc, "Coordinated on-site student service in rural health and infrastructure.")
    head_row(doc, "HKU Horizons", "Gannan, Gansu", "Participant", "Mar 2026", width)
    bullet(doc, "Field observation of livelihoods and trust.")
    head_row(
        doc,
        "NEWDAY - Nansen East-West Dialogue Academy",
        "Lillehammer",
        "Participant, Nansen Academy",
        "29 Jul–6 Aug 2026",
        width,
    )
    bullet(doc, "Nine-day residential East-West dialogue (East Asia and Nordics).")
    head_row(
        doc,
        "Hong Kong Laureate Forum",
        "Hong Kong",
        "Forum Ambassador",
        "Sep–Nov 2025",
        width,
    )
    bullet(
        doc,
        "Worked with 20+ Shaw Laureates, young scientists, and the HKLF Secretariat.",
    )
    head_row(
        doc,
        "Asian Spring Program on Rationality",
        "Taoyuan",
        "Fully-funded scholar (1 of 20)",
        "Feb 2025",
        width,
    )
    bullet(
        doc,
        "Ten-day programme in game theory, Bayesian inference, and Fermi estimation.",
    )

    doc.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
