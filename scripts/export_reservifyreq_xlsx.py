#!/usr/bin/env python3
"""
Genera docs/docs/files/reservifyreq.v.1.3.xls.xlsx a partir de los REQ en docs/reqs/*.md
Columnas por hoja: ID | Título | Descripción / detalle | Estado
"""
from __future__ import annotations

import re
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[1]
REQ_DIR = ROOT / "docs" / "reqs"
OUT_DIR = ROOT / "docs" / "docs" / "files"
OUT_XLSX = OUT_DIR / "reservifyreq.v.1.3.xls.xlsx"

HEADERS = ("ID", "Título", "Descripción / detalle", "Estado")


def merge_open_markdown_items(lines: list[str]) -> list[str]:
    """
    Une bloques donde '- **...' no cierra en la misma línea (título largo en varias líneas).
    No fusiona la siguiente línea si ya es un nuevo ítem ('- **'), p. ej. anexos Dueño/Admin/Empleado.
    """
    out: list[str] = []
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.startswith("- **"):
            block = line
            i += 1
            while i < n:
                if lines[i].startswith("- **"):
                    break
                if block.rstrip().endswith("**"):
                    break
                block += " " + lines[i].strip()
                i += 1
            out.append(block)
        else:
            out.append(line)
            i += 1
    return out


