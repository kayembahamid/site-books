# books.hamcodes.com

The reading side of the Hamcodes family: the books, the free workbook, the
blog, Bro 2 Bro and the mentorship pitch. netizen.hamcodes.com keeps the
games, the comic and the Digital Citizen course.

## This site is a migration, not a rebuild

Every section here was moved across from netizen.hamcodes.com rather than
reinvented: the header, the hero with the walking bot and the book shelf, the
audience strip, the workbook with its email gate, the alternating book rows,
the three blog series, the Bro 2 Bro band and the mentorship gallery.

`main.css` is ported from netizen's `styles.css` and keeps its class names, so
a fix on one site can be carried to the other by hand. The retheme happens in
`tokens.css`: the palette is defined under its own names and netizen's token
names are kept as aliases pointing at it. That alias block is what lets the
ported rules work unchanged.

`index.html` is hand-authored and is the source of truth for section markup.
`scripts/build.js` lifts whole sections out of it to build /books/, /blog/,
/resources.html, /mentorship.html and 404.html, so a page and the home page
cannot drift apart.

## The stack is HTML, CSS and JS

Nothing else, on the site or in the tooling, the same as every other Hamcodes
site. No framework, no bundler, no dependencies. The build is Node because
Node is JS:

    node scripts/build.js          the whole site
    node scripts/build.js books    just the four book pages
    node scripts/build.js pages    just the pages lifted from the home page
    node scripts/build.js bro      just Bro 2 Bro
    node scripts/og.js             the ten social cards

`build.js` is idempotent. Run it twice and nothing changes. If a page differs
after a run, that page was edited by hand and the edit belongs in `build.js`
instead, not in the page.

It has exactly three sources: `index.html` for the shared sections, the
`BOOKS` table inside `build.js`, and `scripts/data/notes.json` for Bro 2 Bro.
Nothing reaches a generated page from anywhere else.

## Palette: off-white and maroon

Off-white ground, white cards, deep maroon primary. The thing that carries the
brand is the maroon glow: a soft coloured shadow under buttons, covers and
cards rather than a hard border.

| Token           | Hex       | Role                                       |
| --------------- | --------- | ------------------------------------------ |
| `--ground`      | `#FAF7F5` | off-white page                             |
| `--paper`       | `#FFFFFF` | cards                                      |
| `--paper-2`     | `#F3EBE8` | tinted band                                |
| `--paper-3`     | `#EFE3DF` | deepest paper, the audience strip          |
| `--ink`         | `#1E1013` | primary text                               |
| `--ink-2`       | `#5C4449` | secondary text                             |
| `--ink-3`       | `#7A5F66` | meta                                       |
| `--maroon`      | `#8C1C2F` | primary                                    |
| `--maroon-2`    | `#AE2739` | hover and second accent                    |
| `--maroon-soft` | `#F6E7E9` | tint behind eyebrows and badges            |
| `--maroon-line` | 22% maroon| the hairline inside a tinted chip          |
| `--deep`        | `#45101C` | dark surfaces                              |
| `--band`        | `#2A0C16` | header, hero, Bro 2 Bro band, footer       |
| `--gold`        | `#C9962C` | the one warm accent that sits with it      |
| `--gold-ink`    | `#7A5A12` | that gold, dark enough to read on paper    |
| `--rose`        | `#E8A9B2` | the light maroon that reads on a dark band |
| `--rule`        | `#E9DDD9` | borders                                    |

`--glow`, `--glow-lg` and `--glow-soft` are the maroon shadows. Use those in
preference to a neutral shadow anywhere something lifts off the page.

### The page reads off-white

Three surfaces run deep and they are the only ones: the header, the hero, and
the Bro 2 Bro band into the footer. Everything between them is paper. That is
the rule to hold the next time a section is added, because it is what makes
the site read off-white and maroon rather than maroon with pale gaps.

    header      deep     the bar, on every page
    hero        deep     the one dark opening
    audience    paper-3  the moment the page turns to paper
    workbook    paper-2  into ground
    books       paper
    blog        ground
    Bro 2 Bro   deep     the one dark band in the middle, and it earns it:
                         the screenshot inside it is a dark site
    mentorship  ground   with the apply card inverted to deep, so the CTA
                         still lands hardest on the page
    footer      deep

