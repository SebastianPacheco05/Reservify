from sqlalchemy.orm import Session
from sqlalchemy import text

def busqueda_restaurante(db: Session, nombre_restaurante: str):
    result = db.execute(
            text('''SELECT nombre_restaurante
                    FROM "Restaurante"
                    WHERE similarity(nombre_restaurante, :nombre_restaurante) > 0.2
                    ORDER BY similarity(nombre_restaurante, :nombre_restaurante) DESC;
                '''),
            {"nombre_restaurante": nombre_restaurante},
        )
    rows = result.mappings().all()
    return [dict(row) for row in rows]