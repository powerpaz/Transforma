/*
 * Página "Información Estadística": sidebar con acordeón + 3 pestañas
 * Marco Conceptual / Visualizador / Base de Datos
 * Menú: Educación Media, Educación Superior (UEP / ITTS),
 *       Títulos, Investigadores, Cultura, Deporte
 */
(function () {
  "use strict";

  /* ── Secciones disponibles ── */
  const SECTION_LABELS = {
    // Educación Media
    "media-estudiantes":       { title: "Educación Media — Estudiantes",                 crumb: "Educación Media / Estudiantes" },
    "media-docentes":          { title: "Educación Media — Docentes",                    crumb: "Educación Media / Docentes" },
    "media-oferta":            { title: "Educación Media — Oferta educativa",            crumb: "Educación Media / Oferta educativa" },
    "media-descomposicion":    { title: "Educación Media — Descomposición de la matrícula", crumb: "Educación Media / Descomposición de la matrícula" },
    // Educación Superior — UEP
    "uep-estudiantes":         { title: "UEP — Estudiantes",                             crumb: "Educación Superior / UEP / Estudiantes" },
    "uep-docentes":            { title: "UEP — Docentes",                                crumb: "Educación Superior / UEP / Docentes" },
    "uep-oferta":              { title: "UEP — Oferta educativa",                        crumb: "Educación Superior / UEP / Oferta educativa" },
    // Educación Superior — ITTS
    "itts-estudiantes":        { title: "ITTS — Estudiantes",                            crumb: "Educación Superior / ITTS / Estudiantes" },
    "itts-docentes":           { title: "ITTS — Docentes",                               crumb: "Educación Superior / ITTS / Docentes" },
    "itts-oferta":             { title: "ITTS — Oferta educativa",                       crumb: "Educación Superior / ITTS / Oferta educativa" },
    // Títulos e Investigadores
    "titulos-general":         { title: "Títulos",                                       crumb: "Títulos" },
    "investigadores-general":  { title: "Investigadores",                                crumb: "Investigadores" },
    // Cultura
    "cultura-ruac":            { title: "Cultura — RUAC",                                crumb: "Cultura / RUAC" },
    "cultura-fondo":           { title: "Cultura — Fondo de Fomento",                    crumb: "Cultura / Fondo de Fomento" },
    "cultura-espacios":        { title: "Cultura — Espacios Culturales",                 crumb: "Cultura / Espacios Culturales" },
    // Deporte
    "deporte-deportistas":     { title: "Deporte — Deportistas",                         crumb: "Deporte / Deportistas" },
    "deporte-organizaciones":  { title: "Deporte — Organizaciones",                      crumb: "Deporte / Organizaciones" },
    "deporte-infraestructura": { title: "Deporte — Infraestructura",                     crumb: "Deporte / Infraestructura" },
  };

  /* ── Referencias DOM ── */
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
      // cerrar todos
      document.querySelectorAll(".acc-trigger").forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        t.closest(".acc-group").querySelector(".acc-panel").style.maxHeight = null;
      });
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        const panel = trigger.closest(".acc-group").querySelector(".acc-panel");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ── Mensaje placeholder genérico ── */
  function placeholder(texto) {
    return `<div style="padding:2rem 0;color:var(--c-text-2,#666);font-size:0.95rem"><p>${texto}</p></div>`;
  }

  /* ── Cargar sección al hacer clic en ítem del menú ── */
  document.querySelectorAll(".acc-item").forEach((item) => {
    item.addEventListener("click", () => {
      // marcar activo
      document.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");

      const key = item.dataset.section;
      const meta = SECTION_LABELS[key];
      if (!meta) return;

      // actualizar encabezados
      headingEl.textContent = meta.title;
      crumbEl.textContent   = meta.crumb;
      sourceEl.textContent  = "";
      statsEl.innerHTML     = "";

      // limpiar paneles
      panelMarco.innerHTML = placeholder("El marco conceptual de <strong>" + meta.title + "</strong> está en construcción.");
      panelViz.innerHTML   = placeholder("El visualizador de <strong>" + meta.title + "</strong> está en construcción.");
      panelBd.innerHTML    = placeholder("La base de datos de <strong>" + meta.title + "</strong> está en construcción.");

      // activar tab Marco Conceptual por defecto
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      const marcoBtn = document.querySelector('[data-tab="marco"]');
      if (marcoBtn) {
        marcoBtn.classList.add("is-active");
        marcoBtn.setAttribute("aria-selected", "true");
      }
      panelMarco.classList.add("is-active");
    });
  });

  /* ── Sidebar toggle móvil ── */
  const navToggle   = document.querySelector(".nav-toggle");
  const sidebar     = document.querySelector(".sidebar");
  const backdrop    = document.getElementById("sidebar-backdrop");

  if (navToggle && sidebar) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      sidebar.classList.toggle("is-open", !open);
      if (backdrop) backdrop.classList.toggle("visually-hidden", open);
    });
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        sidebar.classList.remove("is-open");
        backdrop.classList.add("visually-hidden");
      });
    }
  }

})();
