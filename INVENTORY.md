# Inventario de archivos reales — Portal MINEDEC

Generado a partir de inspección directa de los archivos entregados. Ningún archivo
Excel original ni dato personal se incluye en este repositorio: solo se documentan
aquí su estructura (hojas, columnas, tamaño) para diseñar el pipeline de
anonimización/agregación.

## 1. Documento de especificación

**`propuestaweb.docx`** — "Propuesta de diseño y arquitectura web institucional — MINEDEC".
45 párrafos de texto + 2 imágenes embebidas (mockups):

- `image1.png` (Vista 1 — Home): header (Estudios, Indicadores, Información General,
  Inicio, buscador, Iniciar sesión) + hero "Datos que transforman vidas" con panel
  central MINEDEC y 4 nodos: Educación Media (4.1M estudiantes), Educación Superior
  (500.000 estudiantes UEP-ITT), Cultura (15.000 gestores culturales), Deporte
  (10.000 deportistas) + franja de 4 value props (Información confiable, Cobertura
  nacional, Acceso abierto, Transparencia).
- `image2.png` (Vista 2 — Información General): nav superior con pills, sidebar
  "MENÚ GENERAL" con acordeón (Educación Media > Estudiantes/Instituciones;
  Educación Superior > UEP > Estudiantes/Docentes/Instituciones, ITT >
  Estudiantes/Docentes/Instituciones; Deporte > Medallas/Todos a la cancha;
  Cultura > Personas naturales/Personas jurídicas), tabs (Visualizador, Base de
  Datos, Tabulados) y panel central de gráficos de barras/columnas.

## 2. Archivo raíz

**`Registro-Administrativo-Historico_2009-202X-Inicio.xlsx`** (70.3 MB)
- 1 hoja: `Historico_Inicio` — **415.063 filas × 47 columnas**
- Nivel de agregación: **una fila por institución educativa por año lectivo**
  (no hay datos de estudiantes individuales).
- Columnas clave: `Año_lectivo, Zona, Provincia, Cod_Provincia, Canton, Cod_Canton,
  Parroquia, Cod_Parroquia, Nombre_Institucion, Codigo_Institucion, Escolarizacion,
  Tipo_Educacion, Sostenimiento, Area, Regimen_Escolar, Jurisdiccion, Modalidad,
  Jornada, Tenencia_Inmueble_Edificio, Acceso_Edificio`, conteos de
  `Docentes_(F/M/Total), Administrativos_(F/M/Total), Estudiantes_(F/M/Total)` y
  desagregación por nivel (`Inicial, EGB, Bachillerato` y por año de básica 1º–10º
  y bachillerato 1º–3º).
- **PII: ninguna** (son conteos agregados por institución, no personas). Apta para
  publicación como serie histórica 2009–202X.

## 3. `Anexos/Educación_Media/Información_educacion_media.xlsx`
- 1 hoja `Hoja1` — **2.681 filas × 22 columnas**.
- Snapshot (año actual) agregado por Zona/Provincia/Cantón/Parroquia/Tipo de
  educación/Sostenimiento/Área/Régimen/Jurisdicción: `Instituciones,
  Total_Estudiantes, Estudiantes_Femenino/Masculino, Estudiantes_Inicial/EGB/
  Bachillerato, Total_Docentes, Docentes_Femenino/Masculino`.
- **PII: ninguna.** Apta para publicación directa.

## 4. `Anexos/Educación_Superior/ITTS.xlsx`
- 1 hoja `Hoja1` — **203 filas × 7 columnas**: `cod_ies, TIPO_FINANCIAMIENTO,
  SEMESTRE, AÑO, provincia_ies, canton_ies, ESTUDIANTES`.
- Agregado por Instituto Técnico/Tecnológico/semestre/provincia. **PII: ninguna.**

## 5. `Anexos/Educación_Superior/UEP.xlsx`
- 1 hoja `Hoja3` — **122 filas × 6 columnas**: `CODIGO_IES, TIPO_SEDE,
  PROVINCIA_SEDE, CANTON_SEDE, TIPO_FINANCIAMIENTO, ESTUDIANTES`.
