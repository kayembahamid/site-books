/* main.js
   Small page interactions. Nothing here is required for a page to render. */

(function () {
  /* Blog vertical tabs. Buttons carry data-filter, cards carry data-vertical. */
  function wireTabs() {
    var tabs = document.querySelectorAll('[data-filter]');
    if (!tabs.length) return;
    var cards = document.querySelectorAll('[data-vertical]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var want = tab.getAttribute('data-filter');
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', String(t === tab));
        });
        cards.forEach(function (card) {
          var show = want === 'all' || card.getAttribute('data-vertical') === want;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* Current year in any element with data-year. */
  function wireYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireTabs();
    wireYear();
  });
})();
