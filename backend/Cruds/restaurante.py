from sqlalchemy.orm import Session
from sqlalchemy import text


def insertar_restaurante(
    db: Session,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    id_dueno: int,
):
    db.execute(
        text(
            "SELECT insertar_restaurante(:direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :id_dueno)"
        ),
        {
            "direccion": direccion,
            "nombre_restaurante": nombre_restaurante,
            "descripcion_restaurante": descripcion_restaurante,
            "horario_apertura": horario_apertura,
            "horario_cierre": horario_cierre,
            "id_dueno": id_dueno,
        },
    )
    db.commit()


def editar_restaurante(
    db: Session,
    id_restaurante: int,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    id_dueno: int,
):
    db.execute(
        text(
            "SELECT editar_restaurante(:id_restaurante, :direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :id_dueno)"
        ),
        {
            "id_restaurante": id_restaurante,
            "direccion": direccion,
            "nombre_restaurante": nombre_restaurante,
            "descripcion_restaurante": descripcion_restaurante,
            "horario_apertura": horario_apertura,
            "horario_cierre": horario_cierre,
            "id_dueno": id_dueno,
        },
    )
    db.commit()


def borrar_restaurante(db: Session, id_restaurante: int):
    db.execute(
        text("SELECT borrar_restaurante(:id_restaurante)"),
        {"id_restaurante": id_restaurante},
    )
    db.commit()
