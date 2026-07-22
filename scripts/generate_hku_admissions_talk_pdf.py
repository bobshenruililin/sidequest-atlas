#!/usr/bin/env python3
"""Generate a simple, presentation-style HKU student talk PDF.

The deck is intentionally concise: 12 widescreen slides for a ~40 minute talk.
Admissions details that can change are deferred to the two official URLs shown
on the resources slide.
"""

from __future__ import annotations

from pathlib import Path
from typing import Final

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT: Final = Path(__file__).resolve().parents[1]
OUT: Final = ROOT / "content" / "talks" / "hku-admissions-talk-middle-school.pdf"

# 16:9 widescreen canvas (960 × 540 pt).
W: Final = 13.333 * inch
H: Final = 7.5 * inch

# HKU-inspired modern palette: deep ink/green, mineral white, and restrained gold.
INK: Final = HexColor("#071E22")
GREEN: Final = HexColor("#075A4A")
GREEN_2: Final = HexColor("#0B7561")
GOLD: Final = HexColor("#D7AE55")
GOLD_LIGHT: Final = HexColor("#F1DCA5")
MIST: Final = HexColor("#F4F7F6")
PALE_GREEN: Final = HexColor("#DDECE7")
SLATE: Final = HexColor("#40585C")
MID: Final = HexColor("#789092")
HAIRLINE: Final = HexColor("#C8D7D3")

FONT: Final = "WQY"
FONT_PATH: Final = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"

SLIDE_TITLES: Final = [
    "去港大，走哪条路？",
    "你好，我是 Bob",
    "我的路径，正在转弯",
    "为什么港大？",
    "港大的优势：把资源变成行动",
    "我的港大生活，不只上课",
    "高考生：认准独立通道",
    "高考路径：四步就够",
    "专业地图：从问题出发",
    "怎么选专业？问三次为什么",
    "只收藏这两个入口",
    "把问题带来，把方向带走",
]


def register_fonts() -> None:
    """Register a Chinese font available in the build environment."""
    pdfmetrics.registerFont(TTFont(FONT, FONT_PATH, subfontIndex=0))


def text(
    c: canvas.Canvas,
    x: float,
    y: float,
    value: str,
    size: float,
    color: Color = INK,
    *,
    align: str = "left",
) -> None:
    """Draw one deliberately short line of text."""
    c.setFont(FONT, size)
    c.setFillColor(color)
    if align == "center":
        c.drawCentredString(x, y, value)
    elif align == "right":
        c.drawRightString(x, y, value)
    else:
        c.drawString(x, y, value)


def dark_bg(c: canvas.Canvas, *, accent: str = "orbit") -> None:
    """Paint a full-bleed dark hero background with geometric depth."""
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    c.saveState()
    c.setFillAlpha(0.8)
    c.setFillColor(GREEN)
    c.circle(W - 90, H - 55, 220, fill=1, stroke=0)
    c.restoreState()

    if accent == "orbit":
        c.saveState()
        c.setStrokeAlpha(0.45)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.5)
        c.circle(W - 120, H - 78, 150, fill=0, stroke=1)
        c.circle(W - 120, H - 78, 190, fill=0, stroke=1)
        c.restoreState()
    elif accent == "steps":
        c.saveState()
        c.setFillAlpha(0.22)
        c.setFillColor(GOLD)
        for i in range(5):
            c.rect(W - 330 + i * 62, 0, 42, 165 + i * 62, fill=1, stroke=0)
        c.restoreState()

    c.setFillColor(GOLD)
    c.rect(0, 0, 10, H, fill=1, stroke=0)


def light_bg(c: canvas.Canvas, page: int) -> None:
    """Paint a crisp light slide with subtle editorial geometry."""
    c.setFillColor(MIST)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(0, 0, 10, H, fill=1, stroke=0)

    c.saveState()
    c.setFillAlpha(0.7)
    c.setFillColor(PALE_GREEN)
    c.circle(W - 30, H + 20, 135, fill=1, stroke=0)
    c.restoreState()

    text(c, W - 42, H - 42, f"{page:02d}", 14, GREEN, align="right")


def footer(c: canvas.Canvas, page: int, *, dark: bool = False) -> None:
    color = HexColor("#9DB2B2") if dark else MID
    text(c, 42, 20, "HKU STUDENT TALK · 14:30–15:10", 9, color)
    text(c, W - 38, 20, f"{page} / {len(SLIDE_TITLES)}", 9, color, align="right")


