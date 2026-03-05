from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError
from datetime import datetime, timedelta
from functions.auth.jwt_config import crear_token, crear_refresh_token
import bcrypt

def verificar_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def login_usuario(db: Session, email: str, password: str, request: Request):
    email = email.lower()

    try:
        resultado = (
            db.execute(
                text(
                    """
                    SELECT id_credencial, email, password
                    FROM fn_auth_get_credenciales_by_email(:email)
                    """
                ),
                {"email": email},
            )
            .mappings()
            .fetchone()
        )

        if not resultado:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        id_credencial = resultado["id_credencial"]
        stored_password = resultado["password"] or ""

        # Compatibilidad con datos antiguos: si la contraseña en BD no es un hash bcrypt,
        # la tratamos como texto plano una sola vez y la migramos a bcrypt.
        is_bcrypt = stored_password.startswith("$2a$") or stored_password.startswith("$2b$")

        if is_bcrypt:
            if not verificar_password(password, stored_password):
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        else:
            # Contraseña legacy en texto plano
            if password != stored_password:
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")

            # Migrar a bcrypt de forma transparente usando función SQL
            new_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
                "utf-8"
            )
            db.execute(
                text(
                    """
                    SELECT fn_auth_update_password(:id_credencial, :password)
                    """
                ),
                {"password": new_hash, "id": id_credencial},
            )
            stored_password = new_hash

        # Generar access token (30 minutos)
        token_data = {"sub": email, "id": id_credencial}
        token, expires_at = crear_token(token_data, timedelta(minutes=30))
        issued_at = datetime.utcnow()
        
        # Generar refresh token (7 días)
        refresh_token, refresh_expires_at = crear_refresh_token(token_data)

        # Una fila por sesión: access token + refresh_token (permite renovar sin cerrar sesión)
        db.execute(
            text(
                """
                SELECT fn_auth_insert_jwt_session(
                    :id_credencial,
                    :token,
                    :refresh_token,
                    :issued_at,
                    :expires_at,
                    :refresh_expires_at,
                    :user_agent,
                    :ip_address
                )
                """
            ),
            {
                "id_credencial": id_credencial,
                "token": token,
                "refresh_token": refresh_token,
                "issued_at": issued_at,
                "expires_at": expires_at,
                "refresh_expires_at": refresh_expires_at,
                "user_agent": request.headers.get("user-agent"),
                "ip_address": request.client.host,
            },
        )

        # Obtener usuario y rol desde tabla Usuario (un solo lugar por id_credencial)
        usuario_rol = db.execute(
            text('''
                SELECT documento, nombre_rol
                FROM fn_auth_get_usuario_documento_y_rol(:id_credencial)
            '''),
            {"id_credencial": id_credencial},
        ).fetchone()

        db.commit()

        if not usuario_rol:
            raise HTTPException(status_code=404, detail="No se encontró el usuario")

        documento_usuario = usuario_rol[0]
        nombre_rol = (usuario_rol[1] or "").strip().lower()

        # Normalizar "dueño" a "dueno" para la API
        if nombre_rol == "dueño":
            nombre_rol = "dueno"

        if nombre_rol == "dueno":
            tipo_usuario = "dueno"
            redirect_to = "/duenodashboard"
        elif nombre_rol == "administrador":
            tipo_usuario = "administrador"
            redirect_to = "/admindashboard"
        elif nombre_rol == "empleado":
            tipo_usuario = "empleado"
            redirect_to = "/EmpleadoDashboard"
        elif nombre_rol == "cliente":
            tipo_usuario = "cliente"
            redirect_to = "/"
        else:
            tipo_usuario = nombre_rol or "cliente"
            redirect_to = "/"

        # 🔑 Devolver access token + refresh token + tipo de usuario, documento y ruta de redirección
        return {
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "tipo_usuario": tipo_usuario,
            "documento": int(documento_usuario),
            "redirect_to": redirect_to
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error interno al intentar iniciar sesión",
        )


def renovar_token(db: Session, refresh_token: str, request: Request):
    """
    Renueva el access token usando el refresh_token. Busca la sesión por refresh_token,
    valida que no esté revocada ni expirada, y actualiza la misma fila con el nuevo access token.
    El usuario no pierde la sesión (no sale de la página).
    """
    try:
        from functions.auth.jwt_config import SECRET_KEY, ALGORITHM
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token inválido: no es un refresh token")
        
        email = payload.get("sub")
        id_credencial = payload.get("id")
        
        if not email or not id_credencial:
            raise HTTPException(status_code=401, detail="Token inválido: datos incompletos")
        
        # Buscar sesión por refresh_token (columna dedicada)
        row = db.execute(
            text(
                """
                SELECT id_credencial, revoked, refresh_expires_at
                FROM fn_auth_get_session_by_refresh_token(:refresh_token)
                """
            ),
            {"refresh_token": refresh_token},
        ).fetchone()
        
        if not row:
            raise HTTPException(status_code=401, detail="Refresh token no encontrado")
        
        if row[1]:  # revoked
            raise HTTPException(status_code=401, detail="Refresh token revocado")
        
        if row[2] < datetime.utcnow():  # refresh_expires_at
            raise HTTPException(status_code=401, detail="Refresh token expirado")
        
        # Generar nuevo access token
        token_data = {"sub": email, "id": id_credencial}
        new_token, expires_at = crear_token(token_data, timedelta(minutes=30))
        issued_at = datetime.utcnow()
        
        # Actualizar la misma fila: nuevo token y expires_at (no insertar nueva fila)
        db.execute(
            text(
                """
                SELECT fn_auth_update_jwt_token(
                    :refresh_token,
                    :new_token,
                    :expires_at,
                    :issued_at
                )
                """
            ),
            {
                "new_token": new_token,
                "expires_at": expires_at,
                "issued_at": issued_at,
                "refresh_token": refresh_token,
            },
        )
        
        db.commit()
        
        return {
            "access_token": new_token,
            "token_type": "bearer",
        }
        
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token inválido o expirado",
        )
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error interno al renovar el token",
        )
