from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError
from datetime import datetime, timedelta
from funciones.auth.jwt_config import crear_token
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

        # Generar token
        token_data = {"sub": email, "id": id_credencial}
        token, expires_at = crear_token(token_data, timedelta(minutes=30))
        issued_at = datetime.utcnow()

        # Insertar token en BD
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

        # 🔑 Devolver token + tipo de usuario y ruta de redirección
        return {
            "access_token": token,
            "token_type": "bearer",
            "tipo_usuario": tipo_usuario,
            "redirect_to": redirect_to
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en el login: {str(e)}")
