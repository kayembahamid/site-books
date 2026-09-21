# -*- coding: utf-8 -*-
"""Generate books.hamcodes.com/bro from the book's own note data."""
import json, os, html, re

SRC = "/Users/macbook/Documents/1.Project/bro-2-bro/book-bro-2-bro/site/notes.js"
B = "/Users/macbook/Documents/1.Project/Site-books"

s = open(SRC, encoding="utf-8").read()
NOTES = json.loads(s[s.index("["):s.rindex("]") + 1])

def slugify(t):
    t = t.lower().replace("’", "").replace("'", "")
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:60]

# GitBook front matter that has no place on this site: the site has its own
# table of contents, and the brand spec is English only with no language switch.
DROP = {"Read in Your Preferred language", "Table of Contents", "Read it via an App"}
NOTES = [x for x in NOTES if x["title"] not in DROP]

for i, x in enumerate(NOTES, start=1):
    x["n"] = i
    x["slug"] = "%03d-%s" % (i, slugify(x["title"]))

def esc(t):
    # keep copy free of em dashes, per the brand spec
    return html.escape(t.replace("—", ", ").replace("--", ", "), quote=True)

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
<meta property="og:image" content="https://books.hamcodes.com/assets/og/bro.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="bro">

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

# ---------------- table of contents ----------------
parts = []
for x in NOTES:
    if not parts or parts[-1][0] != x["part"]:
        parts.append((x["part"], []))
    parts[-1][1].append(x)

blocks = []
for i, (part, items) in enumerate(parts):
    lis = "\n".join(
        '          <li><a href="/bro/notes/{slug}.html"><span class="n">{n:03d}</span><span>{title}</span></a></li>'.format(
            slug=x["slug"], n=x["n"], title=esc(x["title"]))
        for x in items
    )
    blocks.append('''      <div class="bro-part">
        <p class="part-no">Part {no:02d}</p>
        <h2>{part}</h2>
        <ul class="bro-notes">
{lis}
        </ul>
      </div>'''.format(no=i + 1, part=esc(part), lis=lis))

toc = HEAD.format(
    title="Bro Nobody Told Me | Hamcodes Books",
    desc="Sixty four notes on money, work, people and figuring yourself out, for the years right after school. Free to read in full, note by note.",
    canon="/bro/", ogtype="book",
) + '''
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">Bro 2 Bro · Free to read</p>
      <h1>Bro, nobody told me.</h1>
      <p class="sub">Life after school, one note at a time. The stuff nobody explains before you have to figure it out the hard way. {count} notes, free, no sign-up.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="/bro/notes/{first}.html">Start at the beginning</a>
        <a class="btn btn-ghost" href="#contents">Jump to a note</a>
      </div>
      <div class="trust">
        <span><strong>{count} notes</strong>Read one, or read it all</span>
        <span><strong>{parts} parts</strong>Yourself, work, money, people</span>
        <span><strong>Free</strong>No sign-up, no paywall</span>
      </div>
    </div>
  </section>

  <section class="tint" id="contents">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Contents</p>
        <h2>Everything in the book.</h2>
      </div>
      <div class="bro-toc">
''' .format(count=len(NOTES), parts=len(parts), first=NOTES[0]["slug"]) + "\n\n".join(blocks) + '''
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="workbook-band">
        <div>
          <p class="eyebrow">More from Hamcodes</p>
          <h2>Books that teach code and safety.</h2>
          <p>Four beginner books for kids, teens and the teachers who guide them.</p>
        </div>
        <div>
          <a class="btn btn-primary" href="/books/">See the books</a>
        </div>
      </div>
    </div>
  </section>

''' + TAIL

open(os.path.join(B, "bro", "index.html"), "w", encoding="utf-8").write(toc)

# ---------------- one page per note ----------------
for i, x in enumerate(NOTES):
    body = []
    for blk in x["blocks"]:
        t, text = blk["t"], esc(blk["x"])
        if t == "h":
            body.append("    <h2>%s</h2>" % text)
        elif t == "h2":
            body.append("    <h3>%s</h3>" % text)
        else:
            body.append("    <p>%s</p>" % text)

    first_p = next((b["x"] for b in x["blocks"] if b["t"] == "p"), x["title"])
    desc = esc(first_p[:155].rsplit(" ", 1)[0] + ("..." if len(first_p) > 155 else ""))

    nav = []
    if i > 0:
        nav.append('    <a href="/bro/notes/{s}.html"><span>Previous</span>{t}</a>'.format(
            s=NOTES[i - 1]["slug"], t=esc(NOTES[i - 1]["title"])))
    else:
        nav.append('    <a href="/bro/"><span>Back to</span>All notes</a>')
    if i < len(NOTES) - 1:
        nav.append('    <a href="/bro/notes/{s}.html"><span>Next</span>{t}</a>'.format(
            s=NOTES[i + 1]["slug"], t=esc(NOTES[i + 1]["title"])))
    else:
        nav.append('    <a href="/books/"><span>Next</span>See the books</a>')

    kicker = esc(x["kicker"]) if x["kicker"] else esc(x["part"])

    page = HEAD.format(
        title="%s | Bro Nobody Told Me" % esc(x["title"]),
        desc=desc,
        canon="/bro/notes/%s.html" % x["slug"],
        ogtype="article",
    ) + '''
  <div class="wrap">
    <p class="crumbs"><a href="/bro/">Bro 2 Bro</a> / Note {n:03d}</p>
  </div>

  <div class="reader reader-head">
    <p class="eyebrow">{kicker}</p>
    <h1>{title}</h1>
    <p class="meta" style="margin-top:16px">Note {n:03d} of {total} · {words} words · {part}</p>
  </div>

  <article class="reader reader-body">
{body}
  </article>

  <div class="reader-nav">
{nav}
  </div>

  <section class="tight">
    <div class="wrap">
      <div class="workbook-band">
        <div>
          <p class="eyebrow">Bro 2 Bro</p>
          <h2>Read the whole thing.</h2>
          <p>All {total} notes, free, in order or in any order you like.</p>
        </div>
        <div>
          <a class="btn btn-primary" href="/bro/">All notes</a>
        </div>
      </div>
    </div>
  </section>

'''.format(
        n=x["n"], total=len(NOTES), words=x["words"], part=esc(x["part"]),
        kicker=kicker, title=esc(x["title"]),
        body="\n".join(body), nav="\n".join(nav),
    ) + TAIL

    open(os.path.join(B, "bro", "notes", "%s.html" % x["slug"]), "w", encoding="utf-8").write(page)

print("bro/index.html + %d note pages" % len(NOTES))
json.dump([{"n": x["n"], "slug": x["slug"], "title": x["title"], "part": x["part"]} for x in NOTES],
          open(os.path.join(B, "bro", "notes.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
