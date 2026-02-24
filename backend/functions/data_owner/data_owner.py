import secrets
import string
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from functions.register.register import hash_password, validar_formato_email

# Tipo: "dueno" | "administrador" | "empleado". Dueño tiene documento; administrador y empleado tienen nit.
def obtener_contexto_gestor(id_credencial: int, db: Session) -> dict:
    """
    Obtiene el contexto del usuario gestor (dueño, administrador o empleado).
    Retorna {"tipo": "dueno", "documento": int} o {"tipo": "administrador"|"empleado", "nit": int}.
    """
    sql = text("""
        SELECT u.documento, u.nit, LOWER(TRIM(r.nombre_rol)) as rol
        FROM "Usuario" u
        JOIN "Roles" r ON u.id_rol = r.id_rol
        WHERE u.id_credencial = :id_credencial
    """)
    row = db.execute(sql, {"id_credencial": id_credencial}).fetchone()
    if not row:
        raise HTTPException(status_code=403, detail="Usuario no encontrado")
    doc, nit, rol = row[0], row[1], (row[2] or "").replace("dueño", "dueno")
    if rol == "dueno":
        return {"tipo": "dueno", "documento": doc}
    if rol == "administrador" and nit is not None:
        return {"tipo": "administrador", "nit": int(nit)}
    if rol == "empleado" and nit is not None:
        return {"tipo": "empleado", "nit": int(nit)}
    if rol == "administrador":
        raise HTTPException(status_code=403, detail="El administrador debe tener un restaurante asignado (nit)")
    raise HTTPException(status_code=403, detail="No tiene permisos de dueño, administrador ni empleado")

def obtener_documento_dueno(id_credencial: int, db: Session) -> int:
    """Obtiene el documento del usuario con rol dueño basado en su id_credencial"""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] != "dueno":
        raise HTTPException(status_code=403, detail="No tiene permisos de dueño")
    return ctx["documento"]

def obtener_estadisticas_restaurante(nit: int, db: Session) -> dict:
    """Estadísticas de un solo restaurante (para administrador)."""
    sql = text("SELECT * FROM obtener_estadisticas_restaurante(:nit)")
    result = db.execute(sql, {"nit": nit}).fetchone()
    if result:
        return {
            "total_restaurantes": result[0] or 1,
            "reservas_activas": result[1] or 0,
            "revenue_mes": float(result[4]) if result[4] is not None else 0.0,
        }
    return {"total_restaurantes": 1, "reservas_activas": 0, "revenue_mes": 0.0}

def obtener_estadisticas_dueno(id_credencial: int, db: Session):
    documento_dueno = obtener_documento_dueno(id_credencial, db)
    sql = text("SELECT * FROM obtener_estadisticas_dueno(:documento)")
    result = db.execute(sql, {"documento": documento_dueno}).fetchone()
    if result:
        return {
            "total_restaurantes": result[0],
            "reservas_activas": result[1],
            "revenue_mes": float(result[4]) if result[4] is not None else 0.0
        }
    return {"total_restaurantes": 0, "reservas_activas": 0, "revenue_mes": 0.0}

def obtener_estadisticas_gestor(id_credencial: int, db: Session) -> dict:
    """Métricas para dueño (todos sus restaurantes) o administrador (solo su restaurante)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return obtener_estadisticas_dueno(id_credencial, db)
    return obtener_estadisticas_restaurante(ctx["nit"], db)

def obtener_reservas_dueno(id_credencial: int, db: Session, limit: int = 50):
    """Reservas de todos los restaurantes del dueño."""
    documento_dueno = obtener_documento_dueno(id_credencial, db)
    return _reservas_por_documento(db, documento_dueno, limit)

def obtener_facturas_gestor(id_credencial: int, db: Session, limit: int = 100) -> list:
    """
    Facturas del gestor: dueño (todos sus restaurantes) o administrador/empleado (solo su nit).
    Retorna: id_encab_fact, nit, nombre_restaurante, precio_total, fecha, forma_pago, documento
    """
    ctx = obtener_contexto_gestor(id_credencial, db)
    limit_val = min(max(1, limit), 500)
    if ctx["tipo"] == "dueno":
        sql = text("""
            SELECT ef.id_encab_fact, ef.nit, ef.nombre_restaurante,
                   COALESCE(ef.precio_total, 0)::float as precio_total,
                   ef.fecha::text, COALESCE(ef.forma_pago, 'Pendiente') as forma_pago, ef.documento
            FROM "Encabezado_factura" ef
            INNER JOIN "Restaurante" r ON ef.nit = r.nit
            WHERE r.documento = :documento_dueno
            ORDER BY ef.fecha DESC, ef.id_encab_fact DESC
            LIMIT :limit_val
        """)
        rows = db.execute(sql, {"documento_dueno": ctx["documento"], "limit_val": limit_val}).fetchall()
    else:
        sql = text("""
            SELECT ef.id_encab_fact, ef.nit, ef.nombre_restaurante,
                   COALESCE(ef.precio_total, 0)::float as precio_total,
                   ef.fecha::text, COALESCE(ef.forma_pago, 'Pendiente') as forma_pago, ef.documento
            FROM "Encabezado_factura" ef
            WHERE ef.nit = :nit_gestor
            ORDER BY ef.fecha DESC, ef.id_encab_fact DESC
            LIMIT :limit_val
        """)
        rows = db.execute(sql, {"nit_gestor": ctx["nit"], "limit_val": limit_val}).fetchall()
    return [
        {
            "id_encab_fact": row[0],
            "nit": row[1],
            "nombre_restaurante": row[2],
            "precio_total": float(row[3]) if row[3] is not None else 0.0,
            "fecha": str(row[4]) if row[4] else "",
            "forma_pago": (row[5] or "Pendiente").strip(),
            "documento": row[6],
        }
        for row in rows
    ]


def _gestor_tiene_acceso_factura(id_credencial: int, id_encab_fact: int, db: Session) -> bool:
    """Verifica si el gestor tiene acceso a la factura (por nit del encabezado)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    row = db.execute(
        text('SELECT nit FROM "Encabezado_factura" WHERE id_encab_fact = :id'),
        {"id": id_encab_fact},
    ).fetchone()
    if not row:
        return False
    nit_factura = row[0]
    return puede_acceder_restaurante(id_credencial, nit_factura, db)


