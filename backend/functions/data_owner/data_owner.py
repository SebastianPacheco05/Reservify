import secrets
import string
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException
from functions.register.register import hash_password, validar_formato_email

_NIT_MIN_EMPLEADO = 8999999990
_NIT_MAX_EMPLEADO = 99999999999

# Tipo: "dueno" | "administrador" | "empleado".
# Dueño tiene documento; empleado mantiene nit único; administrador gestiona nits/restaurantes por tabla puente.
def obtener_contexto_gestor(id_credencial: int, db: Session) -> dict:
    """
    Obtiene el contexto del usuario gestor (dueño, administrador o empleado).
    Retorna {"tipo": "dueno", "documento": int} o {"tipo": "administrador"|"empleado", "nit": int}.
    """
    row = None
    try:
        row = db.execute(
            text("SELECT documento, nit, rol FROM fn_do_obtener_contexto_gestor(:id_credencial)"),
            {"id_credencial": id_credencial},
        ).fetchone()
    except SQLAlchemyError:
        # Fallback: evita caída total si la función SQL no está sincronizada en BD.
        db.rollback()
        row = db.execute(
            text(
                """
                SELECT u.documento, u.nit, LOWER(TRIM(r.nombre_rol)) AS rol
                FROM "Usuario" u
                JOIN "Roles" r ON u.id_rol = r.id_rol
                WHERE u.id_credencial = :id_credencial
                LIMIT 1
                """
            ),
            {"id_credencial": id_credencial},
        ).fetchone()
    if not row:
        raise HTTPException(status_code=403, detail="Usuario no encontrado")
    rol_raw = (row[2] or "").strip().lower()
    rol = rol_raw.replace("dueño", "dueno").replace("duenio", "dueno")
    doc, nit = row[0], row[1]
    if rol == "dueno":
        return {"tipo": "dueno", "documento": doc}
    if rol == "administrador":
        filas_admin = db.execute(
            text(
                """
                SELECT r.nit, r.restaurante_uid
                FROM "Administrador_restaurante" ar
                JOIN "Restaurante" r ON r.restaurante_uid = ar.restaurante_uid
                WHERE ar.id_credencial = :id_credencial
                ORDER BY r.nit
                """
            ),
            {"id_credencial": id_credencial},
        ).fetchall()
        restaurantes = [
            {
                "nit": int(f[0]),
                "restaurante_uid": str(f[1]) if f[1] is not None else "",
            }
            for f in filas_admin
            if f[0] is not None
        ]
        if not restaurantes:
            raise HTTPException(
                status_code=403,
                detail="El administrador no tiene restaurantes asignados.",
            )
        # nit se conserva por compatibilidad con lógica existente (primer restaurante).
        return {"tipo": "administrador", "nit": restaurantes[0]["nit"], "restaurantes": restaurantes}
    if rol == "empleado" and nit is not None:
        return {"tipo": "empleado", "nit": int(nit)}
    if rol == "administrador":
        raise HTTPException(status_code=403, detail="El administrador no tiene restaurantes asignados.")
    raise HTTPException(status_code=403, detail="No tiene permisos de dueño, administrador ni empleado")


def _nits_gestor(ctx: dict) -> list[int]:
    if ctx["tipo"] == "dueno":
        return []
    if ctx["tipo"] == "administrador":
        return [
            int(r["nit"])
            for r in ctx.get("restaurantes", [])
            if r.get("nit") is not None
        ]
    if ctx["tipo"] == "empleado" and ctx.get("nit") is not None:
        return [int(ctx["nit"])]
    return []

def obtener_documento_dueno(id_credencial: int, db: Session) -> int:
    """Obtiene el documento del usuario con rol dueño basado en su id_credencial"""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] != "dueno":
        raise HTTPException(status_code=403, detail="No tiene permisos de dueño")
    return ctx["documento"]

