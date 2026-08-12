"""Verifica que el repositorio esté listo para publicarse en GitHub Pages sin
filtrar las fuentes originales: los Excel/anexos están ignorados por git, el
HTML solo referencia archivos locales (nada de CDNs externos) y los ids del
menú lateral coinciden exactamente entre el HTML y la lógica en dashboard.js.
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _git(*args):
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=False
    )


def test_raw_excel_files_are_gitignored():
    raw_files = [
        "Registro-Administrativo-Historico_2009-202X-Inicio.xlsx",
        "Anexos.zip",
        "Anexos/Cultura/Naturales_cultura.xlsx",
        "Anexos/Cultura/Juridico_cultura.xlsx",
        "Anexos/Deporte/Base_Deporte.xlsx",
        "Anexos/Educación_Media/Información_educacion_media.xlsx",
        "Anexos/Educación_Superior/ITTS.xlsx",
        "Anexos/Educación_Superior/UEP.xlsx",
        "propuestaweb.docx",
        "motor.md",
    ]
    for rel in raw_files:
        path = ROOT / rel
        if not path.exists():
            continue  # este runner podría no tener los Excel originales localmente
        result = _git("check-ignore", "-q", str(path))
        assert result.returncode == 0, f"{rel} NO está ignorado por git — se publicaría en el repo"


def test_no_xlsx_tracked_in_git():
    result = _git("ls-files")
    tracked = result.stdout.splitlines()
    xlsx_tracked = [f for f in tracked if f.lower().endswith((".xlsx", ".xls"))]
    assert not xlsx_tracked, f"Hay archivos Excel versionados en git: {xlsx_tracked}"


def test_no_external_script_or_style_tags():
    """El portal no debe depender de CDNs externos (todo el CSS/JS es local)."""
    for html_file in ["index.html", "informacion-general.html"]:
        html = (ROOT / html_file).read_text(encoding="utf-8")
        srcs = re.findall(r'<script[^>]+src="([^"]+)"', html)
        hrefs = re.findall(r'<link[^>]+href="([^"]+)"', html)
        for url in srcs + hrefs:
            assert not url.startswith("http"), f"{html_file} referencia un recurso externo: {url}"


def test_referenced_local_assets_exist():
    for html_file in ["index.html", "informacion-general.html"]:
        html = (ROOT / html_file).read_text(encoding="utf-8")
        srcs = re.findall(r'<script[^>]+src="([^"]+)"', html)
        hrefs = re.findall(r'<link[^>]+href="([^"]+)"', html)
        for rel in srcs + hrefs:
            if rel.startswith(("http", "data:")):
                continue
            assert (ROOT / rel).exists(), f"{html_file} referencia un archivo inexistente: {rel}"


def test_sidebar_section_ids_match_dashboard_js():
    html = (ROOT / "informacion-general.html").read_text(encoding="utf-8")
    js = (ROOT / "assets" / "js" / "dashboard.js").read_text(encoding="utf-8")
    html_ids = set(re.findall(r'data-section="([^"]+)"', html))
    js_ids = set(re.findall(r'"([a-z0-9-]+)":\s*\{\s*\n\s*title:', js))
    assert html_ids, "No se encontraron data-section en informacion-general.html"
    assert html_ids == js_ids, f"Diferencia de ids -> solo HTML: {html_ids - js_ids} · solo JS: {js_ids - html_ids}"


def test_every_section_declares_a_source():
    """Cada sección del dashboard debe declarar su archivo fuente (se
    muestra como 'Fuente:' en la interfaz) — trazabilidad de motor.md
    sección 24 y 27 ('todo indicador debe poder rastrearse a un archivo')."""
    html = (ROOT / "informacion-general.html").read_text(encoding="utf-8")
    js = (ROOT / "assets" / "js" / "dashboard.js").read_text(encoding="utf-8")
    section_ids = re.findall(r'data-section="([^"]+)"', html)
    sources = re.findall(r'source:\s*\[[^\]]+\]', js)
    assert len(sources) == len(section_ids), (
        f"{len(section_ids)} secciones en el menú pero solo {len(sources)} con 'source:' no vacío en dashboard.js"
    )
