/* ==========================================================
   SteamBlock — main.js
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

  /* ---------- Carrusel de capturas ----------
     El desplazamiento lo hace el navegador (scroll-snap): aquí solo van
     las flechas, los puntos y el pie que dice qué se está viendo. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-shots]'), function (shots) {
    var track = shots.querySelector('.shots__track');
    var slides = shots.querySelectorAll('.shots__slide');
    var prev = shots.querySelector('.shots__nav--prev');
    var next = shots.querySelector('.shots__nav--next');
    var count = shots.querySelector('.shots__count');
    var caption = shots.querySelector('.shots__caption');
    var dots = shots.querySelectorAll('.shots__dot');
    var captions = (shots.getAttribute('data-captions') || '').split('|');
    var total = slides.length;
    var actual = 0;

    if (!track || total < 2) return;

    function irA(i) {
      actual = Math.max(0, Math.min(total - 1, i));
      track.scrollTo({ left: slides[actual].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
      pintar();
    }

    function pintar() {
      if (count) count.textContent = (actual + 1) + ' / ' + total;
      if (caption && captions[actual]) caption.textContent = captions[actual];
      Array.prototype.forEach.call(dots, function (dot, i) {
        if (i === actual) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (prev) prev.disabled = actual === 0;
      if (next) next.disabled = actual === total - 1;
    }

    prev.addEventListener('click', function () { irA(actual - 1); });
    next.addEventListener('click', function () { irA(actual + 1); });

    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener('click', function () { irA(i); });
    });

    // Al deslizar con el dedo, el índice lo manda el scroll, no los botones.
    var pendiente;
    track.addEventListener('scroll', function () {
      clearTimeout(pendiente);
      pendiente = setTimeout(function () {
        var ancho = slides[0].getBoundingClientRect().width;
        if (!ancho) return;
        var i = Math.round(track.scrollLeft / ancho);
        if (i !== actual) { actual = Math.max(0, Math.min(total - 1, i)); pintar(); }
      }, 90);
    }, { passive: true });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); irA(actual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); irA(actual - 1); }
    });

    pintar();
  });

  /* ---------- Formulario ---------- */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var done = document.getElementById('formDone');
  var waLink = document.getElementById('waLink');

  /* Número que recibe las solicitudes: 411 241 4051 (lada de México, 52). */
  var WHATSAPP = '524112414051';

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

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(buildMessage());

    if (waLink) waLink.href = url;
    if (done) {
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Se abre en otra pestaña para no perder lo que ya escribió.
    // Si el navegador bloquea la ventana, queda el enlace de respaldo en el aviso.
    var win = window.open(url, '_blank');
    if (win) win.opener = null;
  });

  /* ---------- Armado del mensaje de WhatsApp ---------- */
  function value(name) {
    var el = form.elements[name];
    return el ? el.value.trim() : '';
  }

  function buildMessage() {
    var lines = ['Hola SteamBlock, quiero solicitar una cotización.', ''];

    var campos = [
      ['Nombre', value('nombre')],
      ['Empresa', value('empresa')],
      ['Correo', value('correo')],
      ['Teléfono', value('telefono')],
      ['Qué necesita', value('tipo')]
    ];

    campos.forEach(function (campo) {
      if (campo[1]) lines.push('*' + campo[0] + ':* ' + campo[1]);
    });

    lines.push('', '*Qué está pasando hoy:*', value('mensaje'));

    return lines.join('\n');
  }
})();
