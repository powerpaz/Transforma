"""Estas pruebas son la garantía técnica de 'no publiques datos personales'
(motor.md sección 3): escanean TODO lo que va a /data (lo único que se
publica en GitHub Pages) en busca de patrones de PII en las celdas CSV.
"""
import re

import pytest

from conftest import ALL_DATA_FILES, PERSON_LEVEL_FILES, numeric_rows, walk_strings

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
EC_PHONE_RE = re.compile(r"(?<!\d)0\d{9}(?!\d)|(?<!\d)\+593\d{8,9}(?!\d)")
# 8+ dígitos consecutivos: cubre cédula (10), RUC (13), cuentas bancarias (9-18)
# y teléfonos con código de país. Los años ("2010", "2010-2011 Inicio") tienen
# como máximo 4 dígitos seguidos, así que no producen falsos positivos.
LONG_DIGIT_RUN_RE = re.compile(r"(?<!\d)\d{8,}(?!\d)")

FORBIDDEN_KEY_WORDS = [
    "cedula", "cédula", "identificacion", "identificación", "nombre", "apellido",
    "direccion", "dirección", "telefono", "teléfono", "celular", "correo",
    "email", "cuenta", "banco", "beneficiario", "apoderado", "nacimiento",
    "razon_social", "razón_social", "ruc",
]
# Coincidencia por palabra completa (no subcadena): evita falsos positivos como
# "instructor" o "construcción" al usar "ruc"/"nombre" como filtro ingenuo.
FORBIDDEN_WORD_RE = re.compile(
    r"(?:^|[^a-záéíóúñ])(" + "|".join(re.escape(w) for w in FORBIDDEN_KEY_WORDS) + r")(?:[^a-záéíóúñ]|$)"
)


@pytest.mark.parametrize("filename", ALL_DATA_FILES)
def test_no_email_addresses(all_public_csv, filename):
    rows = all_public_csv[filename]
    offenders = [(i, c, v) for i, c, v in walk_strings(rows) if EMAIL_RE.search(v)]
    assert not offenders, f"Correos electrónicos encontrados en {filename}: {offenders[:5]}"


def _looks_like_bare_identifier(value: str) -> bool:
    """True si el valor es (casi) solo dígitos — el patrón de una cédula,
    RUC o cuenta bancaria. False para códigos de clasificación económica
    tipo 'J59110001 ACTIVIDADES DE PRODUCCIÓN DE...' que empiezan con un
    código pero son, en su mayoría, una descripción textual legítima."""
    letters = sum(1 for c in value if c.isalpha())
    return letters <= 12


@pytest.mark.parametrize("filename", ALL_DATA_FILES)
def test_no_long_digit_runs_in_cells(all_public_csv, filename):
    rows = all_public_csv[filename]
    # La columna "valor" es numérica por diseño (puede legítimamente ser un
    # entero largo, p.ej. una suma en dólares) — solo se escanean categoria/
    # grupo/medida, que deben ser siempre texto categórico corto.
    offenders = [
        (i, c, v) for i, c, v in walk_strings(rows)
        if c != "valor" and LONG_DIGIT_RUN_RE.search(v) and _looks_like_bare_identifier(v)
    ]
    assert not offenders, f"Posibles cédulas/RUC/cuentas encontradas en {filename}: {offenders[:5]}"


@pytest.mark.parametrize("filename", ALL_DATA_FILES)
def test_no_ecuadorian_phone_numbers(all_public_csv, filename):
    rows = all_public_csv[filename]
    offenders = [(i, c, v) for i, c, v in walk_strings(rows) if c != "valor" and EC_PHONE_RE.search(v)]
    assert not offenders, f"Posibles teléfonos encontrados en {filename}: {offenders[:5]}"


@pytest.mark.parametrize("filename", ALL_DATA_FILES)
def test_no_forbidden_words_in_cells(all_public_csv, filename):
    """Ninguna celda (grupo/categoria/medida) debe contener una palabra de
    campo personal — cubre tanto encabezados fantasma como texto libre que
    se hubiera colado desde una columna de trayectoria/observaciones."""
    rows = all_public_csv[filename]
    offenders = []
    for i, col, val in walk_strings(rows):
        if col == "valor":
            continue
        match = FORBIDDEN_WORD_RE.search(val.lower())
        if match:
            offenders.append((i, col, val, match.group(1)))
    assert not offenders, f"Texto con nombre de dato personal en {filename}: {offenders[:5]}"


def test_min_group_size_k_anonymity(all_public_csv):
    """Los conteos de personas (deporte, cultura) deben respetar k>=5 salvo el
    bucket de supresión 'Otros / protegido' o el grupo 'panorama' (que son
    totales/sumas agregadas, no conteos de categorías — motor.md 3.2)."""
    for filename in PERSON_LEVEL_FILES:
        rows = all_public_csv[filename]
        for row in rows:
            if row["grupo"] == "panorama":
                continue
            if "protegido" in row["categoria"].lower():
                continue
            valor = float(row["valor"])
            # Solo los conteos de personas (medida in {"valor", "naturales",
            # "juridico"}) están sujetos a k-anonimato; series de montos
            # agregados (ingresos, estímulos) no son conteos de individuos.
            if row["medida"] not in ("valor", "naturales", "juridico", "registros"):
                continue
            assert valor >= 5, (
                f"{filename}: {row['grupo']}/{row['categoria']}/{row['medida']} = {valor} "
                "viola el umbral de k-anonimato (k>=5)"
            )
