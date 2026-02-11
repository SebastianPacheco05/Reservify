from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_comentario(db: Session, documento: int, nit: int, comentario: str, calificacion: int = 5):
    try:
        if calificacion < 1 or calificacion > 5:
            raise HTTPException(
                status_code=400,
                detail="La calificación debe estar entre 1 y 5.",
            )
        # Verificar si ya existe reseña (misma lógica que fun_insertar_comentarios.sql)
        existe = db.execute(
            text('SELECT 1 FROM "Comentarios" WHERE documento = :documento AND nit = :nit'),
            {"documento": documento, "nit": nit},
        ).fetchone()
        if existe:
            raise HTTPException(
                status_code=400,
                detail="Ya has dejado una reseña para este restaurante. Solo puedes dejar una reseña por restaurante.",
            )
        # Insert directo (no depende de la función insertar_comentario en la BD)
        db.execute(
            text('INSERT INTO "Comentarios" (documento, nit, comentario, calificacion) VALUES (:documento, :nit, :comentario, :calificacion)'),
            {
                "documento": documento,
                "nit": nit,
                "comentario": comentario,
                "calificacion": calificacion,
            },
        )
        db.commit()
        return {"message": "Comentario insertado correctamente"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al insertar el comentario: {str(e)}",
        )


def verificar_comentario_existente(db: Session, documento: int, nit: int) -> bool:
    """Verifica si el usuario ya tiene un comentario para este restaurante"""
    try:
        result = db.execute(
            text("SELECT COUNT(*) FROM \"Comentarios\" WHERE documento = :documento AND nit = :nit"),
            {"documento": documento, "nit": nit},
        )
        count = result.scalar()
        return count > 0
    except Exception as e:
        return False


def editar_comentario(db: Session, id_comentario: int, comentario: str):
    try:
        db.execute(
            text("SELECT editar_comentario(:id_comentario, :comentario)"),
            {"id_comentario": id_comentario, "comentario": comentario},
        )

        db.commit()
        raise HTTPException(status_code=200, detail="Comentario editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el comentario: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el comentario: {str(e)}",
        )


def borrar_comentario(db: Session, id_comentario: int):
    try:
        db.execute(
            text("SELECT borrar_comentario(:id_comentario)"),
            {"id_comentario": id_comentario},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Comentario eliminado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el comentario: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el comentario: {str(e)}",
        )
