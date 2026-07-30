# MOTOR MAESTRO — PORTAL WEB DE DATOS MINEDEC

> Archivo de instrucciones para ejecutar en Claude Code.
>
> Objetivo: construir un portal web institucional, modular, responsivo e interactivo para consultar información de Educación Media, Educación Superior, Deporte y Cultura mediante datos estáticos, sin conexión a Supabase en esta primera etapa, y dejar la arquitectura preparada para incorporar una fuente de datos remota posteriormente.

---

## 0. INSTRUCCIÓN PRINCIPAL PARA CLAUDE CODE

Actúa como arquitecto de software, desarrollador frontend senior, especialista en visualización de datos y analista de calidad de información.

Debes **inspeccionar los archivos fuente reales antes de programar**, construir el proyecto completo, generar los archivos funcionales, preparar los datos estáticos, validar el resultado y dejarlo listo para publicarse en GitHub Pages.

No te limites a describir una solución. Debes crear físicamente todos los archivos del proyecto.

Trabaja de manera autónoma y por fases. No pidas confirmación para decisiones técnicas menores. Solo detente cuando falte un insumo indispensable que no pueda resolverse con una alternativa segura.

---

# 1. CONTEXTO DEL PROYECTO

Se construirá un portal institucional de datos del **Ministerio de Educación, Deporte y Cultura — MINEDEC**.

El diseño se inspira en la propuesta institucional proporcionada:

- Página inicial visual con el concepto **“Datos que transforman vidas”**.
- Navegación temática por:
  - Educación Media.
  - Educación Superior.
  - Deporte.
  - Cultura.
- Barra superior con accesos principales.
- Vista analítica con menú lateral jerárquico.
- Módulo central dividido en:
  - **Visualizador**.
  - **Base de Datos**.
  - **Tabulados**.
- Indicadores, mapas, gráficos, tablas y filtros interactivos.
- Enfoque en transparencia, datos abiertos, consulta pública y facilidad de uso.

La aplicación será inicialmente **100 % estática** y funcionará en GitHub Pages.

No se utilizará Supabase ni otro backend en esta fase. Sin embargo, el código deberá implementar una capa de servicios que permita reemplazar posteriormente el proveedor estático por Supabase sin reescribir toda la interfaz.

---

# 2. ARCHIVOS FUENTE QUE DEBEN SER PROCESADOS

Localiza e inspecciona estos archivos y carpetas dentro del espacio de trabajo:

```text
propuestaweb.docx
Registro-Administrativo-Historico_2009-202X-Inicio.xlsx
Anexos/
├── Educación_Media/
│   └── Información_educacion_media.xlsx
├── Educación_Superior/
│   ├── UEP.xlsx
│   └── ITTS.xlsx
├── Deporte/
│   └── Base_Deporte.xlsx
└── Cultura/
    ├── Juridico_cultura.xlsx
    └── Naturales_cultura.xlsx
```

El archivo puede llegar comprimido como:

```text
Anexos(1).zip
```

Si existe el ZIP, descomprímelo únicamente en el entorno local de trabajo.

## 2.1 Inventario preliminar observado

Claude Code debe verificar este inventario y generar un informe definitivo:

| Sector | Archivo / hoja | Dimensión observada | Uso esperado |
|---|---|---:|---|
| Educación Media | Registro-Administrativo-Historico_2009-202X-Inicio.xlsx / Historico_Inicio | 415.063 filas, 47 columnas | Serie histórica de instituciones, estudiantes, docentes, administrativos y niveles |
| Educación Media | Información_educacion_media.xlsx / Hoja1 | 2.681 filas, 22 columnas | Resumen territorial actual |
| Educación Superior | UEP.xlsx / Hoja3 | 122 filas, 6 columnas | Estudiantes por sede, provincia, cantón y financiamiento |
| Educación Superior | ITTS.xlsx / Hoja1 | 203 filas, 7 columnas | Estudiantes por IES, semestre, año, provincia, cantón y financiamiento |
| Deporte | Ex Deportistas Vitalicios | Registros desde fila 5 hasta 344 | Resumen agregado de pensionistas y transferencias |
| Deporte | Deportistas de alto rendimiento | Registros desde fila 5 hasta 410 | Resumen agregado por deporte, provincia, zona, género y categoría |
| Deporte | Deportistas de juegos nacionales | Registros desde fila 5 hasta 2.765 | Resumen agregado por deporte, delegación, lugar y género |
| Deporte | Entrenadores | Registros desde fila 5 hasta 349 | Resumen agregado por provincia, zona, función y deporte |
| Deporte | Usuarios de deporte | Registros desde fila 5 hasta 93 | Usuarios pagados, gratuitos e ingresos por territorio |
| Cultura | Juridico_cultura.xlsx / JURIDICOS | 648 filas, 77 columnas | Actores jurídicos agregados por territorio, actividad y estado |
| Cultura | Naturales_cultura.xlsx / Hoja 1 | 26.109 filas, 117 columnas | Actores naturales agregados por territorio, ámbito y características no identificables |

No asumas que el nombre de una columna está correctamente escrito. Conserva la columna original en el diccionario de datos y crea un nombre técnico normalizado para uso interno.

Ejemplos detectados:

```text
Modallidad
Estudiaontes_EGB
Actilización
PARENTEZCO APODERADO
```

No modifiques los archivos originales.

---

# 3. REGLA CRÍTICA DE PRIVACIDAD Y PUBLICACIÓN

## 3.1 GitHub Pages es público

Todo archivo incorporado al repositorio publicado en GitHub Pages puede ser descargado por cualquier persona, aunque no aparezca visible en la interfaz.

