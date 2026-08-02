"""Utilidades compartidas por los scripts ETL del portal MINEDEC.

Estos scripts leen los Excel originales (fuera del repositorio, ver
.gitignore) y escriben exclusivamente datos agregados/anonimizados en
/data como CSV en formato "tidy" (largo): cada fila es una observación
(grupo, categoria, medida, valor). Ninguna fila de nivel-persona sale de
aquí. Ver motor.md secciones 3 y 10 para las reglas de privacidad exactas.
"""
import csv
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data"

K_ANONYMITY_THRESHOLD = 5
SUPPRESSED_LABEL = "Otros / protegido"

FIELDNAMES = ["grupo", "categoria", "medida", "valor"]


def write_csv_rows(name: str, rows: list) -> Path:
    """Escribe una lista de dicts {grupo, categoria, medida, valor} como CSV
    'tidy' (formato largo). Un único esquema de 4 columnas para todos los
    dominios: simple de cargar, filtrar y agrupar en JS puro."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / name
    with out.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDNAMES)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in FIELDNAMES})
    print(f"  -> {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes, {len(rows):,} filas)")
    return out


def rows_from_counts(grupo: str, medida: str, counts: dict) -> list:
    """Convierte un dict {categoria: valor} en filas tidy para un grupo/medida."""
    return [
        {"grupo": grupo, "categoria": str(cat), "medida": medida, "valor": int(val)}
        for cat, val in counts.items()
    ]


def rows_from_total(grupo: str, medida: str, valor) -> list:
    return [{"grupo": grupo, "categoria": "total", "medida": medida, "valor": valor}]


def normalize_text(value) -> str:
    if value is None:
        return "SIN DATO"
    text = str(value).strip()
    if not text or text.lower() in ("nan", "none"):
        return "SIN DATO"
    return " ".join(text.upper().split())


def strip_accents(value: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFKD", value) if not unicodedata.combining(c)
    )


def suppress_small_groups(counts: dict, threshold: int = K_ANONYMITY_THRESHOLD) -> dict:
    """Aplica supresión de celdas pequeñas (k-anonimato) fusionando categorías
    con conteo < threshold en un bucket 'Otros / protegido'. Protege a
    personas en combinaciones raras (motor.md sección 3.2)."""
    safe, suppressed_total = {}, 0
    for key, value in counts.items():
        if value < threshold:
            suppressed_total += value
        else:
            safe[key] = value
    if suppressed_total:
        safe[SUPPRESSED_LABEL] = safe.get(SUPPRESSED_LABEL, 0) + suppressed_total
    return safe


def counts_from_series(series) -> dict:
    return {normalize_text(k): int(v) for k, v in series.value_counts(dropna=False).items()}
