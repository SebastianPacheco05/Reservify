from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_usuario(
    db: Session,
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
    nit: int = None,
):
    try:
        db.execute(
            text(
                "SELECT insertar_usuario(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :nit)"
            ),
            {
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad or None,
                "telefono": telefono or None,
                "id_rol": id_rol,
                "nit": nit,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Usuario insertado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el usuario: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el usuario: {str(e)}",
        )


def editar_usuario(
    db: Session,
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
    nit: int = None,
):
    try:
        db.execute(
            text(
                "SELECT editar_usuario(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :nit)"
            ),
            {
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad or None,
                "telefono": telefono or None,
                "id_rol": id_rol,
                "nit": nit,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Usuario editado correctamente")
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al editar el usuario"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al editar: {str(e)}"
        )


def borrar_usuario(db: Session, documento: int):
    try:
        db.execute(
            text("SELECT borrar_usuario(:documento)"), {"documento": documento}
        )
        db.commit()
        raise HTTPException(status_code=200, detail=f"Usuario con documento {documento} eliminado correctamente")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
