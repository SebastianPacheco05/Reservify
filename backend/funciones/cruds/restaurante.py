from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_restaurante(
    db: Session,
    NIT: int,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    documento: int,
    id_categoria: int,
):
    try:
        db.execute(
            text(
                "SELECT insertar_restaurante(:NIT, :direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :documento, :id_categoria)"
            ),
            {
                "NIT": NIT,
                "direccion": direccion,
                "nombre_restaurante": nombre_restaurante,
                "descripcion_restaurante": descripcion_restaurante,
                "horario_apertura": horario_apertura,
                "horario_cierre": horario_cierre,
                "documento": documento,
                "id_categoria": id_categoria,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Restaurante insertado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el restaurante: {str(e)}",
        )


def editar_restaurante(
    db: Session,
    nit: int,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    documento: int,
    id_categoria: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_restaurante(:nit, :direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :documento, :id_categoria)"
            ),
            {
                "nit": nit,
                "direccion": direccion,
                "nombre_restaurante": nombre_restaurante,
                "descripcion_restaurante": descripcion_restaurante,
                "horario_apertura": horario_apertura,
                "horario_cierre": horario_cierre,
                "documento": documento,
                "id_categoria": id_categoria,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Restaurante editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el restaurante: {str(e)}",
        )


def borrar_restaurante(db: Session, nit: int):
    try:
        db.execute(
            text("SELECT borrar_restaurante(:nit)"),
            {"nit": nit},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Restaurante eliminado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el restaurante: {str(e)}",
        )
