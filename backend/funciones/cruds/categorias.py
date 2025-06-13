from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException


def insertar_categoria(db: Session, nombre_categoria: str):
    try:
        db.execute(
            text("SELECT insertar_categoria(:nombre_categoria)"),
            {"nombre_categoria": nombre_categoria},
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Categoria insertadas correctamente"
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al insertar la categoria"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al insertar: {str(e)}"
        )


def editar_categoria(db: Session, id_categoria: int, nombre_categoria: str):
    try:
        result = db.execute(
            text("SELECT editar_categoria(:id, :nombre_categoria)"),
            {"id": id_categoria, "nombre_categoria": nombre_categoria},
        )
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="categoria no encontrada para editar"
            )
        raise HTTPException(status_code=200, detail="categoria editado correctamente")
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al editar la categoria"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al editar: {str(e)}"
        )


def borrar_categoria(db: Session, id_categoria: int):
    try:
        result = db.execute(text("SELECT borrar_categoria(:id)"), {"id": id_categoria})
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Categoria no encontrada para borrar"
            )
        raise HTTPException(
            status_code=200, detail="Categorias eliminadas correctamente"
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
