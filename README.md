# books.hamcodes.com

The reading side of Hamcodes: the four books, the free workbook, Bro 2 Bro,
the mentorship pitch and the blog. netizen.hamcodes.com keeps the games, the
comic and the Digital Citizen course.

One page, no build step, no dependencies. Deploys as a folder.

## The theme: maroon and off-white

Two colours, and the maroon is the room. The page runs deep maroon from the
header to the footer, the way brotobro.hamcodes.com does, and the blog is the
single page of paper on the site. That contrast is the whole design, so if a
second off-white section ever appears, one of them is wrong.

| Token       | Hex       | Role                                   |
| ----------- | --------- | -------------------------------------- |
| `--ink-0`   | `#100409` | the ground                             |
| `--ink-1`   | `#1a0710` | the top of the room                    |
| `--maroon`  | `#43101f` | the glow behind everything             |
| `--maroon-2`| `#6b1526` | buttons on the paper section           |
| `--rose`    | `#e0687a` | labels, links, the one accent          |
| `--paper`   | `#f4ebdc` | off-white: type on dark, blog ground   |
| `--ink`     | `#2b1a19` | type on the blog                       |

Type is the Bro 2 Bro system: **Fraunces** to say it, **Newsreader** to read
it, **IBM Plex Mono** for every label, button and nav word.

## The covers drift behind the page

`bg.js` fills `#drift`, a fixed layer, with fifteen copies of the four covers.
They are pulled onto the maroon by a CSS filter, blurred, dropped to about a
tenth of full opacity and parallaxed against the scroll, so they read as paper
moving in a room rather than as book covers. Under `prefers-reduced-motion`
they are placed once and never move.

Everything on that layer is transform-only, so it never causes a reflow.

## The book art

`assets/books/cover/` holds the covers the page uses: transparent PNGs, each
carrying its own soft shadow. They came in as 500x500 canvases with the book
floating in the middle, so they are trimmed to what is actually painted,
which is why the art fills its box instead of sitting small inside it. The
untrimmed originals are in `assets/books/source/`.

Because the art is transparent, depth on the page is `drop-shadow`, never
`box-shadow`: a box-shadow would print the rectangle of the image box behind
each book. The same applies to the drifting copies in the background. If a
cover is ever swapped, keep that rule.

Two earlier sets are kept but not served: `assets/books/*.png`, the original
product-photo mockups, and `assets/books/flat/`, flat art cut out of those
photos before the transparent versions arrived.

## Files

```
index.html          the whole site
styles.css          the theme and every component
bg.js               the drifting covers
app.js              workbook gate, header edge, reveal on scroll
assets/books/cover/ the transparent covers the page uses, trimmed
assets/books/source/ those covers as supplied, untrimmed
assets/books/       the older product-photo mockups, not served
assets/ebook/       workbook cover and inside pages
assets/downloads/   the workbook and five worksheets
assets/blog/        blog card art
assets/mentorship/  the programme slides
assets/favicon-512.png  the logo on an off-white tile, rendered from logo.png
assets/og/home.png  the social card
CNAME               books.hamcodes.com
.assetsignore       what Cloudflare Pages leaves out of a deploy
```

## The workbook gate

The six downloads sit behind an email capture. `app.js` posts quietly to the
"Email to Receive the Download" Google Form, then reveals the rows and
remembers the unlock in `localStorage` under `hamcodes-books-unlocked`, so a
returning visitor is not asked twice. Every storage call is wrapped, so a
private-mode browser just sees the form again.

The form has **Collect email addresses ON**, which means Google wants both its
own `emailAddress` field and the custom question `entry.1045781291`. Send one
without the other and the submission is rejected with a 400 and nothing is
recorded. To point it at a different form, change `FORM_ACTION` and
`FORM_ENTRY` at the top of `app.js`.

The form must also allow anonymous responses, or visitors hit a Google login
wall: Form, Settings, Responses, with "Limit to 1 response" and any sign-in
restriction turned off.

## Copy rules

- No em dashes. Use a comma, a full stop, or rewrite the sentence.
- Ranges are written "ages 7 to 15", not with a dash.
- Nothing claims a number the site cannot show. The Bro 2 Bro note count is
  deliberately left out of the copy because the live site and the screenshot
  in this repo disagree about it.

## The hero

The headline, then Ham the robot under it. There is no shelf of four covers
any more: each book gets its own section, and the hero ends on the mascot.

## Local preview

```bash
python3 -m http.server 8123
```

Then http://localhost:8123. Opening `index.html` over `file://` works too, but
the fonts and the drifting covers are happier over HTTP.

## Deploy

Cloudflare Pages, project `books-hamcodes`, no build command, output `/`.

```bash
./deploy.sh
```

The first run opens a browser to log into Cloudflare. Or connect
`github.com/kayembahamid/site-books` in the dashboard for push-to-deploy.

## Still to do

1. Point the `books.hamcodes.com` DNS at the Pages project, and set the custom
   domain there. `CNAME` in this repo only matters to GitHub Pages.
2. The trimmed covers are about 244px wide. They hold up at the size the page
   shows them, but bigger source art would sharpen them on a retina screen.
3. The files listed at the bottom of `.assetsignore` are left over from the
   netizen migration and are no longer referenced by any page. They are kept
   out of the deploy but still sit in the folder; delete them whenever you
   want. Every one of them also exists in `../site-digital-netizenship`.
