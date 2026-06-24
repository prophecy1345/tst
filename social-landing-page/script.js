/* TST Social — interactions, modal, forms, scaled layout */
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

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var input = $('input', modal);
    if (input) setTimeout(function () { input.focus(); }, 60);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
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
      showToast("Thanks! You're on the list 💚");
    });

    var inp = $('input[type="email"]', form);
    if (inp) inp.addEventListener('input', function () { inp.classList.remove('invalid'); });
  }

  handleForm($('#subscribeForm'));
  handleForm($('#modalForm'), closeModal);

  /* ---------- Mobile nav toggle (opens modal as simple CTA fallback) ---------- */
  var toggle = $('.nav__toggle');
  if (toggle) toggle.addEventListener('click', openModal);

  /* ---------- Fit 2560px design to viewport width ---------- */
  var DESIGN_WIDTH = 2560;
  var page = $('.page');
  var viewport = $('.viewport');
  var fitFrame = 0;

  function fitPage() {
    if (!page || !viewport) return;
    var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    var scale = Math.min(1, viewportWidth / DESIGN_WIDTH);

    page.style.transform = 'scale(' + scale + ')';

    if (fitFrame) cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(function () {
      fitFrame = 0;
      var height = page.getBoundingClientRect().height;
      viewport.style.height = Math.ceil(height) + 'px';
    });
  }

  function watchPageSize() {
    if (!page) return;
    if (window.ResizeObserver) {
      new ResizeObserver(fitPage).observe(page);
    }
    page.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', fitPage, { once: true });
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitPage);
    }
  }

  window.addEventListener('resize', fitPage, { passive: true });
  window.addEventListener('orientationchange', fitPage);
  window.addEventListener('load', fitPage);
  watchPageSize();
  fitPage();
})();
