from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException


def insertar_dueno(
    db: Session,
    documento: int,
    tipo_documento: str,
    nombre: str,
    apellido: str,
    id_rol: int,
    id_credencial: int,
):
    try:
        db.execute(
            text(
                "SELECT insertar_dueno(:documento, :tipo_documento, :nombre, :apellido, :id_rol, :id_credencial)"
            ),
            {
                "documento": documento,
                "tipo_documento": tipo_documento,
                "nombre": nombre,
                "apellido": apellido,
                "id_rol": id_rol,
                "id_credencial": id_credencial,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Dueño insertado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el dueño: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el dueño: {str(e)}",
        )


def editar_dueno(
    db: Session,
    documento: int,
    nombre: str,
    apellido: str,
    id_rol: int,
    id_credencial: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_dueno(:documento, :nombre, :apellido, :id_rol, :id_credencial)"
            ),
            {
                "documento": documento,
                "nombre": nombre,
                "apellido": apellido,
                "id_rol": id_rol,
                "id_credencial": id_credencial,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Dueño editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el dueño: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el dueño: {str(e)}",
        )


def borrar_dueno(db: Session, documento: int):
    try:
        db.execute(text("SELECT borrar_dueno(:documento)"), {"documento": documento})
        db.commit()
        raise HTTPException(status_code=200, detail=f"Dueño con documento {documento} eliminado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el dueño: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el dueño: {str(e)}",
        )