- Agregado por Universidad/Escuela Politécnica/sede. **PII: ninguna.**

## 6. `Anexos/Deporte/Base_Deporte.xlsx` — 5 hojas (metadatos en filas 1–8, datos desde fila 9)

| Hoja | Filas dato | Contenido | PII |
|---|---|---|---|
| `Ex Deportistas Vitalicios` | 335 | Pensionistas vitalicios: **cédula, nombre completo, banco, tipo de cuenta, número de cuenta, monto de transferencia**, provincia/cantón residencia | **Alta — datos financieros y de identidad** |
| `Deportistas de alto rendimiento` | ~401 | **Nombres, cédula, género, edad, fecha nacimiento, correo, teléfono, dirección domicilio**, deporte/categoría/provincia, estímulo y monto 2025 | **Alta** |
| `Deportistas de juegos nacionale` | ~2.756 | **Nombres, apellidos, cédula, fecha nacimiento, género**, evento/deporte/provincia (por federación) | **Alta** |
| `Entrenadores` | ~340 | **Nombres, apellidos, cédula, fecha nacimiento, dirección, teléfono, email**, provincia/función/deporte | **Alta** |
| `Usuarios de deporte` | 84 | Ya agregado: fecha de corte, año, uso/centro, tipo deporte, provincia, cantón, usuarios pagados/gratuitos, ingresos | **Ninguna** — apto para publicar tal cual |

## 7. `Anexos/Cultura/Naturales_cultura.xlsx`
- 1 hoja `Hoja 1` — **26.109 filas × 117 columnas**. Registro de gestores/artistas
  culturales personas naturales.
- **PII: alta** — incluye identificación, nombre, fecha de nacimiento, dirección,
  teléfono, correo, redes sociales, etc.
- Columnas categóricas seguras para agregación: `Provincia, Canton, sexo, Etnia,
  Tipo discapacidad, Nivel escolaridad, estados, anio, actividadPrimaria_sector,
  actividadPrimaria_ambito`.

## 8. `Anexos/Cultura/Juridico_cultura.xlsx`
- 1 hoja `JURIDICOS` — **647 filas × 77 columnas**. Registro de personas jurídicas/
  organizaciones culturales.
- **PII/dato sensible de negocio: alta** — razón social, identificación, nombre de
  representante legal, dirección, teléfono, correo.
- Columnas categóricas seguras: `Tipo actor, Subtipo actor, Provincia, Canton,
  Estado Contribuyente, Actividad Economica General, anio, estados`.

## 9. `Anexos.zip`
- Comprime el mismo contenido de `Anexos/` (copia redundante). No se usa como
  fuente adicional; se excluye del repositorio igual que `Anexos/`.

## 10. `motor.md`
- Documento de especificación funcional/de privacidad ("Motor maestro") con
  el mismo inventario preliminar (sección 2.1) que se confirma aquí de forma
  independiente, más la arquitectura de información completa del menú
  lateral, las reglas exactas de privacidad (sección 3) y los criterios de
  aceptación. Se excluye del repositorio junto con los demás insumos
  privados; ver [`README.md`](README.md#alcance-vs-motormd) para el detalle
  de qué de ese documento se implementó y qué se simplificó.

---

## Conclusión — estrategia de datos públicos

| Fuente | Estrategia |
|---|---|
| Registro histórico institucional, Educación Media, ITTS, UEP, Usuarios de deporte | Publicar **agregados directos** (ya son conteos institucionales/administrativos, sin personas identificables) |
| Ex Deportistas Vitalicios, Alto Rendimiento, Juegos Nacionales, Entrenadores | **Nunca publicar filas.** Solo conteos agregados por provincia/deporte/categoría/género/año, con **supresión de celdas pequeñas (k<5)** |
| Naturales_cultura, Juridico_cultura | **Nunca publicar filas.** Solo conteos agregados por provincia/sector/actividad/género/año, con **supresión k<5** |

Los archivos `.xlsx`, `Anexos/`, `Anexos.zip`, `propuestaweb.docx` y `motor.md`
se mantienen **fuera del repositorio Git** (ver `.gitignore`) y solo se usan
localmente como insumo de los scripts en `scripts/etl/`.
