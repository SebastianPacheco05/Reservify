#!/usr/bin/env python3
"""
Migración: requisitos en Markdown → libro Excel (plantilla).

Origen (docs/reqs/):
  Destino (hoja del mismo nombre en el .xlsx, salvo donde se indica):

  | Archivo .md                         | Hoja Excel                      | Notas |
  |-------------------------------------|----------------------------------|-------|
  | REQ. No funcionales backend.md      | (índice NF en una sola hoja)     | Sección «Índice Excel» |
  | REQ. No funcionales db.md           | ↑ REQ. No funcionales            | ↑ |
  | REQ. No funcionales Frontend.md     | ↑ REQ. No funcionales            | ↑ |
  | REQ. funcionales backend.md         | REQ. funcionales backend         | Fila datos desde 12 |
  | REQ. funcionales db.md              | REQ. funcionales db              | ↑ |
  | Financieras.md                      | Financieras                      | ↑ |
  | Gestion Humana.md                   | Gestion Humana                   | ↑ |
  | REQ. funcionales Frontend.md        | REQ. funcionales Frontend        | Solo ítems NFF-VIG-* |
  | REQ. funcionales Frontend.md        | REQ. no funcionales Frontend     | Resto de NFF-*; datos desde fila 18 |
  | Conceptos técnicos y REQ.md         | Conceptos técnicos y REQ.        | Columnas B/D desde fila 6 |

Salida:
  docs/docs/files/reservifyreq.v.1.3.xls.xlsx

Comportamiento:
  - Conserva formato, colores y estilos de la plantilla (solo se escriben valores y
    fórmulas de totales/rangos).
  - Estado del .md → marcas SI/ADI/NO (x) según map_estado().
  - Requiere: pip install openpyxl
  - Depende de: scripts/export_reservifyreq_xlsx.py (parse_blocks, etc.)

Uso:
  python scripts/migrate_req_md_to_xlsx.py
"""
from __future__ import annotations

import sys
from copy import copy
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.cell.cell import MergedCell

ROOT = Path(__file__).resolve().parents[1]
REQ_DIR = ROOT / "docs" / "reqs"
XLSX_PATH = ROOT / "docs" / "docs" / "files" / "reservifyreq.v.1.3.xls.xlsx"

sys.path.insert(0, str(ROOT / "scripts"))
from export_reservifyreq_xlsx import (  # noqa: E402
    merge_nf_from_three_backends,
    parse_blocks,
    parse_simple_list,
)


def copy_row_height(ws, src_row: int, dst_row: int) -> None:
    rd = ws.row_dimensions[dst_row]
    rs = ws.row_dimensions[src_row]
    if rs.height is not None:
        rd.height = rs.height


def merge_safe_set(ws, row: int, col: int, value) -> None:
    """Escribe valor respetando celdas combinadas (solo el ancla es escribible)."""
    cell = ws.cell(row, col)
    if isinstance(cell, MergedCell):
        for m in ws.merged_cells.ranges:
            if m.min_row <= row <= m.max_row and m.min_col <= col <= m.max_col:
                ws.cell(m.min_row, m.min_col).value = value
                return
        return
    cell.value = value


def copy_cell_style(src, dst) -> None:
    if src.has_style:
        dst.font = copy(src.font)
        dst.fill = copy(src.fill)
        dst.border = copy(src.border)
        dst.alignment = copy(src.alignment)
        dst.number_format = src.number_format
        dst.protection = copy(src.protection)


def ensure_rows(ws, template_row: int, first_data: int, need_rows: int) -> int:
    """Asegura filas first_data .. first_data+need_rows-1 copiando estilo de template_row."""
    last = first_data + need_rows - 1
    if last > ws.max_row:
        n = last - ws.max_row
        ws.insert_rows(ws.max_row + 1, amount=n)
    tpl = template_row
    for r in range(first_data, first_data + need_rows):
        copy_row_height(ws, tpl, r)
        for c in range(1, ws.max_column + 1):
            copy_cell_style(ws.cell(tpl, c), ws.cell(r, c))
    return last


