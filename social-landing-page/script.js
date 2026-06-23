/* TST Social — interactions: subscribe modal, email validation, toast */
(function () {
  'use strict';

  var modal = document.getElementById('modal');
  var toast = document.getElementById('toast');
  var toastTimer;

  /* ---------- Modal ---------- */
  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var input = modal.querySelector('input');
    if (input) setTimeout(function () { input.focus(); }, 60);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Toast ---------- */
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
      var input = form.querySelector('input[type="email"]');
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
    // clear invalid state while typing
    var inp = form.querySelector('input[type="email"]');
    if (inp) inp.addEventListener('input', function () { inp.classList.remove('invalid'); });
  }

  handleForm(document.getElementById('subscribeForm'));
  handleForm(document.getElementById('modalForm'), closeModal);

  /* ---------- Mobile nav toggle (opens modal as simple CTA fallback) ---------- */
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) toggle.addEventListener('click', openModal);

  /* ---------- Fit 2560px design to viewport width ---------- */
  var DESIGN_WIDTH = 2560;
  var page = document.querySelector('.page');
  var viewport = document.querySelector('.viewport');

  function fitPage() {
    if (!page || !viewport) return;
    var scale = Math.min(1, window.innerWidth / DESIGN_WIDTH);
    page.style.transform = 'scale(' + scale + ')';
    viewport.style.height = page.offsetHeight * scale + 'px';
  }

  window.addEventListener('resize', fitPage);
  window.addEventListener('load', fitPage);
  fitPage();
})();