Por tanto:

### PROHIBIDO PUBLICAR

No subas ni copies al repositorio público los archivos Excel originales que contengan información personal.

No publiques registros individuales con:

- Cédula o identificación.
- RUC personal.
- Nombres y apellidos.
- Fecha de nacimiento completa.
- Dirección.
- Teléfono.
- Correo electrónico.
- Cuenta bancaria.
- Banco.
- Información de apoderados.
- Discapacidad individual.
- Etnia o pueblo vinculados a una persona identificable.
- Datos de menores de edad.
- Información financiera individual.
- Cualquier combinación que permita reidentificar a una persona.

Los archivos con mayor nivel de riesgo son:

```text
Base_Deporte.xlsx
Naturales_cultura.xlsx
Juridico_cultura.xlsx
```

## 3.2 Tratamiento permitido

Los archivos originales deberán procesarse **localmente** y generar únicamente:

- Conteos agregados.
- Sumas agregadas.
- Promedios.
- Distribuciones porcentuales.
- Series temporales.
- Totales por territorio.
- Totales por categoría.
- Tablas anonimizadas.

Aplica una regla mínima de protección:

```text
No publicar grupos con menos de 5 registros.
```

Cuando un grupo tenga menos de 5 registros:

- Agruparlo en “Otros / protegido”, o
- Suprimir el valor y marcarlo como “Dato protegido”.

No mostrar datos personales en:

- Tablas.
- Tooltips.
- Gráficos.
- Descargas CSV.
- Consola del navegador.
- Archivos JSON.
- Logs.
- Código fuente.
- Metadatos.

## 3.3 Archivos originales fuera de Git

Crea este `.gitignore` como mínimo:

```gitignore
# Archivos fuente privados
sources/
raw/
data/raw/
*.xlsx
*.xls
*.zip

# Datos sensibles o temporales
private/
temp/
tmp/
output_raw/
privacy_reports/details/

# Python
__pycache__/
*.pyc
.venv/
venv/

# Sistema
.DS_Store
Thumbs.db

# Editores
.vscode/
.idea/
```

Los archivos fuente podrán mantenerse en una carpeta local `sources/`, pero esa carpeta nunca debe publicarse.

---

# 4. OBJETIVO FUNCIONAL

La aplicación deberá permitir que una persona usuaria:

1. Ingrese a una página institucional clara y visual.
2. Seleccione uno de los cuatro sectores.
3. Navegue por categorías y subcategorías.
4. Consulte indicadores generales.
5. Aplique filtros territoriales y temáticos.
6. Visualice gráficos interactivos.
7. Visualice capas geográficas cuando exista geometría disponible.
8. Consulte una tabla de datos agregados.
9. Construya tabulados personalizados.
10. Exporte únicamente resultados agregados y seguros.
11. Comparta una consulta mediante parámetros en la URL.
12. Utilice el portal desde computadora, tableta o teléfono.

---

# 5. ARQUITECTURA DE INFORMACIÓN

## 5.1 Barra superior

La barra principal debe incluir:

```text
Inicio
Estudios
Indicadores
Información General
Acerca de los datos
```

También debe incluir:

- Logotipo institucional proporcionado.
- Botón de búsqueda.
- Botón de accesibilidad o contraste.
- Botón para abrir el menú en dispositivos móviles.

No inventes escudos, isotipos ni logotipos oficiales. Utiliza únicamente recursos proporcionados por el usuario.

## 5.2 Página inicial

Crear una portada inspirada en la propuesta visual:

### Encabezado principal

```text
Datos que transforman vidas
```

Texto introductorio:

```text
Explore la información de Educación, Deporte y Cultura para construir un mejor Ecuador.
```

### Tarjetas sectoriales

- Educación Media.
- Educación Superior.
- Deporte.
- Cultura.

Cada tarjeta debe mostrar:

- Nombre.
- Breve descripción.
- Indicador principal disponible.
- Botón “Explorar datos”.
- Icono accesible.
- Estado de actualización.

### Principios institucionales

Mostrar cuatro bloques:

- Información confiable.
- Cobertura nacional.
- Acceso abierto.
- Transparencia.

## 5.3 Vista de análisis

La vista analítica tendrá:

### Menú lateral

```text
EDUCACIÓN MEDIA
├── Panorama general
├── Estudiantes
├── Docentes
├── Instituciones
├── Serie histórica
└── Distribución territorial

EDUCACIÓN SUPERIOR
├── Panorama general
├── Universidades y escuelas politécnicas
│   └── Estudiantes
└── Institutos técnicos y tecnológicos
    └── Estudiantes

DEPORTE
├── Panorama general
├── Alto rendimiento
├── Juegos nacionales
├── Entrenadores
├── Usuarios del deporte
└── Exdeportistas vitalicios

CULTURA
├── Panorama general
├── Personas naturales
├── Personas jurídicas
├── Ámbitos culturales
└── Distribución territorial
```

No habilites una opción que no esté respaldada por información real. Si una categoría está planificada pero no existen datos, mostrarla deshabilitada con la etiqueta:

```text
Próximamente
```

### Pestañas centrales

```text
Visualizador
Base de Datos
Tabulados
```

---

# 6. TECNOLOGÍAS

Usa una arquitectura estática, sin framework obligatorio y compatible con GitHub Pages.

## 6.1 Frontend

- HTML5 semántico.
- CSS3 con variables.
- JavaScript moderno ES2020+.
- Módulos ES.
- Leaflet para mapas.
- Chart.js para gráficos.
- Sin jQuery.
- Sin dependencia de un servidor.
- Sin claves privadas.
- Sin variables secretas en frontend.

