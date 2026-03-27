from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_top_restaurantes(db: Session):
    result = db.execute(
        text(
            """
            SELECT
                -- Identificador público/aleatorio del restaurante.
                r.restaurante_uid AS restaurante_uid,
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


def obtener_restaurantes_paginados(
    db: Session,
    *,
    query: str = "",
    page: int = 1,
    per_page: int = 30,
):
    page = max(1, page)
    per_page = min(max(1, per_page), 50)
    offset = (page - 1) * per_page
    query_norm = query.strip()

    count_sql = text(
        """
        SELECT COUNT(*) AS total
        FROM "Restaurante" r
        LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
        WHERE (
            :query = ''
            OR LOWER(r.nombre_restaurante) LIKE LOWER(:pattern)
            OR LOWER(COALESCE(c.nombre_categoria, '')) LIKE LOWER(:pattern)
            OR LOWER(COALESCE(r.descripcion_restaurante, '')) LIKE LOWER(:pattern)
        )
        """
    )
    total = db.execute(
        count_sql,
        {"query": query_norm, "pattern": f"%{query_norm}%"},
    ).scalar() or 0

    data_sql = text(
        """
        SELECT
            r.restaurante_uid AS restaurante_uid,
            r.nit,
            r.direccion,
            r.nombre_restaurante,
            r.rating,
            r.reviews,
            r.availabletoday,
            r.horario_apertura,
            r.horario_cierre,
            r.documento,
            r.url_image,
            r.descripcion_restaurante,
            c.nombre_categoria
        FROM "Restaurante" r
        LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
        WHERE (
            :query = ''
            OR LOWER(r.nombre_restaurante) LIKE LOWER(:pattern)
            OR LOWER(COALESCE(c.nombre_categoria, '')) LIKE LOWER(:pattern)
            OR LOWER(COALESCE(r.descripcion_restaurante, '')) LIKE LOWER(:pattern)
        )
        ORDER BY r.rating DESC, r.reviews DESC, r.nombre_restaurante ASC
        LIMIT :limit OFFSET :offset
        """
    )
    rows = db.execute(
        data_sql,
        {
            "query": query_norm,
            "pattern": f"%{query_norm}%",
            "limit": per_page,
            "offset": offset,
        },
    ).mappings().all()

    return {
        "items": [dict(row) for row in rows],
        "total": int(total),
        "page": page,
        "per_page": per_page,
    }
