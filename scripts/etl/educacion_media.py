"""ETL Educación Media -> data/educacion_media.csv (formato tidy).

Fuentes (nivel institución, sin datos personales — motor.md 10.1 y 10.2):
- Registro-Administrativo-Historico_2009-202X-Inicio.xlsx (serie 2009-202X)
- Anexos/Educación_Media/Información_educacion_media.xlsx (snapshot vigente)

Cubre las secciones del menú: Panorama general, Estudiantes, Docentes,
Instituciones, Serie histórica, Distribución territorial.
"""
import pandas as pd

from common import ROOT, normalize_text, rows_from_counts, rows_from_total, write_csv_rows

HIST_PATH = ROOT / "Registro-Administrativo-Historico_2009-202X-Inicio.xlsx"
SNAPSHOT_PATH = ROOT / "Anexos" / "Educación_Media" / "Información_educacion_media.xlsx"

NUM_COLS_HIST = [
    "Total_Docentes", "Total_Administrativos", "Total_Estudiantes",
    "Estudiantes_Femenino", "Estudiantes_Masculino",
    "Docentes_Femenino", "Docentes_Masculino",
]
NUM_COLS_SNAPSHOT = [
    "Total_Estudiantes", "Estudiantes_Femenino", "Estudiantes_Masculino",
    "Total_Docentes", "Docentes_Femenino", "Docentes_Masculino", "Instituciones",
]


def load_historico() -> pd.DataFrame:
    print("Leyendo registro histórico institucional (esto puede tardar ~1 min)...")
    df = pd.read_excel(HIST_PATH, sheet_name="Historico_Inicio")
    for c in NUM_COLS_HIST:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    for c in ["Provincia", "Sostenimiento", "Area", "Tipo_Educacion", "Zona"]:
        df[c] = df[c].map(normalize_text)
    return df


def load_snapshot() -> pd.DataFrame:
    df = pd.read_excel(SNAPSHOT_PATH)
    for c in NUM_COLS_SNAPSHOT:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    for c in ["Provincia", "Sostenimiento", "Area", "Tipo_Educacion"]:
        df[c] = df[c].map(normalize_text)
    return df


def build_serie_historica(df: pd.DataFrame) -> list:
    by_year = (
        df.groupby("Año_lectivo", dropna=False)
        .agg(
            instituciones=("Codigo_Institucion", "nunique"),
            estudiantes_total=("Total_Estudiantes", "sum"),
            estudiantes_femenino=("Estudiantes_Femenino", "sum"),
            estudiantes_masculino=("Estudiantes_Masculino", "sum"),
            docentes_total=("Total_Docentes", "sum"),
        )
        .reset_index()
        .rename(columns={"Año_lectivo": "anio"})
        .sort_values("anio")
    )
    by_year["anio"] = by_year["anio"].astype(str)

    rows = []
    for _, r in by_year.iterrows():
        for medida in ["instituciones", "estudiantes_total", "estudiantes_femenino", "estudiantes_masculino", "docentes_total"]:
            rows.append({"grupo": "serie_anio", "categoria": r["anio"], "medida": medida, "valor": int(r[medida])})
    return rows


def build_panorama_y_desgloses(df: pd.DataFrame) -> list:
    rows = []

    def add(grupo, medida, valor_col, group_col=None):
        if group_col is None:
            rows.extend(rows_from_total(grupo, medida, int(df[valor_col].sum())))
        else:
            counts = df.groupby(group_col)[valor_col].sum().round().astype(int).to_dict()
            rows.extend(rows_from_counts(grupo, medida, counts))

    # Panorama general (totales nacionales, snapshot vigente)
    add("panorama", "estudiantes_total", "Total_Estudiantes")
    add("panorama", "estudiantes_femenino", "Estudiantes_Femenino")
    add("panorama", "estudiantes_masculino", "Estudiantes_Masculino")
    add("panorama", "docentes_total", "Total_Docentes")
    add("panorama", "docentes_femenino", "Docentes_Femenino")
    add("panorama", "docentes_masculino", "Docentes_Masculino")
    add("panorama", "instituciones_total", "Instituciones")

    # Estudiantes: desgloses
    add("estudiantes_provincia", "valor", "Total_Estudiantes", "Provincia")
    add("estudiantes_sostenimiento", "valor", "Total_Estudiantes", "Sostenimiento")
    add("estudiantes_area", "valor", "Total_Estudiantes", "Area")
    add("estudiantes_tipo_educacion", "valor", "Total_Estudiantes", "Tipo_Educacion")

    # Docentes: desglose territorial
    add("docentes_provincia", "valor", "Total_Docentes", "Provincia")

    # Instituciones: desglose territorial
    add("instituciones_provincia", "valor", "Instituciones", "Provincia")

    # Distribución territorial (vista combinada, misma fuente que estudiantes_provincia)
    add("distribucion_territorial", "estudiantes", "Total_Estudiantes", "Provincia")
    add("distribucion_territorial", "instituciones", "Instituciones", "Provincia")

    return rows


def run() -> list:
    hist_df = load_historico()
    snap_df = load_snapshot()

    rows = []
    rows += build_serie_historica(hist_df)
    rows += build_panorama_y_desgloses(snap_df)

    write_csv_rows("educacion_media.csv", rows)
    return rows


if __name__ == "__main__":
    run()