Puedes usar librerías por CDN, pero:

- Deben tener versión fijada.
- Deben contar con atributo `integrity` cuando sea posible.
- La aplicación debe mostrar un mensaje útil si una librería no carga.
- Evita incluir más librerías de las necesarias.

## 6.2 Procesamiento local

Crear scripts en Python para:

- Inspeccionar Excel.
- Generar inventario.
- Normalizar columnas.
- Agregar datos.
- Aplicar reglas de privacidad.
- Generar JSON seguro.
- Validar los archivos resultantes.

Dependencias sugeridas:

```text
openpyxl
python-dateutil
```

Para el archivo histórico de gran tamaño, usa:

```python
openpyxl.load_workbook(
    archivo,
    read_only=True,
    data_only=True
)
```

Procesa fila por fila. No cargues las 415.000 filas completas en memoria.

No es obligatorio utilizar pandas.

---

# 7. ESTRUCTURA DEL PROYECTO

Crea exactamente una estructura equivalente a esta:

```text
minedec-portal-datos/
├── index.html
├── 404.html
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt
├── manifest.webmanifest
├── sw.js
│
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── dashboard.css
│   │   ├── accessibility.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── router.js
│   │   ├── state.js
│   │   ├── ui.js
│   │   ├── accessibility.js
│   │   ├── utils.js
│   │   │
│   │   ├── services/
│   │   │   ├── dataService.js
│   │   │   ├── staticDataService.js
│   │   │   └── supabaseDataService.example.js
│   │   │
│   │   ├── modules/
│   │   │   ├── home.js
│   │   │   ├── dashboard.js
│   │   │   ├── filters.js
│   │   │   ├── indicators.js
│   │   │   ├── charts.js
│   │   │   ├── map.js
│   │   │   ├── dataTable.js
│   │   │   ├── queryBuilder.js
│   │   │   ├── export.js
│   │   │   └── metadata.js
│   │   │
│   │   └── workers/
│   │       └── queryWorker.js
│   │
│   ├── img/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── sectors/
│   │   └── placeholders/
│   │
│   └── icons/
│
├── data/
│   ├── manifest.json
│   ├── catalog.json
│   ├── data_dictionary.json
│   ├── update_status.json
│   │
│   ├── processed/
│   │   ├── educacion_media/
│   │   ├── educacion_superior/
│   │   ├── deporte/
│   │   └── cultura/
│   │
│   └── geo/
│       ├── README.md
│       └── .gitkeep
│
├── scripts/
│   ├── build_all.py
│   ├── inspect_sources.py
│   ├── normalize.py
│   ├── privacy.py
│   ├── validate_outputs.py
│   ├── generate_catalog.py
│   └── processors/
│       ├── education_history.py
│       ├── education_current.py
│       ├── higher_education.py
│       ├── sports.py
│       └── culture.py
│
├── tests/
│   ├── test_privacy.py
│   ├── test_data_integrity.py
│   ├── test_queries.js
│   └── test_smoke.html
│
├── docs/
│   ├── architecture.md
│   ├── data_processing.md
│   ├── privacy.md
│   ├── deployment.md
│   └── data_inventory.md
│
└── .github/
    └── workflows/
        └── pages.yml
```

La raíz publicada deberá contener `index.html`.

---

# 8. CAPA DE DATOS INTERCAMBIABLE

La interfaz no debe acceder directamente a archivos concretos desde los componentes.

Crea una interfaz común:

```javascript
class DataService {
  async getCatalog() {}
  async getDataset(datasetId, options = {}) {}
  async query(datasetId, queryDefinition) {}
  async getGeoLayer(level) {}
  async getMetadata(datasetId) {}
}
```

## 8.1 Modo actual

```javascript
DATA_PROVIDER = "static"
```

Implementar:

```text
staticDataService.js
```

Este servicio cargará archivos JSON mediante `fetch()`.

## 8.2 Modo futuro

Crear únicamente un archivo de ejemplo, no funcional y sin credenciales:

```text
supabaseDataService.example.js
```

Debe demostrar cómo se implementaría la misma interfaz en el futuro.

No incluir:

- URL de Supabase.
- Anon key.
- Service role key.
- Claves ficticias que parezcan reales.

---

# 9. PROCESAMIENTO DE DATOS

## 9.1 Flujo general

```text
Excel original local
        ↓
Inspección y catálogo
        ↓
Normalización de nombres
        ↓
Validación de tipos
        ↓
Agregación temática
        ↓
Anonimización y protección
        ↓
Archivos JSON estáticos
        ↓
Validación final
        ↓
Portal web
```

## 9.2 Reglas de normalización

Crear una función que convierta nombres técnicos a `snake_case`:

```text
Año_lectivo               → anio_lectivo
Código_Institucion        → codigo_institucion
Total_Estudiantes         → total_estudiantes
PROVINCIA REPRESENTACIÓN  → provincia_representacion
```

Reglas:

- Quitar tildes solo del nombre técnico.
- Mantener la etiqueta original en metadatos.
- Convertir saltos de línea en espacios.
- Quitar espacios duplicados.
- No cambiar valores originales silenciosamente.
- Registrar correcciones en `data_dictionary.json`.
- Distinguir valores nulos de cero.
- Mantener códigos territoriales como texto para conservar ceros a la izquierda.
- Mantener códigos AMIE e identificadores institucionales como texto.
- Convertir fechas seriales de Excel cuando corresponda.
- Registrar formatos dudosos como advertencias.

