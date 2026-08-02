import csv
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

# CSV tidy (grupo,categoria,medida,valor) — todo el dato de dominio.
TIDY_DATA_FILES = ["educacion_media.csv", "educacion_superior.csv", "deporte.csv", "cultura.csv"]
# resumen.csv usa su propio esquema simple (sector,metrica,valor).
ALL_DATA_FILES = TIDY_DATA_FILES + ["resumen.csv"]

# Dominios cuyos desgloses provienen de datos a nivel de PERSONA y por tanto
# deben respetar k-anonimato (motor.md 3.2 y 10.5-10.7). Educación
# Media/Superior son a nivel institución, no aplica.
PERSON_LEVEL_FILES = ["deporte.csv", "cultura.csv"]


def _read_csv(path: Path) -> list:
    with path.open(encoding="utf-8", newline="") as fh:
        return list(csv.DictReader(fh))


@pytest.fixture(scope="session")
def data_dir():
    return DATA_DIR


@pytest.fixture(scope="session")
def all_public_csv():
    return {name: _read_csv(DATA_DIR / name) for name in ALL_DATA_FILES}


def walk_strings(rows):
    """Yield (row_index, column, value) for every string cell in a list of
    CSV row-dicts (all values start out as strings from csv.DictReader)."""
    for i, row in enumerate(rows):
        for col, val in row.items():
            if val is not None:
                yield i, col, val


def numeric_rows(rows):
    """Yield (row_index, valor) parsed as float for the 'valor' column."""
    for i, row in enumerate(rows):
        try:
            yield i, float(row["valor"])
        except (KeyError, ValueError):
            pass
