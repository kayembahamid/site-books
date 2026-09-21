# -*- coding: utf-8 -*-
"""Build every page except the home page.

The home page is hand-authored and is the source of truth for the section
markup. This script lifts whole sections out of it so a page and the home
page can never drift apart, then wraps them in the standard shell.
"""
import os, re

B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = open(os.path.join(B, "index.html"), encoding="utf-8").read()


def section(id_):
    m = re.search(r'\n  <section class="[^"]*" id="%s">.*?\n  </section>' % id_, HOME, re.S)
    if not m:
        raise SystemExit("section %s not found" % id_)
    return m.group(0)


def shell(title, desc, canon, og, page, body, ogtype="website"):
    return '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://books.hamcodes.com{canon}">
<meta name="theme-color" content="#FFF8EC">
<meta property="og:type" content="{ogtype}">
<meta property="og:site_name" content="Hamcodes Books">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://books.hamcodes.com{canon}">
<meta property="og:image" content="https://books.hamcodes.com/assets/og/{og}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="{page}">

<a class="skip" href="#main">Skip to content</a>
<div data-include="/partials/icons.html" hidden></div>
<header class="site-header" data-include="/partials/header.html"></header>

<main id="main">
{body}
</main>

<footer class="site-footer" data-include="/partials/footer.html"></footer>

<script src="/assets/js/include.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
'''.format(title=title, desc=desc, canon=canon, og=og, page=page, body=body, ogtype=ogtype)


def page_hero(eyebrow, h1, lead, ctas=""):
    return '''
  <section class="hero">
    <div class="wrap">
      <span class="eyebrow r">{e}</span>
      <h1>{h}</h1>
      <p class="lead">{l}</p>{c}
    </div>
  </section>
'''.format(e=eyebrow, h=h1, l=lead, c=("\n      <div class=\"cta-row\">%s</div>" % ctas) if ctas else "")


ARROW = '<svg class="ic"><use href="#i-arrow-forward"/></svg>'

# ---------------- /books/ ----------------
books_sec = section("books").replace('<section class="books" id="books">', '<section class="books">')
open(os.path.join(B, "books", "index.html"), "w", encoding="utf-8").write(shell(
    "All books | Hamcodes Books",
    "Beginner-friendly coding and robotics books, written so anyone can teach and anyone can learn.",
    "/books/", "books", "books",
    page_hero("Hamcodes / Books", "Every book we have written, in one place.",
              "Four books in the Hamcodes series, and one written for the years right after school. All of them assume you are starting from nothing.")
    + books_sec + section("brotobro")))

# ---------------- /resources.html ----------------
open(os.path.join(B, "resources.html"), "w", encoding="utf-8").write(shell(
    "Free workbook and worksheets | Hamcodes Books",
    "The Digital Netizenship Workbook plus 5 classroom-ready worksheets on clickbait, phishing, scams, scenario sorting and internet-safety vocabulary. Free, no sign-up.",
    "/resources.html", "resources", "resources",
    section("workbook").replace('<section class="downloads" id="workbook">', '<section class="downloads">')))

# ---------------- /blog/ ----------------
open(os.path.join(B, "blog", "index.html"), "w", encoding="utf-8").write(shell(
    "Blog | Hamcodes Books",
    "Plain-English guides on online safety, computer science and money. 54 articles across digital netizenship, hacking and coding, and financial literacy.",
    "/blog/", "blog", "blog",
    section("blog").replace('<section class="blog" id="blog">', '<section class="blog">')))

# ---------------- /mentorship.html ----------------
open(os.path.join(B, "mentorship.html"), "w", encoding="utf-8").write(shell(
    "Private Tech Mentorship | Hamcodes Books",
    "One-on-one tech mentorship for coders aged 8 to 16 and the educators who teach them. Personalised roadmap, real projects, safety-first mindset. Five spots, by application.",
    "/mentorship.html", "mentorship", "mentorship",
    section("mentorship").replace('<section class="mentor" id="mentorship">', '<section class="mentor">')))

# ---------------- 404 ----------------
open(os.path.join(B, "404.html"), "w", encoding="utf-8").write(shell(
    "Page not found | Hamcodes Books",
    "That page is not here. Try the books, the notes, or the free workbook.",
    "/404.html", "home", "404",
    page_hero("404", "That page is not here.",
              "It may have moved when the site split in two. The books, the notes and the workbook are all still where you would expect.",
              '<a class="btn btn-primary btn-lg" href="/books/">See the books %s</a> <a class="btn btn-ghost btn-lg" href="/">Go home</a>' % ARROW)
).replace('<meta name="twitter:card"', '<meta name="robots" content="noindex">\n<meta name="twitter:card"'))

print("built books/index.html, resources.html, blog/index.html, mentorship.html, 404.html")
