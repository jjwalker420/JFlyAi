#!/usr/bin/env python3
"""Renders The Vision deck as a polished landscape PDF (mirrors the pptx)."""
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import Paragraph

W, H = 960.0, 540.0  # 13.333 x 7.5 inches at 72 dpi (16:9)

INK    = "#14304A"
ACCENT = "#C8772E"
CREAM  = "#FAF7F2"
SAND   = "#ECE3D6"
SAND2  = "#D8C6AC"
SLATE  = "#5B6B7A"
WHITE  = "#FFFFFF"
DEEP   = "#0E2439"
PANEL  = "#1B3B57"
MID    = "#2A4A63"

c = canvas.Canvas("The-Vision.pdf", pagesize=(W, H))


def IN(v):
    return v * 72.0


def rect(x, y, w, h, color):
    c.setFillColor(HexColor(color)); c.setStrokeColor(HexColor(color))
    c.rect(IN(x), H - IN(y) - IN(h), IN(w), IN(h), fill=1, stroke=0)


def para(x, ytop, w, html, size, color, bold=False, align=TA_LEFT, leading=None):
    style = ParagraphStyle(
        "s", fontName=("Helvetica-Bold" if bold else "Helvetica"),
        fontSize=size, leading=leading or size * 1.16,
        textColor=HexColor(color), alignment=align)
    p = Paragraph(html, style)
    aw, ah = p.wrap(IN(w), 2000)
    p.drawOn(c, IN(x), H - IN(ytop) - ah)
    return ah / 72.0


def kicker(label, num):
    rect(0.9, 0.85, 0.45, 0.12, ACCENT)
    para(0.9, 1.0, 9.0, label.upper(), 13, ACCENT, bold=True)
    para(0.9, 6.9, 6.0, "Your Documents Business", 11, SLATE)
    para(W / 72 - 1.5, 6.9, 0.9, num, 12, SLATE, align=TA_RIGHT)


def newpage():
    c.showPage()


# 1. Title
rect(0, 0, 13.333, 7.5, DEEP)
rect(0.9, 2.35, 0.9, 0.16, ACCENT)
para(0.9, 1.2, 11, "A BUSINESS BUILT FOR YOU", 15, ACCENT, bold=True)
para(0.9, 2.7, 11.5, "Turn what you already", 50, WHITE, bold=True, leading=54)
para(0.9, 3.45, 11.5, "know into work you can", 50, WHITE, bold=True, leading=54)
para(0.9, 4.2, 11.5, "do from home.", 50, ACCENT, bold=True, leading=54)
para(0.9, 5.7, 11, "Prepared for Mark Strazisar", 18, WHITE)
para(0.9, 6.25, 11, "25 years of hospitality, finally on your terms.", 15, SLATE)
newpage()

# 2. One sentence
rect(0, 0, 13.333, 7.5, CREAM)
kicker("The idea", "2")
para(0.9, 1.45, 11.5, "The business, in one sentence.", 40, INK, bold=True)
rect(0.9, 3.0, 11.5, 2.4, WHITE)
rect(0.9, 3.0, 0.14, 2.4, ACCENT)
para(1.45, 3.35, 10.6,
     'You help busy restaurant groups turn what lives in their best people\'s '
     'heads into clear written playbooks, so every location runs the same and '
     'every new opening starts from a <b>proven plan instead of a blank page.</b>',
     25, INK, leading=33)
para(0.9, 5.95, 11, "No cooking. No floor. No clock. Just your knowledge, written down.", 15, SLATE)
newpage()

# 3. Your day
rect(0, 0, 13.333, 7.5, CREAM)
kicker("Your day", "3")
para(0.9, 1.45, 11.5, "What your day actually looks like.", 40, INK, bold=True)
steps = [
    ("1", "Talk", "Open Claude and talk for about ten minutes. Explain how a task really gets done, the way you would tell a new manager."),
    ("2", "Review", "Claude writes a clean draft while you talk. You read it and fix anything that is not how you really do it."),
    ("3", "Save", "When it sounds like you, save it. That is one finished, sellable document. You are done for the day if you want."),
]
cw, gap, x0, y0, ch = 3.55, 0.35, 0.9, 3.0, 3.0
for i, (n, t, d) in enumerate(steps):
    x = x0 + i * (cw + gap)
    rect(x, y0, cw, ch, WHITE)
    rect(x, y0, cw, 0.12, ACCENT)
    para(x + 0.35, y0 + 0.35, cw - 0.7, n, 40, SAND, bold=True)
    para(x + 0.35, y0 + 1.05, cw - 0.7, t, 23, INK, bold=True)
    para(x + 0.35, y0 + 1.65, cw - 0.7, d, 13.5, SLATE, leading=16)
para(0.9, 6.35, 11, "That is the whole rhythm. Talk, review, save. You stay in charge of every word.", 14, INK)
newpage()

