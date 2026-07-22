#!/usr/bin/env python3
"""Generate a 40-minute HKU admissions talk PDF for mainland secondary students.

Sources used (verify on official sites before presenting):
- https://admissions.hku.hk/apply/international-qualifications
- https://www.admissions.hku.hk/zh-hans/apply/mainland
- https://www.hku.hk/mainland
- HKU IAS/NJ General Information (Sept 2026 intake PDF)
Speaker framing from operator docs (Shen Ruililin / Bob).
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parents[1] / "content" / "talks" / "hku-admissions-talk-middle-school.pdf"

# 16:9 slide
W, H = 13.333 * inch, 7.5 * inch

INK = HexColor("#0B1F2A")
TEAL = HexColor("#0F4C5C")
TEAL_SOFT = HexColor("#1A6B7A")
GOLD = HexColor("#C4A35A")
CREAM = HexColor("#F7F3EB")
MUTED = HexColor("#5A6A72")
CARD = HexColor("#E8F0F2")
ACCENT_LINE = HexColor("#D4B978")
WARN = HexColor("#8B3A3A")

FONT = "WQY"
FONT_BOLD = "WQY"  # Micro Hei has one weight; use size/color for hierarchy


def register_fonts() -> None:
    pdfmetrics.registerFont(
        TTFont(FONT, "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc", subfontIndex=0)
    )


def draw_bg(c: canvas.Canvas, variant: str = "plain") -> None:
    if variant == "hero":
        c.setFillColor(INK)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        # soft diagonal wash
        c.setFillColor(Color(0.06, 0.28, 0.34, alpha=0.55))
        path = c.beginPath()
        path.moveTo(W * 0.45, 0)
        path.lineTo(W, 0)
        path.lineTo(W, H)
        path.lineTo(W * 0.62, H)
        path.close()
        c.drawPath(path, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, 0, 10, H, fill=1, stroke=0)
    elif variant == "dark":
        c.setFillColor(TEAL)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, 0, 10, H, fill=1, stroke=0)
    else:
        c.setFillColor(CREAM)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.rect(0, H - 14, W, 14, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, 0, 10, H, fill=1, stroke=0)


def footer(c: canvas.Canvas, page: int, total: int, dark: bool = False) -> None:
    c.setFont(FONT, 9)
    c.setFillColor(HexColor("#A8B5BB") if dark else MUTED)
    c.drawString(36, 18, "港大升学分享 · 内地中学生 · 14:30–15:10")
    c.drawRightString(W - 28, 18, f"{page} / {total}")


def title_block(c: canvas.Canvas, title: str, subtitle: str | None = None, y: float | None = None) -> float:
    y = H - 72 if y is None else y
    c.setFillColor(TEAL)
    c.setFont(FONT, 28)
    c.drawString(48, y, title)
    c.setStrokeColor(ACCENT_LINE)
    c.setLineWidth(2.5)
    c.line(48, y - 14, 220, y - 14)
    if subtitle:
        c.setFillColor(MUTED)
        c.setFont(FONT, 13)
        c.drawString(48, y - 38, subtitle)
        return y - 60
    return y - 36


def bullet(c: canvas.Canvas, x: float, y: float, text: str, size: int = 14, color: Color = INK, max_width: float = 11.5 * inch) -> float:
    c.setFillColor(GOLD)
    c.circle(x + 4, y + 4, 3, fill=1, stroke=0)
    c.setFillColor(color)
    c.setFont(FONT, size)
    # simple wrap
    words = text
    # Chinese: wrap by char count
    line_w = int(max_width / (size * 0.55))
    lines = []
    while len(words) > line_w:
        # prefer break at punctuation / space
        cut = line_w
        for i in range(line_w, max(line_w - 12, 8), -1):
            if words[i] in "，。；、： ）】》 ":
                cut = i + 1
                break
        lines.append(words[:cut])
        words = words[cut:]
    lines.append(words)
    for i, line in enumerate(lines):
        c.drawString(x + 18, y - i * (size + 6), line)
    return y - len(lines) * (size + 6) - 10


def card(c: canvas.Canvas, x: float, y: float, w: float, h: float, title: str, lines: list[str]) -> None:
    c.setFillColor(white)
    c.setStrokeColor(HexColor("#D7E2E6"))
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont(FONT, 14)
    c.drawString(x + 16, y + h - 28, title)
    c.setStrokeColor(ACCENT_LINE)
    c.setLineWidth(2)
    c.line(x + 16, y + h - 36, x + 90, y + h - 36)
    c.setFillColor(INK)
    c.setFont(FONT, 11)
    ty = y + h - 58
    for line in lines:
        c.drawString(x + 16, ty, line)
        ty -= 16


def new_page(c: canvas.Canvas) -> None:
    c.showPage()


def build() -> Path:
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H))
    total = 16

    # 1 Title
    draw_bg(c, "hero")
    c.setFillColor(GOLD)
    c.setFont(FONT, 12)
    c.drawString(48, H - 56, "SIDEQUEST ATLAS · STUDENT TALK")
    c.setFillColor(white)
    c.setFont(FONT, 42)
    c.drawString(48, H - 130, "港大升学：三条路，一个目标")
    c.setFont(FONT, 18)
    c.setFillColor(HexColor("#C9D6DB"))
    c.drawString(48, H - 170, "面向内地初高中同学 · 高考 / IB / A Level")
    c.setFillColor(GOLD)
    c.rect(48, H - 198, 64, 3, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont(FONT, 14)
    c.drawString(48, 120, "讲者：沈睿霖（Bob）")
    c.setFillColor(HexColor("#C9D6DB"))
    c.setFont(FONT, 12)
    c.drawString(48, 96, "香港大学 · BASc Global Health and Development · Year 1")
    c.drawString(48, 76, "时段：14:30–15:10（约 40 分钟）")
    footer(c, 1, total, dark=True)
    new_page(c)

    # 2 Agenda
    draw_bg(c)
    y = title_block(c, "今天一起搞清楚什么", "40 分钟结构 · 留出提问时间")
    items = [
        ("01", "港大是谁，为什么值得认真考虑"),
        ("02", "高考 / IB / A Level：三条申请通道怎么分"),
        ("03", "专业、奖学金与官方资源怎么找"),
        ("04", "一位港大一年级同学的真实路径（讲者）"),
        ("05", "初中阶段现在就能做的准备 + Q&A"),
    ]
    y -= 10
    for num, text in items:
        c.setFillColor(TEAL)
        c.setFont(FONT, 20)
        c.drawString(56, y, num)
        c.setFillColor(INK)
        c.setFont(FONT, 16)
        c.drawString(110, y, text)
        y -= 42
    footer(c, 2, total)
    new_page(c)

    # 3 Why HKU
    draw_bg(c)
    y = title_block(c, "为什么是香港大学？", "官方公开信息 · 排名会变，请以最新官网为准")
    positions = [
        (48, 250),
        (500, 250),
        (48, 55),
        (500, 55),
    ]
    texts = [
        ("世界视野", ["QS 世界大学排名约第 11 位", "（公开排名周期数据，会更新）", "亚洲顶尖综合研究型大学之一"]),
        ("本科选择丰富", ["约 10 个学院 + 多个学院单位", "约 57 个本科课程", "100+ 主修 / 副修组合"]),
        ("学科强项（示例）", ["牙科、教育等常居世界前列", "数据科学与 AI、法律、建筑等", "请查最新 QS Subject 榜单"]),
        ("国际化学习场景", ["英语教学为主的本科环境", "科研、交换、服务机会多", "内地—香港—全球接口"]),
    ]
    for (x, yy), (t, lines) in zip(positions, texts):
        card(c, x, yy, 430, 175, t, lines)
    footer(c, 3, total)
    new_page(c)

    # 4 Three pathways
    draw_bg(c)
    y = title_block(c, "三条升学通道，先分清再发力", "内地同学最常见：高考 · IB · A Level（GCE/IAL）")
    pathways = [
        ("高考 / 港澳台联考", ["通道：内地本科生入学计划", "官网：www.hku.hk/mainland", "与内地统招互不影响", "看重高考总分 + 英语等"]),
        ("IB Diploma", ["通道：国际 / Non-JUPAS", "官网：admissions.hku.hk", "国际资历申请", "看重总分、HL 科目、英语"]),
        ("A Level", ["通道：国际 / Non-JUPAS", "GCE / International A Level", "通常需多科高分成绩", "同样走国际资历页面查标准"]),
    ]
    xs = [48, 360, 672]
    for x, (t, lines) in zip(xs, pathways):
        c.setFillColor(white)
        c.roundRect(x, 90, 290, 380, 10, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.roundRect(x, 430, 290, 40, 8, fill=1, stroke=0)
        # fix rounded top bar visually
        c.rect(x, 430, 290, 20, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(FONT, 14)
        c.drawCentredString(x + 145, 442, t)
        c.setFillColor(INK)
        c.setFont(FONT, 12)
        yy = 390
        for line in lines:
            c.drawString(x + 18, yy, "·  " + line)
            yy -= 36
    footer(c, 4, total)
    new_page(c)

    # 5 Gaokao path
    draw_bg(c)
    y = title_block(c, "通道一：高考 / 内地本科生入学计划", "官方：www.hku.hk/mainland · admissions.hku.hk/zh-hans/apply/mainland")
    bullets = [
        "独立于内地高校统一招生；全国约 31 个省市自治区招生，择优录取（以教育部最新指引为准）。",
        "全部本科专业原则上面向内地招生；新高考省份通常无选科限制（以当年官网说明为准）。",
        "申请步骤：网上填表 → 缴交申请费（港币 600）→ 高考出分后上传成绩。",
        "2026 年度申请截止示例：2026 年 6 月 28 日（请每年复核官网）。",
        "录取综合考虑：高考总成绩与英语、面试（如获邀）、综合学术与非学术素质。",
        "可另报「多元卓越入学计划」争取提前面试 / 加分优惠 / 有条件录取机会。",
    ]
    y = H - 130
    for b in bullets:
        y = bullet(c, 48, y, b, size=13, max_width=12 * inch)
    footer(c, 5, total)
    new_page(c)

    # 6 Multi excellence
    draw_bg(c)
    y = title_block(c, "高考通道加分器：多元卓越入学计划", "先完成内地本科生入学计划报名，再申请本计划")
    left = [
        "适合平时成绩优、竞赛/科创、志愿与领导力、文体特长突出的同学。",
        "选拔流程：材料初审 → 线上面试 → 结果公布。",
        "优秀者或可获加分优惠；特别突出者或可在高考前获有条件录取。",
        "亦可作为部分联合学位 / 特殊计划推荐入口（以官网当年清单为准）。",
    ]
    y = H - 130
    for b in left:
        y = bullet(c, 48, y, b, size=13)
    c.setFillColor(CARD)
    c.roundRect(48, 70, W - 96, 110, 8, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.setFont(FONT, 13)
    c.drawString(68, 150, "时间表示例（2026 入学周期，务必复核官网）")
    c.setFillColor(INK)
    c.setFont(FONT, 11)
    c.drawString(68, 124, "2025-10-06 开放报名 · 2025-12-31 首轮截止 · 2026-01/02 起分批面试")
    c.drawString(68, 104, "2026-03-20 计划截止 · 2026-05 结果公布完毕 · 主计划截止约 2026-06-28")
    c.drawString(68, 84, "录取结果约在 2026-06 下旬至 7 月初陆续发放")
    footer(c, 6, total)
    new_page(c)

    # 7 IB / A Level
    draw_bg(c)
    y = title_block(
        c,
        "通道二 & 三：IB / A Level（国际资历）",
        "官方入口：https://admissions.hku.hk/apply/international-qualifications",
    )
    bullets = [
        "适用：持有 IB、GCE/International A Level 等国际资历的非本地（及部分本地）申请人。",
        "注意：高考（NJCEE）申请人不走此页，应走内地本科生入学计划。",
        "每位申请人一年只可透过一种招生途径递交一份申请；最多可选约 3 个课程志愿。",
        "评审看学术成绩，也可能看面试、个人陈述、推荐信及其他材料；达最低要求≠保证录取。",
        "2026 入学：约 2025-11-26 正午前提交可进第一轮；之后滚动评估至约 2026-08-21 正午。",
        "申请费约港币 600；请在系统中如实填写预测分/实考分，并上传证明文件。",
        "具体课程的预估录取分数线、科目要求、英语要求：请在官网按国家/资历/课程查询。",
    ]
    y = H - 125
    for b in bullets:
        y = bullet(c, 48, y, b, size=12.5, max_width=12 * inch)
    footer(c, 7, total)
    new_page(c)

    # 8 Competitive realism
    draw_bg(c)
    y = title_block(c, "分数怎么看？（不编造「录取线」）", "不同课程、不同年份差异很大——请以官网 Admissions Standards 为准")
    y = H - 140
    for b in [
        "IB：热门课程竞争激烈；公开报道常见竞争区间偏高，但不是本校公布的录取保证线。",
        "A Level：通常需要多科优秀成绩；医学、法律等课程要求通常更高。",
        "高考：没有「省排名固定公式」可在本讲义断言；英语成绩权重高，综合素质重要。",
        "讲者个人参考（仅故事，非标准）：IB 41 → 港大 BASc Global Health and Development。",
        "原则：先选对通道与课程，再对着官网查「Expected Lower Boundary / Subject Requirements」。",
    ]:
        y = bullet(c, 48, y, b, size=13)
    c.setFillColor(WARN)
    c.setFont(FONT, 12)
    c.drawString(48, 70, "任何中介承诺「低分内推 / 免雅思直接录」——港大官方已公开声明为不实信息。")
    footer(c, 8, total)
    new_page(c)

    # 9 Majors
    draw_bg(c)
    y = title_block(c, "专业与学院：先认地图", "完整列表：admissions.hku.hk/programmes/undergraduate-programmes")
    faculties = [
        ("建筑学院", "建筑、测量、景观、城市研究等"),
        ("文学院", "人文、语言、历史、数码人文等"),
        ("经管学院", "工商管理、经济、金融等相关课程"),
        ("牙医学院", "牙医学士等（招生对象以当年为准）"),
        ("教育学院", "教育、语文教育、幼儿与特殊教育等"),
        ("工程学院", "各工程学科与跨学科工程方向"),
        ("法学院", "法学本科及相关路径"),
        ("李嘉诚医学院", "内外全科、生物医学、护理、药学等"),
        ("理学院", "基础科学、跨学科科学等"),
        ("社会科学学院", "社工、心理、政治、社会等"),
    ]
    # two columns
    y = H - 130
    for i, (name, desc) in enumerate(faculties):
        col = i % 2
        row = i // 2
        x = 48 + col * 480
        yy = y - row * 48
        c.setFillColor(TEAL)
        c.setFont(FONT, 13)
        c.drawString(x, yy, "▸ " + name)
        c.setFillColor(MUTED)
        c.setFont(FONT, 11)
        c.drawString(x + 20, yy - 16, desc)
    c.setFillColor(INK)
    c.setFont(FONT, 11)
    c.drawString(48, 55, "另有计算与数据科学、创新、生物医学工程等学院/学院单位课程；亦有与海外名校的联合双学位。")
    footer(c, 9, total)
    new_page(c)

    # 10 Fees scholarships
    draw_bg(c)
    y = title_block(c, "学费、奖学金与生活成本（概览）", "费用以大学最新公布为准；下列为 2026/27 公开文件中的参考数字")
    cards_data = [
        ("非本地学费（参考）", ["非 STEM 学院：约 HK$224,000/年", "STEM 相关：约 HK$249,000/年", "（官方文件注明或待批准）"]),
        ("奖学金", ["入学奖学金：所有申请人自动考虑", "顶尖者或可达学费+住宿+生活津贴", "入学后另有大量绩优奖学金可申"]),
        ("申请与按金", ["国际/内地申请费常见为 HK$600", "非本地录取按金参考约 HK$20,000", "签证需预留数周至约十周时间"]),
    ]
    xs = [48, 360, 672]
    for x, (t, lines) in zip(xs, cards_data):
        card(c, x, 160, 290, 280, t, lines)
    c.setFillColor(MUTED)
    c.setFont(FONT, 11)
    c.drawString(48, 90, "奖学金入口：www.scholarships.hku.hk · 学费生活费请在 admissions 页面「Fees and Scholarships」复核")
    c.drawString(48, 70, "不要把「参考数字」当成报价单；以录取通知书与财务处最新公布为准。")
    footer(c, 10, total)
    new_page(c)

    # 11 Resources / ads
    draw_bg(c)
    y = title_block(c, "官方资源清单（请收藏）", "只信赖港大官网与官方社交媒体，不要走非授权中介")
    links = [
        ("国际资历申请（IB / A Level 等）", "https://admissions.hku.hk/apply/international-qualifications"),
        ("内地高考 / 本科生入学计划", "https://www.hku.hk/mainland"),
        ("内地招生说明（中文）", "https://www.admissions.hku.hk/zh-hans/apply/mainland"),
        ("本科课程列表", "https://admissions.hku.hk/programmes/undergraduate-programmes"),
        ("奖学金", "http://www.scholarships.hku.hk"),
        ("港大主页 / 招生资讯", "https://www.hku.hk  ·  admissions.hku.hk"),
    ]
    y = H - 130
    for name, url in links:
        c.setFillColor(TEAL)
        c.setFont(FONT, 13)
        c.drawString(56, y, name)
        c.setFillColor(INK)
        c.setFont(FONT, 11)
        c.drawString(56, y - 18, url)
        y -= 52
    footer(c, 11, total)
    new_page(c)

    # 12 Anti-agent
    draw_bg(c, "dark")
    c.setFillColor(GOLD)
    c.setFont(FONT, 12)
    c.drawString(48, H - 56, "重要提醒")
    c.setFillColor(white)
    c.setFont(FONT, 28)
    c.drawString(48, H - 110, "直接申请，拒绝「内推神话」")
    points = [
        "港大没有授权中介代招、代录。",
        "没有教授「内推」非本地生的官方机制。",
        "声称低分录取、免标准成绩/语言要求——官方已声明不实。",
        "伪造学历一经证实，可被开除学籍。",
        "申请请直接提交至大学官方系统。",
    ]
    y = H - 170
    for p in points:
        c.setFillColor(GOLD)
        c.circle(60, y + 4, 3.5, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(FONT, 14)
        c.drawString(76, y, p)
        y -= 42
    footer(c, 12, total, dark=True)
    new_page(c)

    # 13 Speaker story
    draw_bg(c)
    y = title_block(c, "讲者路径：一个可参考的样本", "沈睿霖 · 港大一年级 · 不是「标准答案」，是真实时间线")
    story = [
        ("高中", "IB Diploma 41（English A 7；Chinese A 6 + EE A）；长期坚持研究型学习。"),
        ("入学", "港大 BASc Global Health and Development（全球卫生与发展）。"),
        ("一年级", "学年 GPA 4.24 / 4.30；Laidlaw Scholar（热相关心血管入院研究）。"),
        ("服务与教学", "港大医学院朋辈导师；中学 STEM 助教；内地乡村服务（无止桥等）。"),
        ("下一步", "国际学术会议分享；沪港学习网络；公共卫生与跨境协作志向。"),
    ]
    y = H - 125
    for label, text in story:
        c.setFillColor(TEAL)
        c.setFont(FONT, 13)
        c.drawString(56, y, label)
        c.setFillColor(INK)
        c.setFont(FONT, 12)
        # wrap
        words = text
        max_chars = 48
        lines = []
        while len(words) > max_chars:
            cut = max_chars
            for i in range(max_chars, max_chars - 10, -1):
                if words[i] in "，。；、： ":
                    cut = i + 1
                    break
            lines.append(words[:cut])
            words = words[cut:]
        lines.append(words)
        for i, line in enumerate(lines):
            c.drawString(150, y - i * 16, line)
        y -= 16 * len(lines) + 22
    c.setFillColor(MUTED)
    c.setFont(FONT, 11)
    c.drawString(56, 55, "启示：成绩是门槛，持续的问题意识、服务与表达能力，决定你能不能在港大真正长大。")
    footer(c, 13, total)
    new_page(c)

    # 14 What middle schoolers can do now
    draw_bg(c)
    y = title_block(c, "初中现在就能做的五件事", "升学是长跑：现在选方向，比现在刷焦虑更重要")
    actions = [
        ("1. 语言底座", "把英语当成日常工具：阅读、口头表达、写作一起练。"),
        ("2. 认清赛道", "家庭一起讨论：未来更可能高考、IB 还是 A Level？三条路的时间表不同。"),
        ("3. 兴趣深挖", "选 1–2 个真正想追问的主题（科学、社会、设计、健康……）做长期项目。"),
        ("4. 服务与领导", "班级、社团、社区志愿——港大看综合素质，不只看分数。"),
        ("5. 信息素养", "只收藏官网；学会自己查课程要求，不被谣言带跑。"),
    ]
    y = H - 125
    for title, body in actions:
        c.setFillColor(GOLD)
        c.setFont(FONT, 14)
        c.drawString(56, y, title)
        c.setFillColor(INK)
        c.setFont(FONT, 13)
        c.drawString(190, y, body)
        y -= 48
    footer(c, 14, total)
    new_page(c)

    # 15 Timeline for session
    draw_bg(c)
    y = title_block(c, "本场时间分配（14:30–15:10）", "讲者可按现场节奏微调")
    slots = [
        ("14:30–14:35", "开场与目标"),
        ("14:35–14:45", "港大画像 + 三条通道总览"),
        ("14:45–14:55", "高考 / 多元卓越 & IB·A Level 要点"),
        ("14:55–15:02", "专业、奖学金、官方资源"),
        ("15:02–15:06", "讲者样本路径 + 初中行动清单"),
        ("15:06–15:10", "提问与资源回顾"),
    ]
    y = H - 130
    for t, desc in slots:
        c.setFillColor(TEAL)
        c.roundRect(56, y - 8, 160, 28, 6, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(FONT, 12)
        c.drawCentredString(136, y, t)
        c.setFillColor(INK)
        c.setFont(FONT, 14)
        c.drawString(240, y, desc)
        y -= 52
    footer(c, 15, total)
    new_page(c)

    # 16 Close / Q&A
    draw_bg(c, "hero")
    c.setFillColor(GOLD)
    c.setFont(FONT, 12)
    c.drawString(48, H - 56, "Q & A")
    c.setFillColor(white)
    c.setFont(FONT, 36)
    c.drawString(48, H - 130, "把问题带来，把官网带走")
    c.setFillColor(HexColor("#C9D6DB"))
    c.setFont(FONT, 15)
    c.drawString(48, H - 175, "记住三句话：")
    tips = [
        "选对通道（高考 vs 国际资历）",
        "只信官方（admissions.hku.hk / hku.hk/mainland）",
        "成绩之外，还要有持续的兴趣与行动",
    ]
    y = H - 220
    for tip in tips:
        c.setFillColor(GOLD)
        c.circle(60, y + 4, 3.5, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(FONT, 14)
        c.drawString(76, y, tip)
        y -= 36
    c.setFillColor(HexColor("#C9D6DB"))
    c.setFont(FONT, 12)
    c.drawString(48, 110, "讲者：沈睿霖（Bob）· HKU GHAD Year 1")
    c.drawString(48, 88, "国际资历：admissions.hku.hk/apply/international-qualifications")
    c.drawString(48, 68, "内地高考：www.hku.hk/mainland")
    footer(c, 16, total, dark=True)

    c.save()
    return OUT


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path} ({path.stat().st_size} bytes)")
