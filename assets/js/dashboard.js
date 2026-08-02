/*
 * Página "Información General": sidebar con acordeón + 3 pestañas
 * (Visualizador / Base de Datos / Tabulados) renderizadas a partir de los
 * CSV públicos tidy (grupo,categoria,medida,valor) en /data. El menú lateral
 * sigue la arquitectura de información de motor.md (20 secciones en 4
 * sectores). Cada sección declara "metrics" (dict de categoría->valor para
 * barra, o serie temporal para línea); las 3 pestañas reutilizan la misma
 * lista para no duplicar lógica por sección.
 */
(function () {
  "use strict";
  const { loadCSV, pick, pickValue, pickSeries, toEntries } = MinedecData;

  const RESOLVED = {
    media: "#2a78d6", superior: "#008300", cultura: "#4a3aa7", deporte: "#eb6834",
  };

  function dictMetric({ key, title, sub, sector, dict, unit }) {
    return { kind: "dict", key, title, sub, color: RESOLVED[sector], unit: unit || "", dict: dict || {} };
  }
  function seriesMetric({ key, title, sub, sector, points, unit }) {
    return { kind: "series", key, title, sub, color: RESOLVED[sector], unit: unit || "", points };
  }
  function tile(label, value, suffix) {
    return { label, value: Viz.compactNumber(value), suffix };
  }

  /* ---------------------------- definición de secciones ---------------------------- */
  const SECTIONS = {
    // ===================== EDUCACIÓN MEDIA =====================
    "media-panorama": {
      title: "Educación Media — Panorama general",
      crumb: "Educación Media / Panorama general",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        const v = (m) => pickValue(d, "panorama", m);
        return {
          stats: [
            tile("Estudiantes", v("estudiantes_total")),
            tile("Docentes", v("docentes_total")),
            tile("Instituciones", v("instituciones_total")),
          ],
          metrics: [
            dictMetric({ key: "genero-est", title: "Estudiantes por sexo", sector: "media", dict: { "MUJERES": v("estudiantes_femenino"), "HOMBRES": v("estudiantes_masculino") } }),
            dictMetric({ key: "genero-doc", title: "Docentes por sexo", sector: "media", dict: { "MUJERES": v("docentes_femenino"), "HOMBRES": v("docentes_masculino") } }),
          ],
          source: ["Registro Administrativo Histórico 2009-202X + Información Educación Media (snapshot vigente)"],
        };
      },
    },
    "media-estudiantes": {
      title: "Educación Media — Estudiantes",
      crumb: "Educación Media / Estudiantes",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        const v = (m) => pickValue(d, "panorama", m);
        return {
          stats: [
            tile("Estudiantes matriculados", v("estudiantes_total")),
            tile("Mujeres", v("estudiantes_femenino")),
            tile("Hombres", v("estudiantes_masculino")),
          ],
          metrics: [
            dictMetric({ key: "provincia", title: "Estudiantes por provincia", sector: "media", dict: pick(d, "estudiantes_provincia") }),
            dictMetric({ key: "sostenimiento", title: "Estudiantes por sostenimiento", sub: "Fiscal, particular, fiscomisional, municipal", sector: "media", dict: pick(d, "estudiantes_sostenimiento") }),
            dictMetric({ key: "area", title: "Estudiantes por área", sub: "Urbano vs. rural", sector: "media", dict: pick(d, "estudiantes_area") }),
            dictMetric({ key: "tipo", title: "Estudiantes por tipo de educación", sector: "media", dict: pick(d, "estudiantes_tipo_educacion") }),
          ],
          source: ["Información Educación Media (snapshot vigente)"],
        };
      },
    },
    "media-docentes": {
      title: "Educación Media — Docentes",
      crumb: "Educación Media / Docentes",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        const v = (m) => pickValue(d, "panorama", m);
        return {
          stats: [
            tile("Docentes", v("docentes_total")),
            tile("Mujeres", v("docentes_femenino")),
            tile("Hombres", v("docentes_masculino")),
          ],
          metrics: [
            dictMetric({ key: "provincia", title: "Docentes por provincia", sector: "media", dict: pick(d, "docentes_provincia") }),
          ],
          source: ["Información Educación Media (snapshot vigente)"],
        };
      },
    },
    "media-instituciones": {
      title: "Educación Media — Instituciones",
      crumb: "Educación Media / Instituciones",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        return {
          stats: [tile("Instituciones", pickValue(d, "panorama", "instituciones_total"))],
          metrics: [
            dictMetric({ key: "provincia", title: "Instituciones por provincia", sector: "media", dict: pick(d, "instituciones_provincia") }),
          ],
          source: ["Información Educación Media (snapshot vigente)"],
        };
      },
    },
    "media-serie": {
      title: "Educación Media — Serie histórica",
      crumb: "Educación Media / Serie histórica",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        return {
          stats: [],
          metrics: [
            seriesMetric({ key: "estudiantes", title: "Estudiantes por año lectivo", sub: "2010–2024", sector: "media", points: pickSeries(d, "serie_anio", "estudiantes_total") }),
            seriesMetric({ key: "instituciones", title: "Instituciones por año lectivo", sector: "media", points: pickSeries(d, "serie_anio", "instituciones") }),
            seriesMetric({ key: "docentes", title: "Docentes por año lectivo", sector: "media", points: pickSeries(d, "serie_anio", "docentes_total") }),
          ],
          source: ["Registro Administrativo Histórico 2009-202X (nivel institución)"],
        };
      },
    },
    "media-territorial": {
      title: "Educación Media — Distribución territorial",
      crumb: "Educación Media / Distribución territorial",
      async build() {
        const d = await loadCSV("educacion_media.csv");
        return {
          stats: [],
          metrics: [
            dictMetric({ key: "estudiantes", title: "Estudiantes por provincia", sector: "media", dict: pick(d, "distribucion_territorial", "estudiantes") }),
            dictMetric({ key: "instituciones", title: "Instituciones por provincia", sector: "media", dict: pick(d, "distribucion_territorial", "instituciones") }),
          ],
          source: ["Información Educación Media (snapshot vigente)"],
        };
      },
    },

    // ===================== EDUCACIÓN SUPERIOR =====================
    "superior-panorama": {
      title: "Educación Superior — Panorama general",
      crumb: "Educación Superior / Panorama general",
      async build() {
        const d = await loadCSV("educacion_superior.csv");
        const v = (m) => pickValue(d, "panorama", m);
        return {
          stats: [
            tile("Estudiantes UEP", v("uep_estudiantes_total")),
            tile("Estudiantes ITT", v("itt_estudiantes_total")),
            tile("Instituciones UEP", v("uep_instituciones_total")),
            tile("Instituciones ITT", v("itt_instituciones_total")),
          ],
          metrics: [
            dictMetric({ key: "estudiantes", title: "Estudiantes por tipo de institución", sector: "superior", dict: { "UEP (UNIVERSIDADES/POLITÉCNICAS)": v("uep_estudiantes_total"), "ITT (TÉCNICOS/TECNOLÓGICOS)": v("itt_estudiantes_total") } }),
          ],
          source: ["UEP.xlsx", "ITTS.xlsx"],
        };
      },
    },
    "superior-uep-estudiantes": {
      title: "Educación Superior · UEP — Estudiantes",
      crumb: "Educación Superior / Universidades y escuelas politécnicas / Estudiantes",
      async build() {
        const d = await loadCSV("educacion_superior.csv");
        return {
          stats: [
            tile("Estudiantes matriculados", pickValue(d, "panorama", "uep_estudiantes_total")),
            tile("Universidades y escuelas politécnicas", pickValue(d, "panorama", "uep_instituciones_total")),
          ],
          metrics: [
            dictMetric({ key: "provincia", title: "Estudiantes por provincia (sede)", sector: "superior", dict: pick(d, "uep_estudiantes_provincia") }),
            dictMetric({ key: "financiamiento", title: "Estudiantes por tipo de financiamiento", sector: "superior", dict: pick(d, "uep_estudiantes_financiamiento") }),
            dictMetric({ key: "sede", title: "Estudiantes por tipo de sede", sub: "Matriz vs. extensión", sector: "superior", dict: pick(d, "uep_estudiantes_tiposede") }),
            dictMetric({ key: "instituciones", title: "Instituciones por provincia (sede)", sector: "superior", dict: pick(d, "uep_instituciones_provincia") }),
          ],
          source: ["UEP.xlsx (Universidades y Escuelas Politécnicas)"],
        };
      },
    },
    "superior-itt-estudiantes": {
      title: "Educación Superior · ITT — Estudiantes",
      crumb: "Educación Superior / Institutos técnicos y tecnológicos / Estudiantes",
      async build() {
        const d = await loadCSV("educacion_superior.csv");
        return {
          stats: [
            tile("Estudiantes (último período)", pickValue(d, "panorama", "itt_estudiantes_total")),
            tile("Institutos técnicos y tecnológicos", pickValue(d, "panorama", "itt_instituciones_total")),
          ],
          metrics: [
            seriesMetric({ key: "serie", title: "Estudiantes por año", sector: "superior", points: pickSeries(d, "itt_serie_anio", "estudiantes") }),
            dictMetric({ key: "provincia", title: "Estudiantes por provincia (sede)", sector: "superior", dict: pick(d, "itt_estudiantes_provincia") }),
            dictMetric({ key: "financiamiento", title: "Estudiantes por tipo de financiamiento", sector: "superior", dict: pick(d, "itt_estudiantes_financiamiento") }),
            dictMetric({ key: "instituciones", title: "Instituciones por provincia (sede)", sector: "superior", dict: pick(d, "itt_instituciones_provincia") }),
          ],
          source: ["ITTS.xlsx (Institutos Técnicos y Tecnológicos)"],
        };
      },
    },

    // ===================== DEPORTE =====================
    "deporte-panorama": {
      title: "Deporte — Panorama general",
      crumb: "Deporte / Panorama general",
      async build() {
        const d = await loadCSV("deporte.csv");
        const v = (m) => pickValue(d, "panorama", m);
        return {
          stats: [
            tile("Alto rendimiento", v("alto_rendimiento_total")),
            tile("Juegos nacionales", v("juegos_nacionales_total")),
            tile("Entrenadores", v("entrenadores_total")),
            tile("Usuarios del deporte", v("usuarios_deporte_total")),
            tile("Exdeportistas vitalicios", v("vitalicios_total")),
          ],
          metrics: [
            dictMetric({
              key: "programas", title: "Personas por programa", sector: "deporte",
              dict: {
                "ALTO RENDIMIENTO": v("alto_rendimiento_total"),
                "ENTRENADORES": v("entrenadores_total"),
                "EXDEPORTISTAS VITALICIOS": v("vitalicios_total"),
              },
            }),
          ],
          source: ["Base_Deporte.xlsx (agregado, sin datos personales)"],
        };
      },
    },
    "deporte-alto-rendimiento": {
      title: "Deporte — Alto rendimiento",
      crumb: "Deporte / Alto rendimiento",
      async build() {
        const d = await loadCSV("deporte.csv");
        return {
          stats: [
            tile("Deportistas de alto rendimiento", pickValue(d, "panorama", "alto_rendimiento_total")),
            tile("Estímulo total", pickValue(d, "panorama", "alto_rendimiento_estimulo_usd"), "USD"),
          ],
          metrics: [
            dictMetric({ key: "deporte", title: "Por disciplina", sector: "deporte", dict: pick(d, "ar_deporte") }),
            dictMetric({ key: "provincia", title: "Por provincia de representación", sector: "deporte", dict: pick(d, "ar_provincia") }),
            dictMetric({ key: "genero", title: "Por sexo", sector: "deporte", dict: pick(d, "ar_genero") }),
            dictMetric({ key: "edad", title: "Por categoría de edad", sector: "deporte", dict: pick(d, "ar_categoria_edad") }),
            dictMetric({ key: "grupo", title: "Por grupo de alto rendimiento", sector: "deporte", dict: pick(d, "ar_grupo") }),
          ],
          source: ["Base_Deporte.xlsx / Deportistas de alto rendimiento (agregado, sin datos personales)"],
        };
      },
    },
    "deporte-juegos-nacionales": {
      title: "Deporte — Juegos nacionales",
      crumb: "Deporte / Juegos nacionales",
      async build() {
        const d = await loadCSV("deporte.csv");
        return {
          stats: [tile("Participaciones", pickValue(d, "panorama", "juegos_nacionales_total"))],
          metrics: [
            dictMetric({ key: "deporte", title: "Por disciplina", sector: "deporte", dict: pick(d, "jn_deporte") }),
            dictMetric({ key: "federacion", title: "Por federación deportiva provincial", sector: "deporte", dict: pick(d, "jn_federacion") }),
            dictMetric({ key: "genero", title: "Por sexo", sector: "deporte", dict: pick(d, "jn_genero") }),
            dictMetric({ key: "evento", title: "Por evento", sector: "deporte", dict: pick(d, "jn_evento") }),
          ],
          source: ["Base_Deporte.xlsx / Deportistas de juegos nacionales (agregado, sin datos personales)"],
        };
      },
    },
    "deporte-entrenadores": {
      title: "Deporte — Entrenadores",
      crumb: "Deporte / Entrenadores",
      async build() {
        const d = await loadCSV("deporte.csv");
        return {
          stats: [tile("Entrenadores registrados", pickValue(d, "panorama", "entrenadores_total"))],
          metrics: [
            dictMetric({ key: "provincia", title: "Por provincia", sector: "deporte", dict: pick(d, "entrenadores_provincia") }),
            dictMetric({ key: "funcion", title: "Por función", sector: "deporte", dict: pick(d, "entrenadores_funcion") }),
            dictMetric({ key: "genero", title: "Por sexo", sector: "deporte", dict: pick(d, "entrenadores_genero") }),
          ],
          source: ["Base_Deporte.xlsx / Entrenadores (agregado, sin datos personales)"],
        };
      },
    },
    "deporte-usuarios": {
      title: "Deporte — Usuarios del deporte",
      crumb: "Deporte / Usuarios del deporte",
      async build() {
        const d = await loadCSV("deporte.csv");
        return {
          stats: [
            tile("Usuarios atendidos (histórico)", pickValue(d, "panorama", "usuarios_deporte_total")),
            tile("Ingresos generados", pickValue(d, "panorama", "usuarios_deporte_ingresos_usd"), "USD"),
          ],
          metrics: [
            seriesMetric({ key: "serie", title: "Usuarios por año", sector: "deporte", points: pickSeries(d, "usuarios_serie_anio", "usuarios") }),
            dictMetric({ key: "provincia", title: "Usuarios por provincia", sector: "deporte", dict: pick(d, "usuarios_provincia") }),
            dictMetric({ key: "tipo", title: "Usuarios por tipo de deporte", sector: "deporte", dict: pick(d, "usuarios_tipo_deporte") }),
          ],
          source: ["Base_Deporte.xlsx / Usuarios de deporte (ya agregado por centro/mes)"],
        };
      },
    },
    "deporte-vitalicios": {
      title: "Deporte — Exdeportistas vitalicios",
      crumb: "Deporte / Exdeportistas vitalicios",
      async build() {
        const d = await loadCSV("deporte.csv");
        return {
          stats: [
            tile("Pensionistas", pickValue(d, "panorama", "vitalicios_total")),
            tile("Monto mensual agregado", pickValue(d, "panorama", "vitalicios_monto_mensual_usd"), "USD"),
          ],
          metrics: [
            dictMetric({ key: "provincia", title: "Por provincia de residencia", sector: "deporte", dict: pick(d, "vitalicios_provincia") }),
            dictMetric({ key: "residencia", title: "Nacional vs. extranjero", sector: "deporte", dict: pick(d, "vitalicios_residencia") }),
            dictMetric({ key: "estado", title: "Por estado", sector: "deporte", dict: pick(d, "vitalicios_estado") }),
          ],
          source: ["Base_Deporte.xlsx / Ex Deportistas Vitalicios (agregado, sin datos personales)"],
        };
      },
    },

    // ===================== CULTURA =====================
    "cultura-panorama": {
      title: "Cultura — Panorama general",
      crumb: "Cultura / Panorama general",
      async build() {
        const d = await loadCSV("cultura.csv");
        const nat = pickValue(d, "panorama", "naturales_total");
        const jur = pickValue(d, "panorama", "juridico_total");
        return {
          stats: [
            tile("Gestores culturales (personas naturales)", nat),
            tile("Organizaciones culturales (personas jurídicas)", jur),
            tile("Total actores culturales", nat + jur),
          ],
          metrics: [
            dictMetric({ key: "tipo", title: "Actores culturales por tipo", sector: "cultura", dict: { "PERSONAS NATURALES": nat, "PERSONAS JURÍDICAS": jur } }),
          ],
          source: ["Naturales_cultura.xlsx", "Juridico_cultura.xlsx"],
        };
      },
    },
    "cultura-naturales": {
      title: "Cultura — Personas naturales",
      crumb: "Cultura / Personas naturales",
      async build() {
        const d = await loadCSV("cultura.csv");
        return {
          stats: [
            tile("Gestores/artistas registrados", pickValue(d, "panorama", "naturales_total")),
            tile("Provincias con registro", Object.keys(pick(d, "naturales_provincia")).length),
          ],
          metrics: [
            dictMetric({ key: "provincia", title: "Por provincia", sector: "cultura", dict: pick(d, "naturales_provincia") }),
            dictMetric({ key: "sexo", title: "Por sexo", sector: "cultura", dict: pick(d, "naturales_sexo") }),
            dictMetric({ key: "etnia", title: "Por autoidentificación étnica", sector: "cultura", dict: pick(d, "naturales_etnia") }),
            dictMetric({ key: "escolaridad", title: "Por nivel de escolaridad", sector: "cultura", dict: pick(d, "naturales_escolaridad") }),
            seriesMetric({ key: "serie", title: "Registros por año", sector: "cultura", points: pickSeries(d, "naturales_serie_anio", "registros") }),
          ],
          source: ["Naturales_cultura.xlsx (agregado, sin datos personales)"],
        };
      },
    },
    "cultura-juridicas": {
      title: "Cultura — Personas jurídicas",
      crumb: "Cultura / Personas jurídicas",
      async build() {
        const d = await loadCSV("cultura.csv");
        return {
          stats: [tile("Organizaciones registradas", pickValue(d, "panorama", "juridico_total"))],
          metrics: [
            dictMetric({ key: "provincia", title: "Por provincia", sector: "cultura", dict: pick(d, "juridico_provincia") }),
            dictMetric({ key: "tipo", title: "Por tipo de actor", sector: "cultura", dict: pick(d, "juridico_tipo_actor") }),
            dictMetric({ key: "subtipo", title: "Por subtipo de actor", sector: "cultura", dict: pick(d, "juridico_subtipo_actor") }),
            dictMetric({ key: "estado", title: "Por estado de contribuyente", sector: "cultura", dict: pick(d, "juridico_estado_contribuyente") }),
            seriesMetric({ key: "serie", title: "Registros por año", sector: "cultura", points: pickSeries(d, "juridico_serie_anio", "registros") }),
          ],
          source: ["Juridico_cultura.xlsx (agregado, sin datos personales)"],
        };
      },
    },
    "cultura-ambitos": {
      title: "Cultura — Ámbitos culturales",
      crumb: "Cultura / Ámbitos culturales",
      async build() {
        const d = await loadCSV("cultura.csv");
        return {
          stats: [],
          metrics: [
            dictMetric({ key: "sector", title: "Personas naturales por sector cultural", sector: "cultura", dict: pick(d, "ambitos_sector", "naturales") }),
            dictMetric({ key: "ambito", title: "Personas naturales por ámbito de actividad", sector: "cultura", dict: pick(d, "ambitos_ambito", "naturales") }),
            dictMetric({ key: "actividad", title: "Organizaciones por actividad económica general", sector: "cultura", dict: pick(d, "ambitos_actividad_economica", "juridico") }),
          ],
          source: ["Naturales_cultura.xlsx", "Juridico_cultura.xlsx"],
        };
      },
    },
    "cultura-territorial": {
      title: "Cultura — Distribución territorial",
      crumb: "Cultura / Distribución territorial",
      async build() {
        const d = await loadCSV("cultura.csv");
        return {
          stats: [],
          metrics: [
            dictMetric({ key: "naturales", title: "Personas naturales por provincia", sector: "cultura", dict: pick(d, "distribucion_territorial", "naturales") }),
            dictMetric({ key: "juridico", title: "Personas jurídicas por provincia", sector: "cultura", dict: pick(d, "distribucion_territorial", "juridico") }),
          ],
          source: ["Naturales_cultura.xlsx", "Juridico_cultura.xlsx"],
        };
      },
    },
  };

  /* ---------------------------- render de contenido ---------------------------- */
  function renderStats(container, stats) {
    if (!stats || !stats.length) { container.innerHTML = ""; return; }
    Viz.statTiles(container, stats);
  }

  function renderVisualizador(container, metrics) {
    container.innerHTML = "";
    if (!metrics.length) {
      container.innerHTML = '<div class="empty-note">No hay gráficos configurados para esta sección.</div>';
      return;
    }
    const grid = document.createElement("div");
    grid.className = "chart-grid";
    container.appendChild(grid);
    metrics.forEach((m) => {
      const card = document.createElement("div");
      card.className = "chart-card";
      card.innerHTML = `<h3>${m.title}</h3>${m.sub ? `<p class="chart-sub">${m.sub}</p>` : ""}<div class="chart-holder"></div>`;
      grid.appendChild(card);
      const holder = card.querySelector(".chart-holder");
      if (m.kind === "series") {
        if (!m.points.length) { holder.innerHTML = '<p class="empty-note">Sin datos para mostrar.</p>'; return; }
        Viz.lineChart(holder, { series: [{ name: m.title, color: m.color, points: m.points }], yUnit: m.unit });
      } else {
        Viz.barChart(holder, { data: toEntries(m.dict), color: m.color, unit: m.unit });
      }
    });
  }

  function metricRows(m) {
    if (m.kind === "series") return m.points.map((p) => ({ categoria: String(p.x), valor: p.y }));
    return toEntries(m.dict).sort((a, b) => b.value - a.value).map((e) => ({ categoria: e.label, valor: e.value }));
  }

  function renderBaseDatos(container, metrics, sectionTitle) {
    container.innerHTML = "";
    if (!metrics.length) {
      container.innerHTML = '<div class="empty-note">No hay tablas configuradas para esta sección.</div>';
      return;
    }
    metrics.forEach((m) => {
      const rows = metricRows(m);
      const card = document.createElement("div");
      card.className = "chart-card";
      card.innerHTML = `
        <div class="table-toolbar">
          <h3 style="margin:0">${m.title}</h3>
          <button type="button" class="btn-secondary">Descargar CSV</button>
        </div>
        <div class="table-holder"></div>`;
      container.appendChild(card);
      Viz.dataTable(card.querySelector(".table-holder"), {
        columns: [{ key: "categoria", label: "Categoría" }, { key: "valor", label: "Valor", num: true, format: Viz.fullNumber }],
        rows,
      });
      card.querySelector(".btn-secondary").addEventListener("click", () => {
        const cols = [{ key: "categoria", label: "Categoría" }, { key: "valor", label: "Valor" }];
        const filename = `minedec_${sectionTitle}_${m.key}.csv`.toLowerCase().replace(/[^a-z0-9_.]+/g, "-");
        CSV.downloadCSV(filename, cols, rows);
      });
    });
  }

  function renderTabulados(container, metrics) {
    container.innerHTML = "";
    if (!metrics.length) {
      container.innerHTML = '<div class="empty-note">No hay tabulados configurados para esta sección.</div>';
      return;
    }
    metrics.forEach((m) => {
      const rows = metricRows(m);
      const total = rows.reduce((s, r) => s + (Number(r.valor) || 0), 0);
      const withPct = rows.map((r) => ({ ...r, pct: total ? ((r.valor / total) * 100).toFixed(1) + "%" : "—" }));
      const card = document.createElement("div");
      card.className = "chart-card";
      card.innerHTML = `<h3>${m.title}</h3><p class="chart-sub">Tabulado — total: ${Viz.fullNumber(total)}${m.unit || ""}</p><div class="table-holder"></div>`;
      container.appendChild(card);
      Viz.dataTable(card.querySelector(".table-holder"), {
        columns: [
          { key: "categoria", label: "Categoría" },
          { key: "valor", label: "Valor", num: true, format: Viz.fullNumber },
          { key: "pct", label: "% del total", num: true },
        ],
        rows: withPct,
      });
    });
  }

  /* ---------------------------- shell: sidebar + tabs ---------------------------- */
  const els = {
    heading: document.getElementById("db-heading"),
    crumb: document.getElementById("db-crumb"),
    source: document.getElementById("db-source"),
    stats: document.getElementById("db-stats"),
    panels: {
      visualizador: document.getElementById("panel-visualizador"),
      basedatos: document.getElementById("panel-basedatos"),
      tabulados: document.getElementById("panel-tabulados"),
    },
  };

  async function selectSection(id) {
    const section = SECTIONS[id];
    if (!section) return;

    document.querySelectorAll(".acc-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.section === id);
    });

    els.heading.textContent = section.title;
    els.crumb.textContent = section.crumb;
    Object.values(els.panels).forEach((p) => (p.innerHTML = '<p class="chart-sub">Cargando…</p>'));
    els.stats.innerHTML = "";
    els.source.textContent = "";

    let data;
    try {
      data = await section.build();
    } catch (e) {
      console.error(e);
      const msg = '<div class="empty-note">No se pudieron cargar los datos de esta sección. Verifique su conexión y vuelva a intentar.</div>';
      Object.values(els.panels).forEach((p) => (p.innerHTML = msg));
      return;
    }

    renderStats(els.stats, data.stats);
    els.source.textContent = data.source && data.source.length ? "Fuente: " + [...new Set(data.source)].join(" · ") : "";

    renderVisualizador(els.panels.visualizador, data.metrics);
    renderBaseDatos(els.panels.basedatos, data.metrics, section.title);
    renderTabulados(els.panels.tabulados, data.metrics);

    location.hash = id;
    if (window.innerWidth <= 980) closeSidebar();
  }

  function initAccordion() {
    document.querySelectorAll(".acc-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("is-open", !isOpen);
      });
    });
    document.querySelectorAll(".acc-item").forEach((btn) => {
      btn.addEventListener("click", () => selectSection(btn.dataset.section));
    });
  }

  function initTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("is-active", p.id === "panel-" + btn.dataset.tab));
      });
    });
  }

  function openSidebar() { document.querySelector(".sidebar").classList.add("is-open"); }
  function closeSidebar() { document.querySelector(".sidebar").classList.remove("is-open"); }
  function initMobileSidebar() {
    const toggle = document.querySelector(".nav-toggle");
    if (toggle) toggle.addEventListener("click", openSidebar);
    const backdrop = document.getElementById("sidebar-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeSidebar);
  }

  function openGroupFor(sectionId) {
    const item = document.querySelector(`.acc-item[data-section="${sectionId}"]`);
    const panel = item ? item.closest(".acc-panel") : document.querySelector(".acc-panel");
    if (panel) {
      panel.classList.add("is-open");
      panel.previousElementSibling.setAttribute("aria-expanded", "true");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAccordion();
    initTabs();
    initMobileSidebar();
    const initial = (location.hash || "").replace("#", "");
    const initialId = SECTIONS[initial] ? initial : "media-panorama";
    openGroupFor(initialId);
    selectSection(initialId);
  });
})();
