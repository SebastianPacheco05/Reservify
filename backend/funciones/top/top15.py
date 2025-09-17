from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_top15_restaurantes_temp(db: Session):
    result = db.execute(
        text('SELECT r.nit, r.direccion, r.nombre_restaurante, r.rating, r.reviews, r.availabletoday, r.horario_apertura, r.horario_cierre, r.documento, r.url_image ,c.nombre_categoria FROM "Restaurante" r INNER JOIN "Categorias" c ON c.id_categoria = r.id_categoria ORDER BY r.reviews DESC LIMIT 9;'
)
    )
    rows = result.mappings().all()
    return [dict(row) for row in rows]
