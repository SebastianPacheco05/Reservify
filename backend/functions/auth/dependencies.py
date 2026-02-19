# auth/dependencies.py
from fastapi import Depends, HTTPException
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


def verificar_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_credencial = payload.get("id")
        email = payload.get("sub")
        
        if id_credencial is None or email is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Verifica que no esté revocado
        result = db.execute(
            text("SELECT revoked FROM jwt_tokens WHERE token = :token"),
            {"token": token},
        ).fetchone()

        if not result or result[0]:  # ← SOLUCIÓN AQUÍ
            raise HTTPException(status_code=401, detail="Token revocado o no registrado")

        # Devolver payload con email incluido
        return {
            "id": id_credencial,
            "email": email,
            "sub": email
        }

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")