The mentorship card is the only inverted surface on a paper section. If a
second one appears, one of them is wrong.

### Grain

`--grain` is one tile of fractal noise, laid over the whole page by
`body::after` at 3.5% and multiplied. It is what stops the off-white reading
as flat `#FAF7F5`. It is fixed, it never takes a pointer event, and it sits
under the header. Do not raise the opacity: past about 5% it stops being
paper and starts being dots.

## The workbook gate

The downloads sit behind an email capture, the same as netizen. `main.js`
reveals the six download rows on submit and remembers the unlock in
`localStorage` under `hamcodes-books-unlocked`, so a returning visitor is not
asked twice. Every storage call is wrapped, so a blocked or private-mode
browser just sees the form.

The address is not sent anywhere yet. Wire the form to a list provider when
there is one; the submit handler is the only place to change.

## Type

Loaded from Google Fonts in one `<link>` in every page head.

- Display: Sora, 500 to 800. Headlines, wordmark, section titles.
- Body: Plus Jakarta Sans, 300 to 700. Prose, buttons, UI.
- Mono: JetBrains Mono. Eyebrows, meta labels, note numbers, code.

## Copy rules

- No em dashes anywhere. Use a comma, a full stop, or rewrite the sentence.
- No horizontal dividers. Separate sections with space and with a background
  colour shift (`section.tint`, `section.paper`).
- English only. Do not add a language switch.
- Ranges are written "ages 8 to 12", not with a dash.

## Structure

    index.html              hand-authored, and the source of the shared sections
    books/index.html        all books
    books/<slug>.html       one page per book, four of them
    bro/index.html          Bro 2 Bro table of contents
    bro/notes/NNN-slug.html one page per note, 62 of them
    bro/notes.json          generated index of the notes, for future tooling
    blog/index.html         the three series, lifted from the home page
    resources.html          the workbook and five worksheets
    mentorship.html         Private Tech Mentorship pitch and apply
    404.html
    partials/header.html    injected on every page by include.js
    partials/footer.html    injected on every page by include.js
    partials/icons.html     the SVG sprite every page draws its icons from
    assets/css/tokens.css   the palette, the only place colour is defined
    assets/css/main.css     layout and components
    assets/js/include.js    fetches and injects the partials
    assets/js/main.js       the workbook gate, the header, reveal on scroll
    assets/img/hero-bot.png Ham the robot, the home hero and the home OG card
    assets/img/books/       the four cover mockups, png and webp
    assets/og/              per-page social cards, ten of them
    assets/workbook/        the workbook and the five worksheets
    scripts/build.js        the whole site: books, pages, Bro 2 Bro
    scripts/data/notes.json the Bro 2 Bro notes, vendored from the book repo
    scripts/og.js           shoots the social cards in headless Chrome
    scripts/og/card.html    the card itself, drawn in the site's own CSS
    scripts/og/cards.js     the ten cards as data, read by both of the above
    .assetsignore           what Cloudflare Pages leaves out of a deploy

### Partials

Every page carries two empty hosts:

    <header class="site-header" data-include="/partials/header.html"></header>
    <footer class="site-footer" data-include="/partials/footer.html"></footer>

`include.js` fills them on `DOMContentLoaded`. It also re-creates any `<script>`
inside a partial, because `innerHTML` does not execute scripts and the
analytics tag lives in the header partial.

Each page sets `<body data-page="...">`. `include.js` reads that and marks the
matching nav link with `aria-current="page"`.

### Header

Four items plus the workbook CTA:

    Books · Bro 2 Bro · Mentorship · Games ↗ · [Free workbook]

"Games ↗" points at netizen.hamcodes.com. The blog is reachable from the home
page and the footer, not from the top nav.

### Footer

