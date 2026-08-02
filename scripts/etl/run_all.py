"""Orquesta todo el pipeline ETL: lee los Excel originales (fuera del repo)
y escribe únicamente datos agregados/anonimizados en /data."""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import cultura
import deporte
import educacion_media
import educacion_superior
import resumen


def main():
    steps = [
        ("Educación Media", educacion_media.run),
        ("Educación Superior", educacion_superior.run),
        ("Deporte", deporte.run),
        ("Cultura", cultura.run),
        ("Resumen (home)", resumen.run),
    ]
    for label, fn in steps:
        print(f"\n== {label} ==")
        t0 = time.time()
        fn()
        print(f"   ({time.time() - t0:.1f}s)")
    print("\nETL completo. Datos públicos escritos en /data")


if __name__ == "__main__":
    main()
