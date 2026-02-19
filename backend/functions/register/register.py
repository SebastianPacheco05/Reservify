from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from psycopg2.errors import CheckViolation
import bcrypt
import re

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def validar_formato_email(email: str) -> bool:
    """
    Valida el formato del email permitiendo solo caracteres ASCII.
    Verifica que tenga la estructura básica: texto@dominio.extension
    Solo permite: letras A-Z, a-z, números 0-9, y caracteres especiales: . _ % + -
    """
    if not email or len(email) > 100:
        return False
    
    # Validar usando expresión regular que solo permite ASCII
    # Coincide con la restricción CHECK de la base de datos
    pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    if not re.match(pattern, email):
        return False
    
    return True

def registrar_usuario(db: Session, email: str, password: str, nombre: str, apellido: str, tipo_documento: str, documento: float, nacionalidad: str, telefono: str, id_rol: int, nit: int = None):
    try:
        # Validar formato de email antes de intentar insertarlo
        if not validar_formato_email(email):
            raise HTTPException(
                status_code=400,
                detail=f"El formato del email '{email}' no es válido. Por favor, verifica que tenga el formato correcto (ejemplo: usuario@dominio.com)"
            )
        
        # Validar que el registro público solo permita crear clientes
        # Los administradores y dueños solo pueden ser creados por dueños a través del endpoint de empleado
        rol_nombre = db.execute(
            text('SELECT LOWER(TRIM(nombre_rol)) FROM "Roles" WHERE id_rol = :id_rol'),
            {"id_rol": id_rol}
        ).fetchone()
        
        if rol_nombre:
            rol = rol_nombre[0]
            if rol in ("administrador", "admin", "dueño", "dueno"):
                raise HTTPException(
                    status_code=403,
                    detail="No puedes registrarte como administrador o dueño. Solo el dueño puede crear administradores para sus restaurantes."
                )
        
        # Validar si ya existe el correo
        existe = db.execute(
            text('SELECT 1 FROM "Credenciales" WHERE email = :email'),
            {"email": email}
        ).fetchone()

        if existe:
            raise HTTPException(status_code=400, detail=f"El correo {email} ya está registrado")

        # Hashear contraseña
        hashed_password = hash_password(password)

        # Misma lógica que scripts/functions/registrar.sql pero en Python (no depende de que exista la función en la BD)
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
        error_msg = str(e)
        # Detectar errores específicos de CHECK constraint para email
        if "Credenciales_email_check" in error_msg or "check" in error_msg.lower():
            raise HTTPException(
                status_code=400,
                detail=f"El formato del email '{email}' no es válido. Por favor, verifica que tenga el formato correcto (ejemplo: usuario@dominio.com)"
            )
        raise HTTPException(status_code=400, detail=f"Error de integridad al registrar usuario: {error_msg}")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error de base de datos al registrar usuario: {str(e)}")
