/* ==========================================================
   SteamLock — main.js
   Navegación, revelado de proyectos y validación del formulario.
   ========================================================== */

(function () {
  'use strict';

  /* ---------- Año del pie de página ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Borde del nav al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.dataset.stuck = window.scrollY > 12 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menú en pantallas chicas ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.dataset.open === 'true';
      links.dataset.open = open ? 'false' : 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      toggle.textContent = open ? 'Menú' : 'Cerrar';
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.dataset.open = 'false';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menú';
      }
    });
  }

  /* ---------- Revelado: solo las fichas de proyecto ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.dataset.shown = 'true';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.dataset.shown = 'true'; });
  }

  /* ---------- Formulario ---------- */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var done = document.getElementById('formDone');

  var rules = {
    nombre: {
      test: function (v) { return v.trim().length >= 2; },
      msg: 'Escribe tu nombre.'
    },
    correo: {
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      msg: 'Revisa el correo: falta el @ o el dominio.'
    },
    mensaje: {
      test: function (v) { return v.trim().length >= 12; },
      msg: 'Cuéntanos un poco más para poder responderte bien.'
    }
  };

  function setState(input, ok, msg) {
    var field = input.closest('.field');
    var out = form.querySelector('[data-msg-for="' + input.name + '"]');
    if (field) field.dataset.error = ok ? 'false' : 'true';
    if (out) out.textContent = ok ? '' : msg;
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  function check(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var ok = rule.test(input.value);
    setState(input, ok, rule.msg);
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', function () { check(input); });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') check(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (input && !check(input) && !firstBad) firstBad = input;
    });

    if (firstBad) {
      firstBad.focus();
      return;
    }

    // Aquí va el envío real: fetch a tu endpoint, Formspree, EmailJS, etc.
    // fetch('/api/leads', { method: 'POST', body: new FormData(form) })

    if (done) {
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  });
})();