def light_title(c: canvas.Canvas, page: int, title: str, kicker: str) -> None:
    light_bg(c, page)
    text(c, 50, H - 60, kicker, 12, GREEN)
    text(c, 50, H - 112, title, 38, INK)
    c.setFillColor(GOLD)
    c.roundRect(50, H - 132, 76, 5, 2.5, fill=1, stroke=0)


def dark_title(c: canvas.Canvas, title: str, kicker: str, *, accent: str = "orbit") -> None:
    dark_bg(c, accent=accent)
    text(c, 50, H - 58, kicker, 12, GOLD)
    text(c, 50, H - 112, title, 38, white)
    c.setFillColor(GOLD)
    c.roundRect(50, H - 132, 76, 5, 2.5, fill=1, stroke=0)


def arrow(c: canvas.Canvas, x1: float, y: float, x2: float, color: Color = GOLD) -> None:
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(3)
    c.line(x1, y, x2, y)
    p = c.beginPath()
    p.moveTo(x2, y)
    p.lineTo(x2 - 11, y + 7)
    p.lineTo(x2 - 11, y - 7)
    p.close()
    c.drawPath(p, fill=1, stroke=0)


def slide_01(c: canvas.Canvas) -> None:
    dark_bg(c)
    text(c, 50, H - 58, "HKU · STUDENT TALK", 12, GOLD)
    text(c, 50, H - 150, "去港大，", 48, white)
    text(c, 50, H - 212, "走哪条路？", 48, white)
    c.setFillColor(GOLD)
    c.roundRect(50, H - 240, 94, 6, 3, fill=1, stroke=0)
    text(c, 50, H - 280, "高考为主 · IB / A Level 简要补充", 22, GOLD_LIGHT)

    c.saveState()
    c.setFillAlpha(0.13)
    text(c, W - 60, 174, "HKU", 100, white, align="right")
    c.restoreState()

    text(c, 50, 105, "沈睿李麟 Bob", 22, white)
    text(c, 50, 76, "BASc Global Health and Development → GLaw", 16, HexColor("#B9CDCB"))
    footer(c, 1, dark=True)


def slide_02(c: canvas.Canvas) -> None:
    light_title(c, 2, "你好，我是 Bob", "01 · 自我背景")

    text(c, 52, 324, "沈睿李麟", 44, GREEN)
    text(c, 54, 285, "HKU GHAD · Year 1", 20, SLATE)
    text(c, 54, 249, "IB 41 入学", 23, INK)

    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1.5)
    c.line(390, 130, 390, 355)

    text(c, 435, 332, "4.24 / 4.30", 38, GOLD)
    text(c, 438, 300, "GPA", 16, SLATE)
    text(c, 438, 250, "Laidlaw Scholar", 23, INK)
    text(c, 438, 211, "朋辈导师 · STEM TA", 21, INK)
    text(c, 438, 172, "内地乡村服务", 21, INK)

    text(c, 52, 78, "这是一个真实样本，不是唯一模板。", 20, GREEN)
    footer(c, 2)


def slide_03(c: canvas.Canvas) -> None:
    dark_title(c, "我的路径，正在转弯", "02 · MY PATH", accent="steps")

    nodes = [
        (80, "IB 41", "入学起点"),
        (366, "GHAD", "全球卫生与发展"),
        (652, "GLaw", "正在转入"),
    ]
    y = 270
    for i, (x, headline, caption) in enumerate(nodes):
        c.setFillColor(GOLD if i == 2 else GREEN_2)
        c.circle(x + 78, y, 58, fill=1, stroke=0)
        text(c, x + 78, y - 9, headline, 26 if i else 23, white, align="center")
        text(c, x + 78, y - 100, caption, 19, GOLD_LIGHT if i == 2 else white, align="center")
        if i < len(nodes) - 1:
            arrow(c, x + 148, y, x + 260)

    text(c, 50, 75, "转向不是失败，是在大学里验证兴趣。", 22, white)
    footer(c, 3, dark=True)


def slide_04(c: canvas.Canvas) -> None:
    light_title(c, 4, "为什么港大？", "03 · WHY HKU")

    text(c, 52, 315, "因为选择", 38, SLATE)
    text(c, 52, 252, "仍然打开。", 54, GREEN)

    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1.3)
    c.line(520, 145, 520, 350)

    lines = [
        ("中国语境", "×", "国际课堂"),
        ("专业深度", "×", "跨学科空间"),
        ("校园学习", "×", "真实城市"),
    ]
    y = 325
    for left, mark, right in lines:
        text(c, 575, y, left, 22, INK)
        text(c, 710, y, mark, 18, GOLD)
        text(c, 754, y, right, 22, INK)
        y -= 73

    text(c, 52, 75, "大学不是终点；它应该放大你的可能性。", 20, SLATE)
    footer(c, 4)