The same six-link family bar as netizen.hamcodes.com, in the same order:

    Netizen · Books · Shop · Mentorship · Hacker's Notes · Hi Garten

Byline: "A Hamcodes project. Built in Hanoi."

This bar is what makes the two sites read as one organisation. Change it here
and change it on netizen at the same time.

### Mascot

Ham the robot lives on this site now, not on netizen. He sits to the right of
the home hero, waving, and the home OG card reuses the same file.

One asset, `assets/img/hero-bot.png`, a 3D render on a transparent background.
The earlier `mascot.*` set, a webp pair and a png, was a second copy of the
same character that nothing referenced, and it is gone.

The spec asked for a CSS wave on the arm. The render is already mid-wave and a
raster cannot have one limb rotated, so the motion is a slow walk on the whole
character instead, `@keyframes bot-walk` with `bot-shadow` under it, both
disabled under `prefers-reduced-motion`. If the arm ever needs to move on its
own, the render has to come out as two layers, body and arm, and the arm gets
its own element.

The speech bubble stays HTML, so the line changes without touching the art.

## Where the content came from

Everything on this site is real. The book copy, ages, cover art, Amazon links,
workbook files, blog posts and the mentorship form URL were all taken from the
live netizen.hamcodes.com repo (`site-digital-netizenship`) on 21 Sep 2026,
which is where they lived before the split.

The `BOOKS` table in `scripts/build.js` holds the book data as one table. If a
fact is not in that table it does not appear on the page, which is the rule
that keeps the book pages honest. Page counts, lesson counts and chapter lists
are not in it because netizen never published them.

The blog is an aggregator, not a host. The 54 posts still live on
hamcodes.com and the cards link out to them. Moving the bodies here is build
order step 2 and needs the Shopify export.

Nothing on the site 404s.

### One thing the spec and the site disagree on

The split spec says "free workbook, no sign-up". The site kept netizen's email
gate instead, and `main.js` implements it. That was a deliberate choice, to
keep the two sites behaving the same, but it is the one place the site does
not do what the spec says. Removing the gate is a small change: delete the
form from the workbook section and drop `wireGate` from `main.js`.

## Book covers

The four covers are 500x500 product mockups, not flat cover art, so
`.book-cover` is a 1:1 image box rather than a drawn block. Served as webp
with a png fallback. Source files are `assets/books/*.png` in the netizen repo.

## OG cards

Ten cards in `assets/og/`, 1200x630. Regenerate after a copy change:

    node scripts/og.js               all ten
    node scripts/og.js bro.png       just that one

A card is a web page. `scripts/og/card.html` draws it with `tokens.css` and
the site's own Google Fonts, `scripts/og/cards.js` holds the ten as data, and
`scripts/og.js` serves the repo and screenshots the page once per card in
headless Chrome. So a card cannot drift off the palette: it is painted by the
same stylesheet the site is.

Chrome is the only thing it needs beyond Node. Set `CHROME` if the binary is
somewhere unusual.

Two things worth knowing before editing it. The card page carries no grain,
because per-pixel noise is what PNG compresses worst and it took a card from
25 KB to 270 KB for texture nobody sees at feed size. And `og.js` spawns
Chrome asynchronously on purpose: the HTTP server is in that same process, so
a synchronous spawn deadlocks, Chrome waiting on a page the script is too
busy to serve.

## Bro 2 Bro

The 62 note pages are generated from `scripts/data/notes.json`, which is the
book's own markdown as exported by `build-notes.js` in the Bro 2 Bro repo.
That file is vendored here on purpose: the build used to read it out of a
sibling checkout by absolute path, which meant the site could only be built on
one machine.

The source has 64 notes, of which three are GitBook front matter, a
language-switch page, a duplicate table of contents and an app page, that do
not belong here. `DROP` in `build.js` names them. That leaves 62.

Regenerate after a book edit, having first re-exported `notes.json`:

    node scripts/build.js bro

Notes are numbered in reading order. The number is part of the filename, so
renumbering after an insert changes URLs. Prefer appending.

## Still to do, from the split spec

