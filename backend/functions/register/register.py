from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from psycopg2.errors import CheckViolation
import bcrypt
import re


def hash_password(password: str):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def validar_password_fuerte(password: str) -> bool:
    """
    Política de contraseña:
    - Mínimo 10 caracteres
    - Al menos una mayúscula, una minúscula, un número y un carácter especial
    """
    if not password or len(password) < 10:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[^A-Za-z0-9]", password):
        return False
    return True

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
        
        # Validar complejidad de contraseña
        if not validar_password_fuerte(password):
            raise HTTPException(
                status_code=400,
                detail=(
                    "La contraseña no cumple la política de seguridad. "
                    "Debe tener al menos 10 caracteres, con mayúsculas, minúsculas, números y caracteres especiales."
                ),
            )

        # Validar que el registro público solo permita crear clientes
        # Los administradores y dueños solo pueden ser creados por dueños a través del endpoint de empleado
        rol_nombre = db.execute(
            text(
                """
                SELECT fn_register_get_rol_normalizado(:id_rol)
                """
            ),
            {"id_rol": id_rol},
        ).fetchone()
        
        if rol_nombre and rol_nombre[0]:
            rol = rol_nombre[0]
            if rol in ("administrador", "admin", "dueño", "dueno"):
                raise HTTPException(
                    status_code=403,
                    detail="No puedes registrarte como administrador o dueño. Solo el dueño puede crear administradores para sus restaurantes."
                )
        
        # Validar si ya existe el correo usando función SQL
        existe_row = db.execute(
            text(
                """
                SELECT fn_register_email_existe(:email)
                """
            ),
            {"email": email},
        ).fetchone()

        if existe_row and existe_row[0]:
            raise HTTPException(status_code=400, detail=f"El correo {email} ya está registrado")

        # Hashear contraseña
        hashed_password = hash_password(password)

        # Insertar credenciales usando función SQL que devuelve id_credencial
        row_cred = db.execute(
            text(
                """
                SELECT fn_register_insertar_credenciales(:email, :password)
                """
            ),
            {"email": email, "password": hashed_password},
        ).fetchone()
        id_credencial = int(row_cred[0]) if row_cred and row_cred[0] is not None else None

        nacionalidad_val = (nacionalidad or "").strip() or None
        telefono_val = (telefono or "").strip() or None

        # Insertar usuario cliente usando función SQL
        db.execute(
            text(
                """
                SELECT fn_register_insertar_usuario_cliente(
                    :id_credencial,
                    :nombre,
                    :apellido,
                    :tipo_documento,
                    :documento,
                    :nacionalidad,
                    :telefono,
                    :id_rol,
                    :nit
                )
                """
            ),
            {
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad_val or "",
                "telefono": telefono_val or "",
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
