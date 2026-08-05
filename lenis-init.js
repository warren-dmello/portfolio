/* Smooth scroll (Lenis) — site-wide inertial scrolling.
   Exposes window.lenis so smooth-scroll.js routes anchor jumps through it.
   Skipped entirely under reduced-motion (native scroll takes over). */
(function () {
  'use strict';
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
  });
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
