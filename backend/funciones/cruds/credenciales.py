from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException
import bcrypt


def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def insertar_credenciales(db: Session, email: str, password: str):
    hashed_password = hash_password(password)  #  Hashea la contraseña
    email = email.lower()  # Asegura que el email esté en minúsculas
    # Verifica que el email tenga un formato válido

    try:
        db.execute(
            text("SELECT insertar_credenciales(:email, :password)"),
            {
                "email": email,
                "password": hashed_password,
            },  # Envia la contraseña hasheada
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Credenciales insertadas correctamente"
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al insertar las credenciales"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al insertar: {str(e)}"
        )


def editar_credenciales(db: Session, id_credencial: int, email: str, password: str):
    try:
        result = db.execute(
            text("SELECT editar_credenciales(:id, :email, :password)"),
            {"id": id_credencial, "email": email, "password": password},
        )
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Credencial no encontrada para editar"
            )
        raise HTTPException(status_code=200, detail="Credencial editado correctamente")
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al editar las credenciales"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al editar: {str(e)}"
        )


def borrar_credenciales(db: Session, id_credencial: int):
    try:
        result = db.execute(
            text("SELECT borrar_credenciales(:id)"), {"id": id_credencial}
        )
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Credencial no encontrada para borrar"
            )
        raise HTTPException(
            status_code=200, detail="Credendiales eliminadas correctamente"
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