def obtener_factura_detalle_gestor(
    id_credencial: int, id_encab_fact: int, db: Session
) -> dict | None:
    """
    Obtiene encabezado + detalles de una factura. Solo si el gestor tiene acceso.
    """
    if not _gestor_tiene_acceso_factura(id_credencial, id_encab_fact, db):
        return None
    enc = db.execute(
        text("""
            SELECT id_encab_fact, nit, nombre_restaurante, direccion, ciudad, fecha,
                   documento, COALESCE(forma_pago, 'Pendiente') as forma_pago,
                   COALESCE(precio_total, 0)::float as precio_total
            FROM "Encabezado_factura" WHERE id_encab_fact = :id
        """),
        {"id": id_encab_fact},
    ).fetchone()
    if not enc:
        return None
    detalles = db.execute(
        text("""
            SELECT id_det_fact, descripcion, unidades, precio_unitario, precio_total, forma_pago
            FROM "Detalle_factura" WHERE id_encab_fact = :id
        """),
        {"id": id_encab_fact},
    ).fetchall()
    det_list = []
    for d in detalles:
        desc = d[1]
        if isinstance(desc, list):
            desc_str = ", ".join(str(x) for x in desc) if desc else ""
        else:
            desc_str = str(desc) if desc else ""
        det_list.append({
            "id_det_fact": d[0],
            "descripcion": desc_str,
            "unidades": d[2],
            "precio_unitario": float(d[3]) if d[3] is not None else 0,
            "precio_total": float(d[4]) if d[4] is not None else 0,
            "forma_pago": (d[5] or "").strip(),
        })
    return {
        "encabezado": {
            "id_encab_fact": enc[0],
            "nit": enc[1],
            "nombre_restaurante": enc[2],
            "direccion": enc[3],
            "ciudad": enc[4],
            "fecha": str(enc[5]) if enc[5] else "",
            "documento": enc[6],
            "forma_pago": (enc[7] or "Pendiente").strip(),
            "precio_total": float(enc[8]) if enc[8] is not None else 0.0,
        },
        "detalles": det_list,
    }


def enviar_factura_por_email(
    id_credencial: int, id_encab_fact: int, db: Session
) -> tuple[bool, str]:
    """
    Envía la factura por email al cliente. Retorna (ok, mensaje_error).
    Requiere que el gestor tenga acceso y SMTP configurado.
    """
    from functions.email_sender.email_utils import send_email_with_config
    from functions.email_sender.smtp_config_db import get_smtp_config

    if not _gestor_tiene_acceso_factura(id_credencial, id_encab_fact, db):
        return False, "Factura no encontrada o no tiene acceso"

    enc_row = db.execute(
        text("""
            SELECT nit, nombre_restaurante, direccion, ciudad, fecha, documento, forma_pago, precio_total
            FROM "Encabezado_factura" WHERE id_encab_fact = :id
        """),
        {"id": id_encab_fact},
    ).fetchone()
    if not enc_row:
        return False, "Factura no encontrada"

    documento_cliente = enc_row[5]
    email_row = db.execute(
        text("""
            SELECT c.email FROM "Usuario" u
            JOIN "Credenciales" c ON u.id_credencial = c.id_credencial
            WHERE u.documento = :doc
        """),
        {"doc": documento_cliente},
    ).fetchone()
    if not email_row or not email_row[0]:
        return False, "No se encontró email del cliente asociado a esta factura"
    email_cliente = email_row[0].strip()

    smtp = get_smtp_config(db, id_credencial)
    if not smtp or not smtp.get("password_encrypted"):
        return False, "Configura SMTP en Configuración para poder enviar facturas por email."

    nit, nombre_rest, direccion, ciudad, fecha, _, forma_pago, precio_total = enc_row
    det_rows = db.execute(
        text("""
            SELECT descripcion, unidades, precio_unitario, precio_total
            FROM "Detalle_factura" WHERE id_encab_fact = :id
        """),
        {"id": id_encab_fact},
    ).fetchall()

    lineas = []
    for d in det_rows:
        desc = d[0]
        if isinstance(desc, list):
            desc_str = ", ".join(str(x) for x in desc) if desc else ""
        else:
            desc_str = str(desc) if desc else ""
        lineas.append(f"  - {desc_str}: {d[1]} x ${float(d[2] or 0):,.0f} = ${float(d[3] or 0):,.0f}")

    body = f"""Estimado cliente,

Adjunto el detalle de su factura FAC-{id_encab_fact} de {nombre_rest}.

Factura FAC-{id_encab_fact}
Restaurante: {nombre_rest}
NIT: {nit}
Dirección: {direccion}, {ciudad}
Fecha: {fecha}
Forma de pago: {forma_pago}

Detalle:
""" + "\n".join(lineas) + f"""

Total: ${float(precio_total or 0):,.0f}

Gracias por su preferencia.
Reservify
"""
    subject = f"Factura FAC-{id_encab_fact} - {nombre_rest}"
    ok = send_email_with_config(smtp, email_cliente, subject, body)
    if not ok:
        return False, "No se pudo enviar el correo."
    return True, ""


