# auth/dependencies.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import text
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from config import SessionLocal
from funciones.auth.jwt_config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


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
        if id_credencial is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Verifica que no esté revocado
        result = db.execute(
            text("SELECT revoked FROM jwt_tokens WHERE token = :token"),
            {"token": token},
        ).fetchone()

        if not result or result["revoked"]:
            raise HTTPException(
                status_code=401, detail="Token revocado o no registrado"
            )

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