def _strip_md(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    return s.strip()


def parse_blocks(
    text: str,
    *,
    skip_headers: bool = True,
    stop_at_heading: str | None = None,
    merge_multiline: bool = False,
) -> list[dict]:
    """
    Agrupa líneas bajo cada ítem que empiece con '- **ID – Título**' o '- **Nombre**' (sin guión largo).
    Acumula sublíneas '  - **Campo:** valor' y texto suelto indentado.
    """
    lines = text.splitlines()
    if merge_multiline:
        lines = merge_open_markdown_items(lines)
    items: list[dict] = []
    current: dict | None = None
    detail_lines: list[str] = []
    estado = ""

    def flush():
        nonlocal current, detail_lines, estado
        if not current:
            return
        detail = "\n".join(detail_lines).strip()
        items.append(
            {
                "id": current["id"],
                "title": current["title"],
                "detail": detail,
                "estado": estado.strip(),
            }
        )
        current = None
        detail_lines = []
        estado = ""

    # Solo raya en/em Unicode entre ID y título (no el guión ASCII de NFF-VIG-HOME-01)
    item_start = re.compile(
        r"^-\s*\*\*\s*([^*]+?)\s*[\u2013\u2014]\s*(.+?)\s*\*\*\s*$"
    )
    # Conceptos: - **Python** sin em dash en algunos casos
    item_concept = re.compile(r"^-\s*\*\*\s*([^*]+?)\s*\*\*\s*$")
    sub_line = re.compile(r"^\s+-\s*\*\*(.+?):\*\*\s*(.*)$")
    estado_line = re.compile(r"^\s+-\s*\*\*Estado:\*\*\s*(.+)$")

    in_index_only = False
    for i, line in enumerate(lines):
        if skip_headers and line.startswith("### ") and not items:
            continue
        if line.startswith("> ") and not current:
            continue
        if stop_at_heading and line.strip() == stop_at_heading:
            flush()
            break

        if "#### Índice Excel" in line:
            in_index_only = True
            flush()
            continue

        m = item_start.match(line)
        if not m and in_index_only:
            m = item_start.match(line)
        if not m:
            # Anexos: '- **Dueño (`Dashboard.tsx`):** texto…' (sin guión largo ID–título)
            alt = re.match(r"^-\s*\*\*(.+?):\*\*\s*(.*)$", line)
            if alt:
                flush()
                rid = alt.group(1).strip()
                title = alt.group(2).strip() or rid
                current = {"id": rid, "title": title, "raw": "req"}
                continue
        if not m:
            mc = item_concept.match(line)
            if mc and not line.strip().startswith("- **Estado"):
                # Nuevo bloque tipo concepto (solo nombre en negrita)
                flush()
                name = mc.group(1).strip()
                current = {"id": name, "title": name, "raw": "concept"}
                continue

        if m:
            flush()
            rid = m.group(1).strip()
            title = m.group(2).strip()
            current = {"id": rid, "title": title, "raw": "req"}
            continue

        if current:
            me = estado_line.match(line)
            if me:
                estado = me.group(1).strip()
                continue
            ms = sub_line.match(line)
            if ms:
                k, v = ms.group(1).strip(), ms.group(2).strip()
                detail_lines.append(f"{k}: {v}")
                continue
            if line.strip() == "":
                detail_lines.append("")
                continue
            # texto continuo indentado
            if line.startswith("  ") or line.startswith("\t"):
                detail_lines.append(line.strip())
            elif line.startswith("#"):
                flush()
            elif line.startswith("- **") and not line.startswith("  "):
                # nuevo ítem sin detectar (fallback)
                flush()
                m2 = item_start.match(line)
                if m2:
                    rid = m2.group(1).strip()
                    title = m2.group(2).strip()
                    current = {"id": rid, "title": title, "raw": "req"}
                else:
                    alt2 = re.match(r"^-\s*\*\*(.+?):\*\*\s*(.*)$", line)
                    if alt2:
                        rid = alt2.group(1).strip()
                        title = alt2.group(2).strip() or rid
                        current = {"id": rid, "title": title, "raw": "req"}
            else:
                if line.strip():
                    detail_lines.append(line.strip())

    flush()
    return items


def parse_simple_list(text: str) -> list[dict]:
    """Para GU, FI, BE, DB: solo ID, título y Estado."""
    return parse_blocks(text, skip_headers=True)


def merge_nf_from_three_backends() -> list[dict]:
    parts = []
    for name in (
        "REQ. No funcionales backend.md",
        "REQ. No funcionales db.md",
        "REQ. No funcionales Frontend.md",
    ):
        p = REQ_DIR / name
        t = p.read_text(encoding="utf-8")
        idx = t.find("#### Índice Excel")
        if idx == -1:
            continue
        t = t[idx:]
        parts.extend(parse_blocks(t, skip_headers=False))

    def sort_key(item: dict):
        m = re.match(r"^NF-(\d+)([A-Z]?)", item["id"])
        if not m:
            return (10**9, 99, item["id"])
        return (int(m.group(1)), m.group(2) or "\x00")

    parts.sort(key=sort_key)
    return parts


def write_sheet(ws, rows: list[dict], *, wrap: bool = True) -> None:
    for col, h in enumerate(HEADERS, 1):
        c = ws.cell(row=1, column=col, value=h)
        c.font = Font(bold=True)
    ws.freeze_panes = "A2"
    for r, row in enumerate(rows, 2):
        ws.cell(row=r, column=1, value=row.get("id", ""))
        ws.cell(row=r, column=2, value=row.get("title", ""))
        ws.cell(row=r, column=3, value=row.get("detail", ""))
        ws.cell(row=r, column=4, value=row.get("estado", ""))
        if wrap:
            for c in range(1, 5):
                ws.cell(row=r, column=c).alignment = Alignment(
                    wrap_text=True, vertical="top"
                )
    for col in range(1, 5):
        ws.column_dimensions[get_column_letter(col)].width = min(56, 14 + col * 4)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    wb = Workbook()
    # Quitar hoja por defecto
    default = wb.active
    wb.remove(default)

    # --- REQ. No funcionales (fusionado NF) ---
    ws_nf = wb.create_sheet("REQ. No funcionales", 0)
    write_sheet(ws_nf, merge_nf_from_three_backends())

    # --- REQ. funcionales backend ---
    t_be = (REQ_DIR / "REQ. funcionales backend.md").read_text(encoding="utf-8")
    ws_be = wb.create_sheet("REQ. funcionales backend")
    write_sheet(ws_be, parse_simple_list(t_be))

    # --- REQ. funcionales db ---
    t_db = (REQ_DIR / "REQ. funcionales db.md").read_text(encoding="utf-8")
    ws_db = wb.create_sheet("REQ. funcionales db")
    write_sheet(ws_db, parse_simple_list(t_db))

    # --- REQ. no funcionales Frontend (nombre hoja Excel histórico) ---
    t_fr = (REQ_DIR / "REQ. funcionales Frontend.md").read_text(encoding="utf-8")
    ws_fr = wb.create_sheet("REQ. no funcionales Frontend")
    write_sheet(ws_fr, parse_blocks(t_fr, merge_multiline=True))

    # --- Gestion Humana ---
    t_gh = (REQ_DIR / "Gestion Humana.md").read_text(encoding="utf-8")
    ws_gh = wb.create_sheet("Gestion Humana")
    write_sheet(ws_gh, parse_simple_list(t_gh))

    # --- Financieras ---
    t_fi = (REQ_DIR / "Financieras.md").read_text(encoding="utf-8")
    ws_fi = wb.create_sheet("Financieras")
    write_sheet(ws_fi, parse_simple_list(t_fi))

    # --- Conceptos técnicos y REQ. ---
    t_ct = (REQ_DIR / "Conceptos técnicos y REQ.md").read_text(encoding="utf-8")
    ws_ct = wb.create_sheet("Conceptos técnicos y REQ.")
    write_sheet(ws_ct, parse_simple_list(t_ct))

    # --- Metadatos ---
    ws_m = wb.create_sheet("_Metadatos", len(wb.sheetnames) - 1)
    ws_m["A1"] = "Libro"
    ws_m["B1"] = "reservifyreq.v.1.3.xls.xlsx"
    ws_m["A2"] = "Generado desde"
    ws_m["B2"] = "docs/reqs/*.md (export_reservifyreq_xlsx.py)"
    ws_m["A3"] = "Columnas"
    ws_m["B3"] = " | ".join(HEADERS)

    wb.save(OUT_XLSX)
    print(f"Guardado: {OUT_XLSX} ({len(wb.sheetnames)} hojas)")


if __name__ == "__main__":
    main()