def map_estado(estado: str) -> tuple[str, str]:
    """Retorna ('si'|'adi'|'no', observaciones)."""
    e = (estado or "").strip().lower()
    obs = (estado or "").strip()
    if not e:
        return "si", ""
    if "no implementado" in e or "no hecho" in e:
        return "no", obs
    if "parcial" in e or "en observación" in e or "en observacion" in e:
        return "adi", obs
    if "vigente con ajustes" in e or "ajustes pendientes" in e:
        return "adi", obs
    if "derogado" in e:
        return "no", obs
    if "hecho" in e or "vigente" in e or "cubierto" in e:
        return "si", obs
    return "si", obs


def clear_marks(ws, row: int, efg: tuple[int, int, int]) -> None:
    e, f, g = efg
    for c in (e, f, g):
        merge_safe_set(ws, row, c, None)


def write_standard_block(
    ws,
    items: list[dict],
    *,
    first_row: int,
    si_col: int = 5,
    adi_col: int = 6,
    no_col: int = 7,
    obs_col: int = 8,
    template_row: int | None = None,
) -> int:
    """Escribe B índice, C texto, E/F/G marcas, H obs. Devuelve última fila de datos."""
    tpl = template_row or first_row
    ensure_rows(ws, tpl, first_row, len(items))

    for i, it in enumerate(items):
        r = first_row + i
        kind, _ = map_estado(it.get("estado", ""))
        full = f"{it['id']} – {it['title']}".strip()
        merge_safe_set(ws, r, 2, float(i + 1))
        merge_safe_set(ws, r, 3, full)
        clear_marks(ws, r, (si_col, adi_col, no_col))
        if kind == "si":
            merge_safe_set(ws, r, si_col, "x")
        elif kind == "adi":
            merge_safe_set(ws, r, adi_col, "x")
        else:
            merge_safe_set(ws, r, no_col, "x")
        obs = it.get("estado", "")
        if obs and kind == "adi":
            merge_safe_set(ws, r, obs_col, obs)
        elif obs and kind == "no":
            merge_safe_set(ws, r, obs_col, obs)
        else:
            merge_safe_set(ws, r, obs_col, None)
    return first_row + len(items) - 1


def update_summary_formulas_standard(ws, first: int, last: int) -> None:
    """Filas 12-15, columnas 11 (K) típicas."""
    end = last
    ws.cell(12, 11).value = f"=COUNTA(C{first}:C{end})"
    ws.cell(13, 11).value = f"=COUNTA(E{first}:E{end})"
    ws.cell(14, 11).value = f"=K12 - K13"
    ws.cell(15, 11).value = '=TEXT((K13/K12)*100,"0,00") & "%"'


def parse_frontend_split():
    path = REQ_DIR / "REQ. funcionales Frontend.md"
    text = path.read_text(encoding="utf-8")
    items = parse_blocks(text, skip_headers=True, merge_multiline=True)
    vig = [x for x in items if x["id"].startswith("NFF-VIG-")]
    rest = [x for x in items if not x["id"].startswith("NFF-VIG-")]
    return vig, rest


def concepto_text(it: dict) -> str:
    d = it.get("detail", "")
    if "Concepto técnico:" in d:
        return d.split("Concepto técnico:", 1)[-1].strip()
    return d.strip() or it.get("title", "")


def fill_conceptos(ws, items: list[dict], start_row: int = 6) -> int:
    """Columna B palabra, D concepto."""
    tpl = start_row
    ensure_rows(ws, tpl, start_row, len(items))
    for i, it in enumerate(items):
        r = start_row + i
        merge_safe_set(ws, r, 2, it["id"])
        merge_safe_set(ws, r, 4, concepto_text(it))
    return start_row + len(items) - 1


