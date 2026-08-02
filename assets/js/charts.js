/*
 * Motor de gráficos SVG ligero (sin dependencias externas).
 * Implementa: barra horizontal ranqueada (magnitud, un solo hue) y
 * línea/área (serie temporal, 1-2 series con leyenda). Sigue las
 * especificaciones de marca de la skill dataviz: barras redondeadas 4px,
 * líneas 2px, gridlines recesivas, tooltip al hover, leyenda para 2+ series.
 */
(function (global) {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function compactNumber(n) {
    n = Number(n) || 0;
    const abs = Math.abs(n);
    if (abs >= 1e6) return (n / 1e6).toFixed(abs >= 10e6 ? 1 : 2).replace(/\.0$/, "") + "M";
    if (abs >= 1e3) return (n / 1e3).toFixed(abs >= 10e3 ? 0 : 1).replace(/\.0$/, "") + "K";
    return String(Math.round(n));
  }
  function fullNumber(n) {
    return Number(n).toLocaleString("es-EC");
  }

  function niceMax(value) {
    if (value <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(value)));
    const norm = value / mag;
    let step;
    if (norm <= 1) step = 1;
    else if (norm <= 2) step = 2;
    else if (norm <= 5) step = 5;
    else step = 10;
    return step * mag;
  }

  function ensureTooltip(host) {
    let tip = host.querySelector(".viz-tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "viz-tooltip";
      tip.innerHTML = '<div class="t-label"></div><div class="t-value"></div>';
      host.appendChild(tip);
    }
    return tip;
  }
  function showTooltip(host, tip, x, y, label, value) {
    tip.querySelector(".t-label").textContent = label;
    tip.querySelector(".t-value").textContent = value;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
    tip.classList.add("is-visible");
  }
  function hideTooltip(tip) {
    tip.classList.remove("is-visible");
  }

  /**
   * Barra horizontal ranqueada — una sola magnitud por categoría (mismo hue).
   * data: [{label, value}], ya ordenado o se ordena por value desc.
   */
  function barChart(container, { data, color, unit = "", maxItems = 12, valueFormatter }) {
    container.innerHTML = "";
    const root = document.createElement("div");
    root.className = "viz-root";
    container.appendChild(root);

    const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, maxItems);
    if (!sorted.length) {
      root.innerHTML = '<p class="empty-note">Sin datos para mostrar.</p>';
      return;
    }
    const fmt = valueFormatter || fullNumber;
    const max = niceMax(Math.max(...sorted.map((d) => d.value)));

    const rowH = 30;
    const padTop = 6, padBottom = 6;
    const labelW = 132;
    const width = 560;
    const chartW = width - labelW - 54;
    const height = sorted.length * rowH + padTop + padBottom;

    const svg = el("svg", {
      class: "viz-svg", viewBox: `0 0 ${width} ${height}`, role: "img",
      "aria-label": "Gráfico de barras",
    });

    sorted.forEach((d, i) => {
      const y = padTop + i * rowH;
      const barW = Math.max(2, (d.value / max) * chartW);
      const g = el("g", { class: "viz-bar-group" });

      g.appendChild(el("text", {
        x: labelW - 10, y: y + rowH / 2 + 4, class: "viz-cat-label", "text-anchor": "end",
      })).textContent = truncateLabel(d.label, 20);

      g.appendChild(el("line", {
        x1: labelW, x2: labelW, y1: y + 3, y2: y + rowH - 9, class: "viz-baseline",
      }));

      const bar = el("rect", {
        x: labelW, y: y + 3, width: barW, height: rowH - 12, rx: 4, ry: 4,
        fill: color, class: "viz-bar-fill",
      });
      g.appendChild(bar);

      const labelX = labelW + barW + 8;
      const fitsInside = barW > 46;
      const valText = el("text", {
        x: fitsInside ? labelW + barW - 8 : labelX,
        y: y + rowH / 2 - 4.5,
        class: "viz-bar-label",
        "text-anchor": fitsInside ? "end" : "start",
      });
      valText.textContent = fmt(d.value) + unit;
      if (fitsInside) valText.setAttribute("fill", "#fff");
      g.appendChild(valText);

      const hit = el("rect", {
        x: labelW, y: y, width: chartW + 40, height: rowH, class: "viz-hit",
      });
      g.appendChild(hit);

      g.addEventListener("mouseenter", (ev) => onHover(ev, d));
      g.addEventListener("mousemove", (ev) => onHover(ev, d));
      g.addEventListener("mouseleave", () => hideTooltip(tip));

      svg.appendChild(g);
    });

    root.appendChild(svg);
    const tip = ensureTooltip(root);
    root.style.position = "relative";

    function onHover(ev, d) {
      const rect = root.getBoundingClientRect();
      showTooltip(root, tip, ev.clientX - rect.left, ev.clientY - rect.top, d.label, fmt(d.value) + unit);
    }
  }

  function truncateLabel(str, n) {
    str = String(str);
    return str.length > n ? str.slice(0, n - 1) + "…" : str;
  }

  /**
   * Línea/área para series temporales. series: [{name, color, points:[{x,y}]}]
   */
  function lineChart(container, { series, yUnit = "", valueFormatter }) {
    container.innerHTML = "";
    const root = document.createElement("div");
    root.className = "viz-root";

    if (series.length > 1) {
      const legend = document.createElement("div");
      legend.className = "viz-legend";
      series.forEach((s) => {
        const item = document.createElement("span");
        item.className = "viz-legend-item";
        item.innerHTML = `<span class="viz-legend-swatch" style="background:${s.color}"></span>${s.name}`;
        legend.appendChild(item);
      });
      root.appendChild(legend);
    }

    const wrap = document.createElement("div");
    wrap.style.position = "relative";
    root.appendChild(wrap);
    container.appendChild(root);

    const allPoints = series.flatMap((s) => s.points);
    if (!allPoints.length) {
      wrap.innerHTML = '<p class="empty-note">Sin datos para mostrar.</p>';
      return;
    }
    const fmt = valueFormatter || fullNumber;
    const width = 640, height = 260;
    const padL = 46, padR = 12, padT = 14, padB = 28;
    const chartW = width - padL - padR, chartH = height - padT - padB;

    const xs = series[0].points.map((p) => p.x);
    const yMax = niceMax(Math.max(...allPoints.map((p) => p.y)));
    const xScale = (i) => padL + (xs.length <= 1 ? chartW / 2 : (i / (xs.length - 1)) * chartW);
    const yScale = (v) => padT + chartH - (v / yMax) * chartH;

    const svg = el("svg", { class: "viz-svg", viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Gráfico de línea" });

    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const v = (yMax / ticks) * t;
      const y = yScale(v);
      svg.appendChild(el("line", { x1: padL, x2: width - padR, y1: y, y2: y, class: "viz-gridline" }));
      const label = el("text", { x: padL - 8, y: y + 3, class: "viz-axis-label", "text-anchor": "end" });
      label.textContent = compactNumber(v);
      svg.appendChild(label);
    }

    const xLabelEvery = Math.ceil(xs.length / 8) || 1;
    xs.forEach((xv, i) => {
      if (i % xLabelEvery !== 0 && i !== xs.length - 1) return;
      const label = el("text", { x: xScale(i), y: height - 8, class: "viz-axis-label", "text-anchor": "middle" });
      label.textContent = String(xv);
      svg.appendChild(label);
    });
    svg.appendChild(el("line", { x1: padL, x2: width - padR, y1: padT + chartH, y2: padT + chartH, class: "viz-baseline" }));

    series.forEach((s) => {
      const pts = s.points.map((p, i) => [xScale(i), yScale(p.y)]);
      const dPath = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");

      const areaPath = dPath + ` L${pts[pts.length - 1][0].toFixed(1)},${(padT + chartH).toFixed(1)} L${pts[0][0].toFixed(1)},${(padT + chartH).toFixed(1)} Z`;
      svg.appendChild(el("path", { d: areaPath, fill: s.color, opacity: 0.1, stroke: "none" }));
      svg.appendChild(el("path", { d: dPath, fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));

      const last = pts[pts.length - 1];
      svg.appendChild(el("circle", { cx: last[0], cy: last[1], r: 5, fill: s.color, stroke: "var(--surface-1)", "stroke-width": 2 }));
    });

    // hover crosshair over full width
    const hitW = chartW / Math.max(1, xs.length - 1 || 1);
    xs.forEach((xv, i) => {
      const hit = el("rect", {
        x: xScale(i) - hitW / 2, y: padT, width: hitW, height: chartH, class: "viz-hit",
      });
      hit.addEventListener("mouseenter", (ev) => onHover(ev, i));
      hit.addEventListener("mousemove", (ev) => onHover(ev, i));
      hit.addEventListener("mouseleave", () => hideTooltip(tip));
      svg.appendChild(hit);
    });

    wrap.appendChild(svg);
    wrap.style.position = "relative";
    const tip = ensureTooltip(wrap);

    function onHover(ev, i) {
      const rect = wrap.getBoundingClientRect();
      const parts = series.map((s) => `${s.name}: ${fmt(s.points[i].y)}${yUnit}`).join(" · ");
      showTooltip(wrap, tip, ev.clientX - rect.left, ev.clientY - rect.top, String(xs[i]), parts);
    }
  }

  function statTiles(container, tiles) {
    container.innerHTML = "";
    container.className = "stat-grid";
    tiles.forEach((t) => {
      const div = document.createElement("div");
      div.className = "stat-tile";
      div.innerHTML = `<div class="label">${t.label}</div><div class="value">${t.value}${t.suffix ? ` <small>${t.suffix}</small>` : ""}</div>`;
      container.appendChild(div);
    });
  }

  function dataTable(container, { columns, rows }) {
    container.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "data-table-wrap";
    const table = document.createElement("table");
    table.className = "data-table";
    const thead = document.createElement("thead");
    thead.innerHTML = "<tr>" + columns.map((c) => `<th class="${c.num ? "num" : ""}">${c.label}</th>`).join("") + "</tr>";
    const tbody = document.createElement("tbody");
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = columns.map((c) => `<td class="${c.num ? "num" : ""}">${c.format ? c.format(r[c.key]) : r[c.key]}</td>`).join("");
      tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    wrap.appendChild(table);
    container.appendChild(wrap);
  }

  global.Viz = { barChart, lineChart, statTiles, dataTable, compactNumber, fullNumber };
})(window);
