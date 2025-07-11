from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException


def insertar_dueno(
    db: Session,
    nombre: str,
    apellido: str,
    id_rol: int,
    id_credencial: int,
):
    try:
        db.execute(
            text(
                "SELECT insertar_dueno(:nombre, :apellido, :id_rol, :id_credencial)"
            ),
            {
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
    id_dueno: int,
    nombre: str,
    apellido: str,
    id_rol: int,
    id_credencial: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_dueno(:id_dueno, :nombre, :apellido, :id_rol, :id_credencial)"
            ),
            {
                "id_dueno": id_dueno,
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


def borrar_dueno(db: Session, id_dueno: int):
    try:
        db.execute(text("SELECT borrar_dueno(:id_dueno)"), {"id_dueno": id_dueno})
        db.commit()
        raise HTTPException(status_code=200, detail="Dueño eliminado correctamente")
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