def obtener_estadisticas_restaurante(nit: int, db: Session) -> dict:
    """Estadísticas de un solo restaurante (para administrador)."""
    sql = text(
        "SELECT total_restaurantes, reservas_activas, visitantes_mes, total_reservas_mes, revenue_mes, total_clientes_mes "
        "FROM obtener_estadisticas_restaurante(:nit)"
    )
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
    sql = text(
        "SELECT total_restaurantes, reservas_activas, visitantes_mes, total_reservas_mes, revenue_mes, total_clientes_mes "
        "FROM obtener_estadisticas_dueno(:documento)"
    )
    result = db.execute(sql, {"documento": documento_dueno}).fetchone()
    if result:
        return {
            "total_restaurantes": result[0],
            "reservas_activas": result[1],
            "revenue_mes": float(result[4]) if result[4] is not None else 0.0
        }
    return {"total_restaurantes": 0, "reservas_activas": 0, "revenue_mes": 0.0}

def obtener_estadisticas_gestor(id_credencial: int, db: Session) -> dict:
    """Métricas para dueño (todos sus restaurantes) o admin/empleado (restaurantes con acceso)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return obtener_estadisticas_dueno(id_credencial, db)
    nits = _nits_gestor(ctx)
    if not nits:
        return {"total_restaurantes": 0, "reservas_activas": 0, "revenue_mes": 0.0}
    sql = text("""
        SELECT
            COUNT(DISTINCT rest.nit) AS total_restaurantes,
            COALESCE(SUM(CASE
                WHEN LOWER(TRIM(r.estado_reserva)) IN ('pendiente','confirmada','en curso')
                THEN 1 ELSE 0
            END), 0)::INT AS reservas_activas,
            COALESCE(SUM(CASE
                WHEN EXTRACT(MONTH FROM r.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
                 AND EXTRACT(YEAR FROM r.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
                THEN ef.precio_total ELSE 0
            END), 0)::float AS revenue_mes
        FROM "Restaurante" rest
        LEFT JOIN "Mesas" m ON m.nit = rest.nit
        LEFT JOIN "Reserva" r ON r.id_mesa = m.id_mesa
        LEFT JOIN "Encabezado_Factura" ef ON ef.id_encab_fact = r.id_encab_fact
        WHERE rest.nit = ANY(:nits)
    """)
    row = db.execute(sql, {"nits": nits}).fetchone()
    return {
        "total_restaurantes": int(row[0]) if row and row[0] is not None else 0,
        "reservas_activas": int(row[1]) if row and row[1] is not None else 0,
        "revenue_mes": float(row[2]) if row and row[2] is not None else 0.0,
    }

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
            FROM "Encabezado_Factura" ef
            INNER JOIN "Restaurante" r ON ef.nit = r.nit
            WHERE r.documento = :documento_dueno
            ORDER BY ef.fecha DESC, ef.id_encab_fact DESC
            LIMIT :limit_val
        """)
        rows = db.execute(sql, {"documento_dueno": ctx["documento"], "limit_val": limit_val}).fetchall()
    else:
        nits = _nits_gestor(ctx)
        if not nits:
            return []
        sql = text("""
            SELECT ef.id_encab_fact, ef.nit, ef.nombre_restaurante,
                   COALESCE(ef.precio_total, 0)::float as precio_total,
                   ef.fecha::text, COALESCE(ef.forma_pago, 'Pendiente') as forma_pago, ef.documento
            FROM "Encabezado_Factura" ef
            WHERE ef.nit = ANY(:nits)
            ORDER BY ef.fecha DESC, ef.id_encab_fact DESC
            LIMIT :limit_val
        """)
        rows = db.execute(sql, {"nits": nits, "limit_val": limit_val}).fetchall()
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
        text('SELECT nit FROM "Encabezado_Factura" WHERE id_encab_fact = :id'),
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
            FROM "Encabezado_Factura" WHERE id_encab_fact = :id
        """),
        {"id": id_encab_fact},
    ).fetchone()
    if not enc:
        return None
    detalles = db.execute(
        text("""
            SELECT id_det_fact, descripcion, unidades, precio_unitario, precio_total, forma_pago
            FROM "Detalle_Factura" WHERE id_encab_fact = :id
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
            FROM "Encabezado_Factura" WHERE id_encab_fact = :id
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
            FROM "Detalle_Factura" WHERE id_encab_fact = :id
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
    if ctx["tipo"] == "administrador":
        return int(nit) in _nits_gestor(ctx)
    if ctx["tipo"] == "empleado":
        return ctx.get("nit") == nit
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
    nits = _nits_gestor(ctx)
    if not nits:
        return []
    if len(nits) == 1:
        return obtener_reservas_por_nit(nits[0], db, limit)
    limit_clause = f" LIMIT {min(int(limit), 500)}" if limit else ""
    sql = f"""
        {_SQL_RESERVAS_BASE.replace(
            "documento_cliente",
            f"documento_cliente{_SQL_RESERVAS_EXTRA_COLS}",
            1,
        )}
        WHERE rest.nit = ANY(:nits)
        {_SQL_RESERVAS_ORDER}
        {limit_clause}
    """
    rows = db.execute(text(sql), {"nits": nits}).fetchall()
    return [_row_a_reserva(row) for row in rows]

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
        text("SELECT fn_do_actualizar_motivo_cancelacion(:id_reserva, :motivo)"),
        {"motivo": motivo, "id_reserva": id_reserva},
    )
    db.commit()

