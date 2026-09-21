#!/usr/bin/env node
/* og.js — regenerate the ten social cards in assets/og/.

       node scripts/og.js               all ten
       node scripts/og.js bro.png       just that one

   It serves the repo, opens scripts/og/card.html once per card in headless
   Chrome at 1200x630, and screenshots it. That keeps the cards on the same
   tokens, the same fonts and the same grain as the pages, because they are
   literally drawn by the site's own CSS.

   Chrome is the only thing it needs beyond Node. Set CHROME to point at it
   if it is somewhere unusual. This does not run as part of build.js: cards
   are regenerated when the copy on them changes, which is rarely. */

"use strict";

const { execFile } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "og");
const CARDS = require("./og/cards.js");
const PORT = 8123;

const CHROME = process.env.CHROME || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("No Chrome found. Install it, or set CHROME to the binary.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const only = process.argv[2];
const todo = only ? CARDS.filter((c) => c.file === only) : CARDS;

if (!todo.length) {
  console.error(`no card called "${only}". One of:\n  ${CARDS.map((c) => c.file).join("\n  ")}`);
  process.exit(1);
}

/* One shot. It has to be async: the server above is this same process, so a
   synchronous spawn would block the event loop and Chrome would wait forever
   for a page this script is too busy to serve. */
function shoot(card, i) {
  const dest = path.join(OUT, card.file);
  return new Promise((resolve) => {
    execFile(CHROME, [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      /* the page sets data-og-ready once the fonts and the mascot have
         landed. The budget is what actually waits for it. */
      "--virtual-time-budget=9000",
      `--screenshot=${dest}`,
      `http://localhost:${PORT}/scripts/og/card.html?i=${i}`,
    ], { timeout: 60000 }, (err) => {
      if (err || !fs.existsSync(dest)) {
        console.error(`  ${card.file.padEnd(26)} FAILED  ${err ? err.message : "no file written"}`);
        return resolve(false);
      }
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`  ${card.file.padEnd(26)} ${String(kb).padStart(3)} KB`);
      resolve(true);
    });
  });
}

server.listen(PORT, async () => {
  fs.mkdirSync(OUT, { recursive: true });

  let ok = 0;
  for (const card of todo) {
    if (await shoot(card, CARDS.indexOf(card))) ok++;
  }

  server.close();
  console.log(`${ok} of ${todo.length} OG cards written`);
  if (ok !== todo.length) process.exitCode = 1;
});
