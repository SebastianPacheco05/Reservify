from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_mesas(
    db: Session,
    estado_de_disponibilidad: bool,
    cant_personas: int,
    NIT: int,
    precio: float,
):
    try:
        db.execute(
            text(
                "SELECT insertar_mesas(:estado_de_disponibilidad, :cant_personas, :NIT, :precio)"
            ),
            {
                "estado_de_disponibilidad": estado_de_disponibilidad,
                "cant_personas": cant_personas,
                "NIT": NIT,
                "precio": precio,
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
    NIT: int,
    precio: float,
):
    try:
        db.execute(
            text(
                "SELECT editar_mesas(:id_mesa, :estado_de_disponibilidad, :cant_personas, :NIT, :precio)"
            ),
            {
                "id_mesa": id_mesa,
                "estado_de_disponibilidad": estado_de_disponibilidad,
                "cant_personas": cant_personas,
                "NIT": NIT,
                "precio": precio,
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
