/*
 * Página "Información Estadística": sidebar con acordeón + 3 pestañas
 * Marco Conceptual / Visualizador / Base de Datos
 */
(function () {
  "use strict";

  const SECTION_LABELS = {
    "media-estudiantes":       { title: "Educación Media — Estudiantes",                    crumb: "Educación Media / Estudiantes" },
    "media-docentes":          { title: "Educación Media — Docentes",                       crumb: "Educación Media / Docentes" },
    "media-oferta":            { title: "Educación Media — Oferta educativa",               crumb: "Educación Media / Oferta educativa" },
    "media-descomposicion":    { title: "Educación Media — Descomposición de la matrícula", crumb: "Educación Media / Descomposición de la matrícula" },
    "uep-estudiantes":         { title: "UEP — Estudiantes",                                crumb: "Educación Superior / UEP / Estudiantes" },
    "uep-docentes":            { title: "UEP — Docentes",                                   crumb: "Educación Superior / UEP / Docentes" },
    "uep-oferta":              { title: "UEP — Oferta educativa",                           crumb: "Educación Superior / UEP / Oferta educativa" },
    "itts-estudiantes":        { title: "ITTS — Estudiantes",                               crumb: "Educación Superior / ITTS / Estudiantes" },
    "itts-docentes":           { title: "ITTS — Docentes",                                  crumb: "Educación Superior / ITTS / Docentes" },
    "itts-oferta":             { title: "ITTS — Oferta educativa",                          crumb: "Educación Superior / ITTS / Oferta educativa" },
  };

  const headingEl  = document.getElementById("db-heading");
  const crumbEl    = document.getElementById("db-crumb");
  const sourceEl   = document.getElementById("db-source");
  const statsEl    = document.getElementById("db-stats");
  const panelMarco = document.getElementById("panel-marco");
  const panelViz   = document.getElementById("panel-visualizador");
  const panelBd    = document.getElementById("panel-basedatos");

  /* ── Tabs ── */
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById("panel-" + btn.dataset.tab).classList.add("is-active");
    });
  });

  /* ── Acordeón lateral ── */
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".acc-trigger").forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        const p = t.closest(".acc-group").querySelector(".acc-panel");
        if (p) p.style.maxHeight = null;
      });
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        const panel = trigger.closest(".acc-group").querySelector(".acc-panel");
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ── Placeholder ── */
  function placeholder(texto) {
    return `<div style="padding:2rem 0;color:var(--text-secondary);font-size:0.95rem"><p>${texto}</p></div>`;
  }

  /* ── Clic en ítem del menú ── */
  document.querySelectorAll(".acc-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");

      const key  = item.dataset.section;
      const meta = SECTION_LABELS[key];
      if (!meta) return;

      headingEl.textContent = meta.title;
      crumbEl.textContent   = meta.crumb;
      if (sourceEl) sourceEl.textContent = "";
      if (statsEl)  statsEl.innerHTML    = "";

      panelMarco.innerHTML = placeholder("El marco conceptual de <strong>" + meta.title + "</strong> está en construcción.");
      panelViz.innerHTML   = placeholder("El visualizador de <strong>" + meta.title + "</strong> está en construcción.");
      panelBd.innerHTML    = placeholder("La base de datos de <strong>" + meta.title + "</strong> está en construcción.");

      /* activar tab Visualizador (primera pestaña) */
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      const vizBtn = document.querySelector('[data-tab="visualizador"]');
      if (vizBtn) { vizBtn.classList.add("is-active"); vizBtn.setAttribute("aria-selected", "true"); }
      if (panelViz) panelViz.classList.add("is-active");

      /* En móvil: cerrar el sidebar drawer al seleccionar un ítem */
      if (window.innerWidth <= 980) closeSidebar();
    });
  });

  /* ── Sidebar drawer (móvil) ── */
  const navToggle = document.querySelector(".nav-toggle");
  const sidebar   = document.querySelector(".sidebar");
  const backdrop  = document.getElementById("sidebar-backdrop");
  const mainNav   = document.querySelector(".main-nav");

  function openSidebar() {
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.remove("visually-hidden");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.add("visually-hidden");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && sidebar) {
    navToggle.addEventListener("click", () => {
      /* En móvil el toggle abre el sidebar drawer; en desktop no hace nada */
      if (window.innerWidth <= 980) {
        sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
      } else {
        /* En desktop el toggle abre/cierra el nav pills */
        if (mainNav) {
          const open = mainNav.classList.toggle("is-open-mobile");
          navToggle.setAttribute("aria-expanded", String(open));
        }
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }

})();
