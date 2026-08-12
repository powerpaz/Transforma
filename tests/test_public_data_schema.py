"""Sanidad estructural de los CSV públicos: existen, tienen las columnas
tidy que el frontend espera (assets/js/data.js: grupo,categoria,medida,valor)
y los valores son numéricamente plausibles (no negativos, sumas de
femenino+masculino cuadran, etc.)."""
from conftest import ALL_DATA_FILES, TIDY_DATA_FILES, numeric_rows


def _value(rows, grupo, medida, categoria="total"):
    for row in rows:
        if row["grupo"] == grupo and row["medida"] == medida and row["categoria"] == categoria:
            return float(row["valor"])
    raise KeyError(f"No se encontró {grupo}/{categoria}/{medida}")


def test_all_data_files_exist(data_dir):
    for name in ALL_DATA_FILES:
        assert (data_dir / name).exists(), f"Falta {name} — ejecutar scripts/etl/run_all.py"


def test_tidy_files_have_expected_columns(all_public_csv):
    for name in TIDY_DATA_FILES:
        rows = all_public_csv[name]
        assert rows, f"{name} está vacío"
        assert set(rows[0].keys()) == {"grupo", "categoria", "medida", "valor"}, name
    resumen = all_public_csv["resumen.csv"]
    assert resumen and set(resumen[0].keys()) == {"sector", "metrica", "valor"}


def test_no_negative_numbers(all_public_csv):
    for filename, rows in all_public_csv.items():
        offenders = [(i, v) for i, v in numeric_rows(rows) if v < 0]
        assert not offenders, f"Valores negativos en {filename}: {offenders[:5]}"


def test_resumen_shape(all_public_csv):
    r = all_public_csv["resumen.csv"]
    sectores = {row["sector"] for row in r}
    assert sectores == {"educacion_media", "educacion_superior", "cultura", "deporte"}

    def val(sector, metrica):
        return float(next(row["valor"] for row in r if row["sector"] == sector and row["metrica"] == metrica))

    assert val("educacion_media", "estudiantes_total") > 1_000_000
    assert val("educacion_superior", "estudiantes_total") > 100_000
    assert val("cultura", "gestores_total") > 1_000
    assert val("deporte", "usuarios_deporte") > 1_000


def test_educacion_media_shape(all_public_csv):
    d = all_public_csv["educacion_media.csv"]
    anios = sorted({row["categoria"] for row in d if row["grupo"] == "serie_anio"})
    assert len(anios) >= 10
    for anio in anios:
        total = _value(d, "serie_anio", "estudiantes_total", anio)
        fem = _value(d, "serie_anio", "estudiantes_femenino", anio)
        masc = _value(d, "serie_anio", "estudiantes_masculino", anio)
        assert fem + masc == total, f"{anio}: {fem}+{masc} != {total}"

    total = _value(d, "panorama", "estudiantes_total")
    fem = _value(d, "panorama", "estudiantes_femenino")
    masc = _value(d, "panorama", "estudiantes_masculino")
    assert fem + masc == total


def test_educacion_superior_shape(all_public_csv):
    d = all_public_csv["educacion_superior.csv"]
    assert _value(d, "panorama", "uep_instituciones_total") > 0
    assert _value(d, "panorama", "itt_instituciones_total") > 0
    assert any(row["grupo"] == "itt_serie_anio" for row in d)


def test_deporte_shape(all_public_csv):
    d = all_public_csv["deporte.csv"]
    for medida in ["vitalicios_total", "alto_rendimiento_total", "juegos_nacionales_total", "entrenadores_total", "usuarios_deporte_total"]:
        assert _value(d, "panorama", medida) > 0, medida


def test_cultura_shape(all_public_csv):
    d = all_public_csv["cultura.csv"]
    assert _value(d, "panorama", "naturales_total") > 10_000
    assert _value(d, "panorama", "juridico_total") > 100
