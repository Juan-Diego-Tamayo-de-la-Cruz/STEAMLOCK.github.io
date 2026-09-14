/* ==========================================================
   SteamLock — cube.js
   El ensamblaje del cubo corre en CSS. Este archivo solo agrega
   el seguimiento del puntero, y se desactiva si la persona pidió
   menos movimiento o está en una pantalla táctil.
   ========================================================== */

(function () {
  var svg = document.getElementById('cube');
  var wrap = document.getElementById('cubeWrap');
  if (!svg || !wrap) return;

  var quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (quiet || !fine) return;

  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var running = false;

  function onMove(e) {
    var r = svg.getBoundingClientRect();
    var nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
    var ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
    target.x = Math.max(-1, Math.min(1, nx)) * 14;
    target.y = Math.max(-1, Math.min(1, ny)) * 9;
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    current.x += (target.x - current.x) * 0.07;
    current.y += (target.y - current.y) * 0.07;

    wrap.style.transform =
      'translate(' + current.x.toFixed(2) + 'px,' + current.y.toFixed(2) + 'px)';

    if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  // El transform de CSS ya no debe pelear con el de JS una vez que empieza.
  wrap.style.transition = 'none';
  window.addEventListener('mousemove', onMove, { passive: true });
})();
