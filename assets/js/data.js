/* Carga y cachea los CSV públicos generados por scripts/etl/ (formato tidy:
 * grupo,categoria,medida,valor). Sin librerías externas: usa CSV.parseCSV. */
(function (global) {
  "use strict";
  const cache = {};

  async function loadCSV(name) {
    if (cache[name]) return cache[name];
    const res = await fetch(`data/${name}`);
    if (!res.ok) throw new Error(`No se pudo cargar data/${name} (${res.status})`);
    const text = await res.text();
    const rows = CSV.parseCSV(text).map((r) => ({ ...r, valor: Number(r.valor) }));
    cache[name] = rows;
    return rows;
  }

  /** Filtra por grupo (y opcionalmente medida) y devuelve {categoria: valor}. */
  function pick(rows, grupo, medida) {
    const out = {};
    rows.forEach((r) => {
      if (r.grupo !== grupo) return;
      if (medida != null && r.medida !== medida) return;
      out[r.categoria] = r.valor;
    });
    return out;
  }

  /** Valor único (grupo="panorama", categoria="total" normalmente). */
  function pickValue(rows, grupo, medida, categoria = "total") {
    const row = rows.find((r) => r.grupo === grupo && r.medida === medida && r.categoria === categoria);
    return row ? row.valor : 0;
  }

  /** Serie temporal: [{x: categoria, y: valor}], ordenada por categoria. */
  function pickSeries(rows, grupo, medida) {
    return rows
      .filter((r) => r.grupo === grupo && r.medida === medida)
      .map((r) => ({ x: r.categoria, y: r.valor }))
      .sort((a, b) => (a.x > b.x ? 1 : a.x < b.x ? -1 : 0));
  }

  function toEntries(dict) {
    return Object.entries(dict || {}).map(([label, value]) => ({ label, value }));
  }

  global.MinedecData = { loadCSV, pick, pickValue, pickSeries, toEntries };
})(window);