def migrate() -> None:
    """Ejecuta la migración MD → Excel."""
    if not XLSX_PATH.is_file():
        raise SystemExit(f"No existe el Excel plantilla: {XLSX_PATH}")

    wb = load_workbook(XLSX_PATH)

    nf = merge_nf_from_three_backends()
    ws = wb["REQ. No funcionales"]
    last = write_standard_block(ws, nf, first_row=12, template_row=12)
    update_summary_formulas_standard(ws, 12, last)

    be = parse_simple_list((REQ_DIR / "REQ. funcionales backend.md").read_text(encoding="utf-8"))
    ws = wb["REQ. funcionales backend"]
    last = write_standard_block(ws, be, first_row=12, template_row=12)
    update_summary_formulas_standard(ws, 12, last)

    db = parse_simple_list((REQ_DIR / "REQ. funcionales db.md").read_text(encoding="utf-8"))
    ws = wb["REQ. funcionales db"]
    last = write_standard_block(ws, db, first_row=12, template_row=12)
    update_summary_formulas_standard(ws, 12, last)

    fi = parse_simple_list((REQ_DIR / "Financieras.md").read_text(encoding="utf-8"))
    ws = wb["Financieras"]
    last = write_standard_block(ws, fi, first_row=12, template_row=12)
    ws.cell(12, 11).value = f"=COUNTA(B12:B{last})"
    ws.cell(13, 11).value = f"=COUNTA(E12:E{last})"
    ws.cell(14, 11).value = "=K12 - K13"
    ws.cell(15, 11).value = '=TEXT((K13/K12)*100,"0,00") & "%"'

    gu = parse_simple_list((REQ_DIR / "Gestion Humana.md").read_text(encoding="utf-8"))
    ws = wb["Gestion Humana"]
    last = write_standard_block(ws, gu, first_row=12, template_row=12)
    update_summary_formulas_standard(ws, 12, last)

    vig, nff_rest = parse_frontend_split()
    ws = wb["REQ. funcionales Frontend"]
    last = write_standard_block(ws, vig, first_row=12, template_row=12)
    update_summary_formulas_standard(ws, 12, last)

    ws = wb["REQ. no funcionales Frontend"]
    first = 18
    ensure_rows(ws, first, first, len(nff_rest))
    for i, it in enumerate(nff_rest):
        r = first + i
        kind, _ = map_estado(it.get("estado", ""))
        full = f"{it['id']} – {it['title']}".strip()
        merge_safe_set(ws, r, 2, float(i + 1))
        merge_safe_set(ws, r, 3, full)
        for c in (6, 7, 8):
            merge_safe_set(ws, r, c, None)
        if kind == "si":
            merge_safe_set(ws, r, 6, "x")
        elif kind == "adi":
            merge_safe_set(ws, r, 7, "x")
        else:
            merge_safe_set(ws, r, 8, "x")
    last_nf = first + len(nff_rest) - 1
    ws.cell(14, 12).value = f"=COUNTA(B{first}:B{last_nf})"
    ws.cell(15, 12).value = f'=COUNTIF(F{first}:F{last_nf},"*x*")'
    ws.cell(16, 12).value = "=L14-L15"
    ws.cell(17, 12).value = '=TEXT((L15/L14)*100,"0,00") & "%"'

    cname = [n for n in wb.sheetnames if n.startswith("Conceptos")][0]
    ws = wb[cname]
    ct = parse_simple_list((REQ_DIR / "Conceptos técnicos y REQ.md").read_text(encoding="utf-8"))
    fill_conceptos(ws, ct, start_row=6)

    ws.cell(
        6,
        18,
    ).value = (
        "='REQ. No funcionales'!K12+'REQ. funcionales Frontend'!K12+'REQ. funcionales db'!K12"
        "+'REQ. funcionales backend'!K12+Financieras!K12+'REQ. no funcionales Frontend'!L14"
    )
    ws.cell(
        7,
        18,
    ).value = (
        "='REQ. No funcionales'!K13+'REQ. funcionales Frontend'!K13+'REQ. funcionales db'!K13"
        "+'REQ. funcionales backend'!K13+Financieras!K13+'Gestion Humana'!K13+'REQ. no funcionales Frontend'!L15"
    )

    wb.save(XLSX_PATH)
    print(f"Migración guardada: {XLSX_PATH}")
    print(
        f"  NF={len(nf)} BE={len(be)} DB={len(db)} FI={len(fi)} GU={len(gu)} "
        f"NFF-VIG={len(vig)} NFF-otros={len(nff_rest)} Conceptos={len(ct)}"
    )


def main() -> None:
    migrate()


if __name__ == "__main__":
    main()
