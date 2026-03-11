from __future__ import annotations

import hashlib
import os
import re
import secrets
import string
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from jose import jwt, JWTError
from sqlalchemy import text
from sqlalchemy.orm import Session

from config import get_db
from functions.auth.jwt_config import SECRET_KEY, ALGORITHM
from functions.cruds.credenciales import hash_password
from functions.email_sender.email_utils import send_email
from models import (
    PasswordResetRequestSchema,
    PasswordResetVerifySchema,
    PasswordResetConfirmSchema,
)


router = APIRouter(tags=["Password Reset"])

RESET_CODE_TTL_MINUTES = int(os.getenv("PASSWORD_RESET_CODE_TTL_MINUTES", "15"))
RESET_TOKEN_TTL_MINUTES = int(os.getenv("PASSWORD_RESET_TOKEN_TTL_MINUTES", "10"))

# Acepta XXXX-XXXX o XXXXXXXX (alfanumérico)
_CODE_RE = re.compile(r"^[A-Za-z0-9]{4}-?[A-Za-z0-9]{4}$")


def _normalize_email(email: str) -> str:
    return (email or "").strip().lower()


def _normalize_code(code: str) -> str:
    # Quita guiones y espacios, y lo vuelve uppercase para comparar
    return re.sub(r"[^A-Za-z0-9]", "", (code or "")).strip().upper()


def _hash_code(code: str) -> str:
    # Pepper con SECRET_KEY; no guardamos el código en texto plano
    pepper = (SECRET_KEY or "reservify").encode("utf-8")
    payload = pepper + b":" + code.encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def _generate_code_8() -> str:
    # 8 caracteres alfanuméricos, garantizando al menos 1 letra y 1 número
    letters = string.ascii_uppercase
    digits = string.digits
    alphabet = letters + digits

    a = secrets.choice(letters)
    b = secrets.choice(digits)
    rest = [secrets.choice(alphabet) for _ in range(6)]
    chars = [a, b, *rest]
    secrets.SystemRandom().shuffle(chars)
    raw = "".join(chars)
    return f"{raw[:4]}-{raw[4:]}"


