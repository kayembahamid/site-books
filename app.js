/* ============================================================
   books.hamcodes.com
   1. The workbook email gate, posting quietly to a Google Form
   2. The header edge, once paper is passing under it
   3. Sections rising into place as they arrive
   ============================================================ */

/* ------------------------------------------------------------------
   The download gate.
   The form has "Collect email addresses" ON, which means Google wants
   BOTH its own emailAddress field AND the custom question. Send one
   without the other and the submission is rejected with a 400 and
   nothing is recorded. To point this at a different form, change these
   two lines: the action is the viewform URL ending /formResponse, and
   the entry id comes from the form's "Get pre-filled link".
------------------------------------------------------------------ */
var FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSfNw2OARi2KXBm90TlcP9iUcCMd8E3OEgPVMPS4_BT3e1qhVw/formResponse";
var FORM_ENTRY = "entry.1045781291";
var STORAGE_KEY = "hamcodes-books-unlocked";

(function gate() {
  var form = document.getElementById("gateForm");
  var rows = document.getElementById("dlRows");
  var done = document.getElementById("gateDone");
  if (!form || !rows || !done) return;

  function reveal(scroll) {
    form.style.display = "none";
    done.classList.add("show");
    rows.classList.add("show");
    if (scroll) rows.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // a returning visitor is not asked twice. Private mode throws here.
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") reveal(false);
  } catch (e) {}

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("gateEmail").value.trim();
    if (!email) return;

    if (FORM_ACTION) {
      var body = new FormData();
      body.append("emailAddress", email);
      if (FORM_ENTRY) body.append(FORM_ENTRY, email);
      fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body: body })
        .catch(function () {});
    }

    try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e2) {}
    reveal(true);
  });
})();

/* ---------------- The header firms up off the hero ---------------- */
(function header() {
  var bar = document.querySelector(".site-header");
  if (!bar) return;
  var queued = false;
  function check() {
    bar.classList.toggle("is-stuck", (window.scrollY || 0) > 12);
  }
  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; check(); });
  }, { passive: true });
  check();
})();

/* ------------------------------------------------------------------
   Reveal on arrival. The markup carries no reveal state of its own, so
   a page with JS off, an old browser, or a visitor who has asked for
   reduced motion sees every section from the first paint.
------------------------------------------------------------------ */
(function reveal() {
  var reduce = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;
  document.documentElement.classList.add("js-reveal");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });

  targets.forEach(function (el) { io.observe(el); });
})();

/* ---------------- Footer year ---------------- */
(function year() {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();