def puede_acceder_restaurante(id_credencial: int, nit: int, db: Session) -> bool:
    """Verifica si el usuario (dueño, administrador o empleado) puede acceder al restaurante con ese nit."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        row = db.execute(
            text('SELECT 1 FROM "Restaurante" WHERE documento = :doc AND nit = :nit'),
            {"doc": ctx["documento"], "nit": nit}
        ).fetchone()
        return row is not None
    if ctx["tipo"] in ("administrador", "empleado"):
        return ctx["nit"] == nit
    return False

_SQL_RESERVAS_BASE = """
    SELECT r.id_reserva, r.horario, r.fecha, r.estado_reserva,
           m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
           r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente
    FROM "Reserva" r
    INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    INNER JOIN "Restaurante" rest ON m.nit = rest.nit
    INNER JOIN "Usuario" c ON r.documento = c.documento
"""
_SQL_RESERVAS_EXTRA_COLS = ", r.motivo_cancelacion, r.ajuste"
_SQL_RESERVAS_ORDER = 'ORDER BY r.fecha DESC, r.horario DESC'


def _ejecutar_reservas_sql(db: Session, sql: str, params: dict) -> list:
    """Ejecuta SQL de reservas y mapea filas a dict."""
    rows = db.execute(text(sql), params).fetchall()
    return [_row_a_reserva(row) for row in rows]


def obtener_reservas_por_nit(
    nit: int, db: Session, limit: int | None = 50, fecha: str | None = None
) -> list:
    """Reservas de un solo restaurante (incluye motivo_cancelacion y ajuste si existen en BD).
    Si fecha se proporciona (YYYY-MM-DD), filtra por ese día."""
    limit_clause = f" LIMIT {min(int(limit), 500)}" if limit else ""
    where_extra = " AND r.fecha = :fecha" if fecha else ""
    params: dict = {"nit": nit}
    if fecha:
        params["fecha"] = fecha
    sql_con_extra = (_SQL_RESERVAS_BASE.replace(
        "documento_cliente",
        f"documento_cliente{_SQL_RESERVAS_EXTRA_COLS}",
        1,
    ) + f" WHERE rest.nit = :nit{where_extra} {_SQL_RESERVAS_ORDER}{limit_clause}").strip()
    sql_sin_extra = (_SQL_RESERVAS_BASE + f' WHERE rest.nit = :nit{where_extra} {_SQL_RESERVAS_ORDER}{limit_clause}').strip()
    try:
        return _ejecutar_reservas_sql(db, sql_con_extra, params)
    except Exception:
        return _ejecutar_reservas_sql(db, sql_sin_extra, params)

def _row_a_reserva(row) -> dict:
    # row puede tener 14 o 16 columnas según si hay motivo_cancelacion y ajuste
    d = {
        "id_reserva": row[0], "horario": str(row[1]), "fecha": str(row[2]),
        "estado_reserva": row[3], "id_mesa": row[4], "cant_personas": row[5],
        "nombre_restaurante": row[6], "nit": row[7], "num_comensales": row[8],
        "cliente_nombre": f"{row[9]} {row[10]}", "cliente_telefono": row[11] or "", "cliente_documento": row[12]
    }
    if len(row) >= 15:
        d["motivo_cancelacion"] = row[13]
        d["ajuste"] = row[14]
    else:
        d["motivo_cancelacion"] = None
        d["ajuste"] = None
    return d

def _reservas_por_documento(db: Session, documento_dueno: int, limit: int = 50) -> list:
    limit_clause = f"LIMIT {limit}" if limit else ""
    sql_con_extra = text(f"""
        SELECT 
            r.id_reserva, r.horario, r.fecha, r.estado_reserva,
            m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
            r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente,
            r.motivo_cancelacion, r.ajuste
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        INNER JOIN "Usuario" c ON r.documento = c.documento
        WHERE rest.documento = :documento_dueno
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    sql_sin_extra = text(f"""
        SELECT 
            r.id_reserva, r.horario, r.fecha, r.estado_reserva,
            m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
            r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        INNER JOIN "Usuario" c ON r.documento = c.documento
        WHERE rest.documento = :documento_dueno
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    try:
        rows = db.execute(sql_con_extra, {"documento_dueno": documento_dueno}).fetchall()
    except Exception:
        rows = db.execute(sql_sin_extra, {"documento_dueno": documento_dueno}).fetchall()
    return [_row_a_reserva(row) for row in rows]


def _reservas_confirmadas_por_documento(db: Session, documento_dueno: int, limit: int = 200) -> list:
    """Reservas con estado 'confirmada' de todos los restaurantes del dueño."""
    limit_clause = f"LIMIT {limit}" if limit else ""
    sql_con_extra = text(f"""
        SELECT 
            r.id_reserva, r.horario, r.fecha, r.estado_reserva,
            m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
            r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente,
            r.motivo_cancelacion, r.ajuste
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        INNER JOIN "Usuario" c ON r.documento = c.documento
        WHERE rest.documento = :documento_dueno AND LOWER(TRIM(r.estado_reserva)) = 'confirmada'
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    sql_sin_extra = text(f"""
        SELECT 
            r.id_reserva, r.horario, r.fecha, r.estado_reserva,
            m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
            r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        INNER JOIN "Usuario" c ON r.documento = c.documento
        WHERE rest.documento = :documento_dueno AND LOWER(TRIM(r.estado_reserva)) = 'confirmada'
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    try:
        rows = db.execute(sql_con_extra, {"documento_dueno": documento_dueno}).fetchall()
    except Exception:
        rows = db.execute(sql_sin_extra, {"documento_dueno": documento_dueno}).fetchall()
    return [_row_a_reserva(row) for row in rows]


def obtener_reservas_confirmadas_dueno(id_credencial: int, db: Session, limit: int = 200) -> list:
    """Reservas aceptadas (confirmadas) de todos los restaurantes del dueño."""
    documento_dueno = obtener_documento_dueno(id_credencial, db)
    return _reservas_confirmadas_por_documento(db, documento_dueno, limit)


def obtener_reservas_gestor(id_credencial: int, db: Session, limit: int = 50) -> list:
    """Reservas para dueño (todos sus restaurantes) o administrador (solo su restaurante)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return _reservas_por_documento(db, ctx["documento"], limit)
    return obtener_reservas_por_nit(ctx["nit"], db, limit)

def obtener_nit_por_reserva(id_reserva: int, db: Session) -> int | None:
    """Obtiene el NIT del restaurante al que pertenece la reserva."""
    row = db.execute(
        text("""
            SELECT m.nit FROM "Reserva" r
            INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            WHERE r.id_reserva = :id_reserva
        """),
        {"id_reserva": id_reserva},
    ).fetchone()
    return int(row[0]) if row else None

def obtener_email_cliente_por_reserva(id_reserva: int, db: Session) -> str | None:
    """Obtiene el email del cliente que hizo la reserva (para notificaciones)."""
    row = db.execute(
        text("""
            SELECT cred.email FROM "Reserva" r
            INNER JOIN "Usuario" u ON r.documento = u.documento
            INNER JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
            WHERE r.id_reserva = :id_reserva
        """),
        {"id_reserva": id_reserva},
    ).fetchone()
    return row[0] if row and row[0] else None

def actualizar_motivo_cancelacion(db: Session, id_reserva: int, motivo: str) -> None:
    """Guarda el motivo de cancelación en la reserva."""
    db.execute(
        text('UPDATE "Reserva" SET motivo_cancelacion = :motivo WHERE id_reserva = :id_reserva'),
        {"motivo": motivo, "id_reserva": id_reserva},
    )
    db.commit()

def obtener_restaurantes_gestor(id_credencial: int, db: Session) -> list:
    """Lista de restaurantes que gestiona el usuario (dueño: todos; administrador: uno)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        sql = text("""
            SELECT nit, nombre_restaurante, COALESCE(url_image, '') as url_image,
                   COALESCE(rating, 0) as rating
            FROM "Restaurante" WHERE documento = :documento
        """)
        rows = db.execute(sql, {"documento": ctx["documento"]}).fetchall()
    else:
        sql = text("""
            SELECT nit, nombre_restaurante, COALESCE(url_image, '') as url_image,
                   COALESCE(rating, 0) as rating
            FROM "Restaurante" WHERE nit = :nit
        """)
        rows = db.execute(sql, {"nit": ctx["nit"]}).fetchall()
    return [
        {"nit": r[0], "nombre_restaurante": r[1], "url_image": r[2] or "", "rating": float(r[3]) if r[3] is not None else 0}
        for r in rows
    ]


def es_dueño_de_restaurante(id_credencial: int, nit: int, db: Session) -> bool:
    """True solo si el usuario es dueño y ese restaurante es suyo (Restaurante.documento = dueño.documento)."""
    try:
        doc = obtener_documento_dueno(id_credencial, db)
        row = db.execute(
            text('SELECT 1 FROM "Restaurante" WHERE nit = :nit AND documento = :doc'),
            {"nit": nit, "doc": doc},
        ).fetchone()
        return row is not None
    except HTTPException:
        return False


def obtener_restaurante_completo_dueno(id_credencial: int, nit: int, db: Session) -> dict | None:
    """Detalle completo del restaurante para edición (solo dueño, solo sus restaurantes). Incluye id_categoria, url_image, imagenes_referencia."""
    if not es_dueño_de_restaurante(id_credencial, nit, db):
        return None
    row = db.execute(
        text("""
            SELECT r.nit, r.direccion, r.nombre_restaurante, r.descripcion_restaurante,
                   r.horario_apertura, r.horario_cierre, r.documento, r.id_categoria,
                   COALESCE(r.url_image, '') as url_image,
                   COALESCE(r.min_anticipacion_horas, 0) AS min_anticipacion_horas
            FROM "Restaurante" r WHERE r.nit = :nit
        """),
        {"nit": nit},
    ).fetchone()
    if not row:
        return None
    imagenes = []
    try:
        ref_rows = db.execute(
            text('SELECT url_imagen FROM "Imagen_referencia_restaurante" WHERE nit = :nit ORDER BY orden'),
            {"nit": nit},
        ).fetchall()
        imagenes = [r[0] for r in ref_rows]
    except Exception:
        pass
    return {
        "nit": row[0],
        "direccion": row[1],
        "nombre_restaurante": row[2],
        "descripcion_restaurante": row[3],
        "horario_apertura": str(row[4]) if row[4] else "",
        "horario_cierre": str(row[5]) if row[5] else "",
        "documento": row[6],
        "id_categoria": row[7],
        "url_image": row[8] or "",
        "min_anticipacion_horas": int(row[9]) if row[9] is not None else 0,
        "imagenes_referencia": imagenes,
    }


def obtener_mesas_restaurante_dueno(id_credencial: int, nit: int, db: Session) -> list:
    """Mesas del restaurante (solo dueño, solo sus restaurantes)."""
    if not es_dueño_de_restaurante(id_credencial, nit, db):
        return []
    rows = db.execute(
        text('SELECT id_mesa, estado_de_disponibilidad, cant_personas, nit, precio FROM "Mesas" WHERE nit = :nit'),
        {"nit": nit},
    ).fetchall()
    return [
        {"id_mesa": r[0], "estado_de_disponibilidad": r[1], "cant_personas": r[2], "nit": r[3], "precio": float(r[4]) if r[4] else 0}
        for r in rows
    ]


def obtener_mesas_restaurante_gestor(id_credencial: int, nit: int, db: Session) -> list:
    """Mesas del restaurante (dueño, administrador o empleado con acceso). Solo lectura."""
    if not puede_acceder_restaurante(id_credencial, nit, db):
        return []
    rows = db.execute(
        text('SELECT id_mesa, estado_de_disponibilidad, cant_personas, nit, precio FROM "Mesas" WHERE nit = :nit'),
        {"nit": nit},
    ).fetchall()
    return [
        {"id_mesa": r[0], "estado_de_disponibilidad": r[1], "cant_personas": r[2], "nit": r[3], "precio": float(r[4]) if r[4] else 0}
        for r in rows
    ]


def obtener_flujo_diario_gestor(id_credencial: int, db: Session) -> list:
    """Flujo diario: Reservas de hoy agrupadas por hora. Dueño/Admin."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        where_clause = "rest.documento = :doc"
        params = {"doc": ctx["documento"]}
    else:
        where_clause = "rest.nit = :nit"
        params = {"nit": ctx["nit"]}
    sql = text(f"""
        SELECT TO_CHAR(r.horario, 'HH24:00') AS hora,
               COALESCE(SUM(r.num_comensales), 0)::INT AS customers,
               COUNT(r.id_reserva)::INT AS reservations
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        WHERE r.fecha = CURRENT_DATE AND {where_clause}
        GROUP BY TO_CHAR(r.horario, 'HH24:00')
        ORDER BY hora
    """)
    rows = db.execute(sql, params).fetchall()
    return [
        {"hour": row[0], "customers": row[1], "reservations": row[2], "walkIns": 0}
        for row in rows
    ]


def obtener_metricas_mensuales_gestor(id_credencial: int, db: Session) -> list:
    """Métricas mensuales para MonthlyChart. Dueño/Admin. Fallback si Calculos_mensuales vacío."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    MESES = ("", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic")
    if ctx["tipo"] == "dueno":
        sql_cal = text("""
            SELECT c.mes, c.anio, c.total_reservas, c.revenue, c.total_clientes
            FROM "Calculos_mensuales" c
            INNER JOIN "Restaurante" r ON c.nit = r.nit
            WHERE r.documento = :doc
            ORDER BY c.anio, c.mes
        """)
        sql_fallback = text("""
            SELECT EXTRACT(MONTH FROM r.fecha)::INT AS mes, EXTRACT(YEAR FROM r.fecha)::INT AS anio,
                   COUNT(r.id_reserva)::INT AS total_reservas,
                   COALESCE(SUM(ef.precio_total), 0)::DECIMAL AS revenue,
                   COUNT(DISTINCT r.documento)::INT AS total_clientes
            FROM "Reserva" r
            INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            INNER JOIN "Restaurante" rest ON m.nit = rest.nit
            LEFT JOIN "Encabezado_Factura" ef ON r.id_encab_fact = ef.id_encab_fact
            WHERE rest.documento = :doc AND r.fecha >= CURRENT_DATE - INTERVAL '24 months'
            GROUP BY EXTRACT(MONTH FROM r.fecha), EXTRACT(YEAR FROM r.fecha)
            ORDER BY anio, mes
        """)
        params = {"doc": ctx["documento"]}
    else:
        sql_cal = text("""
            SELECT mes, anio, total_reservas, revenue, total_clientes
            FROM "Calculos_mensuales" WHERE nit = :nit
            ORDER BY anio, mes
        """)
        sql_fallback = text("""
            SELECT EXTRACT(MONTH FROM r.fecha)::INT AS mes, EXTRACT(YEAR FROM r.fecha)::INT AS anio,
                   COUNT(r.id_reserva)::INT AS total_reservas,
                   COALESCE(SUM(ef.precio_total), 0)::DECIMAL AS revenue,
                   COUNT(DISTINCT r.documento)::INT AS total_clientes
            FROM "Reserva" r
            INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            LEFT JOIN "Encabezado_Factura" ef ON r.id_encab_fact = ef.id_encab_fact
            WHERE m.nit = :nit AND r.fecha >= CURRENT_DATE - INTERVAL '24 months'
            GROUP BY EXTRACT(MONTH FROM r.fecha), EXTRACT(YEAR FROM r.fecha)
            ORDER BY anio, mes
        """)
        params = {"nit": ctx["nit"]}
    rows = db.execute(sql_cal, params).fetchall()
    if not rows:
        rows = db.execute(sql_fallback, params).fetchall()
    return [
        {
            "month": f"{MESES[int(row[0])]} {int(row[1])}",
            "visitors": int(row[4]) if len(row) > 4 else int(row[2]),
            "reservations": int(row[2]),
            "revenue": float(row[3]) if row[3] else 0,
        }
        for row in rows
    ]


def obtener_mi_balance_empleado(id_credencial: int, db: Session) -> dict:
    """Facturas del empleado (id_credencial_empleado). Solo empleado."""
    rows = db.execute(
        text("""
            SELECT ef.id_encab_fact, ef.nit, ef.nombre_restaurante,
                   COALESCE(ef.precio_total, 0)::float, ef.fecha::text
            FROM "Encabezado_Factura" ef
            WHERE ef.id_credencial_empleado = :id_credencial
            ORDER BY ef.fecha DESC, ef.id_encab_fact DESC
            LIMIT 100
        """),
        {"id_credencial": id_credencial},
    ).fetchall()
    facturas = [
        {"id_encab_fact": r[0], "nit": r[1], "nombre_restaurante": r[2], "precio_total": float(r[3]), "fecha": str(r[4])}
        for r in rows
    ]
    total = sum(f["precio_total"] for f in facturas)
    return {"total": total, "facturas": facturas}


def obtener_clientes_gestor(id_credencial: int, db: Session) -> list:
    """Clientes (rol cliente) con reservas en restaurantes del gestor."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        sql = text("""
            SELECT u.documento, u.nombre, u.apellido, cred.email,
                   COUNT(r.id_reserva)::INT AS total_reservas,
                   MAX(r.fecha)::text AS ultima_visita
            FROM "Usuario" u
            JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
            JOIN "Roles" rol ON u.id_rol = rol.id_rol
            JOIN "Reserva" r ON r.documento = u.documento
            JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            JOIN "Restaurante" rest ON m.nit = rest.nit
            WHERE LOWER(TRIM(rol.nombre_rol)) = 'cliente' AND rest.documento = :doc
            GROUP BY u.documento, u.nombre, u.apellido, cred.email
            ORDER BY total_reservas DESC
        """)
        params = {"doc": ctx["documento"]}
    else:
        sql = text("""
            SELECT u.documento, u.nombre, u.apellido, cred.email,
                   COUNT(r.id_reserva)::INT AS total_reservas,
                   MAX(r.fecha)::text AS ultima_visita
            FROM "Usuario" u
            JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
            JOIN "Roles" rol ON u.id_rol = rol.id_rol
            JOIN "Reserva" r ON r.documento = u.documento
            JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            WHERE LOWER(TRIM(rol.nombre_rol)) = 'cliente' AND m.nit = :nit
            GROUP BY u.documento, u.nombre, u.apellido, cred.email
            ORDER BY total_reservas DESC
        """)
        params = {"nit": ctx["nit"]}
    rows = db.execute(sql, params).fetchall()
    return [
        {
            "documento": r[0], "nombre": f"{r[1]} {r[2]}", "email": r[3] or "",
            "total_reservas": r[4], "ultima_visita": str(r[5]) if r[5] else ""
        }
        for r in rows
    ]


def obtener_mi_restaurante_info(id_credencial: int, db: Session) -> dict | None:
    """Info básica del restaurante del empleado/admin."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return None
    row = db.execute(
        text("""
            SELECT nit, nombre_restaurante, COALESCE(direccion, ''), 
                   COALESCE(horario_apertura, ''), COALESCE(horario_cierre, ''),
                   COALESCE(url_image, '')
            FROM "Restaurante" WHERE nit = :nit
        """),
        {"nit": ctx["nit"]},
    ).fetchone()
    if not row:
        return None
    return {
        "nit": row[0], "nombre_restaurante": row[1], "direccion": row[2] or "",
        "horario_apertura": str(row[3]) if row[3] else "", "horario_cierre": str(row[4]) if row[4] else "",
        "url_image": row[5] or "",
    }


def obtener_administrador_restaurante(nit: int, db: Session) -> dict | None:
    """Obtiene el único administrador asignado a este restaurante (Usuario con rol administrador y nit = X)."""
    row = db.execute(
        text("""
            SELECT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email
            FROM "Usuario" u
            JOIN "Roles" r ON u.id_rol = r.id_rol
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            WHERE LOWER(TRIM(r.nombre_rol)) = 'administrador' AND u.nit = :nit
            LIMIT 1
        """),
        {"nit": nit},
    ).fetchone()
    if not row:
        return None
    return {
        "id_credencial": row[0],
        "nombre": row[1],
        "apellido": row[2],
        "documento": row[3],
        "email": row[4],
    }


def asignar_administrador_restaurante(id_credencial_dueno: int, nit: int, id_credencial_admin: int, db: Session) -> None:
    """Asigna un único administrador al restaurante. Quita a cualquier otro admin de este restaurante (pasa a empleado sin nit)."""
    if not es_dueño_de_restaurante(id_credencial_dueno, nit, db):
        raise HTTPException(status_code=403, detail="No eres dueño de este restaurante")
    r_admin = db.execute(text("SELECT id_rol FROM \"Roles\" WHERE LOWER(TRIM(nombre_rol)) = 'administrador'")).fetchone()
    r_emp = db.execute(text("SELECT id_rol FROM \"Roles\" WHERE LOWER(TRIM(nombre_rol)) = 'empleado'")).fetchone()
    id_rol_admin = r_admin[0] if r_admin else None
    id_rol_empleado = r_emp[0] if r_emp else None
    if not id_rol_admin or not id_rol_empleado:
        raise HTTPException(status_code=500, detail="Roles no configurados")
    # Quitar a cualquier otro admin de este nit (pasarlo a empleado sin nit)
    db.execute(
        text("""
            UPDATE "Usuario" SET id_rol = :id_empleado, nit = NULL
            WHERE nit = :nit AND id_rol = :id_admin AND id_credencial != :id_new
        """),
        {"id_empleado": id_rol_empleado, "nit": nit, "id_admin": id_rol_admin, "id_new": id_credencial_admin},
    )
    # Asignar este usuario como administrador de este restaurante
    db.execute(
        text("""
            UPDATE "Usuario" SET id_rol = :id_admin, nit = :nit
            WHERE id_credencial = :id_credencial
        """),
        {"id_admin": id_rol_admin, "nit": nit, "id_credencial": id_credencial_admin},
    )
    db.commit()


def obtener_usuarios_asignables_dueno(id_credencial: int, db: Session) -> list:
    """Usuarios que el dueño puede asignar como administrador: tienen nit en alguno de sus restaurantes."""
    doc = obtener_documento_dueno(id_credencial, db)
    rows = db.execute(
        text("""
            SELECT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email, r.nombre_rol, u.nit
            FROM "Usuario" u
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            JOIN "Roles" r ON r.id_rol = u.id_rol
            WHERE u.nit IN (SELECT nit FROM "Restaurante" WHERE documento = :doc)
            ORDER BY u.nombre, u.apellido
        """),
        {"doc": doc},
    ).fetchall()
    return [
        {
            "id_credencial": r[0],
            "nombre": r[1],
            "apellido": r[2],
            "documento": r[3],
            "email": r[4] or "",
            "nombre_rol": r[5] or "",
            "nit": r[6],
        }
        for r in rows
    ]


def obtener_empleados_con_restaurante_dueno(id_credencial: int, db: Session) -> list:
    """Empleados/admins del dueño con nombre del restaurante asignado."""
    doc = obtener_documento_dueno(id_credencial, db)
    rows = db.execute(
        text("""
            SELECT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email, r.nombre_rol, u.nit, rest.nombre_restaurante
            FROM "Usuario" u
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            JOIN "Roles" r ON r.id_rol = u.id_rol
            JOIN "Restaurante" rest ON rest.nit = u.nit
            WHERE u.nit IN (SELECT nit FROM "Restaurante" WHERE documento = :doc)
            ORDER BY rest.nombre_restaurante, u.nombre, u.apellido
        """),
        {"doc": doc},
    ).fetchall()
    return [
        {
            "id_credencial": r[0],
            "nombre": r[1],
            "apellido": r[2],
            "documento": r[3],
            "email": r[4] or "",
            "nombre_rol": r[5] or "",
            "nit": r[6],
            "nombre_restaurante": r[7] or "",
        }
        for r in rows
    ]


def buscar_email_para_empleado(email: str, db: Session) -> dict:
    """Si el email existe en Credenciales, devuelve existe=True e id_credencial, nombre, apellido. Si no, existe=False."""
    if not email or not email.strip():
        return {"existe": False}
    email = email.strip().lower()
    row = db.execute(
        text("""
            SELECT c.id_credencial, u.nombre, u.apellido
            FROM "Credenciales" c
            LEFT JOIN "Usuario" u ON u.id_credencial = c.id_credencial
            WHERE LOWER(TRIM(c.email)) = :email
        """),
        {"email": email},
    ).fetchone()
    if not row:
        return {"existe": False}
    return {
        "existe": True,
        "id_credencial": row[0],
        "nombre": row[1] or "",
        "apellido": row[2] or "",
    }


def _usuario_es_empleado_o_admin_del_dueno(id_credencial: int, id_credencial_dueno: int, db: Session) -> bool:
    """Verifica si el usuario es empleado o administrador en alguno de los restaurantes del dueño."""
    doc = obtener_documento_dueno(id_credencial_dueno, db)
    row = db.execute(
        text("""
            SELECT 1 FROM "Usuario" u
            JOIN "Roles" r ON u.id_rol = r.id_rol
            WHERE u.id_credencial = :id_credencial
              AND LOWER(TRIM(r.nombre_rol)) IN ('empleado', 'administrador')
              AND u.nit IN (SELECT nit FROM "Restaurante" WHERE documento = :doc)
        """),
        {"id_credencial": id_credencial, "doc": doc},
    ).fetchone()
    return row is not None


def cambiar_rol_a_cliente(id_credencial_gestor: int, id_credencial: int, db: Session) -> None:
    """
    Cambia el rol de un empleado o administrador a cliente.
    - Dueño: puede cambiar empleados/admins de cualquiera de sus restaurantes.
    - Administrador: puede cambiar empleados/admins de su restaurante asignado.
    """
    ctx = obtener_contexto_gestor(id_credencial_gestor, db)

    # Verificar que el objetivo sea empleado/administrador del ámbito del gestor
    if ctx["tipo"] == "dueno":
        # Mantener la validación existente basada en dueño
        obtener_documento_dueno(id_credencial_gestor, db)
        if not _usuario_es_empleado_o_admin_del_dueno(id_credencial, id_credencial_gestor, db):
            raise HTTPException(
                status_code=403,
                detail="Solo puedes cambiar a cliente a empleados o administradores de tus restaurantes.",
            )
    elif ctx["tipo"] == "administrador" and ctx.get("nit") is not None:
        # Administrador: solo empleados/admins de su NIT
        nit_admin = int(ctx["nit"])
        fila = db.execute(
            text(
                """
                SELECT 1
                FROM "Usuario" u
                JOIN "Roles" r ON u.id_rol = r.id_rol
                WHERE u.id_credencial = :id_credencial
                  AND u.nit = :nit
                  AND LOWER(TRIM(r.nombre_rol)) IN ('empleado', 'administrador')
                """
            ),
            {"id_credencial": id_credencial, "nit": nit_admin},
        ).fetchone()
        if not fila:
            raise HTTPException(
                status_code=403,
                detail="Solo puedes cambiar a cliente a empleados o administradores de tu restaurante.",
            )
    else:
        raise HTTPException(status_code=403, detail="No tienes permisos para cambiar roles a cliente.")

    # Aplicar cambio a rol cliente (común para dueño y admin)
    r_cliente = db.execute(
        text('SELECT id_rol FROM "Roles" WHERE LOWER(TRIM(nombre_rol)) = \'cliente\''),
    ).fetchone()
    if not r_cliente:
        raise HTTPException(status_code=500, detail="Rol cliente no configurado.")
    db.execute(
        text('UPDATE "Usuario" SET id_rol = :id_rol, nit = NULL WHERE id_credencial = :id_credencial'),
        {"id_rol": r_cliente[0], "id_credencial": id_credencial},
    )
    db.commit()


def asignar_empleado_existente(id_credencial_dueno: int, id_credencial: int, nit: int, db: Session) -> None:
    """Asigna un usuario existente como empleado del restaurante (solo dueño, solo sus restaurantes)."""
    if not es_dueño_de_restaurante(id_credencial_dueno, nit, db):
        raise HTTPException(status_code=403, detail="No eres dueño de este restaurante.")
    r_emp = db.execute(text("SELECT id_rol FROM \"Roles\" WHERE LOWER(TRIM(nombre_rol)) = 'empleado'")).fetchone()
    id_rol_empleado = r_emp[0] if r_emp else None
    if not id_rol_empleado:
        raise HTTPException(status_code=500, detail="Rol empleado no configurado.")
    db.execute(
        text("""
            UPDATE "Usuario" SET id_rol = :id_rol, nit = :nit
            WHERE id_credencial = :id_credencial
        """),
        {"id_rol": id_rol_empleado, "nit": nit, "id_credencial": id_credencial},
    )
    db.commit()


def _generar_password_aleatorio(longitud: int = 12) -> str:
    alfabeto = string.ascii_letters + string.digits + "!@#$%&*"
    return "".join(secrets.choice(alfabeto) for _ in range(longitud))


def crear_empleado_invitado(
    id_credencial_dueno: int, email: str, nit: int, db: Session
) -> dict:
    """
    Crea credencial + usuario empleado para el restaurante (solo dueño).
    Genera contraseña aleatoria. Devuelve email y password en claro para mostrarla al dueño.
    """
    if not es_dueño_de_restaurante(id_credencial_dueno, nit, db):
        raise HTTPException(status_code=403, detail="No eres dueño de este restaurante.")
    if not validar_formato_email(email):
        raise HTTPException(status_code=400, detail="El formato del email no es válido.")
    email = email.strip().lower()
    existe = db.execute(
        text('SELECT 1 FROM "Credenciales" WHERE LOWER(TRIM(email)) = :email'),
        {"email": email},
    ).fetchone()
    if existe:
        raise HTTPException(status_code=400, detail="Ese correo ya está registrado.")
    r_emp = db.execute(text("SELECT id_rol FROM \"Roles\" WHERE LOWER(TRIM(nombre_rol)) = 'empleado'")).fetchone()
    id_rol_empleado = r_emp[0] if r_emp else None
    if not id_rol_empleado:
        raise HTTPException(status_code=500, detail="Rol empleado no configurado.")
    password_plano = _generar_password_aleatorio()
    password_hash = hash_password(password_plano)
    r = db.execute(
        text('INSERT INTO "Credenciales" (email, password) VALUES (:email, :password) RETURNING id_credencial'),
        {"email": email, "password": password_hash},
    )
    id_credencial = r.scalar()
    nombre_desde_email = email.split("@")[0].replace(".", " ").strip() or "Empleado"
    db.execute(
        text("""
            INSERT INTO "Usuario" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit)
            VALUES (:id_credencial, :nombre, :apellido, :tipo_doc, :documento, :nacionalidad, :telefono, :id_rol, :nit)
        """),
        {
            "id_credencial": id_credencial,
            "nombre": nombre_desde_email[:50],
            "apellido": "Empleado",
            "tipo_doc": "CC",
            "documento": id_credencial,
            "nacionalidad": "",
            "telefono": "",
            "id_rol": id_rol_empleado,
            "nit": nit,
        },
    )
    db.commit()
    return {"email": email, "password": password_plano, "id_credencial": id_credencial}
