from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_top_restaurantes(db: Session):
    result = db.execute(
        text(
            """
            SELECT
                r.restaurante_uid,
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
                c.nombre_categoria
            FROM "Restaurante" r
            LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
            ORDER BY r.rating DESC, r.reviews DESC
            LIMIT :limit
            """
        ),
        {"limit": 9},
    )
    rows = result.mappings().all()
    return [dict(row) for row in rows]