# 4. Why you
rect(0, 0, 13.333, 7.5, CREAM)
kicker("Why you", "4")
para(0.9, 1.45, 11.5, "You have already built", 40, INK, bold=True, leading=44)
para(0.9, 2.18, 11.5, "the thing you will sell.", 40, INK, bold=True, leading=44)
pts = [
    "Around 15 concepts built and operated: restaurants, bars, lounges, nightclubs, a coffee shop, a family fun center.",
    "Owner, Chief Operating Officer, and Vice President of Operations.",
    "You wrote the training manuals, the safety procedures, and the onboarding programs yourself.",
    "You took Beta Nightclub to number one in North America and doubled sales at SUTRA Lounge.",
    "You ran the P&Ls and mentored the general managers who ran your floors.",
]
y = 3.25
for p in pts:
    rect(0.95, y + 0.07, 0.22, 0.22, ACCENT)
    para(1.45, y, 11.0, p, 16.5, INK, leading=19)
    y += 0.75
para(0.9, 6.95, 11.5, "This is not a new career. It is the work you have always been great at.", 14, SLATE)
newpage()

# 5. The problem
rect(0, 0, 13.333, 7.5, CREAM)
kicker("The opportunity", "5")
para(0.9, 1.45, 11.5, "The problem every growing", 40, INK, bold=True, leading=44)
para(0.9, 2.18, 11.5, "group has, and you solve.", 40, INK, bold=True, leading=44)
probs = [
    ("Training drifts", "A server learns one way at one spot and a different way at another. The brand feels different depending on the door you walk in."),
    ("Knowledge walks out", "The real playbook lives in your best people's heads. When they leave, it leaves with them."),
    ("Every opening from scratch", "A group that keeps opening rebuilds training and checklists each time, instead of pulling a proven playbook off the shelf."),
]
cw, gap, x0, y0, ch = 3.55, 0.35, 0.9, 3.2, 2.9
for i, (t, d) in enumerate(probs):
    x = x0 + i * (cw + gap)
    rect(x, y0, cw, ch, WHITE)
    rect(x, y0, 0.12, ch, ACCENT)
    para(x + 0.4, y0 + 0.4, cw - 0.75, t, 19, INK, bold=True, leading=22)
    para(x + 0.4, y0 + 1.35, cw - 0.75, d, 13.5, SLATE, leading=16.5)
para(0.9, 6.45, 11.5, "Your lane is floor operations. You make the knowledge into documents anyone can use.", 14, INK)
newpage()

# 6. What you sell
rect(0, 0, 13.333, 7.5, CREAM)
kicker("The offer", "6")
para(0.9, 1.45, 11.5, "What you sell.", 40, INK, bold=True)
fams = [
    ("Operations core", "Opening and closing, cash handling, cleaning, inventory, food safety, emergency procedures, manager checklists."),
    ("Employee and training", "Onboarding, server and bartender and host manuals, steps of service, menu knowledge, coaching."),
    ("Standards and scaling", "Brand standards, audits, recipe specs, and the flagship: the new location opening playbook."),
]
cw, gap, x0, y0, ch = 3.55, 0.35, 0.9, 2.9, 2.9
for i, (t, d) in enumerate(fams):
    x = x0 + i * (cw + gap)
    rect(x, y0, cw, ch, WHITE)
    rect(x, y0, cw, 0.12, ACCENT)
    para(x + 0.38, y0 + 0.45, cw - 0.7, t, 18.5, INK, bold=True, leading=21)
    para(x + 0.38, y0 + 1.35, cw - 0.7, d, 13.5, SLATE, leading=16.5)
para(0.9, 6.2, 11.5, "Sell one document, a package, or a full system. Sell it once, or keep it current for a monthly fee.", 14, INK)
newpage()

# 7. Flagship
rect(0, 0, 13.333, 7.5, DEEP)
rect(0.9, 0.85, 0.45, 0.12, ACCENT)
para(0.9, 1.0, 9, "YOUR FLAGSHIP", 13, ACCENT, bold=True)
para(W / 72 - 1.5, 6.9, 0.9, "7", 12, SLATE, align=TA_RIGHT)
para(0.9, 1.5, 11.5, "The new location", 40, WHITE, bold=True, leading=44)
para(0.9, 2.23, 11.5, "opening playbook.", 40, ACCENT, bold=True, leading=44)
para(0.9, 3.2, 11.3,
     "Most groups rebuild every opening from a blank page. You give them one "
     "proven plan they run every time. A countdown timeline, build sheets, the "
     "hiring and training calendar, punch lists, and the soft opening plan.",
     17, WHITE, leading=24)
rect(0.9, 5.0, 11.5, 1.4, PANEL)
rect(0.9, 5.0, 0.14, 1.4, ACCENT)
para(1.4, 5.45, 10.8,
     'It turns every opening from a scramble into a routine. '
     '<font color="%s"><b>Lead with this.</b></font>' % ACCENT, 17, WHITE)
