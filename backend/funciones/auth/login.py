from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError
from datetime import datetime, timedelta
from funciones.auth.jwt_config import crear_token, crear_refresh_token
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
                text('SELECT * FROM "Credenciales" WHERE email = :email'),
                {"email": email},
            )
            .mappings()
            .fetchone()
        )

        if not resultado:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        id_credencial = resultado["id_credencial"]
        hashed_password = resultado["password"]

        if not verificar_password(password, hashed_password):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

        # Generar access token (30 minutos)
        token_data = {"sub": email, "id": id_credencial}
        token, expires_at = crear_token(token_data, timedelta(minutes=30))
        issued_at = datetime.utcnow()
        
        # Generar refresh token (7 días)
        refresh_token, refresh_expires_at = crear_refresh_token(token_data)

        # Insertar access token en BD
        db.execute(
            text(
                """
                INSERT INTO jwt_tokens (
                    id_credencial,
                    token,
                    issued_at,
                    expires_at,
                    revoked,
                    user_agent,
                    ip_address,
                    created_at,
                    updated_at
                ) VALUES (
                    :id_credencial,
                    :token,
                    :issued_at,
                    :expires_at,
                    FALSE,
                    :user_agent,
                    :ip_address,
                    NOW(),
                    NOW()
                )
            """
            ),
            {
                "id_credencial": id_credencial,
                "token": token,
                "issued_at": issued_at,
                "expires_at": expires_at,
                "user_agent": request.headers.get("user-agent"),
                "ip_address": request.client.host,
            },
        )
        
        # Insertar refresh token en BD
        db.execute(
            text(
                """
                INSERT INTO jwt_tokens (
                    id_credencial,
                    token,
                    issued_at,
                    expires_at,
                    revoked,
                    user_agent,
                    ip_address,
                    created_at,
                    updated_at
                ) VALUES (
                    :id_credencial,
                    :token,
                    :issued_at,
                    :expires_at,
                    FALSE,
                    :user_agent,
                    :ip_address,
                    NOW(),
                    NOW()
                )
            """
            ),
            {
                "id_credencial": id_credencial,
                "token": refresh_token,
                "issued_at": issued_at,
                "expires_at": refresh_expires_at,
                "user_agent": request.headers.get("user-agent"),
                "ip_address": request.client.host,
            },
        )

        # Verificar en qué tabla está el usuario (Dueno, Empleado o Cliente)
        es_dueno = db.execute(
            text('SELECT 1 FROM "Dueno" WHERE id_credencial = :id_credencial'),
            {"id_credencial": id_credencial},
        ).fetchone()

        es_empleado = db.execute(
            text('SELECT 1 FROM "Empleado" WHERE id_credencial = :id_credencial'),
            {"id_credencial": id_credencial},
        ).fetchone()

        es_cliente = db.execute(
            text('SELECT 1 FROM "Cliente" WHERE id_credencial = :id_credencial'),
            {"id_credencial": id_credencial},
        ).fetchone()

        db.commit()

        # Determinar el tipo de usuario y la ruta de redirección
        if es_dueno:
            tipo_usuario = "dueno"
            redirect_to = "/DuenoDashboard"
        elif es_empleado:
            tipo_usuario = "empleado"
            redirect_to = "/EmpleadoDashboard"
        elif es_cliente:
            tipo_usuario = "cliente"
            redirect_to = "/"
        else:
            raise HTTPException(status_code=404, detail="No se encontró el usuario en ninguna tabla")

        # 🔑 Devolver access token + refresh token + tipo de usuario y ruta de redirección
        return {
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "tipo_usuario": tipo_usuario,
            "redirect_to": redirect_to
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en el login: {str(e)}")


def renovar_token(db: Session, refresh_token: str, request: Request):
    """
    Renueva el access token usando un refresh token válido
    """
    try:
        # Decodificar el refresh token
        from funciones.auth.jwt_config import SECRET_KEY, ALGORITHM
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verificar que sea un refresh token
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token inválido: no es un refresh token")
        
        email = payload.get("sub")
        id_credencial = payload.get("id")
        
        if not email or not id_credencial:
            raise HTTPException(status_code=401, detail="Token inválido: datos incompletos")
        
        # Verificar que el refresh token existe en la BD y no está revocado
        result = db.execute(
            text("SELECT revoked, expires_at FROM jwt_tokens WHERE token = :token"),
            {"token": refresh_token}
        ).fetchone()
        
        if not result:
            raise HTTPException(status_code=401, detail="Refresh token no encontrado")
        
        if result[0]:  # revoked
            raise HTTPException(status_code=401, detail="Refresh token revocado")
        
        # Verificar que no haya expirado
        if result[1] < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Refresh token expirado")
        
        # Generar nuevo access token
        token_data = {"sub": email, "id": id_credencial}
        new_token, expires_at = crear_token(token_data, timedelta(minutes=30))
        issued_at = datetime.utcnow()
        
        # Insertar nuevo access token en BD
        db.execute(
            text(
                """
                INSERT INTO jwt_tokens (
                    id_credencial,
                    token,
                    issued_at,
                    expires_at,
                    revoked,
                    user_agent,
                    ip_address,
                    created_at,
                    updated_at
                ) VALUES (
                    :id_credencial,
                    :token,
                    :issued_at,
                    :expires_at,
                    FALSE,
                    :user_agent,
                    :ip_address,
                    NOW(),
                    NOW()
                )
            """
            ),
            {
                "id_credencial": id_credencial,
                "token": new_token,
                "issued_at": issued_at,
                "expires_at": expires_at,
                "user_agent": request.headers.get("user-agent"),
                "ip_address": request.client.host,
            },
        )
        
        db.commit()
        
        return {
            "access_token": new_token,
            "token_type": "bearer"
        }
        
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al renovar token: {str(e)}")
