from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import bcrypt

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def registrar_usuario(db: Session, email: str, password: str, nombre: str, apellido: str, tipo_documento: str, documento: float, nacionalidad: str, telefono: str, id_rol: int, nit: int = None):
    try:
        # Validar si ya existe el correo
        existe = db.execute(
            text('SELECT 1 FROM "Credenciales" WHERE email = :email'),
            {"email": email}
        ).fetchone()

        if existe:
            raise HTTPException(status_code=400, detail=f"El correo {email} ya está registrado")

        # Hashear contraseña
        hashed_password = hash_password(password)

        # Misma lógica que scripts/funciones/registrar.sql pero en Python (no depende de que exista la función en la BD)
        r = db.execute(
            text('INSERT INTO "Credenciales" (email, password) VALUES (:email, :password) RETURNING id_credencial'),
            {"email": email, "password": hashed_password},
        )
        id_credencial = r.scalar()

        nacionalidad_val = (nacionalidad or "").strip() or None
        telefono_val = (telefono or "").strip() or None

        db.execute(
            text("""INSERT INTO "Usuario" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit)
                    VALUES (:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :nit)"""),
            {
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad_val,
                "telefono": telefono_val,
                "id_rol": id_rol,
                "nit": nit,
            },
        )

        db.commit()
        return {"message": "Usuario registrado correctamente"}

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error de integridad al registrar usuario: {str(e)}")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error de base de datos al registrar usuario: {str(e)}")
