#!/usr/bin/env node
/* build.js — the whole site, from three sources.

   The stack here is HTML, CSS and JS, the same as every other Hamcodes site,
   so the build is Node with no dependencies. Run it with:

       node scripts/build.js            everything
       node scripts/build.js books      just the four book pages
       node scripts/build.js pages      just the pages lifted from the home page
       node scripts/build.js bro        just Bro 2 Bro

   Three sources, and nothing else:

     index.html            hand-authored, and the source of truth for the
                           section markup that /books/, /blog/, /resources
                           and /mentorship reuse
     BOOKS below           one row per book. A fact that is not in this table
                           does not reach a book page
     scripts/data/notes.json   the Bro 2 Bro notes, exported from the book's
                           own markdown by build-notes.js in the Bro 2 Bro repo

   Running it twice changes nothing. If a page differs after a run, the page
   was edited by hand and the edit belongs in here instead. */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");

function write(rel, body) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
}

/* Matches Python's html.escape(s, quote=True), which is what the pages in the
   repo were written with. Keep it that way or every note page re-diffs. */
function esc(t) {
  return String(t)
    .replace(/—/g, ", ")
    .replace(/--/g, ", ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const pad3 = (n) => String(n).padStart(3, "0");
const pad2 = (n) => String(n).padStart(2, "0");
const ARROW = '<svg class="ic"><use href="#i-arrow-forward"/></svg>';

/* ---------------------------------------------------------------- the shell */

function shell(o) {
  const robots = o.noindex ? '<meta name="robots" content="noindex">\n' : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="canonical" href="https://books.hamcodes.com${o.canon}">
<meta name="theme-color" content="#2A0C16">
${robots}<meta property="og:type" content="${o.ogtype || "website"}">
<meta property="og:site_name" content="Hamcodes Books">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:url" content="https://books.hamcodes.com${o.canon}">
<meta property="og:image" content="https://books.hamcodes.com/assets/og/${o.og}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="${o.page}">

<a class="skip" href="#main">Skip to content</a>
<div data-include="/partials/icons.html" hidden></div>
<header class="site-header" data-include="/partials/header.html"></header>

<main id="main">
${o.body}
</main>

<footer class="site-footer" data-include="/partials/footer.html"></footer>

<script src="/assets/js/include.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

function pageHero(eyebrow, h1, lead, ctas) {
  const row = ctas
    ? `\n      <div class="hero-cta" style="margin-top:1.8rem">${ctas}</div>`
    : "";
  return `
  <section class="hero">
    <div class="wrap">
      <span class="eyebrow">${eyebrow}</span>
      <h1>${h1}</h1>
      <p class="lead">${lead}</p>${row}
    </div>
  </section>
`;
}

/* ------------------------------------------------- sections of the home page */

/* The home page is hand-authored. Lifting whole sections out of it, rather
   than re-describing them here, is what stops a page and the home page from
   drifting apart. The id is kept, so an in-page anchor still works. */
function section(id) {
  const home = read("index.html");
  const re = new RegExp(`\\n  <section class="[^"]*" id="${id}">[\\s\\S]*?\\n  </section>`);
  const m = home.match(re);
  if (!m) throw new Error(`section #${id} is not in index.html`);
  return m[0];
}

/* ---------------------------------------------------------------- the books */

const SERIES_TITLE = "The Hamcodes Book Series";
const SERIES_BLURB =
  "Beginner-friendly coding and robotics books, written so anyone can teach and anyone can learn.";

const BOOKS = [
  {
    slug: "coding-for-kids", title: "Coding for Kids", cls: "b", btn: "gold",
    kicker: "Coding for Kids", h: "My First Code", age: "Ages 5+",
    desc: "A playful first step into code, from Scratch to friendly bots with " +
          "code.org. Big pictures, simple steps, zero jargon.",
    amazon: "https://www.amazon.com/dp/B0DFX4L8B5/",
  },
  {
    slug: "coding-for-teens", title: "Coding for Teens", cls: "p", btn: "orange",
    kicker: "Coding for Teens", h: "My First Code", age: "Ages 9+",
    desc: "The next level up, with real projects, deeper logic, and the " +
          "confidence to build. From Scratch to bots and beyond.",
    amazon: "https://www.amazon.com/gp/product/B0DGLP5JFM?ref_=dbs_mng_crcw_0&amp;storeType=ebooks",
  },
  {
    slug: "build-a-bot", title: "Build-A-Bot", cls: "o", btn: "primary",
    kicker: "Robotics &middot; STEAM", h: "Build-A-Bot", age: "Ages 7 to 15",
    desc: "Hands-on robotics for young makers, with 3D design, coding, and " +
          "Arduino projects that actually move, light up, and beep.",
    amazon: "https://www.amazon.com/Build-Bot-Robotics-Projects-Beginners-ebook/dp/B0FMKJT73Y/",
  },
  {
    slug: "teachers-edition", title: "Teacher's Edition", cls: "t", btn: "teal",
    kicker: "Coding for Educators", h: "Teacher's Edition", age: "For teachers",
    desc: "Never coded before? Teach it anyway. Lesson plans, classroom " +
          "activities, and everything you need to lead CS with confidence.",
    amazon: "https://www.amazon.com/Coding-Educators-First-Code-Teachers-ebook/dp/B0F6VR4F5L/",
  },
];

function cover(b, eager) {
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture>
            <source type="image/webp" srcset="/assets/img/books/${b.slug}.webp">
            <img src="/assets/img/books/${b.slug}.png" width="500" height="500" alt="${b.title}, ${b.kicker}" ${load} decoding="async">
          </picture>`;
}

function bookRow(b, eager, heading) {
  const hd = heading || "h3";
  return `      <div class="book-row">
        <div class="book-media"><div class="panel ${b.cls}">${cover(b, eager)}</div></div>
        <div class="book-info">
          <span class="tag ${b.cls}">${b.kicker}</span>
          <${hd}>${b.h}</${hd}>
          <span class="age-badge">${b.age}</span>
          <p>${b.desc}</p>
          <div class="cta-row">
            <a class="btn btn-${b.btn} btn-lg" href="${b.amazon}" target="_blank" rel="noopener">View on Amazon ${ARROW}</a>
            <a class="btn btn-ghost" href="/books/${b.slug}.html">Read more</a>
          </div>
        </div>
      </div>`;
}

function buildBooks() {
  BOOKS.forEach((b, i) => {
    const prev = BOOKS[(i - 1 + BOOKS.length) % BOOKS.length];
    const next = BOOKS[(i + 1) % BOOKS.length];
    const others = BOOKS.filter((o) => o.slug !== b.slug).map((o) => bookRow(o)).join("\n\n");

    const body = `
  <div class="wrap">
    <p class="crumbs"><a href="/books/">All books</a> / ${b.title}</p>
  </div>

  <section class="books">
    <div class="wrap">
${bookRow(b, true, "h1")}
    </div>
  </section>

  <section class="downloads">
    <div class="wrap">
      <div class="sec-head center">
        <span class="eyebrow o">${SERIES_TITLE}</span>
        <h2>The rest of the series</h2>
        <p class="lead">${SERIES_BLURB}</p>
      </div>
    </div>
  </section>

  <section class="books">
    <div class="wrap">
${others}
    </div>
  </section>

  <div class="reader-nav">
    <a href="/books/${prev.slug}.html"><span>Previous book</span>${prev.title}</a>
    <a href="/books/${next.slug}.html"><span>Next book</span>${next.title}</a>
  </div>
`;

    write(`books/${b.slug}.html`, shell({
      title: `${b.title} | Hamcodes Books`,
      desc: b.desc,
      canon: `/books/${b.slug}.html`,
      og: b.slug,
      page: "books",
      ogtype: "book",
      body,
    }));
  });
  console.log(`books/  ${BOOKS.length} book pages`);
}

/* ------------------------------------- the pages lifted from the home page */

function buildPages() {
  write("books/index.html", shell({
    title: "All books | Hamcodes Books",
    desc: SERIES_BLURB,
    canon: "/books/",
    og: "books",
    page: "books",
    body:
      pageHero(
        "Hamcodes &middot; Books",
        "Every book we have written, in one place.",
        "Four books in the Hamcodes series, and one written for the years right after school. All of them assume you are starting from nothing."
      ) + section("books") + section("brotobro"),
  }));

  write("resources.html", shell({
    title: "Free workbook and worksheets | Hamcodes Books",
    desc: "The Digital Netizenship Workbook plus 5 classroom-ready worksheets on clickbait, phishing, scams, scenario sorting and internet-safety vocabulary.",
    canon: "/resources.html",
    og: "resources",
    page: "resources",
    body: section("downloads"),
  }));

  write("blog/index.html", shell({
    title: "Blog | Hamcodes Books",
    desc: "Plain-English guides on online safety, computer science and money. 54 articles across digital netizenship, hacking and coding, and financial literacy.",
    canon: "/blog/",
    og: "blog",
    page: "blog",
    body: section("blog"),
  }));

  write("mentorship.html", shell({
    title: "Private Tech Mentorship | Hamcodes Books",
    desc: "One-on-one tech mentorship for coders aged 8 to 16 and the educators who teach them. Five spots, by application.",
    canon: "/mentorship.html",
    og: "mentorship",
    page: "mentorship",
    body: section("mentorship"),
  }));

  write("404.html", shell({
    title: "Page not found | Hamcodes Books",
    desc: "That page is not here. Try the books, the notes, or the free workbook.",
    canon: "/404.html",
    og: "home",
    page: "404",
    noindex: true,
    body: pageHero(
      "404",
      "That page is not here.",
      "It may have moved when the site split in two. The books, the notes and the workbook are all still where you would expect.",
      `<a class="btn btn-primary btn-lg" href="/books/">See the books ${ARROW}</a> <a class="btn btn-ghost btn-lg" href="/">Go home</a>`
    ),
  }));

  console.log("books/index.html, resources.html, blog/index.html, mentorship.html, 404.html");
}

/* --------------------------------------------------------------- Bro 2 Bro */

/* GitBook front matter that has no place on this site: the site has its own
   table of contents, and the brand spec is English only with no language
   switch. Dropping these three is what takes 64 notes down to 62. */
const DROP = new Set([
  "Read in Your Preferred language",
  "Table of Contents",
  "Read it via an App",
]);

function slugify(t) {
  return t
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function loadNotes() {
  const all = JSON.parse(read("scripts", "data", "notes.json"));
  const notes = all.filter((x) => !DROP.has(x.title));
  notes.forEach((x, i) => {
    x.n = i + 1;
    x.slug = `${pad3(i + 1)}-${slugify(x.title)}`;
  });
  return notes;
}

function buildBro() {
  const notes = loadNotes();
  const total = notes.length;

  /* ---- the table of contents ---- */
  const parts = [];
  notes.forEach((x) => {
    if (!parts.length || parts[parts.length - 1].part !== x.part) {
      parts.push({ part: x.part, items: [] });
    }
    parts[parts.length - 1].items.push(x);
  });

  const blocks = parts.map((p, i) => {
    const lis = p.items
      .map((x) => `          <li><a href="/bro/notes/${x.slug}.html"><span class="n">${pad3(x.n)}</span><span>${esc(x.title)}</span></a></li>`)
      .join("\n");
    return `      <div class="bro-part">
        <p class="part-no">Part ${pad2(i + 1)}</p>
        <h2>${esc(p.part)}</h2>
        <ul class="bro-notes">
${lis}
        </ul>
      </div>`;
  });

  const toc = `
  <section class="hero">
    <div class="wrap">
      <span class="eyebrow">Bro 2 Bro &middot; Free to read</span>
      <h1>Bro, nobody told me.</h1>
      <p class="lead">Life after school, one note at a time. The stuff nobody explains before you have to figure it out the hard way. ${total} notes, free, no sign-up.</p>
      <div class="cta-row">
        <a class="btn btn-primary btn-lg" href="/bro/notes/${notes[0].slug}.html">Start at the beginning ${ARROW}</a>
        <a class="btn btn-ghost btn-lg" href="#contents">Jump to a note</a>
      </div>
      <div class="trust" style="margin-top:2rem">
        <span><strong>${total} notes</strong>Read one, or read it all</span>
        <span><strong>${parts.length} parts</strong>Yourself, work, money, people</span>
        <span><strong>Free</strong>No sign-up, no paywall</span>
      </div>
    </div>
  </section>

  <section class="downloads" id="contents">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow o">Contents</span>
        <h2>Everything in the book.</h2>
      </div>
      <div class="bro-toc">
${blocks.join("\n\n")}
      </div>
    </div>
  </section>

  <section class="books">
    <div class="wrap sec-head center">
      <span class="eyebrow o">More from Hamcodes</span>
      <h2>Books that teach code and safety.</h2>
      <p class="lead">${SERIES_BLURB}</p>
      <div class="cta-row" style="justify-content:center">
        <a class="btn btn-primary btn-lg" href="/books/">See the books ${ARROW}</a>
      </div>
    </div>
  </section>
`;

  write("bro/index.html", shell({
    title: "Bro Nobody Told Me | Hamcodes Books",
    desc: "Sixty four notes on money, work, people and figuring yourself out, for the years right after school. Free to read in full, note by note.",
    canon: "/bro/",
    og: "bro",
    page: "bro",
    ogtype: "book",
    body: toc,
  }));

  /* ---- one page per note ---- */
  notes.forEach((x, i) => {
    const body = x.blocks
      .map((b) => {
        const text = esc(b.x);
        if (b.t === "h") return `    <h2>${text}</h2>`;
        if (b.t === "h2") return `    <h3>${text}</h3>`;
        return `    <p>${text}</p>`;
      })
      .join("\n");

    const firstP = (x.blocks.find((b) => b.t === "p") || {}).x || x.title;
    const clipped = firstP.slice(0, 155);
    const desc = esc(
      clipped.slice(0, clipped.lastIndexOf(" ")) + (firstP.length > 155 ? "..." : "")
    );

    const nav = [
      i > 0
        ? `    <a href="/bro/notes/${notes[i - 1].slug}.html"><span>Previous</span>${esc(notes[i - 1].title)}</a>`
        : '    <a href="/bro/"><span>Back to</span>All notes</a>',
      i < total - 1
        ? `    <a href="/bro/notes/${notes[i + 1].slug}.html"><span>Next</span>${esc(notes[i + 1].title)}</a>`
        : '    <a href="/books/"><span>Next</span>See the books</a>',
    ].join("\n");

    const page = `
  <div class="wrap">
    <p class="crumbs"><a href="/bro/">Bro 2 Bro</a> / Note ${pad3(x.n)}</p>
  </div>

  <div class="reader reader-head">
    <span class="eyebrow">${esc(x.kicker || x.part)}</span>
    <h1>${esc(x.title)}</h1>
    <p class="note" style="margin-top:14px;font-family:var(--mono);font-size:.76rem;letter-spacing:.08em;text-transform:uppercase">Note ${pad3(x.n)} of ${total} &middot; ${x.words} words &middot; ${esc(x.part)}</p>
  </div>

  <article class="reader reader-body">
${body}
  </article>

  <div class="reader-nav">
${nav}
  </div>

  <section class="downloads">
    <div class="wrap sec-head center">
      <span class="eyebrow o">Bro 2 Bro</span>
      <h2>Read the whole thing.</h2>
      <p class="lead">All ${total} notes, free, in order or in any order you like.</p>
      <div class="cta-row" style="justify-content:center">
        <a class="btn btn-primary btn-lg" href="/bro/">All notes ${ARROW}</a>
      </div>
    </div>
  </section>
`;

    write(`bro/notes/${x.slug}.html`, shell({
      title: `${esc(x.title)} | Bro Nobody Told Me`,
      desc,
      canon: `/bro/notes/${x.slug}.html`,
      og: "bro",
      page: "bro",
      ogtype: "article",
      body: page,
    }));
  });

  const index = notes.map((x) => ({ n: x.n, slug: x.slug, title: x.title, part: x.part }));
  write("bro/notes.json", JSON.stringify(index, null, 1) + "\n");

  console.log(`bro/index.html + ${total} note pages + bro/notes.json`);
}

/* ------------------------------------------------------------------- main */

const TASKS = { books: buildBooks, pages: buildPages, bro: buildBro };
const which = process.argv[2];

if (which && !TASKS[which]) {
  console.error(`unknown target "${which}". One of: ${Object.keys(TASKS).join(", ")}`);
  process.exit(1);
}

/* books before pages: /books/index.html lifts its rows out of index.html, and
   the individual book pages are what those rows link to. */
(which ? [which] : ["books", "pages", "bro"]).forEach((k) => TASKS[k]());
