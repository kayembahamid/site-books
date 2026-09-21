# -*- coding: utf-8 -*-
"""Generate the per-page OG cards for books.hamcodes.com, in the Books palette."""
from PIL import Image, ImageDraw, ImageFont
import os

FONTS = "/private/tmp/claude-501/-Users-macbook-Documents-1-Project/26ebaf17-3aca-4d17-8d06-c36f8a4d99ee/scratchpad/fonts"
OUT = "/Users/macbook/Documents/1.Project/Site-books/assets/og"
MASCOT = "/Users/macbook/Documents/1.Project/Site-books/assets/img/mascot.webp"

GROUND, PAPER, PAPER2 = "#FFF8EC", "#FFFFFF", "#F5EDD9"
INK, INK2, INK3 = "#1A1108", "#5C4A38", "#8B7355"
BRAND, GOLD, TEAL, DEEP = "#E63946", "#FFB627", "#0F766E", "#5C3D2E"

W, H, PAD = 1200, 630, 72


def font(name, size, weight):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(path, eyebrow, headline, meta, cover=None, cover_label=None, mascot=False):
    im = Image.new("RGB", (W, H), GROUND)
    d = ImageDraw.Draw(im)

    text_w = W - PAD * 2
    if cover or mascot:
        text_w = 700

    # wordmark
    f_mark = font("Sora.ttf", 28, 700)
    x = PAD
    d.text((x, PAD - 6), "Hamcodes", font=f_mark, fill=INK)
    x += d.textlength("Hamcodes", font=f_mark)
    d.text((x, PAD - 6), " / ", font=f_mark, fill=BRAND)
    x += d.textlength(" / ", font=f_mark)
    d.text((x, PAD - 6), "Books", font=font("Sora.ttf", 28, 500), fill=INK3)

    # eyebrow
    f_eye = font("JBM.ttf", 19, 500)
    y = 196
    ex = PAD
    for ch in eyebrow.upper():
        d.text((ex, y), ch, font=f_eye, fill=BRAND)
        ex += d.textlength(ch, font=f_eye) + 2.6

    # headline
    size = 62 if len(headline) < 52 else 52
    f_head = font("Sora.ttf", size, 700)
    lines = wrap(d, headline, f_head, text_w)
    while len(lines) > 3 and size > 38:
        size -= 6
        f_head = font("Sora.ttf", size, 700)
        lines = wrap(d, headline, f_head, text_w)
    y = 244
    for ln in lines:
        d.text((PAD, y), ln, font=f_head, fill=INK)
        y += int(size * 1.12)

    # meta
    f_meta = font("JBM.ttf", 19, 400)
    mx = PAD
    for ch in meta.upper():
        d.text((mx, H - PAD - 24), ch, font=f_meta, fill=INK2)
        mx += d.textlength(ch, font=f_meta) + 2.2

    # optional book cover block
    if cover:
        cw, chh = 260, 347
        cx, cy = W - PAD - cw, (H - chh) // 2 + 20
        d.rounded_rectangle([cx, cy, cx + cw, cy + chh], radius=8, fill=cover)
        d.rectangle([cx, cy, cx + 10, cy + chh], fill=INK)
        lab_fill = INK if cover == GOLD else PAPER
        f_cl = font("Sora.ttf", 27, 700)
        cl = wrap(d, cover_label, f_cl, cw - 44)
        ty = cy + chh - 34 - len(cl) * 32
        for ln in cl:
            d.text((cx + 24, ty), ln, font=f_cl, fill=lab_fill)
            ty += 32

    # optional mascot
    if mascot and os.path.exists(MASCOT):
        m = Image.open(MASCOT).convert("RGBA")
        mh = 430
        m = m.resize((round(m.width * mh / m.height), mh), Image.LANCZOS)
        im.paste(m, (W - PAD - m.width + 20, H - mh - 40), m)

    # brand bar
    d.rectangle([0, H - 14, W, H], fill=BRAND)

    im.save(path, quality=88, optimize=True)
    return os.path.getsize(path) // 1024


cards = [
    ("home.png", "Books, blog and free workbooks", "Beginner books that teach code, safety, and growing up.", "books.hamcodes.com", None, None, True),
    ("books.png", "Hamcodes / Books", "Every book we have written, in one place.", "Four books, plus Bro Nobody Told Me", None, None, False),
    ("coding-for-kids.png", "Book 01 of the Hamcodes series", "Coding for Kids", "Ages 8 to 12 · 148 pages · 24 lessons", GOLD, "Coding for Kids", False),
    ("coding-for-teens.png", "Book 02 of the Hamcodes series", "Coding for Teens", "Ages 13 to 17 · 216 pages · 30 lessons", TEAL, "Coding for Teens", False),
    ("build-a-bot.png", "Book 03 of the Hamcodes series", "Build-A-Bot", "Ages 10 to 16 · 192 pages · 18 builds", BRAND, "Build-A-Bot", False),
    ("teachers-edition.png", "Book 04 of the Hamcodes series", "Teacher's Edition", "For educators · 240 pages · Full scope and sequence", DEEP, "Teacher's Edition", False),
    ("bro.png", "Bro 2 Bro · Free to read", "Bro, nobody told me.", "62 notes on life after school", None, None, False),
    ("blog.png", "Hamcodes / Blog", "Three things worth knowing.", "Netizenship · Coding · Money", None, None, False),
    ("blog-four-skills.png", "Digital Netizenship", "The four skills every young person online actually needs", "7 min read · books.hamcodes.com/blog", None, None, False),
    ("resources.png", "Free · No sign-up", "The workbook, plus five worksheets.", "6 PDFs · Print at home or in class", None, None, False),
    ("mentorship.png", "Private Tech Mentorship", "One-on-one guidance for young coders.", "Ages 8 to 16 · 5 spots · By application", None, None, False),
]

for name, eye, head, meta, cov, lab, masc in cards:
    kb = card(os.path.join(OUT, name), eye, head, meta, cov, lab, masc)
    print("  %-26s %3d KB" % (name, kb))
print("%d OG cards written" % len(cards))
