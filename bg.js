/* The room behind the page: the four covers, faint and maroon, drifting up
   as you scroll the way the notes drift on brotobro.hamcodes.com.

   Everything here is transform-only on a fixed layer, so it never touches
   layout and never fires a reflow. With reduced motion asked for, the covers
   are placed once and then left alone. */
(function () {
  var layer = document.getElementById("drift");
  if (!layer) return;

  var COVERS = [
    { src: "assets/books/cover/kids.png",      ar: "244 / 268" },
    { src: "assets/books/cover/teens.png",     ar: "244 / 268" },
    { src: "assets/books/cover/robot.png",     ar: "244 / 375" },
    { src: "assets/books/cover/educators.png", ar: "244 / 375" }
  ];

  var still = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ghosts = [], field = 0, raf = 0, scroll = 0, t0 = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    layer.innerHTML = "";
    ghosts = [];

    var vw = window.innerWidth;
    var n = vw < 700 ? 7 : vw < 1200 ? 11 : 15;
    field = window.innerHeight * 2;

    for (var i = 0; i < n; i++) {
      var cover = COVERS[i % COVERS.length];
      var el = document.createElement("span");
      el.className = "cover-ghost";
      el.style.backgroundImage = "url('" + cover.src + "')";
      el.style.setProperty("--ar", cover.ar);

      // small ones sit further back: fainter, and they move slower
      var depth = rand(0, 1);
      var w = (vw < 700 ? 88 : 120) + depth * (vw < 700 ? 90 : 150);
      el.style.setProperty("--w", w.toFixed(0) + "px");
      el.style.setProperty("--op", (0.035 + depth * 0.075).toFixed(3));
      el.style.setProperty("--rot", rand(-16, 16).toFixed(1) + "deg");
      el.style.left = rand(-6, 94).toFixed(2) + "%";
      el.style.top = "0";

      ghosts.push({
        el: el,
        y: rand(0, field),
        speed: 0.10 + depth * 0.34,   // parallax against the page
        amp: 8 + depth * 16,          // how far it bobs
        freq: rand(0.05, 0.13),
        phase: rand(0, Math.PI * 2)
      });
      layer.appendChild(el);
    }
    place(0);
  }

  function place(time) {
    for (var i = 0; i < ghosts.length; i++) {
      var g = ghosts[i];
      var bob = still ? 0 : Math.sin(time * g.freq + g.phase) * g.amp;
      var y = g.y - scroll * g.speed + bob;
      y = ((y % field) + field) % field;          // wrap, so they keep coming
      g.el.style.transform =
        "translate3d(0," + (y - field * 0.25).toFixed(1) + "px,0) rotate(var(--rot))";
    }
  }

  function step(now) {
    if (!t0) t0 = now;
    place((now - t0) / 1000);
    raf = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(raf);
    if (still) { place(0); return; }
    t0 = 0;
    raf = requestAnimationFrame(step);
  }

  var queued = false;
  window.addEventListener("scroll", function () {
    scroll = window.scrollY || window.pageYOffset || 0;
    if (still && !queued) {
      queued = true;
      requestAnimationFrame(function () { queued = false; place(0); });
    }
  }, { passive: true });

  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () { build(); start(); }, 200);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });

  scroll = window.scrollY || 0;
  build();
  start();
})();
