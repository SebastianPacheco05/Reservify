from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_top_restaurantes(db: Session):
    result = db.execute(
        text(
            """
            SELECT
                nit,
                direccion,
                nombre_restaurante,
                rating,
                reviews,
                availabletoday,
                horario_apertura,
                horario_cierre,
                documento,
                url_image,
                nombre_categoria
            FROM fn_top_obtener_top_restaurantes(:limit)
            """
        ),
        {"limit": 9},
    )
    rows = result.mappings().all()
    return [dict(row) for row in rows]
