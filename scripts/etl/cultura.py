"""ETL Cultura -> data/cultura.csv (formato tidy).

Ambas fuentes (personas naturales y jurídicas) contienen identificación,
nombre/razón social, dirección, teléfono y correo. Se exportan
exclusivamente conteos agregados por categorías públicas (provincia,
sector/actividad, género, año de registro), con supresión k<5 (motor.md
sección 10.6 y 10.7). No se publica ni etnia ni discapacidad cruzadas con
territorio para evitar reidentificación por combinación.

Cubre las secciones del menú: Panorama general, Personas naturales,
Personas jurídicas, Ámbitos culturales, Distribución territorial.
"""
import pandas as pd

from common import ROOT, counts_from_series, normalize_text, rows_from_counts, rows_from_total, suppress_small_groups, write_csv_rows

NATURALES_PATH = ROOT / "Anexos" / "Cultura" / "Naturales_cultura.xlsx"
JURIDICO_PATH = ROOT / "Anexos" / "Cultura" / "Juridico_cultura.xlsx"

NATURALES_COLS = [
    "Provincia", "Canton", "sexo", "Etnia", "Tipo discapacidad",
    "Nivel escolaridad", "estados", "anio",
    "actividadPrimaria_sector", "actividadPrimaria_ambito",
]
JURIDICO_COLS = [
    "Tipo actor", "Subtipo actor", "Provincia", "Canton",
    "Estado Contribuyente", "Actividad Economica General", "anio", "estados",
]


def _safe_counts(df: pd.DataFrame, col: str) -> dict:
    return suppress_small_groups(counts_from_series(df[col]))


def build_naturales(rows: list) -> None:
    df = pd.read_excel(NATURALES_PATH, sheet_name="Hoja 1", usecols=NATURALES_COLS)
    for c in NATURALES_COLS:
        df[c] = df[c].map(normalize_text)
    df["tiene_discapacidad"] = df["Tipo discapacidad"].apply(
        lambda v: "NO" if v in ("SIN DATO", "NINGUNA", "NO") else "SI"
    )
    df["anio"] = df["anio"].str.extract(r"(\d{4})").fillna("SIN DATO")

    rows.extend(rows_from_total("panorama", "naturales_total", int(len(df))))
    rows.extend(rows_from_counts("naturales_provincia", "valor", _safe_counts(df, "Provincia")))
    rows.extend(rows_from_counts("naturales_sexo", "valor", _safe_counts(df, "sexo")))
    rows.extend(rows_from_counts("naturales_etnia", "valor", _safe_counts(df, "Etnia")))
    rows.extend(rows_from_counts("naturales_discapacidad", "valor", _safe_counts(df, "tiene_discapacidad")))
    rows.extend(rows_from_counts("naturales_escolaridad", "valor", _safe_counts(df, "Nivel escolaridad")))
    rows.extend(rows_from_counts("ambitos_sector", "naturales", _safe_counts(df, "actividadPrimaria_sector")))
    rows.extend(rows_from_counts("ambitos_ambito", "naturales", _safe_counts(df, "actividadPrimaria_ambito")))
    rows.extend(rows_from_counts("naturales_estado", "valor", _safe_counts(df, "estados")))
    rows.extend(rows_from_counts("naturales_serie_anio", "registros", dict(sorted(_safe_counts(df, "anio").items()))))


def build_juridico(rows: list) -> None:
    df = pd.read_excel(JURIDICO_PATH, sheet_name="JURIDICOS", usecols=JURIDICO_COLS)
    for c in JURIDICO_COLS:
        df[c] = df[c].map(normalize_text)
    df["anio"] = df["anio"].str.extract(r"(\d{4})").fillna("SIN DATO")

    rows.extend(rows_from_total("panorama", "juridico_total", int(len(df))))
    rows.extend(rows_from_counts("juridico_provincia", "valor", _safe_counts(df, "Provincia")))
    rows.extend(rows_from_counts("juridico_tipo_actor", "valor", _safe_counts(df, "Tipo actor")))
    rows.extend(rows_from_counts("juridico_subtipo_actor", "valor", _safe_counts(df, "Subtipo actor")))
    rows.extend(rows_from_counts("ambitos_actividad_economica", "juridico", _safe_counts(df, "Actividad Economica General")))
    rows.extend(rows_from_counts("juridico_estado_contribuyente", "valor", _safe_counts(df, "Estado Contribuyente")))
    rows.extend(rows_from_counts("juridico_serie_anio", "registros", dict(sorted(_safe_counts(df, "anio").items()))))

    # Distribución territorial combinada (naturales + jurídico) por provincia
    rows.extend(rows_from_counts("distribucion_territorial", "juridico", _safe_counts(df, "Provincia")))


def run() -> list:
    rows = []
    build_naturales(rows)
    build_juridico(rows)
    # Distribución territorial también necesita el lado "naturales"; se añade
    # aquí para mantener ambas medidas bajo el mismo grupo.
    df_nat = pd.read_excel(NATURALES_PATH, sheet_name="Hoja 1", usecols=["Provincia"])
    df_nat["Provincia"] = df_nat["Provincia"].map(normalize_text)
    rows.extend(rows_from_counts(
        "distribucion_territorial", "naturales", suppress_small_groups(counts_from_series(df_nat["Provincia"]))
    ))

    write_csv_rows("cultura.csv", rows)
    return rows


if __name__ == "__main__":
    run()