## 9.3 Archivos de salida obligatorios

### `data/manifest.json`

Debe indicar:

```json
{
  "version": "1.0.0",
  "generatedAt": "ISO-8601",
  "provider": "static",
  "datasets": [],
  "geoLayers": [],
  "privacy": {
    "aggregated": true,
    "minimumGroupSize": 5
  }
}
```

### `data/catalog.json`

Para cada conjunto:

```json
{
  "id": "educacion_media_historico",
  "sector": "educacion_media",
  "title": "Registro administrativo histórico",
  "description": "...",
  "sourceFile": "nombre del archivo fuente",
  "publicFile": "data/processed/...",
  "dimensions": [],
  "measures": [],
  "availableYears": [],
  "availableTerritorialLevels": [],
  "lastUpdated": null,
  "notes": []
}
```

### `data/data_dictionary.json`

Por campo:

- Nombre técnico.
- Etiqueta original.
- Etiqueta visible.
- Tipo.
- Descripción.
- Unidad.
- Dimensión o medida.
- Sensibilidad.
- Publicable.
- Regla de transformación.
- Valores o categorías principales.

### `data/update_status.json`

Debe mostrar la fecha de generación y el estado de cada fuente:

```text
Procesado
Procesado con advertencias
No procesado
Bloqueado por privacidad
```

---

# 10. AGREGACIONES POR CONJUNTO DE DATOS

## 10.1 Educación Media — histórico

Archivo:

```text
Registro-Administrativo-Historico_2009-202X-Inicio.xlsx
```

Campos principales observados:

- Año lectivo.
- Zona.
- Provincia y código.
- Cantón y código.
- Parroquia y código.
- Institución y código.
- Escolarización.
- Tipo de educación.
- Sostenimiento.
- Área.
- Régimen escolar.
- Jurisdicción.
- Modalidad.
- Jornada.
- Docentes por sexo y total.
- Administrativos por sexo y total.
- Estudiantes por sexo y total.
- Inicial.
- EGB.
- Bachillerato.
- Desagregación por años de educación.

No publiques una tabla de las 415.000 filas completas en la carga inicial.

Genera:

```text
historico_nacional_anio.json
historico_zona_anio.json
historico_provincia_anio.json
historico_canton_anio.json
historico_parroquia_anio.json
historico_sostenimiento_anio.json
historico_area_anio.json
historico_tipo_educacion_anio.json
historico_regimen_anio.json
historico_jurisdiccion_anio.json
```

Métricas mínimas:

- Número de instituciones únicas.
- Total de estudiantes.
- Estudiantes femeninos.
- Estudiantes masculinos.
- Total de docentes.
- Docentes femeninos.
- Docentes masculinos.
- Total de administrativos.
- Inicial.
- EGB.
- Bachillerato.

Cuando se agregue por institución, usar el código institucional para evitar duplicados dentro del mismo año lectivo.

## 10.2 Educación Media — resumen territorial

Archivo:

```text
Información_educacion_media.xlsx
```

Este archivo ya contiene información agregada. Publicar sus registros territoriales siempre que no haya datos personales.

Permitir filtros por:

- Zona.
- Provincia.
- Cantón.
- Parroquia.
- Tipo de educación.
- Sostenimiento.
- Área.
- Régimen.
- Jurisdicción.

## 10.3 Educación Superior — UEP

Archivo:

```text
UEP.xlsx
```

Generar:

- Estudiantes por provincia.
- Estudiantes por cantón.
- Estudiantes por tipo de sede.
- Estudiantes por tipo de financiamiento.
- Número de sedes por territorio.
- Ranking territorial.

No confundir número de registros con número de instituciones. Utilizar `CODIGO_IES`.

## 10.4 Educación Superior — ITTS

Archivo:

```text
ITTS.xlsx
```

Generar:

- Estudiantes por año y semestre.
- Estudiantes por provincia.
- Estudiantes por cantón.
- Estudiantes por financiamiento.
- Número de IES por territorio.

Usar `cod_ies` como identificador institucional.

## 10.5 Deporte

### Exdeportistas vitalicios

Publicar solo agregados:

- Número de pensionistas.
- Distribución nacional/extranjero.
- País de residencia.
- Provincia y cantón de residencia.
- Tipo de beneficiario.
- Estado.
- Valor total transferido.
- Valor promedio transferido.

Excluir completamente:

- Cédula.
- Nombres.
- Apoderados.
- Parentesco.
- Banco.
- Tipo y número de cuenta.

### Alto rendimiento

Publicar agregados por:

- Sector.
- Organismo deportivo.
- Deporte.
- Categoría.
- Modalidad.
- Grupo.
- Género.
- Rango de edad.
- Provincia de representación.
- Cantón.
- Zona.
- Nivel de estímulo.
- Año de ingreso.

Métricas:

- Número de deportistas.
- Monto total.
- Monto promedio.

No publicar nombres, cédulas, teléfonos, correos ni domicilios.

### Juegos nacionales

Publicar agregados por:

- Evento.
- Lugar.
- Participa por.
- Deporte.
- Género.
- Rango de edad.

No publicar documentos de identidad, nombres ni fechas completas de nacimiento.

### Entrenadores

Publicar agregados por:

- Delegación.
- Provincia.
- Zona.
- Función.
- Deporte.
- Género.

No publicar nombres, identificación, dirección, teléfono ni correo.

### Usuarios del deporte

Publicar:

- Usuarios pagados.
- Usuarios gratuitos.
- Total de usuarios.
- Total de ingresos.
- Provincia.
- Cantón.
- Tipo de deporte.
- Año.
- Fecha de corte cuando sea válida.

