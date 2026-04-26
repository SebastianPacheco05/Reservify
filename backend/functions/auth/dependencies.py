# auth/dependencies.py
from datetime import datetime
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import SessionLocal
from .jwt_config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verificar_token(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_credencial = payload.get("id")
        email = payload.get("sub")

        if id_credencial is None or email is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Verifica revocación usando función SQL.
        result = db.execute(
            text("SELECT fn_auth_get_jwt_token_status(:token)"),
            {"token": token},
        ).fetchone()

        # La función devuelve TRUE si el token está revocado o no existe
        if result and result[0]:
            raise HTTPException(
                status_code=401,
                detail="Token revocado o no registrado",
            )

        # Validación por dispositivo: mismo user-agent e IP del login original.
        token_ctx = db.execute(
            text(
                """
                SELECT revoked, expires_at, user_agent, ip_address
                FROM fn_auth_get_jwt_token_context(:token)
                """
            ),
            {"token": token},
        ).fetchone()

        if not token_ctx:
            raise HTTPException(status_code=401, detail="Token no registrado")

        if token_ctx[0]:
            raise HTTPException(status_code=401, detail="Token revocado")

        if token_ctx[1] and token_ctx[1] < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token expirado")

        current_user_agent = request.headers.get("user-agent") or "sin dato"
        current_ip = request.client.host if request.client else "sin dato"
        session_user_agent = token_ctx[2] or "sin dato"
        session_ip = token_ctx[3] or "sin dato"

        if session_user_agent != current_user_agent or session_ip != current_ip:
            raise HTTPException(
                status_code=401,
                detail="Sesión inválida para este dispositivo",
            )

        # Devolver payload con email incluido
        return {
            "id": id_credencial,
            "email": email,
            "sub": email,
        }

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")
