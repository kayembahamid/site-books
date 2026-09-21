/* main.js — small page behaviour. Nothing here is needed for a page to render. */

(function () {
  var STORAGE_KEY = "hamcodes-books-unlocked";

  /* The workbook gate. Same behaviour as netizen: an email unlocks the
     download rows, and the unlock is remembered so a returning visitor is
     not asked twice. The address is kept locally; wire the form to a list
     provider when there is one. */
  function reveal() {
    var ok = document.getElementById("gateSuccess");
    var links = document.getElementById("unlockedLinks");
    var form = document.getElementById("gateForm");
    if (ok) ok.classList.add("show");
    if (links) links.classList.add("show");
    if (form) form.style.display = "none";
  }

  function wireGate() {
    var form = document.getElementById("gateForm");
    if (!form) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") reveal();
    } catch (e) { /* private mode, blocked storage: show the form */ }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("gateEmail");
      if (email && !email.checkValidity()) { email.reportValidity(); return; }
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e2) { /* fine */ }
      reveal();
    });
  }

  function wireYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function wireCurrent() {
    var here = document.body.getAttribute("data-page");
    if (!here) return;
    var link = document.querySelector('.nav-links [data-nav="' + here + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  /* The header sits on the hero, which is dark, so it only needs to firm up
     once the page has scrolled past it and paper is passing underneath. */
  function wireHeader() {
    var head = document.querySelector(".site-header");
    if (!head) return;
    var ticking = false;
    function apply() {
      head.classList.toggle("is-stuck", window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  }

  /* Sections rise into place as they arrive. The hidden state is scoped to
     .js-reveal on <html>, which only this function sets, so a page with no
     JS, no IntersectionObserver, or reduced motion asked for renders
     everything visible from the start. */
  var REVEAL = ".sec-head, .aud, .dl-grid, .book-row, .blog-row, .brobook-grid, .mentor-grid, .mentor-gallery, .hero-shelf";

  function wireReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var items = document.querySelectorAll(REVEAL);
    if (!items.length) return;
    document.documentElement.classList.add("js-reveal");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    items.forEach(function (el) {
      el.setAttribute("data-reveal", "");
      io.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireGate();
    wireYear();
    wireReveal();
  });

  /* The header arrives after the partial is injected. */
  document.addEventListener("hamcodes:includes-done", function () {
    wireCurrent();
    wireYear();
    wireHeader();
  });
})();
