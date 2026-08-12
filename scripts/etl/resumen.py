"""Construye data/resumen.csv (cifras del hero de la página de inicio) a
partir de los CSV tidy ya generados por los demás scripts ETL. Esquema
propio (más simple que el resto): sector,metrica,valor.
"""
import csv

import pandas as pd

from common import DATA_DIR, ROOT


def _panorama(filename: str) -> dict:
    df = pd.read_csv(DATA_DIR / filename)
    sub = df[df["grupo"] == "panorama"]
    return dict(zip(sub["medida"], sub["valor"]))


def run() -> list:
    media = _panorama("educacion_media.csv")
    superior = _panorama("educacion_superior.csv")
    deporte = _panorama("deporte.csv")
    cultura = _panorama("cultura.csv")

    rows = [
        {"sector": "educacion_media", "metrica": "estudiantes_total", "valor": int(media["estudiantes_total"])},
        {"sector": "educacion_media", "metrica": "instituciones_total", "valor": int(media["instituciones_total"])},
        {"sector": "educacion_superior", "metrica": "estudiantes_uep", "valor": int(superior["uep_estudiantes_total"])},
        {"sector": "educacion_superior", "metrica": "estudiantes_itt", "valor": int(superior["itt_estudiantes_total"])},
        {"sector": "educacion_superior", "metrica": "estudiantes_total",
         "valor": int(superior["uep_estudiantes_total"]) + int(superior["itt_estudiantes_total"])},
        {"sector": "cultura", "metrica": "gestores_naturales", "valor": int(cultura["naturales_total"])},
        {"sector": "cultura", "metrica": "organizaciones_juridicas", "valor": int(cultura["juridico_total"])},
        {"sector": "cultura", "metrica": "gestores_total",
         "valor": int(cultura["naturales_total"]) + int(cultura["juridico_total"])},
        {"sector": "deporte", "metrica": "alto_rendimiento", "valor": int(deporte["alto_rendimiento_total"])},
        {"sector": "deporte", "metrica": "juegos_nacionales", "valor": int(deporte["juegos_nacionales_total"])},
        {"sector": "deporte", "metrica": "entrenadores", "valor": int(deporte["entrenadores_total"])},
        {"sector": "deporte", "metrica": "usuarios_deporte", "valor": int(deporte["usuarios_deporte_total"])},
    ]

    out = DATA_DIR / "resumen.csv"
    with out.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=["sector", "metrica", "valor"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"  -> {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes, {len(rows):,} filas)")
    return rows


if __name__ == "__main__":
    run()