## 10.6 Cultura — personas naturales

La fuente contiene información personal y sensible.

No publicar registros individuales.

Generar agregados por:

- Provincia.
- Cantón.
- Parroquia cuando el tamaño del grupo lo permita.
- Sexo.
- Rango de edad.
- Nacionalidad agrupada.
- Sector cultural.
- Ámbito.
- Subámbito.
- Rol.
- Actividad.
- Producto.
- Estado.
- Año de registro.
- Trayectoria por rangos.

Rangos de edad sugeridos:

```text
Menor de 18
18–24
25–34
35–44
45–54
55–64
65 o más
No informado
```

No cruzar dimensiones sensibles de forma que facilite la reidentificación.

No publicar:

- Identificación.
- Nombre.
- Fecha exacta de nacimiento.
- RUC.
- Dirección.
- Referencia.
- Teléfonos.
- Correos.
- Páginas personales.
- Documentos adjuntos.
- Detalles de trayectoria de texto libre.
- Código CONADIS.
- Discapacidad individual.

## 10.7 Cultura — personas jurídicas

Generar agregados por:

- Provincia.
- Cantón.
- Parroquia.
- Subtipo de actor.
- Actividad cultural.
- Sector.
- Ámbito.
- Subámbito.
- Tipo de contribuyente.
- Estado.
- Año.
- Estado de validación.

No publicar:

- Identificación tributaria completa si no existe autorización expresa.
- Nombre de representante.
- Identificación de representante.
- Dirección.
- Teléfonos.
- Correos.
- Texto libre de trayectoria.
- Información de nómina.

Para el nombre de una organización, por defecto no publicarlo. Solo podrá habilitarse con una lista blanca aprobada por el propietario de los datos.

---

# 11. MOTOR DE CONSULTAS ESTÁTICO

Crear una interfaz de consulta sin backend.

## 11.1 Constructor visual

Permitir seleccionar:

- Conjunto de datos.
- Una a tres dimensiones.
- Una o más métricas.
- Operación:
  - Suma.
  - Conteo.
  - Conteo distinto.
  - Promedio.
  - Mínimo.
  - Máximo.
- Filtros.
- Orden.
- Límite de resultados.
- Tipo de salida.

Tipos de salida:

```text
Tabla
Barras
Columnas
Línea
Dona
Mapa
Tarjetas
```

## 11.2 Definición interna

Usar una estructura similar:

```javascript
{
  datasetId: "educacion_media_historico",
  dimensions: ["anio_lectivo", "provincia"],
  measures: [
    {
      field: "total_estudiantes",
      operation: "sum",
      alias: "Estudiantes"
    }
  ],
  filters: [
    {
      field: "sostenimiento",
      operator: "equals",
      value: "Fiscal"
    }
  ],
  orderBy: [
    {
      field: "Estudiantes",
      direction: "desc"
    }
  ],
  limit: 50
}
```

## 11.3 Operadores

Implementar:

```text
equals
not_equals
contains
starts_with
in
between
greater_than
less_than
is_null
is_not_null
```

## 11.4 Rendimiento

- Ejecutar consultas grandes dentro de `queryWorker.js`.
- Cargar datos de forma diferida.
- No cargar todos los sectores al iniciar.
- Cachear archivos ya descargados.
- Cancelar consultas anteriores cuando el usuario cambie filtros.
- Mostrar indicador de carga.
- Mostrar errores comprensibles.
- Limitar resultados visibles a 500 filas.
- Paginar tablas.
- Dividir archivos de salida demasiado grandes.

## 11.5 URL compartible

Guardar el estado de consulta en parámetros de URL o hash:

```text
#dashboard?sector=educacion_media&dataset=historico&anio=2024
```

No incluir información sensible en la URL.

---

# 12. VISUALIZADOR

## 12.1 Componentes obligatorios

Cada tablero debe tener:

1. Título.
2. Descripción.
3. Fecha o estado de actualización.
4. Filtros.
5. Tarjetas KPI.
6. Gráfico principal.
7. Gráfico secundario.
8. Mapa o mensaje de disponibilidad.
9. Tabla resumida.
10. Botón para limpiar filtros.
11. Botón para exportar resultados agregados.
12. Sección “Acerca de estos datos”.

## 12.2 KPI sugeridos

### Educación Media

- Instituciones.
- Estudiantes.
- Docentes.
- Promedio de estudiantes por institución.

### Educación Superior

- Estudiantes.
- Sedes.
- IES.
- Participación pública/particular.

### Deporte

- Deportistas.
- Entrenadores.
- Usuarios.
- Monto agregado cuando corresponda.

### Cultura

- Actores culturales.
- Provincias con registros.
- Ámbitos culturales.
- Registros activos.

## 12.3 Gráficos

Usar Chart.js y crear funciones reutilizables.

Gráficos mínimos:

- Barras horizontales.
- Columnas.
- Línea temporal.
- Dona.
- Barras apiladas.
- Pirámide o comparación por sexo solo cuando sea estadísticamente segura.
- Ranking territorial.

Requisitos:

- Tooltips.
- Leyenda.
- Etiquetas accesibles.
- Paleta consistente.
- Adaptación móvil.
- Mensaje “No existen datos para los filtros seleccionados”.
- Destruir la instancia anterior antes de crear un gráfico nuevo.
- No usar animaciones excesivas.

---

# 13. MAPAS Y CAPAS

Usar Leaflet.

## 13.1 Limitación actual

Los archivos Excel analizados contienen principalmente:

- Zona.
- Provincia.
- Cantón.
- Parroquia.
- Códigos territoriales.