def slide_05(c: canvas.Canvas) -> None:
    light_title(c, 5, "港大的优势：把资源变成行动", "04 · HKU ADVANTAGES")

    columns = [
        ("课堂", "英语学习环境", "和不同背景的人一起思考"),
        ("专业", "综合大学", "主修之外仍能跨界"),
        ("机会", "本科研究", "导师、项目、交换与服务"),
        ("位置", "香港", "连接内地与全球的现场"),
    ]
    x0 = 52
    col_w = 215
    for i, (label, headline, detail) in enumerate(columns):
        x = x0 + i * col_w
        if i:
            c.setStrokeColor(HAIRLINE)
            c.setLineWidth(1)
            c.line(x - 20, 126, x - 20, 350)
        text(c, x, 332, f"0{i + 1}", 16, GOLD)
        text(c, x, 278, label, 34, GREEN)
        text(c, x, 222, headline, 21, INK)
        text(c, x, 184, detail, 16, SLATE)

    text(c, 52, 78, "资源不会自动变成成长：要主动问、主动试、主动做。", 20, GREEN)
    footer(c, 5)


def slide_06(c: canvas.Canvas) -> None:
    dark_title(c, "我的港大生活，不只上课", "05 · SCHOOL LIFE")

    items = [
        ("学", "GHAD 课堂", 88, 286),
        ("研", "Laidlaw 研究", 316, 222),
        ("带", "朋辈导师 · STEM TA", 544, 286),
        ("走", "内地乡村服务", 772, 222),
    ]
    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.line(118, 254, 802, 254)

    for i, (verb, caption, x, y) in enumerate(items):
        c.setFillColor(GOLD if i % 2 else GREEN_2)
        c.circle(x, y, 48, fill=1, stroke=0)
        text(c, x, y - 13, verb, 36, white, align="center")
        caption_y = y + 76 if y < 250 else y - 88
        text(c, x, caption_y, caption, 18, white, align="center")

    text(c, 50, 75, "一周里，学习、研究、带人、行动同时发生。", 22, GOLD_LIGHT)
    footer(c, 6, dark=True)


def slide_07(c: canvas.Canvas) -> None:
    light_title(c, 7, "高考生：认准独立通道", "06 · GAOKAO PATHWAY")

    text(c, 52, 332, "港大内地本科生", 38, GREEN)
    text(c, 52, 282, "入学计划", 38, GREEN)

    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1.5)
    c.line(425, 145, 425, 350)

    points = [
        "在港大官网独立报名",
        "以高考成绩、英语等综合评审",
        "部分申请人会获邀面试",
        "与内地统招并行*",
    ]
    y = 332
    for point in points:
        c.setFillColor(GOLD)
        c.circle(485, y + 7, 5, fill=1, stroke=0)
        text(c, 508, y, point, 22, INK)
        y -= 59

    text(c, 52, 76, "* 招生范围、要求与安排以申请当年官方政策为准。", 16, SLATE)
    footer(c, 7)


def slide_08(c: canvas.Canvas) -> None:
    light_title(c, 8, "高考路径：四步就够", "07 · THE PROCESS")

    steps = [
        ("1", "定方向", "看课程与要求"),
        ("2", "官网报名", "填资料和志愿"),
        ("3", "高考之后", "上传成绩 · 留意面试"),
        ("4", "收到结果", "比较课程与成本"),
    ]
    y = 260
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(4)
    c.line(115, y, W - 115, y)

    for number, heading, caption in steps:
        x = 115 + (int(number) - 1) * 244
        c.setFillColor(GREEN if number != "4" else GOLD)
        c.circle(x, y, 36, fill=1, stroke=0)
        text(c, x, y - 10, number, 25, white, align="center")
        text(c, x, 185, heading, 22, INK, align="center")
        text(c, x, 151, caption, 16, SLATE, align="center")

    c.setFillColor(PALE_GREEN)
    c.roundRect(52, 64, W - 104, 48, 10, fill=1, stroke=0)
    text(c, W / 2, 78, "不相信「保录」「内推」；不猜所谓固定分数线。", 19, GREEN, align="center")
    footer(c, 8)


