from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

# Tipo: "dueno" | "administrador". Dueño tiene documento, administrador tiene nit (un solo restaurante).
def obtener_contexto_gestor(id_credencial: int, db: Session) -> dict:
    """
    Obtiene el contexto del usuario gestor (dueño o administrador).
    Retorna {"tipo": "dueno", "documento": int} o {"tipo": "administrador", "nit": int}.
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
    if rol == "administrador":
        raise HTTPException(status_code=403, detail="El administrador debe tener un restaurante asignado (nit)")
    raise HTTPException(status_code=403, detail="No tiene permisos de dueño ni administrador")

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

def obtener_reservas_por_nit(nit: int, db: Session, limit: int = 50) -> list:
    """Reservas de un solo restaurante (para administrador)."""
    limit_clause = f"LIMIT {limit}" if limit else ""
    sql = text(f"""
        SELECT 
            r.id_reserva, r.horario, r.fecha, r.estado_reserva,
            m.id_mesa, m.cant_personas, rest.nombre_restaurante, rest.nit,
            r.num_comensales, c.nombre, c.apellido, c.telefono, c.documento as documento_cliente
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m.nit = rest.nit
        INNER JOIN "Usuario" c ON r.documento = c.documento
        WHERE rest.nit = :nit
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    rows = db.execute(sql, {"nit": nit}).fetchall()
    return [_row_a_reserva(row) for row in rows]

def _row_a_reserva(row) -> dict:
    return {
        "id_reserva": row[0], "horario": str(row[1]), "fecha": str(row[2]),
        "estado_reserva": row[3], "id_mesa": row[4], "cant_personas": row[5],
        "nombre_restaurante": row[6], "nit": row[7], "num_comensales": row[8],
        "cliente_nombre": f"{row[9]} {row[10]}", "cliente_telefono": row[11], "cliente_documento": row[12]
    }

def _reservas_por_documento(db: Session, documento_dueno: int, limit: int = 50) -> list:
    limit_clause = f"LIMIT {limit}" if limit else ""
    sql = text(f"""
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
    rows = db.execute(sql, {"documento_dueno": documento_dueno}).fetchall()
    return [_row_a_reserva(row) for row in rows]

def obtener_reservas_gestor(id_credencial: int, db: Session, limit: int = 50) -> list:
    """Reservas para dueño (todos sus restaurantes) o administrador (solo su restaurante)."""
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return _reservas_por_documento(db, ctx["documento"], limit)
    return obtener_reservas_por_nit(ctx["nit"], db, limit)

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
