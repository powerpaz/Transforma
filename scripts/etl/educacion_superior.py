"""ETL Educación Superior -> data/educacion_superior.csv (formato tidy).

UEP = Universidades y Escuelas Politécnicas, ITT = Institutos Técnicos y
Tecnológicos (motor.md 10.3 y 10.4). Ambas fuentes ya vienen agregadas por
sede/institución, sin datos personales.

Cubre las secciones del menú: Panorama general, UEP > Estudiantes,
ITT > Estudiantes.
"""
import pandas as pd

from common import ROOT, normalize_text, rows_from_counts, rows_from_total, write_csv_rows

UEP_PATH = ROOT / "Anexos" / "Educación_Superior" / "UEP.xlsx"
ITT_PATH = ROOT / "Anexos" / "Educación_Superior" / "ITTS.xlsx"


def build_uep(rows: list) -> None:
    df = pd.read_excel(UEP_PATH, sheet_name="Hoja3")
    df["ESTUDIANTES"] = pd.to_numeric(df["ESTUDIANTES"], errors="coerce").fillna(0)
    for c in ["TIPO_SEDE", "PROVINCIA_SEDE", "TIPO_FINANCIAMIENTO"]:
        df[c] = df[c].map(normalize_text)

    def counts(col):
        return df.groupby(col)["ESTUDIANTES"].sum().round().astype(int).to_dict()

    instituciones_provincia = df.groupby("PROVINCIA_SEDE")["CODIGO_IES"].nunique().astype(int).to_dict()

    rows.extend(rows_from_total("panorama", "uep_estudiantes_total", int(df["ESTUDIANTES"].sum())))
    rows.extend(rows_from_total("panorama", "uep_instituciones_total", int(df["CODIGO_IES"].nunique())))
    rows.extend(rows_from_counts("uep_estudiantes_provincia", "valor", counts("PROVINCIA_SEDE")))
    rows.extend(rows_from_counts("uep_estudiantes_financiamiento", "valor", counts("TIPO_FINANCIAMIENTO")))
    rows.extend(rows_from_counts("uep_estudiantes_tiposede", "valor", counts("TIPO_SEDE")))
    rows.extend(rows_from_counts("uep_instituciones_provincia", "valor", instituciones_provincia))


def build_itt(rows: list) -> None:
    df = pd.read_excel(ITT_PATH, sheet_name="Hoja1")
    df["ESTUDIANTES"] = pd.to_numeric(df["ESTUDIANTES"], errors="coerce").fillna(0)
    df["AÑO"] = df["AÑO"].astype(str)
    for c in ["TIPO_FINANCIAMIENTO", "provincia_ies", "SEMESTRE"]:
        df[c] = df[c].map(normalize_text)

    def counts(col):
        return df.groupby(col)["ESTUDIANTES"].sum().round().astype(int).to_dict()

    serie_anio = df.groupby("AÑO")["ESTUDIANTES"].sum().round().astype(int).to_dict()
    instituciones_provincia = df.groupby("provincia_ies")["cod_ies"].nunique().astype(int).to_dict()

    rows.extend(rows_from_total(
        "panorama", "itt_estudiantes_total", int(df[df["AÑO"] == df["AÑO"].max()]["ESTUDIANTES"].sum())
    ))
    rows.extend(rows_from_total("panorama", "itt_instituciones_total", int(df["cod_ies"].nunique())))
    rows.extend(rows_from_counts("itt_serie_anio", "estudiantes", serie_anio))
    rows.extend(rows_from_counts("itt_estudiantes_provincia", "valor", counts("provincia_ies")))
    rows.extend(rows_from_counts("itt_estudiantes_financiamiento", "valor", counts("TIPO_FINANCIAMIENTO")))
    rows.extend(rows_from_counts("itt_instituciones_provincia", "valor", instituciones_provincia))


def run() -> list:
    rows = []
    build_uep(rows)
    build_itt(rows)
    write_csv_rows("educacion_superior.csv", rows)
    return rows


if __name__ == "__main__":
    run()