def slide_09(c: canvas.Canvas) -> None:
    light_title(c, 9, "专业地图：从问题出发", "08 · MAJORS & FACULTIES")

    groups = [
        ("医健", "医学 · 牙医 · 护理", "药学 · 全球卫生"),
        ("法政", "法学 · 政治", "国际关系 · 社会政策"),
        ("经管", "经济 · 金融", "会计 · 商业分析"),
        ("工程计算", "工程 · 计算机", "数据科学 · AI"),
        ("科学", "生物 · 化学", "环境 · 跨学科科学"),
        ("人文创意", "文学 · 语言 · 教育", "建筑 · 城市 · 社科"),
    ]
    card_w = 266
    card_h = 117
    gap_x = 28
    x0 = 52
    rows_y = [255, 116]

    for i, (label, line_1, line_2) in enumerate(groups):
        col = i % 3
        row = i // 3
        x = x0 + col * (card_w + gap_x)
        y = rows_y[row]
        c.setFillColor(white)
        c.setStrokeColor(HAIRLINE)
        c.setLineWidth(1)
        c.roundRect(x, y, card_w, card_h, 12, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.roundRect(x, y, 8, card_h, 4, fill=1, stroke=0)
        text(c, x + 27, y + 77, label, 24, GREEN)
        text(c, x + 27, y + 45, line_1, 16, INK)
        text(c, x + 27, y + 20, line_2, 16, SLATE)

    text(c, 52, 70, "课程名称与科目要求，请按申请年份在官网复核。", 16, SLATE)
    footer(c, 9)


def slide_10(c: canvas.Canvas) -> None:
    light_title(c, 10, "怎么选专业？问三次为什么", "09 · CHOOSING A MAJOR")

    questions = [
        ("01", "我愿意长期研究什么问题？"),
        ("02", "这个课程每天怎么学？"),
        ("03", "未来想在哪种场景工作？"),
    ]
    y = 333
    for number, question in questions:
        text(c, 55, y, number, 19, GOLD)
        text(c, 126, y - 3, question, 25, INK)
        c.setStrokeColor(HAIRLINE)
        c.setLineWidth(1)
        c.line(55, y - 25, W - 55, y - 25)
        y -= 75

    c.setFillColor(GREEN)
    c.roundRect(52, 58, W - 104, 78, 12, fill=1, stroke=0)
    text(c, 78, 95, "GHAD  →  GLaw", 25, GOLD_LIGHT)
    text(c, W - 78, 95, "验证之后，允许自己转向。", 20, white, align="right")
    footer(c, 10)


def slide_11(c: canvas.Canvas) -> None:
    dark_title(c, "只收藏这两个入口", "10 · OFFICIAL RESOURCES")

    text(c, 54, 335, "高考 / 内地", 20, GOLD)
    text(c, 54, 292, "www.hku.hk/mainland", 28, white)
    c.setStrokeColor(HexColor("#376761"))
    c.setLineWidth(1.5)
    c.line(54, 260, W - 88, 260)

    text(c, 54, 210, "IB / A Level", 20, GOLD)
    text(
        c,
        54,
        166,
        "https://admissions.hku.hk/apply/international-qualifications",
        20,
        white,
    )
    text(c, 54, 76, "课程、材料、截止日期：以申请当年官网为准。", 19, GOLD_LIGHT)
    footer(c, 11, dark=True)


def slide_12(c: canvas.Canvas) -> None:
    dark_bg(c)
    text(c, 50, H - 58, "Q & A", 13, GOLD)
    text(c, 50, H - 132, "把问题带来，", 42, white)
    text(c, 50, H - 186, "把方向带走。", 42, white)

    questions = [
        "我为什么想去港大？",
        "我想解决什么问题？",
        "我的下一步是什么？",
    ]
    y = 273
    for i, question in enumerate(questions, start=1):
        text(c, 54, y, f"0{i}", 17, GOLD)
        text(c, 104, y - 2, question, 22, white)
        y -= 54

    text(c, 50, 68, "沈睿李麟 Bob · HKU GHAD → GLaw", 17, HexColor("#B9CDCB"))
    footer(c, 12, dark=True)


SLIDES = [
    slide_01,
    slide_02,
    slide_03,
    slide_04,
    slide_05,
    slide_06,
    slide_07,
    slide_08,
    slide_09,
    slide_10,
    slide_11,
    slide_12,
]


def build() -> Path:
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("港大升学分享：去港大，走哪条路？")
    c.setAuthor("沈睿李麟 (Bob)")
    c.setSubject("面向内地中学生的港大升学分享")

    for i, draw_slide in enumerate(SLIDES):
        draw_slide(c)
        if i < len(SLIDES) - 1:
            c.showPage()

    c.save()
    return OUT


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path} ({len(SLIDES)} slides, {path.stat().st_size} bytes)")
