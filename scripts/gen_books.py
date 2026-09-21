# -*- coding: utf-8 -*-
"""Generate the books index and the four book pages.

Every string here is taken from the live netizen.hamcodes.com book section.
Nothing is invented: if a fact is not in BOOKS, it does not go on the page.
"""
import os

B = "/Users/macbook/Documents/1.Project/Site-books"

SERIES_TITLE = "The Hamcodes Book Series"
SERIES_BLURB = ("Beginner-friendly coding and robotics books, written so anyone "
                "can teach and anyone can learn.")

BOOKS = [
    dict(slug="coding-for-kids", n="01", title="Coding for Kids",
         kicker="My First Code", age="Ages 5+",
         desc="A playful first step into code, from Scratch to friendly bots with "
              "code.org. Big pictures, simple steps, zero jargon.",
         amazon="https://www.amazon.com/dp/B0DFX4L8B5/"),
    dict(slug="coding-for-teens", n="02", title="Coding for Teens",
         kicker="My First Code", age="Ages 9+",
         desc="The next level up, with real projects, deeper logic, and the "
              "confidence to build. From Scratch to bots and beyond.",
         amazon="https://www.amazon.com/gp/product/B0DGLP5JFM?ref_=dbs_mng_crcw_0&storeType=ebooks"),
    dict(slug="build-a-bot", n="03", title="Build-A-Bot",
         kicker="Robotics · STEAM", age="Ages 7 to 15",
         desc="Hands-on robotics for young makers, with 3D design, coding, and "
              "Arduino projects that actually move, light up, and beep.",
         amazon="https://www.amazon.com/Build-Bot-Robotics-Projects-Beginners-ebook/dp/B0FMKJT73Y/"),
    dict(slug="teachers-edition", n="04", title="Teacher's Edition",
         kicker="Coding for Educators", age="For teachers",
         desc="Never coded before? Teach it anyway. Lesson plans, classroom "
              "activities, and everything you need to lead CS with confidence.",
         amazon="https://www.amazon.com/Coding-Educators-First-Code-Teachers-ebook/dp/B0F6VR4F5L/"),
]

HEAD = '''<!doctype html>
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
<body data-page="books">

<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-include="/partials/header.html"></header>

<main id="main">
'''

TAIL = '''</main>

<footer class="site-footer" data-include="/partials/footer.html"></footer>

<script src="/assets/js/include.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
'''

WORKBOOK_BAND = '''
  <section class="tight">
    <div class="wrap">
      <div class="workbook-band">
        <div>
          <p class="eyebrow">Free, no sign-up</p>
          <h2>The workbook, plus five worksheets.</h2>
          <p>{line}</p>
        </div>
        <div>
          <a class="btn btn-primary" href="/resources.html">Get the workbook</a>
        </div>
      </div>
    </div>
  </section>
'''


def cover(b, eager=False):
    return ('<span class="book-cover">\n'
            '            <picture>\n'
            '              <source type="image/webp" srcset="/assets/img/books/{slug}.webp">\n'
            '              <img src="/assets/img/books/{slug}.png" width="500" height="500" '
            'alt="{title}, {kicker}" loading="{load}" decoding="async">\n'
            '            </picture>\n'
            '          </span>').format(load="eager" if eager else "lazy", **b)


def card(b):
    return '''        <a class="book-card" href="/books/{slug}.html">
          {cover}
          <div class="body">
            <p class="age">{kicker} · {age}</p>
            <h3>{title}</h3>
            <p>{desc}</p>
            <p class="more">Read more</p>
          </div>
        </a>'''.format(cover=cover(b), **b)


# ---------------- books/index.html ----------------
index = HEAD.format(
    title="All books | Hamcodes Books",
    desc=SERIES_BLURB,
    canon="/books/", ogtype="website", og="books",
) + '''
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">Hamcodes / Books</p>
      <h1>''' + SERIES_TITLE + '''</h1>
      <p class="sub">''' + SERIES_BLURB + '''</p>
    </div>
  </section>

  <section class="paper">
    <div class="wrap">
      <div class="grid grid-4">
''' + "\n\n".join(card(b) for b in BOOKS) + '''
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="strip accent">
        <div>
          <p class="eyebrow">Also by Hamcodes</p>
          <h2>Bro Nobody Told Me</h2>
          <p>Sixty two notes on money, work, people and figuring yourself out, for the years right after school. Free to read in full on this site.</p>
          <div class="cta-row">
            <a class="btn btn-primary" href="/bro/">Read the notes</a>
          </div>
        </div>
        <div class="aside">
          <ul>
            <li><strong>After school</strong>Written for students leaving school.</li>
            <li><strong>62 notes</strong>Read one, or read the whole thing.</li>
            <li><strong>Free</strong>No sign-up, no paywall.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
''' + WORKBOOK_BAND.format(line="Printable pages that work next to any of the books, or on their own in a classroom.") + TAIL

open(os.path.join(B, "books", "index.html"), "w", encoding="utf-8").write(index)

# ---------------- one page per book ----------------
for i, b in enumerate(BOOKS):
    prev_b, next_b = BOOKS[i - 1], BOOKS[(i + 1) % len(BOOKS)]
    page = HEAD.format(
        title="%s | Hamcodes Books" % b["title"],
        desc=b["desc"], canon="/books/%s.html" % b["slug"],
        ogtype="book", og=b["slug"],
    ) + '''
  <div class="wrap">
    <p class="crumbs"><a href="/books/">All books</a> / {title}</p>
  </div>

  <section class="hero">
    <div class="wrap book-detail">
      <div class="cover-col">
        {cover}
      </div>

      <div>
        <p class="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p class="sub">{desc}</p>

        <div class="facts">
          <div><strong>{age}</strong>Reading level</div>
          <div><strong>{kicker}</strong>Series</div>
          <div><strong>Book {n}</strong>In the Hamcodes series</div>
        </div>

        <div class="cta-row">
          <a class="btn btn-primary" href="{amazon}" rel="noopener">View on Amazon</a>
          <a class="btn btn-ghost" href="/resources.html">Free workbook &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <section class="paper">
    <div class="wrap-narrow">
      <h2>The rest of the series</h2>
      <p style="margin-top:12px;color:var(--ink-2)">{series_blurb}</p>
      <div class="grid grid-3" style="margin-top:24px">
{others}
      </div>
    </div>
  </section>

  <div class="reader-nav">
    <a href="/books/{prev_slug}.html"><span>Previous book</span>{prev_title}</a>
    <a href="/books/{next_slug}.html"><span>Next book</span>{next_title}</a>
  </div>
'''.format(
        cover=cover(b, eager=True), series_blurb=SERIES_BLURB,
        others="\n\n".join(card(o) for o in BOOKS if o["slug"] != b["slug"]),
        prev_slug=prev_b["slug"], prev_title=prev_b["title"],
        next_slug=next_b["slug"], next_title=next_b["title"], **b
    ) + WORKBOOK_BAND.format(line="Printable pages that work next to this book, or on their own in a classroom.") + TAIL

    open(os.path.join(B, "books", "%s.html" % b["slug"]), "w", encoding="utf-8").write(page)

print("books/index.html + %d book pages, real copy only" % len(BOOKS))
