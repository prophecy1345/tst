/* TST Social — interactions, modal, forms */
(function () {
  'use strict';

  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  var $$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /* ---------- Modal ---------- */
  var modal = $('#modal');
  var modalFormView = modal ? $('.modal__view--form', modal) : null;
  var modalSuccessView = modal ? $('.modal__view--success', modal) : null;
  var modalSocial = modal ? $('.modal__social', modal) : null;

  function resetModalView() {
    if (!modal) return;
    modal.classList.remove('modal--success');
    if (modalFormView) modalFormView.hidden = false;
    if (modalSuccessView) modalSuccessView.hidden = true;
    if (modalSocial) modalSocial.hidden = false;
  }

  function showModalSuccess() {
    if (!modal) return;
    modal.classList.add('modal--success');
    if (modalFormView) modalFormView.hidden = true;
    if (modalSuccessView) modalSuccessView.hidden = false;
    if (modalSocial) modalSocial.hidden = true;
  }

  function openModal() {
    if (!modal) return;
    resetModalView();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    syncModalViewport();
    var input = $('input', modal);
    if (input) setTimeout(function () { input.focus(); }, 60);
  }

  function openModalSuccess() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    showModalSuccess();
    syncModalViewport();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    resetModalView();
    syncModalViewport();
  }

  /* iOS shrinks and pans the visual viewport when the keyboard opens, but keeps
     `position: fixed` anchored to the layout viewport -- the sheet drifts up and
     the page shows underneath it. Pin the overlay to the visual viewport instead. */
  var vv = window.visualViewport;

  function syncModalViewport() {
    if (!modal || !vv) return;
    if (!modal.classList.contains('open')) {
      modal.style.position = '';
      modal.style.top = '';
      modal.style.left = '';
      modal.style.width = '';
      modal.style.height = '';
      return;
    }
    /* Document coordinates, not `position: fixed`: iOS scrolls the document to
       reveal the focused field even with body overflow hidden, and a fixed
       overlay does not follow the visual viewport there. pageTop/pageLeft are
       the visual viewport's offset within the document, so this lands exactly
       on the visible area whether the keyboard is up, down, or animating. */
    modal.style.position = 'absolute';
    modal.style.top = vv.pageTop + 'px';
    modal.style.left = vv.pageLeft + 'px';
    modal.style.width = vv.width + 'px';
    modal.style.height = vv.height + 'px';
  }

  if (vv) {
    vv.addEventListener('resize', syncModalViewport);
    vv.addEventListener('scroll', syncModalViewport);
  }

  $$('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  $$('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Toast ---------- */
  var toast = $('#toast');
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    if (msg) toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  /* ---------- Email validation + submit ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleForm(form, afterSuccess) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input[type="email"]', form);
      var value = (input.value || '').trim();
      if (!EMAIL_RE.test(value)) {
        input.classList.add('invalid');
        input.focus();
        return;
      }
      input.classList.remove('invalid');
      form.reset();
      if (typeof afterSuccess === 'function') afterSuccess();
    });

    var inp = $('input[type="email"]', form);
    if (inp) inp.addEventListener('input', function () { inp.classList.remove('invalid'); });
  }

  handleForm($('#subscribeForm'), openModalSuccess);
  handleForm($('#modalForm'), showModalSuccess);

  /* ---------- Mobile nav toggle (opens modal as simple CTA fallback) ---------- */
  var toggle = $('.nav__toggle');
  if (toggle) toggle.addEventListener('click', openModal);

  /* ---------- Hero curve stroke animation (all breakpoints) ---------- */
  function initHeroCurveAnimation() {
    // Filter to only the visible SVGs at the current breakpoint
    var visibleCurves = $$('.hero__curve-anim').filter(function (svg) {
      return getComputedStyle(svg).display !== 'none';
    });

    var durations = [1800, 2400, 2000]; // ms per curve (1, 2, 3)

    visibleCurves.forEach(function (svg, i) {
      var path = svg.querySelector('path');
      if (!path) return;

      var length = path.getTotalLength();

      // Set hidden initial state
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
      path.style.willChange = 'stroke-dashoffset';

      // Staggered reveal: curve 1 → 2 → 3
      var delay = 150 + i * 350;
      var duration = durations[i] !== undefined ? durations[i] : 2000;

      setTimeout(function () {
        path.style.transition = 'stroke-dashoffset ' + duration + 'ms cubic-bezier(0.33, 1, 0.68, 1)';
        path.style.strokeDashoffset = '0';
      }, delay);
    });
  }

  if (document.readyState === 'complete') {
    initHeroCurveAnimation();
  } else {
    window.addEventListener('load', initHeroCurveAnimation);
  }

  /* ---------- Reveal animations: underline (Line.svg) + green highlight ---------- */
  /* ---------- Reveal animations: underline, highlight, spark ---------- */

  // Underline + highlight: observe the elements directly
  var textRevealEls = $$('.underline-orange, .highlight-green');
  if (textRevealEls.length && 'IntersectionObserver' in window) {
    var textObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-drawn');
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    textRevealEls.forEach(function (el) { textObserver.observe(el); });
  } else {
    textRevealEls.forEach(function (el) { el.classList.add('line-drawn'); });
  }

  // Spark + Arrow: observe each parent .feature block, reveal the deco inside
  function makeDecoObserver(featureEl, decoEl) {
    if (!featureEl || !decoEl) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            decoEl.classList.add('line-drawn');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
      obs.observe(featureEl);
    } else {
      decoEl.classList.add('line-drawn');
    }
  }

  var featureImgRight = $$('.feature--img-right');

  // Spark — stroke-dashoffset "drawing" animation
  (function () {
    var sparkSvg = $('.feature__deco--spark');
    var sparkFeature = featureImgRight[0];
    if (!sparkSvg || !sparkFeature) return;

    var paths = $$('path', sparkSvg);
    paths.forEach(function (path) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'none';
      path.style.willChange = 'stroke-dashoffset';
    });

    if ('IntersectionObserver' in window) {
      var sparkObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            paths.forEach(function (path, i) {
              setTimeout(function () {
                path.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(0.33, 1, 0.68, 1)';
                path.style.strokeDashoffset = '0';
              }, i * 250);
            });
            sparkObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
      sparkObs.observe(sparkFeature);
    } else {
      paths.forEach(function (path) { path.style.strokeDashoffset = '0'; });
    }
  }());

  // Arrow — stroke-dashoffset animation
  (function () {
    var arrowSvg = $('.feature__deco--arrow');
    var arrowFeature = $('.feature--img-left');
    if (!arrowSvg || !arrowFeature) return;

    var path = arrowSvg.querySelector('path');
    if (!path) return;
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = -len; // negative = старт с конца пути (хвостик → стрелочка)
    path.style.transition = 'none';
    path.style.willChange = 'stroke-dashoffset';

    if ('IntersectionObserver' in window) {
      var arrowObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            path.style.transition = 'stroke-dashoffset 1800ms cubic-bezier(0.33, 1, 0.68, 1)';
            path.style.strokeDashoffset = '0';
            arrowObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
      arrowObs.observe(arrowFeature);
    } else {
      path.style.strokeDashoffset = '0';
    }
  }());

  // Heart — stroke-dashoffset animation
  (function () {
    var heartSvg = $('.feature__deco--heart');
    var heartFeature = featureImgRight[1];
    if (!heartSvg || !heartFeature) return;

    var path = heartSvg.querySelector('path');
    if (!path) return;
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = -len;
    path.style.transition = 'none';
    path.style.willChange = 'stroke-dashoffset';

    if ('IntersectionObserver' in window) {
      var heartObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            path.style.transition = 'stroke-dashoffset 1800ms cubic-bezier(0.33, 1, 0.68, 1)';
            path.style.strokeDashoffset = '0';
            heartObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
      heartObs.observe(heartFeature);
    } else {
      path.style.strokeDashoffset = '0';
    }
  }());

})();