def _crear_reset_token(id_code: int, id_credencial: int, email: str) -> str:
    now = datetime.utcnow()
    exp = now + timedelta(minutes=RESET_TOKEN_TTL_MINUTES)
    payload = {
        "type": "pwd_reset",
        "email": email,
        "id_credencial": int(id_credencial),
        "id_code": int(id_code),
        "iat": int(now.timestamp()),
        "exp": exp,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _decode_reset_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    if payload.get("type") != "pwd_reset":
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload


@router.post("/request")
def request_password_reset(body: PasswordResetRequestSchema, db: Session = Depends(get_db)):
    """
    Solicita recuperación.
    Valida en BD si el email existe. Si no existe, devuelve error.
    Si existe, genera un código (XXXX-XXXX) y lo envía por correo.
    """
    email = _normalize_email(body.email)
    if not email:
        raise HTTPException(status_code=400, detail="El correo es obligatorio")

    try:
        row = db.execute(
            text("SELECT fn_auth_get_credencial_id_by_email(:email)"),
            {"email": email},
        ).fetchone()
    except Exception:
        # Fallback si la función SQL no está creada aún
        db.rollback()
        row = db.execute(
            text('SELECT id_credencial FROM "Credenciales" WHERE LOWER(email) = LOWER(:email)'),
            {"email": email},
        ).fetchone()

    id_credencial = int(row[0]) if row and row[0] is not None else None
    if not id_credencial:
        raise HTTPException(status_code=404, detail="El correo no está registrado")
    code = _generate_code_8()
    code_norm = _normalize_code(code)
    code_hash = _hash_code(code_norm)
    expires_at = datetime.utcnow() + timedelta(minutes=RESET_CODE_TTL_MINUTES)

    try:
        db.execute(
            text("SELECT fn_auth_insert_password_reset_code(:id_credencial, :code_hash, :expires_at)"),
            {"id_credencial": id_credencial, "code_hash": code_hash, "expires_at": expires_at},
        ).fetchone()
    except Exception:
        # Fallback si la función SQL no está creada aún
        db.rollback()
        db.execute(
            text(
                """
                INSERT INTO "Password_Reset_Codes"(id_credencial, code_hash, expires_at, used)
                VALUES (:id_credencial, :code_hash, :expires_at, FALSE)
                """
            ),
            {"id_credencial": id_credencial, "code_hash": code_hash, "expires_at": expires_at},
        )
    db.commit()

    subject = "Código de recuperación - Reservify"
    message = (
        "Recibimos una solicitud para restablecer tu contraseña.\n\n"
        f"Tu código es: {code}\n\n"
        f"Este código expira en {RESET_CODE_TTL_MINUTES} minutos.\n"
        "Si no fuiste tú, puedes ignorar este correo."
    )
    send_email(email, subject, message)
    return {"ok": True}


@router.post("/verify")
def verify_password_reset_code(body: PasswordResetVerifySchema, db: Session = Depends(get_db)):
    """
    Verifica el código y devuelve un reset_token de corta duración.
    """
    email = _normalize_email(body.email)
    code_input = (body.code or "").strip()
    if not _CODE_RE.match(code_input):
        raise HTTPException(status_code=400, detail="Formato de código inválido (usa XXXX-XXXX)")

    try:
        row = db.execute(
            text("SELECT fn_auth_get_credencial_id_by_email(:email)"),
            {"email": email},
        ).fetchone()
    except Exception:
        # Fallback si la función SQL no está creada aún
        db.rollback()
        row = db.execute(
            text('SELECT id_credencial FROM "Credenciales" WHERE LOWER(email) = LOWER(:email)'),
            {"email": email},
        ).fetchone()
    id_credencial = int(row[0]) if row and row[0] is not None else None
    if not id_credencial:
        raise HTTPException(status_code=400, detail="Código o correo incorrecto")
    code_norm = _normalize_code(code_input)
    code_hash = _hash_code(code_norm)

    code_row = db.execute(
        text(
            """
            SELECT id
            FROM "Password_Reset_Codes"
            WHERE id_credencial = :id_credencial
              AND used = FALSE
              AND expires_at > NOW()
              AND code_hash = :code_hash
            ORDER BY created_at DESC
            LIMIT 1
            """
        ),
        {"id_credencial": id_credencial, "code_hash": code_hash},
    ).fetchone()

    if not code_row:
        raise HTTPException(status_code=400, detail="Código o correo incorrecto")

    reset_token = _crear_reset_token(int(code_row[0]), id_credencial, email)
    return {"ok": True, "reset_token": reset_token}


@router.post("/reset")
def confirm_password_reset(body: PasswordResetConfirmSchema, db: Session = Depends(get_db)):
    """
    Cambia la contraseña usando reset_token, y marca el código como usado.
    """
    if body.password != body.confirm_password:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    payload = _decode_reset_token(body.reset_token)
    id_credencial = int(payload["id_credencial"])
    id_code = int(payload["id_code"])

    # Validar que el código siga vigente y no se haya usado
    row = db.execute(
        text(
            """
            SELECT used, expires_at
            FROM "Password_Reset_Codes"
            WHERE id = :id_code AND id_credencial = :id_credencial
            """
        ),
        {"id_code": id_code, "id_credencial": id_credencial},
    ).fetchone()

    if not row:
        raise HTTPException(status_code=400, detail="Token inválido")
    used, expires_at = bool(row[0]), row[1]
    if used:
        raise HTTPException(status_code=400, detail="Este código ya fue usado")
    if expires_at is None or expires_at <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="El código ya expiró")

    new_hash = hash_password(body.password)

    db.execute(
        text("SELECT fn_auth_update_password(:id_credencial, :password)"),
        {"id_credencial": id_credencial, "password": new_hash},
    )
    db.execute(
        text('UPDATE "Password_Reset_Codes" SET used = TRUE WHERE id = :id_code'),
        {"id_code": id_code},
    )
    db.commit()
    return {"ok": True}