No se ha confirmado la existencia de geometrías GeoJSON en los anexos.

Por tanto:

- La aplicación debe funcionar aunque `data/geo/` esté vacío.
- Si no existe una capa geográfica, mostrar:

```text
La capa geográfica aún no se encuentra disponible. Puede continuar la consulta mediante gráficos y tablas.
```

- No inventar geometrías.
- No descargar límites territoriales de una fuente no autorizada.
- No geocodificar direcciones de personas.
- No enviar datos a servicios externos.

## 13.2 Capas futuras esperadas

Preparar soporte para:

```text
dpa_provincias.geojson
dpa_cantones.geojson
dpa_parroquias.geojson
```

Claves preferidas:

```text
cod_provincia
cod_canton
cod_parroquia
```

El sistema deberá poder configurar el campo de unión desde `config.js`.

## 13.3 Funcionalidad del mapa

- Selector de nivel territorial.
- Selector de métrica.
- Leyenda dinámica.
- Escala de colores.
- Tooltip con nombre, código y valor agregado.
- Zoom al territorio seleccionado.
- Restablecer extensión.
- Mostrar/ocultar capas.
- Control de opacidad.
- Panel de información.
- Sin datos personales.

Si el GeoJSON tiene una licencia o fuente, mostrarla en el pie del mapa.

---

# 14. BASE DE DATOS

La pestaña “Base de Datos” no mostrará bases crudas con datos personales.

Debe mostrar únicamente conjuntos públicos procesados.

Funciones:

- Seleccionar conjunto.
- Buscar sin distinguir tildes ni mayúsculas.
- Filtrar.
- Ordenar.
- Ocultar y mostrar columnas.
- Paginar.
- Mostrar máximo 100 filas por página.
- Descargar resultado filtrado como CSV.
- Copiar tabla.
- Mostrar cantidad de registros.
- Mostrar diccionario del campo al pasar el cursor o abrir detalles.

El CSV exportado debe incluir:

- Título del conjunto.
- Fecha de generación.
- Filtros aplicados.
- Nota de agregación.
- Fuente.
- Datos visibles.

---

# 15. TABULADOS

Crear un módulo similar a una tabla dinámica básica.

El usuario debe poder:

- Arrastrar o seleccionar dimensiones.
- Seleccionar métricas.
- Elegir filas y columnas.
- Aplicar filtros.
- Mostrar totales.
- Mostrar porcentajes.
- Alternar entre valores absolutos y porcentajes.
- Exportar CSV.
- Convertir el tabulado en gráfico.

No permitir combinaciones que incumplan la regla de privacidad.

---

# 16. DISEÑO VISUAL

## 16.1 Estilo

- Institucional.
- Moderno.
- Limpio.
- Modular.
- Sobrio.
- Con espacios amplios.
- Tarjetas con bordes suaves.
- Sombras ligeras.
- Jerarquía tipográfica clara.
- Evitar saturación visual.

Define los colores en `variables.css`.

No declares que un color es “oficial” si no está documentado.

## 16.2 Variables

Ejemplo de estructura:

```css
:root {
  --color-primary: #12345a;
  --color-secondary: #1f7a8c;
  --color-accent-education: #2a9d8f;
  --color-accent-higher: #6c5ce7;
  --color-accent-sport: #f39c12;
  --color-accent-culture: #9b59b6;
  --color-background: #f5f7fa;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-muted: #64748b;
  --color-border: #dbe3ec;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.07);
}
```

Claude Code podrá ajustar la paleta tomando como referencia visual la propuesta proporcionada.

## 16.3 Responsividad

Puntos de quiebre mínimos:

```text
Móvil: hasta 767 px
Tableta: 768–1023 px
Escritorio: 1024 px o más
```

En móvil:

- Menú lateral como panel deslizable.
- Filtros en acordeón.
- KPI en una columna o dos.
- Gráficos con altura adecuada.
- Tablas con desplazamiento horizontal.
- Botones con área táctil mínima de 44 px.

---

# 17. ACCESIBILIDAD

Cumplir como mínimo con buenas prácticas WCAG 2.1 AA:

- HTML semántico.
- Navegación por teclado.
- Foco visible.
- Texto alternativo.
- Contraste suficiente.
- `aria-label` en botones con iconos.
- `aria-live` para resultados y errores.
- Encabezados en orden.
- No depender solo del color.
- Enlace “Saltar al contenido”.
- Respeto a `prefers-reduced-motion`.
- Tabla con encabezados correctamente asociados.
- Gráficos acompañados por una tabla o resumen textual.

Crear modo de alto contraste.

---

# 18. SEGURIDAD

Aunque sea una aplicación estática:

- No usar `innerHTML` con valores provenientes de datos.
- Escapar texto.
- Validar parámetros de URL.
- No ejecutar código desde JSON.
- No usar `eval`.
- No incluir secretos.
- No incluir rutas locales del equipo.
- No publicar reportes de privacidad detallados.
- No registrar datos personales en consola.
- Usar Content Security Policy compatible con las librerías seleccionadas.
- Agregar `rel="noopener noreferrer"` en enlaces externos.
- Validar el nombre de archivos descargados.

---

# 19. PWA Y FUNCIONAMIENTO SIN CONEXIÓN

Crear:

```text
manifest.webmanifest
sw.js
```

El service worker debe cachear:

- HTML.
- CSS.
- JS.
- Imágenes del sitio.
- Catálogo.
- Datos agregados consultados recientemente.

No almacenar datos sensibles.

Al actualizar la versión, invalidar caché anterior.