1. Migrate the remaining blog posts from hamcodes.com. The blog is an
   aggregator until then.
2. Add the 301 from brotobro.hamcodes.com to books.hamcodes.com/bro. That one
   is a DNS and Pages job on the brotobro project, not a change in this repo.
3. On netizen: strip everything that now lives here, and point its
   "Books ↗" link at this site. That is Prompt 2 in the split spec.
4. Wire the workbook form to a list provider. The address it collects is not
   sent anywhere yet.

## Deploy

Cloudflare Pages, the same as every other Hamcodes site. Repo is
`github.com/kayembahamid/site-books`, branch `main`, Pages project
`books-hamcodes`.

Two ways to publish, matching the rest of the family:

    ./deploy.sh          # direct upload, goes live in about a minute

or connect the repo in the Cloudflare dashboard for push-to-deploy. Project
settings: no build command, output directory `/`, production branch `main`.

`deploy.sh` is the same script netizen, hacker and higarten use, with the
project name changed. The first run opens a browser to log into Cloudflare.

The naming convention across the family is `<subdomain>-hamcodes` for the
Pages project: netizen-hamcodes, hacker-hamcodes, higarten-hamcodes, and now
books-hamcodes.

`_headers` carries the security headers and the cache rules. `_redirects`
carries the one legacy route. `.assetsignore` keeps `scripts/`, `CLAUDE.md`
and `deploy.sh` out of the deployment, so the build tooling and these notes
stay in the repo and off the public site. All three are Cloudflare Pages
files and are ignored by the local `python3 -m http.server` preview.

One Pages behaviour to know: it serves `foo.html` at both `/foo` and
`/foo.html`, and redirects the `.html` form to the extensionless one. Internal
links here are written with `.html`, so each takes one extra hop. Dropping the
extensions would break the local preview server, which does not do
extensionless routing, so the hop was left in. If it ever matters, change the
links and preview with a server that resolves extensionless paths.

## Accessibility: the maroon clears AA

This section used to warn that the brand red could not carry small text. That
was the netizen red, `#E63946`, and it has not been on this site since the
retheme. The maroon has a lot more room:

| Pair                            | Ratio | WCAG AA small text |
| ------------------------------- | ----- | ------------------ |
| `--maroon` on `--ground`        |  8.48 | passes             |
| `--maroon` on `--maroon-soft`   |  7.55 | passes             |
| `--paper` on `--maroon`         |  9.04 | passes             |
| `--paper` on `--maroon-2`       |  6.67 | passes             |
| `--ink` on `--ground`           | 17.29 | passes             |
| `--ink-2` on `--ground`         |  8.28 | passes             |
| `--ink-3` on `--paper-3`        |  4.57 | passes, just       |
| `--gold-ink` on `--ground`      |  5.97 | passes             |
| `--ink` on `--gold`             |  6.27 | passes             |
| `--rose` on `--band`            |  9.25 | passes             |
| `--on-dark` on `--band`         | 15.66 | passes             |

Two rules keep it that way.

`--gold` is a fill, never a text colour on paper. At 2.50 on `--ground` it
fails badly. Small text that wants to be gold uses `--gold-ink`. On a dark
band the plain `--gold` is fine, 6.78 on `--band`.

`--ink-3` is the tightest pair on the site, 4.57 against `--paper-3`. It was
`#8B6F75`, which measured 3.61 there and failed. Do not lighten it back.

## Motion

Two pieces, both in `main.js`, both additive.

The header takes `.is-stuck` past 12px of scroll and firms up, because it
starts life on the dark hero and only needs an edge once paper is passing
underneath.

Sections rise into place as they arrive, through one IntersectionObserver over
a list of selectors. The markup carries no reveal attributes: `main.js` adds
`data-reveal` itself and puts `.js-reveal` on `<html>`, and the CSS hides
nothing unless that class is there. So a page with JS off, an old browser
with no IntersectionObserver, or a visitor who has asked for reduced motion
gets every section visible from the first paint. Check that this still holds
before touching either half.
