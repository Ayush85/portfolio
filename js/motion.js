(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  // stagger index within each parent, list item index
  document.querySelectorAll(".rv").forEach(function (el) {
    var sib = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("rv"); });
    el.style.setProperty("--d", (Math.min(sib.indexOf(el), 5) * 0.09) + "s");
    el.addEventListener("transitionend", function f(e) { if (e.propertyName === "opacity") { el.classList.add("done"); el.removeEventListener("transitionend", f); } });
    setTimeout(function () { if (el.classList.contains("in")) el.classList.add("done"); }, 1800);
  });
  document.querySelectorAll(".pts").forEach(function (ul) {
    Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty("--i", i); });
  });

  // scroll progress
  var bar = function () {
    var h = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--sp", h > 0 ? (window.scrollY / h).toFixed(4) : 0);
  };
  window.addEventListener("scroll", bar, { passive: true }); bar();

  if (reduce) return;

  // count-up for figures
  function countUp(el) {
    var txt = el.textContent, m = txt.match(/(\d+(?:\.\d+)?)/);
    if (!m) return;
    var end = parseFloat(m[1]), dec = (m[1].split(".")[1] || "").length, pre = txt.slice(0, m.index), post = txt.slice(m.index + m[1].length);
    var t0 = null, dur = 1100;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (end * e).toFixed(dec) + post;
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll(".stat b, .num b").forEach(function (b) { cio.observe(b); });

    // product covers play when visible
    var pio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("play"); pio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    document.querySelectorAll(".cover").forEach(function (c) { pio.observe(c); });
  } else {
    document.querySelectorAll(".cover").forEach(function (c) { c.classList.add("play"); });
  }

  // product cards: tilt + replay cover animation on hover
  document.querySelectorAll(".pc").forEach(function (card) {
    var cover = card.querySelector(".cover");
    card.addEventListener("pointermove", function (e) {
      if (!card.classList.contains("done")) return;
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
      card.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
    });
    card.addEventListener("pointerenter", function () {
      if (!cover) return;
      cover.classList.remove("play"); void cover.offsetWidth; cover.classList.add("play");
    });
    card.addEventListener("pointerleave", function () { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  });

  // background parallax
  var nn = document.querySelector(".nn-bg");
  if (nn) window.addEventListener("pointermove", function (e) {
    nn.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * -22).toFixed(1) + "px");
    nn.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * -16).toFixed(1) + "px");
  }, { passive: true });
})();