newpage()

# 8. Money
rect(0, 0, 13.333, 7.5, CREAM)
kicker("The money", "8")
para(0.9, 1.45, 11.5, "What the money looks like.", 40, INK, bold=True)
ways = [
    ("Per document", "$150 to $750", "Each finished document. Great for starting small.", False),
    ("Monthly retainer", "$3,000 / month", "Recommended. A flat fee for the build period, then $1,000 a month to keep it current. Steady income, protected on slow weeks.", True),
    ("Project fee", "$18k to $25k", "One fixed price for the full system, paid in milestones.", False),
]
cw, gap, x0, y0, ch = 3.55, 0.35, 0.9, 2.85, 2.95
for i, (t, price, d, rec) in enumerate(ways):
    x = x0 + i * (cw + gap)
    rect(x, y0, cw, ch, INK if rec else WHITE)
    rect(x, y0, cw, 0.12, ACCENT)
    tcol = WHITE if rec else INK
    scol = SAND if rec else SLATE
    if rec:
        para(x + 0.38, y0 + 0.28, cw - 0.7, "RECOMMENDED", 11, ACCENT, bold=True)
    para(x + 0.38, y0 + 0.6, cw - 0.7, t, 17, tcol, bold=True)
    para(x + 0.38, y0 + 1.05, cw - 0.7, price, 24, ACCENT, bold=True)
    para(x + 0.38, y0 + 1.75, cw - 0.7, d, 12.5, scol, leading=15)
para(0.9, 6.25, 11.6,
     'An outside firm would charge this group <font color="%s"><b>$30,000 to '
     '$75,000 or more</b></font> to build the same system. You already know '
     'their floors, so you are the better fit and still a bargain.' % ACCENT,
     14, INK, leading=18)
newpage()

# 9. 30 day ramp
rect(0, 0, 13.333, 7.5, CREAM)
kicker("The first 30 days", "9")
para(0.9, 1.45, 11.5, "Your first month, one step at a time.", 40, INK, bold=True)
weeks = [
    ("Week 1", "Set up Claude. Finish one sample document.", SAND, INK),
    ("Week 2", "Finish two or three more. Shape your pitch.", SAND2, INK),
    ("Week 3", "Have the friendly conversation with the group.", MID, WHITE),
    ("Week 4", "Land the arrangement. Start the opening playbook.", INK, WHITE),
]
baseY = 6.1
heights = [1.4, 2.0, 2.6, 3.2]
cw, gap, x0 = 2.7, 0.45, 1.0
last_x = x0
for i, (t, d, col, tcol) in enumerate(weeks):
    x = x0 + i * (cw + gap)
    last_x = x
    h = heights[i]
    y = baseY - h
    rect(x, y, cw, h, col)
    rect(x, y, cw, 0.1, ACCENT)
    para(x + 0.25, y + 0.22, cw - 0.5, t, 17, tcol, bold=True)
    para(x + 0.25, y + 0.72, cw - 0.5, d, 12, tcol, leading=14.5)
rect(x0, baseY, (cw + gap) * 3 + cw, 0.05, SLATE)
para(0.9, 6.45, 11.5, "Progress is measured in documents finished, not hours. Rest days are built in.", 14, SLATE)
newpage()

# 10. Health
rect(0, 0, 13.333, 7.5, CREAM)
kicker("On your terms", "10")
para(0.9, 1.45, 11.5, "Built around your life,", 40, INK, bold=True, leading=44)
para(0.9, 2.18, 11.5, "not the other way around.", 40, INK, bold=True, leading=44)
pts = [
    "Work in short bursts. Twenty good minutes moves a document forward.",
    "Stack the easy days. Get ahead when you feel strong, rest when you do not.",
    "Rest the hard days with no guilt. The work waits. It does not expire.",
    "On a retainer, a slow week costs you nothing. You are paid for finished work, not hours.",
]
y = 3.3
for p in pts:
    rect(0.95, y + 0.06, 0.22, 0.22, ACCENT)
    para(1.45, y, 11.0, p, 16.5, INK, leading=19)
    y += 0.78
para(0.9, 6.7, 11.5, "You built businesses that ran while you slept. This one runs around your health.", 14, SLATE)
newpage()

# 11. Closing
rect(0, 0, 13.333, 7.5, DEEP)
rect(0.9, 2.5, 0.9, 0.16, ACCENT)
para(0.9, 2.85, 11.5, "You already built this.", 46, WHITE, bold=True, leading=50)
para(0.9, 3.65, 11.5, "Now you sell it.", 46, ACCENT, bold=True, leading=50)
para(0.9, 5.1, 11.3, "Your first move is simple: set up Claude, then read the Start Here playbook.", 18, WHITE, leading=24)
para(0.9, 5.55, 11.3, "One finished document at a time, Mark. You have got this.", 18, SLATE, leading=24)
newpage()

c.save()
print("Saved The-Vision.pdf")
