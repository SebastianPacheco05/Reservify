from sqlalchemy.orm import Session
from sqlalchemy import text

def busqueda_restaurante(db: Session, nombre_restaurante: str):
    result = db.execute(
        text(
            """
            SELECT nombre_restaurante
            FROM fn_filters_busqueda_restaurante(:nombre_restaurante)
            """
        ),
        {"nombre_restaurante": nombre_restaurante},
    )
    rows = result.mappings().all()
    return [dict(row) for row in rows]