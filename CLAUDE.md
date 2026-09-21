# books.hamcodes.com

The reading side of the Hamcodes family. Books, the blog, the free workbooks,
Bro 2 Bro, and the mentorship pitch. Audience is adults and educators.

The play side lives on netizen.hamcodes.com: games, the Backchannel comic, and
the Digital Citizen course. Nothing on this site belongs there and nothing
there belongs here.

## Stack

Plain HTML5, vanilla CSS with custom-property tokens, vanilla JavaScript.
No framework, no build step, no bundler, no TypeScript, no preprocessor.

One `.html` file per route. Vercel and Cloudflare Pages serve these directly
with no build command and the repo root as the publish directory.

Preview locally with a server, not by opening the file. `include.js` uses
`fetch()`, which does not work over `file://`:

    python3 -m http.server 8080

## Palette

Every colour on the site is a custom property in `assets/css/tokens.css`.
No other hex values anywhere, including inside page files.

| Token      | Hex       | Role                                |
| ---------- | --------- | ----------------------------------- |
| `--ground` | `#FFF8EC` | warm cream page ground              |
| `--paper`  | `#FFFFFF` | card surface                        |
| `--paper-2`| `#F5EDD9` | tinted section, aside               |
| `--ink`    | `#1A1108` | espresso, primary text              |
| `--ink-2`  | `#5C4A38` | secondary text                      |
| `--ink-3`  | `#8B7355` | warm khaki, meta                    |
| `--brand`  | `#E63946` | Hamcodes red, primary, everywhere   |
| `--gold`   | `#FFB627` | chapter numbers, badges, foil       |
| `--teal`   | `#0F766E` | secondary CTA, links                |
| `--deep`   | `#5C3D2E` | book spines, dark strips            |
| `--rule`   | `#E5DCC5` | borders                             |

Bright the way a well-lit indie bookshop is bright, not the way a neon sign
is bright. The neon palette belongs to Netizen.

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
    blog/index.html         three verticals as tabs
    blog/posts/<slug>.html  article reader
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
    assets/og/              per-page social cards, 11 of them
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

## What still needs real assets

The scaffold is complete and every page renders. These are content drops, not
code changes:

- `assets/workbook/*.pdf`: the six PDFs are linked and named, files not present.
  This is the only thing on the site that 404s.
- `assets/img/books/`: real cover art. Covers are currently drawn in CSS from
  the palette, which looks deliberate rather than unfinished, so this is an
  upgrade and not a gap.
- Book descriptions, page counts and chapter lists in `books/*.html` are
  written to the right shape and need the author's final numbers.
- The blog has one full article. The rest of the 60+ posts migrate from
  hamcodes.com in build order step 2.
- The Amazon links on the book pages point at a search, not at an ASIN.
- The mentorship apply button points at `https://forms.gle/`, needs the real
  form URL.

## OG cards

Eleven cards in `assets/og/`, 1200x630, generated in the Books palette with the
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
