from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_roles(db: Session, nombre_rol: str, descripcion: str):
    try:
        db.execute(
            text("SELECT insertar_roles(:nombre_rol, :descripcion)"),
            {"nombre_rol": nombre_rol, "descripcion": descripcion},
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Rol Insertado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el rol: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el rol: {str(e)}",
        )


def editar_roles(db: Session, id_rol: int, nombre_rol: str, descripcion: str):
    try:
        db.execute(
            text("SELECT editar_roles(:id_rol, :nombre_rol, :descripcion)"),
            {"id_rol": id_rol, "nombre_rol": nombre_rol, "descripcion": descripcion},
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Rol editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el rol: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el rol: {str(e)}",
        )


def borrar_roles(db: Session, id_rol: int):
    try:
        db.execute(text("SELECT borrar_roles(:id_rol)"), {"id_rol": id_rol})
        db.commit()
        raise HTTPException(status_code=200, detail="Rol eliminado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el rol: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el rol: {str(e)}",
        )
