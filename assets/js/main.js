/* Página de inicio: contador animado del hero + menú móvil. */
(function () {
  "use strict";

  function animateCount(node, target, duration = 900) {
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * eased);
      node.textContent = Viz.compactNumber(val);
      if (p < 1) requestAnimationFrame(frame);
      else node.textContent = Viz.compactNumber(target);
    }
    requestAnimationFrame(frame);
  }

  async function loadResumen() {
    const res = await fetch("data/resumen.csv");
    if (!res.ok) throw new Error(`No se pudo cargar data/resumen.csv (${res.status})`);
    const text = await res.text();
    const rows = CSV.parseCSV(text);
    const get = (sector, metrica) => {
      const row = rows.find((r) => r.sector === sector && r.metrica === metrica);
      return row ? Number(row.valor) : 0;
    };
    return get;
  }

  async function initHero() {
    try {
      const get = await loadResumen();
      const map = {
        "stat-media": get("educacion_media", "estudiantes_total"),
        "stat-superior": get("educacion_superior", "estudiantes_total"),
        "stat-cultura": get("cultura", "gestores_total"),
        "stat-deporte": get("deporte", "alto_rendimiento") + get("deporte", "juegos_nacionales"),
      };
      Object.entries(map).forEach(([id, value]) => {
        const node = document.getElementById(id);
        if (node) animateCount(node, value);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open-mobile");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHero();
    initMobileNav();
  });
})();
