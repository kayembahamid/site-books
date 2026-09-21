# -*- coding: utf-8 -*-
"""Generate the four book pages on the migrated netizen design.

Every string in BOOKS is taken from the live netizen.hamcodes.com book
section. If a fact is not in this table it does not reach the page.
"""
import os

B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SERIES_TITLE = "The Hamcodes Book Series"
SERIES_BLURB = ("Beginner-friendly coding and robotics books, written so anyone "
                "can teach and anyone can learn.")
ARROW = '<svg class="ic"><use href="#i-arrow-forward"/></svg>'

BOOKS = [
    dict(slug="coding-for-kids", title="Coding for Kids", cls="b", btn="gold",
         kicker="Coding for Kids", h="My First Code", age="Ages 5+",
         desc="A playful first step into code, from Scratch to friendly bots with "
              "code.org. Big pictures, simple steps, zero jargon.",
         amazon="https://www.amazon.com/dp/B0DFX4L8B5/"),
    dict(slug="coding-for-teens", title="Coding for Teens", cls="p", btn="orange",
         kicker="Coding for Teens", h="My First Code", age="Ages 9+",
         desc="The next level up, with real projects, deeper logic, and the "
              "confidence to build. From Scratch to bots and beyond.",
         amazon="https://www.amazon.com/gp/product/B0DGLP5JFM?ref_=dbs_mng_crcw_0&amp;storeType=ebooks"),
    dict(slug="build-a-bot", title="Build-A-Bot", cls="o", btn="primary",
         kicker="Robotics &middot; STEAM", h="Build-A-Bot", age="Ages 7 to 15",
         desc="Hands-on robotics for young makers, with 3D design, coding, and "
              "Arduino projects that actually move, light up, and beep.",
         amazon="https://www.amazon.com/Build-Bot-Robotics-Projects-Beginners-ebook/dp/B0FMKJT73Y/"),
    dict(slug="teachers-edition", title="Teacher's Edition", cls="t", btn="teal",
         kicker="Coding for Educators", h="Teacher's Edition", age="For teachers",
         desc="Never coded before? Teach it anyway. Lesson plans, classroom "
              "activities, and everything you need to lead CS with confidence.",
         amazon="https://www.amazon.com/Coding-Educators-First-Code-Teachers-ebook/dp/B0F6VR4F5L/"),
]

SHELL = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} | Hamcodes Books</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://books.hamcodes.com/books/{slug}.html">
<meta name="theme-color" content="#2A0C16">
<meta property="og:type" content="book">
<meta property="og:site_name" content="Hamcodes Books">
<meta property="og:title" content="{title} | Hamcodes Books">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://books.hamcodes.com/books/{slug}.html">
<meta property="og:image" content="https://books.hamcodes.com/assets/og/{slug}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="books">

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
'''


def cover(b, eager=False):
    return ('<picture>\n'
            '            <source type="image/webp" srcset="/assets/img/books/{slug}.webp">\n'
            '            <img src="/assets/img/books/{slug}.png" width="500" height="500" '
            'alt="{title}, {kicker}" {load} decoding="async">\n'
            '          </picture>').format(load='fetchpriority="high"' if eager else 'loading="lazy"', **b)


def row(b, eager=False, heading="h3"):
    return '''      <div class="book-row">
        <div class="book-media"><div class="panel {cls}">{cov}</div></div>
        <div class="book-info">
          <span class="tag {cls}">{kicker}</span>
          <{hd}>{h}</{hd}>
          <span class="age-badge">{age}</span>
          <p>{desc}</p>
          <div class="cta-row">
            <a class="btn btn-{btn} btn-lg" href="{amazon}" target="_blank" rel="noopener">View on Amazon {arrow}</a>
            <a class="btn btn-ghost" href="/books/{slug}.html">Read more</a>
          </div>
        </div>
      </div>'''.format(cov=cover(b, eager), hd=heading, arrow=ARROW, **b)


for i, b in enumerate(BOOKS):
    prev_b, next_b = BOOKS[i - 1], BOOKS[(i + 1) % len(BOOKS)]
    others = "\n\n".join(row(o) for o in BOOKS if o["slug"] != b["slug"])
    body = '''
  <div class="wrap">
    <p class="crumbs"><a href="/books/">All books</a> / {title}</p>
  </div>

  <section class="books">
    <div class="wrap">
{hero}
    </div>
  </section>

  <section class="downloads">
    <div class="wrap">
      <div class="sec-head center">
        <span class="eyebrow o">{series_title}</span>
        <h2>The rest of the series</h2>
        <p class="lead">{series_blurb}</p>
      </div>
    </div>
  </section>

  <section class="books">
    <div class="wrap">
{others}
    </div>
  </section>

  <div class="reader-nav">
    <a href="/books/{prev_slug}.html"><span>Previous book</span>{prev_title}</a>
    <a href="/books/{next_slug}.html"><span>Next book</span>{next_title}</a>
  </div>
'''.format(hero=row(b, eager=True, heading="h1"), others=others,
           series_title=SERIES_TITLE, series_blurb=SERIES_BLURB,
           prev_slug=prev_b["slug"], prev_title=prev_b["title"],
           next_slug=next_b["slug"], next_title=next_b["title"], **b)

    open(os.path.join(B, "books", "%s.html" % b["slug"]), "w", encoding="utf-8").write(
        SHELL.format(body=body, **b))

print("%d book pages rebuilt on the migrated design" % len(BOOKS))
