#!/usr/bin/env python3
"""Render one of the packet's markdown files into a clean, readable PDF.

Usage: python3 build_pdf_from_md.py input.md output.pdf "Cover Title" "Cover Subtitle"
Handles the markdown subset used in this packet: H1/H2/H3, bold, bullet and
numbered lists, blockquotes, fenced code blocks, and horizontal rules.
"""
import sys, re, html
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, HRFlowable, Table, TableStyle, PageBreak,
                                KeepTogether)

INK    = HexColor("#14304A")
ACCENT = HexColor("#C8772E")
SLATE  = HexColor("#5B6B7A")
CREAM  = HexColor("#FAF7F2")
CODEBG = HexColor("#F1ECE3")
QUOTEBG = HexColor("#FBF6EE")
LIGHT  = HexColor("#D9D2C7")

src, out = sys.argv[1], sys.argv[2]
cover_title = sys.argv[3] if len(sys.argv) > 3 else None
cover_sub = sys.argv[4] if len(sys.argv) > 4 else ""

styles = {
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=26, leading=30,
                         textColor=INK, spaceBefore=6, spaceAfter=10),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=17, leading=21,
                         textColor=INK, spaceBefore=18, spaceAfter=7, keepWithNext=1),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=13, leading=17,
                         textColor=ACCENT, spaceBefore=11, spaceAfter=4, keepWithNext=1),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.8, leading=15.6,
                           textColor=HexColor("#222B33"), spaceAfter=7, alignment=TA_LEFT),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10.8, leading=15.2,
                             textColor=HexColor("#222B33"), leftIndent=16, bulletIndent=2,
                             spaceAfter=3),
    "num": ParagraphStyle("num", fontName="Helvetica", fontSize=10.8, leading=15.2,
                          textColor=HexColor("#222B33"), leftIndent=18, bulletIndent=2,
                          spaceAfter=3),
    "quote": ParagraphStyle("quote", fontName="Helvetica-Oblique", fontSize=10.8,
                            leading=15.6, textColor=INK, spaceAfter=2),
    "code": ParagraphStyle("code", fontName="Courier", fontSize=9.2, leading=12.6,
                           textColor=INK),
}


def inline(text):
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r'<font face="Courier">\1</font>', text)
    return text


def quote_box(lines):
    para = Paragraph("<br/>".join(inline(l) for l in lines), styles["quote"])
    t = Table([[para]], colWidths=[6.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), QUOTEBG),
        ("LINEBEFORE", (0, 0), (0, -1), 3, ACCENT),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return t


def code_box(lines):
    def conv(l):
        stripped = l.lstrip(" ")
        indent = "&nbsp;" * (len(l) - len(stripped))
        return (indent + html.escape(stripped)) or "&nbsp;"
    safe = [conv(l) for l in lines]
    para = Paragraph("<br/>".join(safe), styles["code"])
    t = Table([[para]], colWidths=[6.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODEBG),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


# ---- parse ----
with open(src) as f:
    lines = f.read().split("\n")

flow = []
if cover_title:
    flow += [Spacer(1, 2.0 * inch),
             Paragraph(cover_title, ParagraphStyle("ct", fontName="Helvetica-Bold",
                       fontSize=34, leading=40, textColor=INK)),
             Spacer(1, 0.15 * inch),
             HRFlowable(width=1.4 * inch, thickness=4, color=ACCENT,
                        spaceBefore=4, spaceAfter=16, hAlign="LEFT")]
    if cover_sub:
        flow.append(Paragraph(cover_sub, ParagraphStyle("cs", fontName="Helvetica",
                    fontSize=14, leading=20, textColor=SLATE)))
    flow.append(Paragraph("Prepared for Mark Strazisar", ParagraphStyle("cp",
                fontName="Helvetica", fontSize=12, leading=18, textColor=SLATE,
                spaceBefore=24)))
    flow.append(PageBreak())

i = 0
in_code = False
code_lines = []
first_h1 = True
while i < len(lines):
    line = lines[i]
    if line.strip().startswith("```"):
        if in_code:
            flow.append(code_box(code_lines)); flow.append(Spacer(1, 7))
            code_lines = []; in_code = False
        else:
            in_code = True
        i += 1; continue
    if in_code:
        code_lines.append(line); i += 1; continue

    s = line.strip()
    if not s:
        i += 1; continue
    if s == "---":
        flow.append(HRFlowable(width="100%", thickness=0.6, color=LIGHT,
                    spaceBefore=8, spaceAfter=8)); i += 1; continue
    if s.startswith("> "):
        q = []
        while i < len(lines) and lines[i].strip().startswith(">"):
            q.append(lines[i].strip()[1:].strip()); i += 1
        flow.append(quote_box(q)); flow.append(Spacer(1, 8)); continue
    if s.startswith("### "):
        flow.append(Paragraph(inline(s[4:]), styles["h3"])); i += 1; continue
    if s.startswith("## "):
        flow.append(HRFlowable(width="100%", thickness=0.6, color=ACCENT,
                    spaceBefore=14, spaceAfter=4))
        flow.append(Paragraph(inline(s[3:]), styles["h2"])); i += 1; continue
    if s.startswith("# "):
        if first_h1 and cover_title:
            i += 1; continue  # title already on cover
        first_h1 = False
        flow.append(Paragraph(inline(s[2:]), styles["h1"])); i += 1; continue
    m = re.match(r"^(\d+)\.\s+(.*)", s)
    if m:
        flow.append(Paragraph(inline(m.group(2)), styles["num"],
                    bulletText=m.group(1) + "."))
        i += 1; continue
    if s.startswith("- "):
        flow.append(Paragraph(inline(s[2:]), styles["bullet"], bulletText="•"))
        i += 1; continue
    flow.append(Paragraph(inline(s), styles["body"]))
    i += 1


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(SLATE)
    if doc.page > 1:
        canvas.drawString(0.9 * inch, 0.55 * inch, "Your Documents Business")
        canvas.drawRightString(LETTER[0] - 0.9 * inch, 0.55 * inch, str(doc.page))
    canvas.restoreState()


doc = BaseDocTemplate(out, pagesize=LETTER, topMargin=0.9 * inch,
                      bottomMargin=0.9 * inch, leftMargin=0.9 * inch,
                      rightMargin=0.9 * inch, title=cover_title or "Document")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=footer)])
doc.build(flow)
print("Saved", out)
