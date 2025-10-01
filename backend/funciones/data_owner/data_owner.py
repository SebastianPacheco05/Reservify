from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_estadisticas_dueno(documento_dueno: int, db: Session):
    sql = text("""
        SELECT * 
        FROM obtener_estadisticas_dueno(:documento);
    """)
    result = db.execute(sql, {"documento": documento_dueno}).fetchone()

    if result:
        return {
            "total_restaurantes": result[0],
            "reservas_activas": result[1],
            "visitantes_mes": result[2],
            "total_reservas_mes": result[3],
            "revenue_mes": float(result[4]) if result[4] is not None else 0.0,
            "total_clientes_mes": result[5]
        }
    else:
        return {
            "total_restaurantes": 0,
            "reservas_activas": 0,
            "visitantes_mes": 0,
            "total_reservas_mes": 0,
            "revenue_mes": 0.0,
            "total_clientes_mes": 0
        }
