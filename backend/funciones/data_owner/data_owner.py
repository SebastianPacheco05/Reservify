from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

def obtener_documento_dueno(id_credencial: int, db: Session) -> int:
    """Obtiene el documento del dueño basado en su id_credencial"""
    sql = text("""
        SELECT documento 
        FROM "Dueno" 
        WHERE id_credencial = :id_credencial
    """)
    result = db.execute(sql, {"id_credencial": id_credencial}).fetchone()
    
    if not result:
        raise HTTPException(
            status_code=403, 
            detail="No tiene permisos de dueño o no se encontró el usuario"
        )
    
    return result[0]

def obtener_estadisticas_dueno(id_credencial: int, db: Session):
    # Obtener el documento del dueño
    documento_dueno = obtener_documento_dueno(id_credencial, db)
    
    sql = text("""
        SELECT * 
        FROM obtener_estadisticas_dueno(:documento);
    """)
    result = db.execute(sql, {"documento": documento_dueno}).fetchone()

    if result:
        return {
            "total_restaurantes": result[0],
            "reservas_activas": result[1],
            "revenue_mes": float(result[4]) if result[4] is not None else 0.0
        }
    else:
        return {
            "total_restaurantes": 0,
            "reservas_activas": 0,
            "revenue_mes": 0.0
        }

def obtener_reservas_dueno(id_credencial: int, db: Session, limit: int = 50):
    """Obtiene las reservas más recientes de todos los restaurantes del dueño
    
    Args:
        id_credencial: ID de credencial del dueño
        db: Sesión de base de datos
        limit: Número máximo de reservas a retornar (None para todas)
    """
    # Obtener el documento del dueño
    documento_dueno = obtener_documento_dueno(id_credencial, db)
    
    limit_clause = f"LIMIT {limit}" if limit else ""
    
    sql = text(f"""
        SELECT 
            r.id_reserva,
            r.horario,
            r.fecha,
            r.estado_reserva,
            m.id_mesa,
            m.cant_personas,
            rest.nombre_restaurante,
            rest.nit,
            r.num_comensales,
            c.nombre,
            c.apellido,
            c.telefono,
            c.documento as documento_cliente
        FROM "Reserva" r
        INNER JOIN "Mesas" m ON r.id_mesa = m.id_mesa
        INNER JOIN "Restaurante" rest ON m."nit" = rest.nit
        INNER JOIN "Cliente" c ON r.documento = c.documento
        WHERE rest.documento = :documento_dueno
        ORDER BY r.fecha DESC, r.horario DESC
        {limit_clause}
    """)
    
    result = db.execute(sql, {"documento_dueno": documento_dueno})
    rows = result.fetchall()
    
    reservas = []
    for row in rows:
        reservas.append({
            "id_reserva": row[0],
            "horario": str(row[1]),
            "fecha": str(row[2]),
            "estado_reserva": row[3],
            "id_mesa": row[4],
            "cant_personas": row[5],
            "nombre_restaurante": row[6],
            "nit": row[7],
            "num_comensales": row[8],
            "cliente_nombre": f"{row[9]} {row[10]}",
            "cliente_telefono": row[11],
            "cliente_documento": row[12]
        })
    
    return reservas
