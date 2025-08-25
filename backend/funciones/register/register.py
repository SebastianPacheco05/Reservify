from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import bcrypt

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def registrar_cliente(db: Session, email: str, password: str, nombre: str, apellido: str, tipo_documento: str, documento: float, nacionalidad: str, telefono: str, id_rol: int):
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

        # Ejecutar procedimiento almacenado
        db.execute(
            text("""SELECT registrar_cliente(:email, :password, :nombre, :apellido, 
                                              :tipo_documento, :documento, :nacionalidad, 
                                              :telefono, :id_rol)"""),
            {
                "email": email,
                "password": hashed_password,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad,
                "telefono": telefono,
                "id_rol": id_rol,
            },
        )

        db.commit()
        return {"message": "Cliente registrado correctamente"}

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error de integridad al registrar cliente: {str(e)}")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error de base de datos al registrar cliente: {str(e)}")