Mostrar un indicador cuando el usuario esté sin conexión.

---

# 20. ARCHIVOS PRINCIPALES

## 20.1 `index.html`

Debe contener:

- Metadatos.
- CSP.
- Enlace para saltar al contenido.
- Cabecera.
- Navegación.
- Contenedor de vistas.
- Pie institucional.
- Diálogo accesible de metadatos.
- Contenedor de notificaciones.
- Plantillas HTML reutilizables si son necesarias.
- Inclusión de módulos JS con `type="module"`.

## 20.2 `assets/js/app.js`

Responsabilidades:

- Inicializar configuración.
- Inicializar proveedor de datos.
- Cargar catálogo.
- Inicializar router.
- Registrar eventos globales.
- Registrar service worker.
- Mostrar vista inicial.
- Gestionar errores globales.

## 20.3 `assets/js/state.js`

Estado mínimo:

```javascript
{
  sector: null,
  section: null,
  datasetId: null,
  tab: "visualizador",
  filters: {},
  query: null,
  selectedMetric: null,
  territorialLevel: null,
  loading: false,
  error: null
}
```

Implementar suscripción simple a cambios.

## 20.4 `assets/js/config.js`

Configurar:

- Nombre del portal.
- Proveedor.
- Rutas base compatibles con GitHub Pages.
- Sectores.
- Menús.
- Campos geográficos.
- Paleta de gráficos.
- Formatos.
- Regla de privacidad.
- Consultas predeterminadas.

No asumir que el repositorio estará en el dominio raíz.

Detectar correctamente:

```text
https://usuario.github.io/repositorio/
```

## 20.5 `staticDataService.js`

- Cargar `manifest.json`.
- Cargar `catalog.json`.
- Resolver rutas relativas.
- Cachear respuestas.
- Lanzar errores descriptivos.
- Validar el esquema básico.
- Reintentar una vez en fallos transitorios.
- No cargar fuentes privadas.

## 20.6 `queryWorker.js`

Implementar operaciones puras sobre arreglos de objetos:

- Filtrar.
- Agrupar.
- Agregar.
- Ordenar.
- Limitar.
- Calcular porcentajes.
- Responder con identificador de consulta.
- Manejar cancelación lógica.

---

# 21. VALIDACIONES DE DATOS

Crear `scripts/validate_outputs.py`.

Debe comprobar:

- Todos los JSON son válidos.
- No existen cédulas.
- No existen correos.
- No existen teléfonos.
- No existen cuentas bancarias.
- No existen nombres de personas en fuentes anonimizadas.
- No existen rutas locales.
- Los códigos territoriales mantienen ceros iniciales.
- Las métricas numéricas son válidas.
- No existen valores `NaN` o `Infinity`.
- Los archivos del manifiesto existen.
- Los campos del catálogo coinciden con el diccionario.
- Los grupos cumplen el tamaño mínimo.
- Los totales agregados concuerdan con los totales fuente, salvo supresiones documentadas.

Patrones mínimos a detectar:

```python
EMAIL_PATTERN
ECUADOR_ID_PATTERN
PHONE_PATTERN
BANK_ACCOUNT_PATTERN
WINDOWS_PATH_PATTERN
```

No dependas únicamente de expresiones regulares. Verifica también los nombres de columnas.

Generar:

```text
docs/data_inventory.md
docs/data_processing.md
docs/privacy.md
privacy_reports/summary.json
```

El resumen público no debe contener valores personales detectados.

Si el validador detecta un campo sensible en `data/processed/`, debe:

1. Detener el proceso.
2. Eliminar el archivo inseguro.
3. Mostrar el nombre del conjunto y campo.
4. No continuar con el despliegue.

---

# 22. PRUEBAS

## 22.1 Pruebas Python

Crear pruebas para:

- Normalización de encabezados.
- Conversión de códigos a texto.
- Conversión de fechas.
- Agregaciones.
- Conteo distinto.
- Regla de grupo mínimo.
- Eliminación de campos sensibles.
- Integridad de totales.

## 22.2 Pruebas JavaScript

Probar:

- Filtros.
- Agrupación.
- Suma.
- Promedio.
- Orden.
- Paginación.
- Serialización a URL.
- Restauración desde URL.
- Exportación CSV.
- Manejo de valores nulos.
- Búsqueda sin tildes.

## 22.3 Prueba funcional

Comprobar:

- El sitio abre sin errores.
- La portada es visible.
- Cada sector puede seleccionarse.
- Los filtros actualizan KPI y gráficos.
- La tabla cambia con los filtros.
- La descarga contiene solo datos filtrados.
- El mapa no rompe la app si no hay GeoJSON.
- El menú funciona en móvil.
- La navegación por teclado es posible.
- No hay errores en consola.

---

# 23. GITHUB PAGES

## 23.1 Flujo de despliegue

Crear `.github/workflows/pages.yml` para:

1. Descargar el repositorio.
2. Configurar GitHub Pages.
3. Ejecutar validaciones.
4. Bloquear despliegue si falla privacidad.
5. Publicar el sitio estático.

Los archivos Excel originales no estarán en GitHub, por lo que el workflow no deberá intentar regenerar datos privados.

El procesamiento completo se realizará localmente antes del commit.

El workflow público solo validará:

```text
HTML
CSS
JavaScript
JSON procesado
Privacidad
Rutas
```

## 23.2 Compatibilidad de rutas

No usar rutas absolutas como:

```text
/assets/css/main.css
```

Usar rutas compatibles con subcarpeta:

```text
./assets/css/main.css
```