def obtener_restaurantes_gestor(id_credencial: int, db: Session) -> list:
    """Lista de restaurantes que gestiona el usuario (dueño: todos; administrador: uno)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        sql = text("""
            SELECT restaurante_uid, nit, nombre_restaurante, COALESCE(url_image, '') as url_image,
                   COALESCE(rating, 0) as rating
            FROM "Restaurante" WHERE documento = :documento
        """)
        rows = db.execute(sql, {"documento": ctx["documento"]}).fetchall()
    else:
        nits = _nits_gestor(ctx)
        if not nits:
            return []
        sql = text("""
            SELECT restaurante_uid, nit, nombre_restaurante, COALESCE(url_image, '') as url_image,
                   COALESCE(rating, 0) as rating
            FROM "Restaurante" WHERE nit = ANY(:nits)
        """)
        rows = db.execute(sql, {"nits": nits}).fetchall()
    return [
        {
            "restaurante_uid": str(r[0]) if r[0] is not None else "",
            "nit": r[1],
            "nombre_restaurante": r[2],
            "url_image": r[3] or "",
            "rating": float(r[4]) if r[4] is not None else 0,
        }
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
            SELECT r.restaurante_uid, r.nit, r.direccion, r.nombre_restaurante, r.descripcion_restaurante,
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
        uid = row[0]
        ref_rows = db.execute(
            text(
                'SELECT url_imagen FROM "Imagen_referencia_restaurante" '
                'WHERE restaurante_uid = CAST(:restaurante_uid AS uuid) ORDER BY orden'
            ),
            {"restaurante_uid": str(uid) if uid is not None else ""},
        ).fetchall()
        imagenes = [r[0] for r in ref_rows]
    except Exception:
        pass
    return {
        "restaurante_uid": str(row[0]) if row[0] is not None else "",
        "nit": row[1],
        "direccion": row[2],
        "nombre_restaurante": row[3],
        "descripcion_restaurante": row[4],
        "horario_apertura": str(row[5]) if row[5] else "",
        "horario_cierre": str(row[6]) if row[6] else "",
        "documento": row[7],
        "id_categoria": row[8],
        "url_image": row[9] or "",
        "min_anticipacion_horas": int(row[10]) if row[10] is not None else 0,
        "imagenes_referencia": imagenes,
    }


def obtener_mesas_restaurante_dueno(id_credencial: int, nit: int, db: Session) -> list:
    """Mesas del restaurante (solo dueño, solo sus restaurantes)."""
    if not es_dueño_de_restaurante(id_credencial, nit, db):
        return []
    rows = db.execute(
        text("""
            SELECT m.id_mesa, m.estado_de_disponibilidad, m.cant_personas, m.nit, m.precio, m.descripcion
            FROM "Mesas" m
            WHERE m.nit = :nit
               OR m.restaurante_uid = (
                   SELECT r.restaurante_uid FROM "Restaurante" r WHERE r.nit = :nit LIMIT 1
               )
        """),
        {"nit": nit},
    ).fetchall()
    return [
        {
            "id_mesa": r[0],
            "estado_de_disponibilidad": r[1],
            "cant_personas": r[2],
            "nit": r[3],
            "precio": float(r[4]) if r[4] else 0,
            "descripcion": r[5] if len(r) > 5 else "sin dato",
        }
        for r in rows
    ]


def obtener_mesas_restaurante_gestor(id_credencial: int, nit: int, db: Session) -> list:
    """Mesas del restaurante (dueño, administrador o empleado con acceso). Solo lectura."""
    if not puede_acceder_restaurante(id_credencial, nit, db):
        return []
    rows = db.execute(
        text("""
            SELECT m.id_mesa, m.estado_de_disponibilidad, m.cant_personas, m.nit, m.precio, m.descripcion
            FROM "Mesas" m
            WHERE m.nit = :nit
               OR m.restaurante_uid = (
                   SELECT r.restaurante_uid FROM "Restaurante" r WHERE r.nit = :nit LIMIT 1
               )
        """),
        {"nit": nit},
    ).fetchall()
    return [
        {
            "id_mesa": r[0],
            "estado_de_disponibilidad": r[1],
            "cant_personas": r[2],
            "nit": r[3],
            "precio": float(r[4]) if r[4] else 0,
            "descripcion": r[5] if len(r) > 5 else "sin dato",
        }
        for r in rows
    ]


def obtener_flujo_diario_gestor(id_credencial: int, db: Session) -> list:
    """Flujo diario: Reservas de hoy agrupadas por hora. Dueño/Admin."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        where_clause = "rest.documento = :doc"
        params = {"doc": ctx["documento"]}
    else:
        nits = _nits_gestor(ctx)
        if not nits:
            return []
        where_clause = "rest.nit = ANY(:nits)"
        params = {"nits": nits}
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
        nits = _nits_gestor(ctx)
        if not nits:
            return []
        sql_cal = text("""
            SELECT mes, anio, total_reservas, revenue, total_clientes
            FROM "Calculos_mensuales" WHERE nit = ANY(:nits)
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
            WHERE m.nit = ANY(:nits) AND r.fecha >= CURRENT_DATE - INTERVAL '24 months'
            GROUP BY EXTRACT(MONTH FROM r.fecha), EXTRACT(YEAR FROM r.fecha)
            ORDER BY anio, mes
        """)
        params = {"nits": nits}
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
        nits = _nits_gestor(ctx)
        if not nits:
            return []
        sql = text("""
            SELECT u.documento, u.nombre, u.apellido, cred.email,
                   COUNT(r.id_reserva)::INT AS total_reservas,
                   MAX(r.fecha)::text AS ultima_visita
            FROM "Usuario" u
            JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
            JOIN "Roles" rol ON u.id_rol = rol.id_rol
            JOIN "Reserva" r ON r.documento = u.documento
            JOIN "Mesas" m ON r.id_mesa = m.id_mesa
            WHERE LOWER(TRIM(rol.nombre_rol)) = 'cliente' AND m.nit = ANY(:nits)
            GROUP BY u.documento, u.nombre, u.apellido, cred.email
            ORDER BY total_reservas DESC
        """)
        params = {"nits": nits}
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
    nits = _nits_gestor(ctx)
    if not nits:
        return None
    row = db.execute(
        text("""
            SELECT restaurante_uid, nit, nombre_restaurante, COALESCE(direccion, ''),
                   COALESCE(horario_apertura, ''), COALESCE(horario_cierre, ''),
                   COALESCE(url_image, '')
            FROM "Restaurante" WHERE nit = ANY(:nits)
            ORDER BY nit
            LIMIT 1
        """),
        {"nits": nits},
    ).fetchone()
    if not row:
        return None
    return {
        "restaurante_uid": str(row[0]) if row[0] is not None else "",
        "nit": row[1],
        "nombre_restaurante": row[2],
        "direccion": row[3] or "",
        "horario_apertura": str(row[4]) if row[4] else "",
        "horario_cierre": str(row[5]) if row[5] else "",
        "url_image": row[6] or "",
    }


