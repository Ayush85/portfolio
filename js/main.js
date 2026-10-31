(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // reveal on scroll
  var rv = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) || reduce) {
    rv.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (e) { io.observe(e); });
  }

  // active nav link
  var links = document.querySelectorAll(".nav ul a[href^='#']");
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var secs = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function onScroll() {
    var y = window.scrollY + 140, cur = null;
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle("on", !!cur && map[cur] === a && !a.classList.contains("cta")); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // pointer spotlight on glass cards
  if (!reduce) {
    document.querySelectorAll(".g.spot").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
})();

// journey path progress
(function () {
  var tl = document.getElementById("path");
  if (!tl) return;
  function upd() {
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    tl.style.setProperty("--prog", Math.max(0, Math.min(1, p)).toFixed(3));
  }
  window.addEventListener("scroll", upd, { passive: true });
  window.addEventListener("resize", upd);
  upd();
})();

// theme toggle
(function () {
  var b = document.querySelector(".tt");
  if (!b) return;
  var root = document.documentElement;
  b.addEventListener("click", function () {
    var t = root.getAttribute("data-theme");
    if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var n = t === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", n);
    try { localStorage.setItem("theme", n); } catch (e) {}
  });
})();
