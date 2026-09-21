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
`scripts/gen_pages.py` lifts whole sections out of it to build /books/,
/blog/, /resources.html, /mentorship.html and 404.html, so a page and the home
page cannot drift apart.

## Palette: off-white and maroon

Off-white ground, white cards, deep maroon primary. The thing that carries the
brand is the maroon glow: a soft coloured shadow under buttons, covers and
cards rather than a hard border.

| Token           | Hex       | Role                                  |
| --------------- | --------- | ------------------------------------- |
| `--ground`      | `#FAF7F5` | off-white page                        |
| `--paper`       | `#FFFFFF` | cards                                 |
| `--paper-2`     | `#F3EBE8` | tinted band                           |
| `--ink`         | `#1E1013` | primary text                          |
| `--ink-2`       | `#5C4449` | secondary text                        |
| `--ink-3`       | `#8B6F75` | meta                                  |
| `--maroon`      | `#8C1C2F` | primary                               |
| `--maroon-2`    | `#AE2739` | hover and second accent               |
| `--maroon-soft` | `#F6E7E9` | tint behind eyebrows and badges       |
| `--deep`        | `#45101C` | dark surfaces                         |
| `--band`        | `#2A0C16` | header, audience, Bro 2 Bro band      |
| `--gold`        | `#C9962C` | the one warm accent that sits with it |
| `--rule`        | `#E9DDD9` | borders                               |

`--glow`, `--glow-lg` and `--glow-soft` are the maroon shadows. Use those in
preference to a neutral shadow anywhere something lifts off the page.

The page runs dark at the top and bottom and light in the middle, the same
rhythm netizen uses: maroon header and hero, dark audience strip, off-white
workbook, white books, off-white blog, then the dark Bro 2 Bro and mentorship
bands into the footer.

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

    index.html              hero with mascot, book grid, Bro strip, blog, mentorship
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
    assets/css/tokens.css   the palette, the only place colour is defined
    assets/css/main.css     layout and components
    assets/js/include.js    fetches and injects the partials
    assets/js/main.js       blog tabs, small interactions
    assets/img/mascot.*     Ham the robot: webp at two sizes, png fallback
    assets/img/books/       the four cover mockups, png and webp
    assets/og/              per-page social cards, 11 of them
    scripts/gen_books.py    regenerates the book pages from one data table
    scripts/gen_pages.py    builds the other pages from the home page sections
    scripts/gen_bro.py      regenerates the Bro notes from the book source
    scripts/gen_og.py       regenerates the OG cards
    assets/workbook/        the six PDF downloads

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
the home hero, waving, with the bubble "Hi. Let's read something."

The artwork is the 3D render from `course-the-digital-citizen/Netizen covers
Games/Hero BUILD A BOT.png`, trimmed to its alpha bounding box and resized.
The hero serves it through a `<picture>`: webp at 380 and 760 wide, with a
quantised png fallback. Source render is 2046x3072 and 2.6 MB, the webp the
page actually loads is 38 KB.

The spec asked for a CSS wave on the arm. The render is already mid-wave and a
raster cannot have one limb rotated, so the motion is a slow hover on the whole
character instead, `@keyframes ham-hover`, disabled under
`prefers-reduced-motion`. If the arm ever needs to move on its own, the render
has to come out as two layers, body and arm, and the arm gets its own element.

The speech bubble stays HTML, so the line changes without touching the art.
`assets/img/mascot.svg` is the earlier flat placeholder, kept only as a
fallback sketch. Nothing references it.

## Where the content came from

Everything on this site is real. The book copy, ages, cover art, Amazon links,
workbook files, blog posts and the mentorship form URL were all taken from the
live netizen.hamcodes.com repo (`site-digital-netizenship`) on 21 Sep 2026,
which is where they lived before the split.

`scripts/gen_books.py` holds the book data as one table. If a fact is not in
that table it does not appear on the page, which is the rule that keeps the
book pages honest. Page counts, lesson counts and chapter lists are not in it
because netizen never published them.

The blog is an aggregator, not a host. The 54 posts still live on
hamcodes.com and the cards link out to them. Moving the bodies here is build
order step 2 and needs the Shopify export.

Nothing on the site 404s.

### Still open

- The workbook on netizen sits behind an email gate. Here it downloads
  directly, because the split spec says "free workbook, no sign-up". If the
  gate is meant to follow it here, that is a deliberate change, not an
  oversight.

## Book covers

The four covers are 500x500 product mockups, not flat cover art, so
`.book-cover` is a 1:1 image box rather than a drawn block. Served as webp
with a png fallback. Source files are `assets/books/*.png` in the netizen repo.

## OG cards

Ten cards in `assets/og/`, 1200x630, generated in the Books palette with the
real Sora and JetBrains Mono. Regenerate after a copy change:

    python3 scripts/gen_og.py

The script needs Pillow and the three font files. It reads its font path from a
constant at the top; point that at wherever the TTFs live.

## Bro 2 Bro

The 62 note pages are generated from the book's own markdown, by way of
`notes.js` in the Bro 2 Bro repo. The build spec said 67 notes; the source
has 64, of which two are GitBook front matter (a language-switch page and a
duplicate table of contents) that do not belong here. That leaves 62.

Regenerate after a book edit:

    python3 scripts/gen_bro.py

Notes are numbered in reading order. The number is part of the filename, so
renumbering after an insert changes URLs. Prefer appending.

## Still to do, from the split spec

1. Drop the six workbook PDFs into `assets/workbook/`.
2. Migrate the remaining blog posts from hamcodes.com.
3. Add the 301 from brotobro.hamcodes.com to books.hamcodes.com/bro.
4. Deploy, connect the domain, submit the sitemap.
5. On netizen: strip everything that now lives here, and point its
   "Books ↗" link at this site. That is Prompt 2 in the split spec.

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
carries the one legacy route. Both are Cloudflare Pages files and are ignored
by the local `python3 -m http.server` preview.

One Pages behaviour to know: it serves `foo.html` at both `/foo` and
`/foo.html`, and redirects the `.html` form to the extensionless one. Internal
links here are written with `.html`, so each takes one extra hop. Dropping the
extensions would break the local preview server, which does not do
extensionless routing, so the hop was left in. If it ever matters, change the
links and preview with a server that resolves extensionless paths.

## Accessibility note: the red

Two constraints in the split spec pull against each other. The palette is
fixed ("exactly these tokens, no other hex values") and every page is meant to
score 95+ on Lighthouse accessibility. The Hamcodes red cannot do both for
small text:

| Pair                             | Ratio | WCAG AA small text |
| -------------------------------- | ----- | ------------------ |
| `--brand` on `--ground`          | 3.95  | fails (needs 4.5)  |
| `--paper` on `--brand`           | 4.17  | fails              |
| `--ink` on `--brand`             | 4.47  | fails, just        |

There is no combination of existing tokens that puts small text on the red, or
the red on the cream, at 4.5:1. Everything else on the site was moved above
4.5:1, including the gold chapter numerals, which now sit on a `--deep` chip
(5.54:1) instead of directly on cream (1.66:1).

The palette was kept as specified, so the red eyebrows, the red primary
buttons and the red category tag are the remaining flags. Three ways out, all
the author's call:

1. Leave it. The failing elements are short labels and buttons whose meaning is
   also carried by position and shape. Lighthouse will still flag them.
2. Add one darker red to the palette for text and small UI only, keeping
   `#E63946` for fills and large display type.
3. Raise button and eyebrow type to 19px bold, which moves them into the
   large-text threshold of 3:1.

Nothing else on the site depends on this decision, so it can be made later
without a rewrite.
