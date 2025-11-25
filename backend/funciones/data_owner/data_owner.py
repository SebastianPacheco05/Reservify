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
