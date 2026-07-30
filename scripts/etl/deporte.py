"""ETL Deporte -> data/deporte.csv (formato tidy).

Las 4 primeras hojas de Base_Deporte.xlsx contienen datos de PERSONA
(cédula, nombres, apellidos, contacto, y en el caso de "Ex Deportistas
Vitalicios" hasta cuenta bancaria). De aquí NUNCA se exportan filas ni
columnas identificatorias: solo conteos agregados por categorías públicas
(provincia, disciplina, género, categoría), con supresión k<5 (motor.md
sección 10.5). La hoja "Usuarios de deporte" ya viene agregada por
centro/mes y se publica tal cual.

Cubre las secciones del menú: Panorama general, Alto rendimiento, Juegos
nacionales, Entrenadores, Usuarios del deporte, Exdeportistas vitalicios.
"""
import pandas as pd

from common import (
    ROOT, counts_from_series, normalize_text, rows_from_counts, rows_from_total,
    suppress_small_groups, write_csv_rows,
)

PATH = ROOT / "Anexos" / "Deporte" / "Base_Deporte.xlsx"


def _safe_counts(df: pd.DataFrame, col: str) -> dict:
    return suppress_small_groups(counts_from_series(df[col]))


def build_ex_vitalicios(rows: list) -> None:
    df = pd.read_excel(PATH, sheet_name="Ex Deportistas Vitalicios", skiprows=9)
    df = df.dropna(subset=["CEDULA"])
    df["PROVINCIA"] = df["PROVINCIA"].map(normalize_text)
    df["RESIDENCIA"] = df["RESIDENCIA"].map(normalize_text)
    df["ESTADO"] = df["ESTADO"].map(normalize_text)
    monto = pd.to_numeric(df["VALOR A TRANSFERIR SEPTIEMBRE 2025"], errors="coerce").fillna(0)

    rows.extend(rows_from_total("panorama", "vitalicios_total", int(len(df))))
    rows.extend(rows_from_total("panorama", "vitalicios_monto_mensual_usd", int(monto.sum())))
    rows.extend(rows_from_counts("vitalicios_residencia", "valor", _safe_counts(df, "RESIDENCIA")))
    rows.extend(rows_from_counts("vitalicios_provincia", "valor", _safe_counts(df, "PROVINCIA")))
    rows.extend(rows_from_counts("vitalicios_estado", "valor", _safe_counts(df, "ESTADO")))


def build_alto_rendimiento(rows: list) -> None:
    df = pd.read_excel(PATH, sheet_name="Deportistas de alto rendimiento", skiprows=8)
    df = df.dropna(subset=["CÉDULAS FORMATO"])
    for c in ["DEPORTE", "PROVINCIA\nREPRESENTACIÓN", "GÉNERO", "CATEGORÍA EDAD", "GRUPO AR"]:
        df[c] = df[c].map(normalize_text)
    monto = pd.to_numeric(df["MONTO 2025"], errors="coerce").fillna(0)

    rows.extend(rows_from_total("panorama", "alto_rendimiento_total", int(len(df))))
    rows.extend(rows_from_total("panorama", "alto_rendimiento_estimulo_usd", int(monto.sum())))
    rows.extend(rows_from_counts("ar_deporte", "valor", _safe_counts(df, "DEPORTE")))
    rows.extend(rows_from_counts("ar_provincia", "valor", _safe_counts(df, "PROVINCIA\nREPRESENTACIÓN")))
    rows.extend(rows_from_counts("ar_genero", "valor", _safe_counts(df, "GÉNERO")))
    rows.extend(rows_from_counts("ar_categoria_edad", "valor", _safe_counts(df, "CATEGORÍA EDAD")))
    rows.extend(rows_from_counts("ar_grupo", "valor", _safe_counts(df, "GRUPO AR")))


def build_juegos_nacionales(rows: list) -> None:
    df = pd.read_excel(PATH, sheet_name="Deportistas de juegos nacionale", skiprows=8)
    df = df.dropna(subset=["Doc. de Ident."])
    for c in ["Deporte", "Participa por", "Género", "Evento"]:
        df[c] = df[c].map(normalize_text)

    rows.extend(rows_from_total("panorama", "juegos_nacionales_total", int(len(df))))
    rows.extend(rows_from_counts("jn_deporte", "valor", _safe_counts(df, "Deporte")))
    rows.extend(rows_from_counts("jn_federacion", "valor", _safe_counts(df, "Participa por")))
    rows.extend(rows_from_counts("jn_genero", "valor", _safe_counts(df, "Género")))
    rows.extend(rows_from_counts("jn_evento", "valor", _safe_counts(df, "Evento")))


def build_entrenadores(rows: list) -> None:
    df = pd.read_excel(PATH, sheet_name="Entrenadores", skiprows=8)
    df = df.dropna(subset=["Doc. de Ident."])
    for c in ["PROVINCIA", "Funcion a Secas", "Género"]:
        df[c] = df[c].map(normalize_text)

    rows.extend(rows_from_total("panorama", "entrenadores_total", int(len(df))))
    rows.extend(rows_from_counts("entrenadores_provincia", "valor", _safe_counts(df, "PROVINCIA")))
    rows.extend(rows_from_counts("entrenadores_funcion", "valor", _safe_counts(df, "Funcion a Secas")))
    rows.extend(rows_from_counts("entrenadores_genero", "valor", _safe_counts(df, "Género")))


def build_usuarios_deporte(rows: list) -> None:
    df = pd.read_excel(PATH, sheet_name="Usuarios de deporte", skiprows=8)
    df["AÑO"] = df["AÑO"].astype("Int64").astype(str)
    for c in ["PROVINCIA", "Tipo Deporte"]:
        df[c] = df[c].map(normalize_text)
    for c in ["USUARIOS PAGADOS", "USUARIOS GRATUITOS", "TOTAL INGRESOS"]:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    df["usuarios_totales"] = df["USUARIOS PAGADOS"] + df["USUARIOS GRATUITOS"]

    serie = df.groupby("AÑO")[["usuarios_totales", "TOTAL INGRESOS"]].sum().round().astype(int)
    for anio, r in serie.iterrows():
        rows.append({"grupo": "usuarios_serie_anio", "categoria": anio, "medida": "usuarios", "valor": int(r["usuarios_totales"])})
        rows.append({"grupo": "usuarios_serie_anio", "categoria": anio, "medida": "ingresos", "valor": int(r["TOTAL INGRESOS"])})

    rows.extend(rows_from_total("panorama", "usuarios_deporte_total", int(df["usuarios_totales"].sum())))
    rows.extend(rows_from_total("panorama", "usuarios_deporte_ingresos_usd", int(df["TOTAL INGRESOS"].sum())))
    rows.extend(rows_from_counts(
        "usuarios_provincia", "valor",
        df.groupby("PROVINCIA")["usuarios_totales"].sum().round().astype(int).to_dict(),
    ))
    rows.extend(rows_from_counts(
        "usuarios_tipo_deporte", "valor",
        df.groupby("Tipo Deporte")["usuarios_totales"].sum().round().astype(int).to_dict(),
    ))


def run() -> list:
    rows = []
    build_ex_vitalicios(rows)
    build_alto_rendimiento(rows)
    build_juegos_nacionales(rows)
    build_entrenadores(rows)
    build_usuarios_deporte(rows)
    write_csv_rows("deporte.csv", rows)
    return rows


if __name__ == "__main__":
    run()
