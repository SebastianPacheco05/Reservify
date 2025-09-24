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

        # Obtener la ruta del dashboard según el rol/usuario
        dashboard_route = db.execute(
            text("SELECT get_dashboard_route(:id_credencial)"),
            {"id_credencial": id_credencial},
        ).scalar()

        db.commit()

        if not dashboard_route:
            raise HTTPException(status_code=404, detail="No se encontró ruta para este usuario")

        # 🔑 Devolver token + ruta a donde redirigir
        return {
            "access_token": token,
            "token_type": "bearer",
            "redirect_to": dashboard_route
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en el login: {str(e)}")
