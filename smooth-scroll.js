(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 1600;
  var rafId = null;

  /* Matches site --ease: cubic-bezier(0.22, 1, 0.36, 1) */
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function clampScrollY(y) {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(y, max));
  }

  function getScrollTarget(el, options) {
    options = options || {};
    var block = options.block || 'start';
    var offset = options.offset || 0;
    var rect = el.getBoundingClientRect();
    var y = window.scrollY + rect.top;

    if (block === 'center') {
      y -= (window.innerHeight - rect.height) / 2;
    } else if (block === 'end') {
      y -= window.innerHeight - rect.height;
    }

    return clampScrollY(y + offset);
  }

  function smoothScrollTo(targetY) {
    targetY = clampScrollY(targetY);

    if (reduced) {
      window.scrollTo(0, targetY);
      return;
    }

    if (rafId) cancelAnimationFrame(rafId);

    var startY = window.scrollY;
    var dist = targetY - startY;
    if (Math.abs(dist) < 2) return;

    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / DURATION, 1);
      window.scrollTo(0, startY + dist * easeOut(progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function smoothScrollToElement(el, options) {
    if (!el) return;
    smoothScrollTo(getScrollTarget(el, options));
  }

  window.smoothScrollTo = smoothScrollTo;
  window.smoothScrollToElement = smoothScrollToElement;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      smoothScrollTo(0);
      return;
    }

    var id = href.slice(1);
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    smoothScrollToElement(target, { block: 'start' });
  });
})();
