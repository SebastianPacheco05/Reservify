from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_mesas(
    db: Session,
    estado_de_disponibilidad: bool,
    cant_personas: int,
    restaurante_uid: str,
    precio: float,
    descripcion: str,
):
    try:
        # Casts explícitos: si hay varias sobrecargas en PostgreSQL, el 3er arg como texto
        # queda "unknown" y provoca AmbiguousFunction; uuid + numeric(10,2) fija la firma.
        db.execute(
            text(
                "SELECT insertar_mesas("
                "CAST(:estado_de_disponibilidad AS boolean), "
                "CAST(:cant_personas AS integer), "
                "CAST(:restaurante_uid AS uuid), "
                "CAST(:precio AS numeric(10,2)), "
                "CAST(:descripcion AS varchar(255))"
                ")"
            ),
            {
                "estado_de_disponibilidad": estado_de_disponibilidad,
                "cant_personas": cant_personas,
                "restaurante_uid": restaurante_uid,
                "precio": precio,
                "descripcion": descripcion,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Mesa insertada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar la mesa: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar la mesa: {str(e)}",
        )


def editar_mesas(
    db: Session,
    id_mesa: int,
    estado_de_disponibilidad: bool,
    cant_personas: int,
    restaurante_uid: str,
    precio: float,
    descripcion: str,
):
    try:
        db.execute(
            text(
                "SELECT editar_mesas("
                "CAST(:id_mesa AS integer), "
                "CAST(:estado_de_disponibilidad AS boolean), "
                "CAST(:cant_personas AS integer), "
                "CAST(:restaurante_uid AS uuid), "
                "CAST(:precio AS numeric(10,2)), "
                "CAST(:descripcion AS varchar(255))"
                ")"
            ),
            {
                "id_mesa": id_mesa,
                "estado_de_disponibilidad": estado_de_disponibilidad,
                "cant_personas": cant_personas,
                "restaurante_uid": restaurante_uid,
                "precio": precio,
                "descripcion": descripcion,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Mesa editada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar la mesa: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar la mesa: {str(e)}",
        )


def borrar_mesas(db: Session, id_mesa: int):
    try:
        db.execute(text("SELECT borrar_mesas(:id_mesa)"), {"id_mesa": id_mesa})
        db.commit()
        raise HTTPException(status_code=200, detail="Mesa eliminada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar la mesa: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar la mesa: {str(e)}",
        )
