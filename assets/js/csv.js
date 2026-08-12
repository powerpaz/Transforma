/*
 * Parser/serializador CSV propio, en JavaScript puro (sin librerías).
 * Soporta comillas dobles, comas y saltos de línea dentro de campos
 * entrecomillados (RFC 4180), suficiente para los CSV tidy de /data.
 */
(function (global) {
  "use strict";

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    // Normaliza saltos de línea y quita un posible BOM inicial.
    text = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    if (!rows.length) return [];

    const header = rows[0];
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      if (rows[r].length === 1 && rows[r][0] === "") continue; // línea vacía final
      const obj = {};
      header.forEach((h, i) => { obj[h] = rows[r][i] !== undefined ? rows[r][i] : ""; });
      out.push(obj);
    }
    return out;
  }

  function needsQuoting(value) {
    return /[",\n]/.test(value);
  }

  function toCSV(columns, rows) {
    const esc = (v) => {
      v = String(v ?? "");
      return needsQuoting(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    };
    const header = columns.map((c) => esc(c.label)).join(",");
    const lines = rows.map((r) => columns.map((c) => esc(r[c.key])).join(","));
    return [header, ...lines].join("\n");
  }

  function downloadCSV(filename, columns, rows) {
    const csv = "﻿" + toCSV(columns, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  global.CSV = { parseCSV, toCSV, downloadCSV };
})(window);
