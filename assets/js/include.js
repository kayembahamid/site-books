/* include.js
   Finds every element with a data-include attribute, fetches that partial
   and injects it. Runs on DOMContentLoaded. Keeps the header and footer in
   one place so a change to either updates every page.

   Note: fetch() will not read partials over file://. Serve the folder
   locally (python3 -m http.server 8080) when previewing. */

(function () {
  function runScripts(host) {
    // innerHTML does not execute <script>, so re-create each one.
    host.querySelectorAll('script').forEach(function (old) {
      var s = document.createElement('script');
      for (var i = 0; i < old.attributes.length; i++) {
        s.setAttribute(old.attributes[i].name, old.attributes[i].value);
      }
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  function markCurrent(host) {
    var here = document.body.getAttribute('data-page');
    if (!here) return;
    var link = host.querySelector('[data-nav="' + here + '"]');
    if (link) link.setAttribute('aria-current', 'page');
  }

  function wireNav(host) {
    var toggle = host.querySelector('[data-nav-toggle]');
    var nav = host.querySelector('#siteNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  function load(host) {
    var url = host.getAttribute('data-include');
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error(url + ' returned ' + res.status);
        return res.text();
      })
      .then(function (html) {
        host.innerHTML = html;
        runScripts(host);
        wireNav(host);
      })
      .catch(function (err) {
        console.error('include.js:', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    Promise.all(hosts.map(load)).then(function () {
      document.dispatchEvent(new CustomEvent('hamcodes:includes-done'));
    });
  });
})();
