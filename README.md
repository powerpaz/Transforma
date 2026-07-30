# MINEDEC — Portal de datos abiertos

Portal web estático (home + "Información General") del Ministerio de
Educación, Deporte y Cultura: página de inicio con resumen por sector y un
tablero con menú lateral (20 secciones en 4 sectores), pestañas
**Visualizador / Base de Datos / Tabulados** y gráficos. Construido en
**JavaScript puro** (sin frameworks ni librerías externas — ni siquiera para
parsear CSV) para publicarse en GitHub Pages sin paso de build.

Sigue la propuesta visual de [`propuestaweb.docx`](propuestaweb.docx) y la
especificación funcional/de privacidad de [`motor.md`](motor.md) — ver
[«Alcance vs. `motor.md`»](#alcance-vs-motormd) más abajo para qué de ese
documento se implementó tal cual y qué se simplificó, y por qué.

## Privacidad de los datos — léase primero

Este repositorio **no contiene los Excel originales ni ningún dato
personal**. Los archivos fuente (`Registro-Administrativo-Historico_*.xlsx`,
`Anexos/`, `Anexos.zip`, `propuestaweb.docx`, `motor.md`) están excluidos vía
`.gitignore` y solo se usan localmente, fuera del repo, como insumo de
`scripts/etl/`.

Lo único que se publica en `/data/*.csv` son **conteos agregados**: totales
por provincia, sexo, disciplina, año, etc. Ninguna fila individual (nombre,
cédula, dirección, teléfono, correo, cuenta bancaria) sale de las fuentes
originales. Donde la fuente es a nivel de persona (deportistas, gestores
culturales) se aplica además **supresión de celdas pequeñas (k-anonimato,
k≥5)**: cualquier categoría con menos de 5 personas se fusiona en "Otros /
protegido".

Ver [`INVENTORY.md`](INVENTORY.md) para el detalle de cada archivo fuente
inspeccionado, qué contiene y cómo se anonimizó.

## Formato de los datos: CSV "tidy", no JSON

Cada dominio se publica como **un único CSV en formato largo** de 4 columnas:

```csv
grupo,categoria,medida,valor
estudiantes_provincia,GUAYAS,valor,1011590
estudiantes_provincia,PICHINCHA,valor,670264
serie_anio,2010-2011 Inicio,estudiantes_total,4227768
```

- **`grupo`** — qué desglose es (p.ej. `estudiantes_provincia`, `serie_anio`).
- **`categoria`** — el valor de esa dimensión (una provincia, un año, "total").
- **`medida`** — qué se está contando (útil cuando un grupo tiene varias
  magnitudes, p.ej. la serie histórica trae `estudiantes_total`,
  `estudiantes_femenino`, `docentes_total`, etc. en el mismo `grupo=serie_anio`).
- **`valor`** — el número.

Una sola tabla por dominio (en vez de una por cada desglose) para no
multiplicar archivos, y sigue siendo trivial de filtrar/agrupar en JS
(`assets/js/data.js`) o de abrir directamente en Excel/Sheets. `resumen.csv`
(las 12 cifras del hero de la home) usa su propio esquema simple:
`sector,metrica,valor`.

Archivos generados (~42 KB en total, frente a los 93 MB de los Excel
originales):

```
data/educacion_media.csv        221 filas
data/educacion_superior.csv     109 filas
data/deporte.csv                167 filas
data/cultura.csv                324 filas
data/resumen.csv                 12 filas
```

## Estructura

```
index.html                  Página de inicio (Vista 1 de propuestaweb.docx)
informacion-general.html    Tablero (Vista 2): menú lateral + tabs + gráficos
assets/css/styles.css       Sistema de diseño (tokens de marca + dataviz)
assets/js/csv.js            Parser/serializador CSV propio (sin librerías)
assets/js/charts.js         Motor de gráficos SVG propio (barra y línea)
assets/js/data.js           Carga/cachea y filtra los CSV de /data
assets/js/main.js           Lógica de la página de inicio
assets/js/dashboard.js      Sidebar, tabs y las 20 secciones del tablero
data/*.csv                  Datos públicos agregados (generados, ver abajo)
scripts/etl/*.py            Pipeline que agrega/anonimiza cada fuente Excel
tests/                      pytest: privacidad, esquema e integridad del repo
INVENTORY.md                Inventario de los archivos fuente reales
motor.md                    Especificación funcional/de privacidad completa
```

## Regenerar los datos públicos

Requiere tener localmente los Excel originales (no incluidos en el repo) en
las rutas descritas en `INVENTORY.md`.

```bash
pip install -r requirements.txt
python scripts/etl/run_all.py   # lee los Excel, escribe /data/*.csv
```

## Ejecutar las pruebas

```bash
python -m pytest tests -v
```

Cubren tres frentes:

- **`test_public_data_privacy.py`** — escanea todo `/data/*.csv` en busca de
  correos, teléfonos, cédulas/RUC/cuentas, texto con nombre de campo
  personal, y verifica el umbral de k-anonimato.
- **`test_public_data_schema.py`** — que cada CSV tenga las columnas que
  espera el frontend, sin valores negativos y con cifras coherentes
  (femenino + masculino = total, etc.).
- **`test_repo_integrity.py`** — que los Excel originales estén ignorados por
  git, que no haya `.xlsx` versionados, que el HTML no dependa de CDNs
  externos, que los ids del menú coincidan con `dashboard.js` y que cada
  sección declare su fuente.

## Ver el portal localmente

Es un sitio estático, pero usa `fetch()` para cargar `/data/*.csv`, así que
necesita servirse por HTTP (no `file://`):

```bash
python -m http.server 8000
# abrir http://localhost:8000/
```

## Publicar en GitHub Pages

1. Crear el repositorio en GitHub y subir esta rama (`git push`).
2. En **Settings → Pages**, elegir **Deploy from a branch** → `main` / `/(root)`.
3. Listo: `index.html` y `informacion-general.html` quedan servidos tal cual,
   sin paso de build. `.nojekyll` evita que GitHub Pages intente procesar la
   carpeta con Jekyll.

## Alcance de los datos y honestidad de la información

El menú lateral de "Información General" sigue la arquitectura de
información de `motor.md` sección 5.3 (20 secciones: Panorama general,
Estudiantes, Docentes, Instituciones, Serie histórica y Distribución
territorial en Educación Media; Panorama + UEP/ITT Estudiantes en Educación
Superior; Panorama, Alto rendimiento, Juegos nacionales, Entrenadores,
Usuarios del deporte y Exdeportistas vitalicios en Deporte; Panorama,
Personas naturales, Personas jurídicas, Ámbitos culturales y Distribución
territorial en Cultura).

Donde la fuente entregada no tiene el indicador (por ejemplo, "Docentes" no
existe como columna en `UEP.xlsx`/`ITTS.xlsx`, así que Educación Superior no
tiene una sección de Docentes), esa sección **no se inventa**: simplemente no
aparece en el menú, en vez de mostrar datos falsos.

## Alcance vs. `motor.md`

`motor.md` es una especificación muy amplia (arquitectura de servicios
intercambiable, PWA/service worker, mapas Leaflet, constructor de consultas
tipo tabla dinámica con arrastrar-y-soltar, adaptador Supabase de ejemplo,
`docs/` con 5 documentos separados, suite de pruebas en JS, workflow de
GitHub Actions que bloquea el despliegue si falla la privacidad). Se
implementó el núcleo funcional completo — inspección real de fuentes,
inventario, agregación con k-anonimato, portal con los 4 sectores, menú
lateral completo, 3 pestañas funcionando con datos reales, gráficos
interactivos, exportación CSV, pruebas de privacidad/esquema/integridad,
listo para GitHub Pages — y se dejaron fuera, deliberadamente, estas piezas
periféricas:

| No implementado | Por qué |
|---|---|
| Mapas Leaflet / capas GeoJSON | Los Excel no traen geometría ni límites territoriales, y `motor.md` 13.1 prohíbe explícitamente inventar o descargar geometrías de una fuente no autorizada. La sección "Distribución territorial" cubre el mismo objetivo con gráficos de barras por provincia. |
| PWA (`manifest.webmanifest`, `sw.js`, caché offline) | No es parte de "portal de datos" en sentido estricto; añade una capa de complejidad (invalidación de caché, testing offline) desproporcionada para el alcance pedido. |
| Constructor de consultas arrastrar-y-soltar / URL compartible con estado de filtros | Las 3 pestañas ya permiten explorar cada desglose generado; un pivot-table genérico es un proyecto en sí mismo. |
| Adaptador de ejemplo Supabase | No hay plan concreto de migración todavía; se documenta la posibilidad en este README en vez de código no funcional. |
| `docs/` con 5 archivos separados (`architecture.md`, `data_processing.md`, etc.) | Consolidado en este README + `INVENTORY.md` para no fragmentar la documentación de un proyecto de este tamaño. |
| Suite de pruebas en JavaScript | La lógica de agregación/privacidad (lo más sensible) vive en Python y está cubierta por `tests/`; la capa JS es intencionalmente delgada (parseo CSV + filtrado + render). |
| GitHub Actions que bloquea el deploy por privacidad | `tests.yml` corre la suite de privacidad en cada push; un workflow de "Pages" adicional no aporta más control ya que el build es estático y sin paso de generación en CI (los CSV se generan localmente, antes del commit, como pide `motor.md` 23.1). |

Todo lo demás de `motor.md` — inspección real antes de programar, no
modificar originales, regla de k≥5, `.gitignore` de fuentes, arquitectura de
información del menú, 3 pestañas, gráficos con tooltip/leyenda, tabla
paginable y exportable, responsividad móvil/tablet/escritorio, accesibilidad
básica (skip-link, aria-live, foco visible, prefers-reduced-motion no
forzado), y "toda cifra visible proviene de un archivo procesado" — está
implementado y verificado (ver capturas y pruebas).