En JavaScript, resolver la base del sitio mediante `document.baseURI` o una función central.

## 23.3 `404.html`

Crear una página 404 que:

- Mantenga el diseño.
- Permita regresar al inicio.
- Sea compatible con GitHub Pages.
- No exponga información técnica.

---

# 24. DOCUMENTACIÓN

## 24.1 README

Debe incluir:

- Descripción.
- Captura o espacio para captura.
- Características.
- Arquitectura.
- Requisitos.
- Procesamiento local.
- Vista previa local.
- Publicación.
- Privacidad.
- Cómo agregar datos.
- Cómo agregar capas GeoJSON.
- Cómo migrar a Supabase.
- Limitaciones actuales.

## 24.2 Ejecución local

Documentar:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Instalar:

```bash
pip install -r requirements.txt
```

Preparar fuentes localmente:

```bash
python scripts/inspect_sources.py --source-dir sources
python scripts/build_all.py --source-dir sources --output-dir data/processed
python scripts/validate_outputs.py
```

Servidor local:

```bash
python -m http.server 8000
```

Abrir:

```text
http://localhost:8000
```

No abrir `index.html` con doble clic porque `fetch()` puede ser bloqueado bajo `file://`.

---

# 25. FASES DE EJECUCIÓN PARA CLAUDE CODE

## Fase 1 — Inspección

1. Localizar archivos.
2. Descomprimir anexos.
3. Leer propuesta.
4. Inventariar libros, hojas, dimensiones y encabezados.
5. Detectar campos sensibles.
6. Crear `docs/data_inventory.md`.
7. No modificar originales.

## Fase 2 — Esqueleto

1. Crear estructura.
2. Crear HTML.
3. Crear CSS.
4. Crear router y estado.
5. Crear servicios.
6. Crear portada.
7. Crear menú lateral.
8. Crear pestañas.

## Fase 3 — Datos

1. Crear normalizadores.
2. Crear procesadores por sector.
3. Generar agregados.
4. Aplicar privacidad.
5. Crear catálogo.
6. Crear diccionario.
7. Validar totales.
8. Validar ausencia de PII.

## Fase 4 — Visualización

1. KPI.
2. Filtros.
3. Gráficos.
4. Tabla.
5. Tabulados.
6. Exportación.
7. Consultas compartibles.
8. Mapas opcionales.

## Fase 5 — Calidad

1. Pruebas.
2. Accesibilidad.
3. Responsividad.
4. Rendimiento.
5. Privacidad.
6. Consola sin errores.
7. Documentación.

## Fase 6 — GitHub

1. `.gitignore`.
2. Workflow.
3. README.
4. Verificación de rutas.
5. Publicación lista.

---

# 26. CRITERIOS DE ACEPTACIÓN

El trabajo se considerará completo únicamente cuando:

- Existe un portal funcional.
- Existe `index.html`.
- El diseño refleja la propuesta institucional.
- Los cuatro sectores están disponibles.
- El menú lateral funciona.
- Las tres pestañas funcionan.
- Los datos se cargan desde archivos estáticos.
- No existe dependencia de Supabase.
- La arquitectura permite cambiar el proveedor.
- Los filtros actualizan el contenido.
- Los gráficos son interactivos.
- La tabla es consultable y exportable.
- Los tabulados se pueden configurar.
- La aplicación no falla si no existen capas.
- Existe soporte preparado para GeoJSON.
- La interfaz es responsiva.
- La navegación es accesible.
- Los archivos fuente privados están ignorados.
- No hay datos personales en archivos públicos.
- Las validaciones de privacidad pasan.
- El sitio funciona bajo una subruta de GitHub Pages.
- Existe documentación suficiente.
- No hay errores relevantes en la consola.
- Todos los botones tienen una acción real.
- No existen textos de relleno como “Lorem ipsum”.
- No existen indicadores inventados.
- Toda cifra visible proviene de los archivos procesados.

---

# 27. REGLAS DE VERACIDAD

- No inventar datos.
- No inventar fechas de actualización.
- No inventar fuentes.
- No inventar coordenadas.
- No inventar capas geográficas.
- No inventar significados de campos ambiguos.
- No corregir valores fuente sin registrar la transformación.
- Cuando un campo sea ambiguo, incluirlo en advertencias.
- Cuando falte información, mostrar “No disponible”.
- Cuando una suma no cuadre, detener y reportar.
- Todo indicador debe poder rastrearse hasta un archivo procesado.

---

# 28. ENTREGA FINAL DE CLAUDE CODE

Al finalizar, Claude Code deberá mostrar:

1. Árbol de archivos creado.
2. Resumen de fuentes procesadas.
3. Registros procesados por fuente.
4. Agregaciones generadas.
5. Campos sensibles eliminados.
6. Resultado de las pruebas.
7. Resultado de la validación de privacidad.
8. Instrucciones para ejecutar localmente.
9. Instrucciones para crear el repositorio.
10. Instrucciones para activar GitHub Pages.
11. Limitaciones pendientes.
12. Archivos o datos adicionales recomendados.

También deberá crear:

```text
IMPLEMENTATION_REPORT.md
```

Este informe debe incluir decisiones tomadas, problemas encontrados y pendientes.

---

# 29. COMANDO DE INICIO PARA CLAUDE CODE

Comienza ahora.

Primero inspecciona todos los archivos reales y genera el inventario. Después crea el proyecto completo siguiendo este documento.

No publiques los Excel originales ni datos personales.

No entregues únicamente recomendaciones: implementa el portal, genera los datos públicos seguros, ejecuta las pruebas y deja el repositorio listo para GitHub Pages.