def obtener_administrador_restaurante(nit: int, db: Session) -> dict | None:
    """Obtiene el único administrador asignado al restaurante (tabla puente)."""
    row = db.execute(
        text("""
            SELECT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email
            FROM "Restaurante" rest
            JOIN "Administrador_restaurante" ar ON ar.restaurante_uid = rest.restaurante_uid
            JOIN "Usuario" u ON u.id_credencial = ar.id_credencial
            JOIN "Roles" r ON u.id_rol = r.id_rol
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            WHERE LOWER(TRIM(r.nombre_rol)) = 'administrador'
              AND rest.nit = :nit
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
    db.execute(
        text("SELECT fn_do_asignar_administrador_restaurante(:nit, :id_credencial_admin)"),
        {"nit": nit, "id_credencial_admin": id_credencial_admin},
    )
    db.commit()


def obtener_usuarios_asignables_dueno(id_credencial: int, db: Session) -> list:
    """Usuarios que el dueño puede asignar como administrador en sus restaurantes."""
    doc = obtener_documento_dueno(id_credencial, db)
    rows = db.execute(
        text("""
            SELECT DISTINCT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email, r.nombre_rol, rest.nit
            FROM "Usuario" u
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            JOIN "Roles" r ON r.id_rol = u.id_rol
            LEFT JOIN "Administrador_restaurante" ar ON ar.id_credencial = u.id_credencial
            LEFT JOIN "Restaurante" rest
              ON rest.nit = u.nit
              OR rest.restaurante_uid = ar.restaurante_uid
            WHERE rest.documento = :doc
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
            SELECT DISTINCT u.id_credencial, u.nombre, u.apellido, u.documento, cred.email, r.nombre_rol, rest.nit, rest.nombre_restaurante
            FROM "Usuario" u
            JOIN "Credenciales" cred ON cred.id_credencial = u.id_credencial
            JOIN "Roles" r ON r.id_rol = u.id_rol
            LEFT JOIN "Administrador_restaurante" ar ON ar.id_credencial = u.id_credencial
            JOIN "Restaurante" rest
              ON rest.nit = u.nit
              OR rest.restaurante_uid = ar.restaurante_uid
            WHERE rest.documento = :doc
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
            LEFT JOIN "Administrador_restaurante" ar ON ar.id_credencial = u.id_credencial
            LEFT JOIN "Restaurante" rest
              ON rest.nit = u.nit
              OR rest.restaurante_uid = ar.restaurante_uid
            WHERE u.id_credencial = :id_credencial
              AND LOWER(TRIM(r.nombre_rol)) IN ('empleado', 'administrador')
              AND rest.documento = :doc
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
    elif ctx["tipo"] == "administrador":
        # Administrador: solo empleados/admins de restaurantes que administra.
        nits_admin = _nits_gestor(ctx)
        if not nits_admin:
            raise HTTPException(status_code=403, detail="No tienes restaurantes asignados.")
        fila = db.execute(
            text(
                """
                SELECT 1
                FROM "Usuario" u
                JOIN "Roles" r ON u.id_rol = r.id_rol
                LEFT JOIN "Administrador_restaurante" ar ON ar.id_credencial = u.id_credencial
                LEFT JOIN "Restaurante" rest
                  ON rest.nit = u.nit
                  OR rest.restaurante_uid = ar.restaurante_uid
                WHERE u.id_credencial = :id_credencial
                  AND rest.nit = ANY(:nits)
                  AND LOWER(TRIM(r.nombre_rol)) IN ('empleado', 'administrador')
                """
            ),
            {"id_credencial": id_credencial, "nits": nits_admin},
        ).fetchone()
        if not fila:
            raise HTTPException(
                status_code=403,
                detail="Solo puedes cambiar a cliente a empleados o administradores de tu restaurante.",
            )
    else:
        raise HTTPException(status_code=403, detail="No tienes permisos para cambiar roles a cliente.")

    # Aplicar cambio a rol cliente (común para dueño y admin) mediante función SQL
    db.execute(
        text("SELECT fn_do_cambiar_rol_a_cliente(:id_credencial)"),
        {"id_credencial": id_credencial},
    )
    db.commit()


def asignar_empleado_existente(id_credencial_gestor: int, id_credencial: int, nit: int, db: Session) -> None:
    """Asigna un usuario existente como empleado del restaurante (dueño o admin con acceso)."""
    if not puede_acceder_restaurante(id_credencial_gestor, nit, db):
        raise HTTPException(status_code=403, detail="No tienes acceso a este restaurante.")
    if nit <= _NIT_MIN_EMPLEADO - 1 or nit > _NIT_MAX_EMPLEADO:
        raise HTTPException(
            status_code=400,
            detail=(
                "El NIT del restaurante está fuera del rango permitido para asignar empleados "
                f"({_NIT_MIN_EMPLEADO}-{_NIT_MAX_EMPLEADO}). "
                "Corrige el NIT del restaurante e inténtalo de nuevo."
            ),
        )
    try:
        db.execute(
            text("SELECT fn_do_asignar_empleado_existente(:id_credencial, :nit)"),
            {"id_credencial": id_credencial, "nit": nit},
        )
        db.commit()
    except IntegrityError as e:
        db.rollback()
        msg = str(e)
        if "Usuario_nit_check" in msg or "check violation" in msg.lower():
            raise HTTPException(
                status_code=400,
                detail=(
                    "No se pudo asignar el empleado porque el NIT del restaurante "
                    "no cumple la validación de la base de datos."
                ),
            )
        raise
    except SQLAlchemyError:
        db.rollback()
        raise


def _generar_password_aleatorio(longitud: int = 12) -> str:
    alfabeto = string.ascii_letters + string.digits + "!@#$%&*"
    return "".join(secrets.choice(alfabeto) for _ in range(longitud))


def crear_empleado_invitado(
    id_credencial_gestor: int, email: str, nit: int, db: Session
) -> dict:
    """
    Crea credencial + usuario empleado para el restaurante (dueño o admin con acceso).
    Genera contraseña aleatoria. Devuelve email y password en claro para mostrarla al dueño.
    """
    try:
        if not puede_acceder_restaurante(id_credencial_gestor, nit, db):
            raise HTTPException(status_code=403, detail="No tienes acceso a este restaurante.")
        if nit <= _NIT_MIN_EMPLEADO - 1 or nit > _NIT_MAX_EMPLEADO:
            raise HTTPException(
                status_code=400,
                detail=(
                    "El NIT del restaurante está fuera del rango permitido para empleados "
                    f"({_NIT_MIN_EMPLEADO}-{_NIT_MAX_EMPLEADO}). "
                    "Corrige el NIT del restaurante e inténtalo de nuevo."
                ),
            )
        if not validar_formato_email(email):
            raise HTTPException(status_code=400, detail="El formato del email no es válido.")
        email = email.strip().lower()

        # Verificar existencia de email mediante función SQL
        row = db.execute(
            text("SELECT fn_do_email_credencial_existe(:email)"),
            {"email": email},
        ).fetchone()
        if row and row[0]:
            raise HTTPException(status_code=400, detail="Ese correo ya está registrado.")

        password_plano = _generar_password_aleatorio()
        password_hash = hash_password(password_plano)
        nombre_desde_email = email.split("@")[0].replace(".", " ").strip() or "Empleado"

        # TODO: cuando el flujo incluya teléfono/documento del empleado, pasarlos aquí
        row_new = db.execute(
            text(
                """
                SELECT fn_do_crear_empleado_invitado(
                    :email,
                    :password_hash,
                    :nit,
                    :nombre,
                    :apellido,
                    :tipo_doc,
                    :documento,
                    :nacionalidad,
                    :telefono
                )
                """
            ),
            {
                "email": email,
                "password_hash": password_hash,
                "nit": nit,
                "nombre": nombre_desde_email[:50],
                "apellido": "Empleado",
                "tipo_doc": "CC",
                "documento": 0,
                "nacionalidad": "",
                "telefono": "",
            },
        ).fetchone()
        id_credencial = int(row_new[0]) if row_new and row_new[0] is not None else None
        db.commit()
        return {"email": email, "password": password_plano, "id_credencial": id_credencial}

    except IntegrityError as e:
        db.rollback()
        msg = str(e)
        # Documento duplicado
        if "Usuario_pkey" in msg:
            raise HTTPException(
                status_code=400,
                detail="Este documento ya existe en nuestro sistema.",
            )
        # Teléfono duplicado (si hay restricción UNIQUE)
        if "Usuario_telefono_key" in msg or "usuario_telefono_key" in msg:
            raise HTTPException(
                status_code=400,
                detail="Este teléfono ya existe en nuestro sistema.",
            )
        # Email duplicado (único en Credenciales)
        if "Credenciales_email_key" in msg or "credenciales_email_key" in msg:
            raise HTTPException(
                status_code=400,
                detail="Este correo ya existe en nuestro sistema.",
            )
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el empleado invitado por un problema de integridad de datos.",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error de base de datos al crear el empleado invitado.",
        )
