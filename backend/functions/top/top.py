from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_top_restaurantes(db: Session):
    result = db.execute(
        text(
            """
            SELECT
                t.restaurante_uid,
                t.nit,
                t.direccion,
                t.nombre_restaurante,
                t.rating,
                t.reviews,
                t.availabletoday,
                t.horario_apertura,
                t.horario_cierre,
                t.documento,
                t.url_image,
                t.nombre_categoria
            FROM fn_top_obtener_top_restaurantes(:limit) AS t
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

    count_sql = text("SELECT fn_top_contar_restaurantes(:query) AS total")
    total = db.execute(
        count_sql,
        {"query": query_norm},
    ).scalar() or 0

    data_sql = text(
        """
        SELECT
            t.restaurante_uid,
            t.nit,
            t.direccion,
            t.nombre_restaurante,
            t.rating,
            t.reviews,
            t.availabletoday,
            t.horario_apertura,
            t.horario_cierre,
            t.documento,
            t.url_image,
            t.descripcion_restaurante,
            t.nombre_categoria
        FROM fn_top_obtener_restaurantes_paginados(
            :query,
            :limit,
            :offset
        ) AS t
        """
    )
    rows = db.execute(
        data_sql,
        {
            "query": query_norm,
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
