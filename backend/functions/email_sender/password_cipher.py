"""
Cifrado de contraseñas SMTP/IMAP para guardar en BD.
Se usa cifrado simétrico (Fernet). La app debe poder recuperar la contraseña
para conectar a los servidores de correo, por eso no se usa bcrypt (hash unidireccional).
"""
import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Cargar .env de la raíz del proyecto (mismo que config.py) para tener SECRET_KEY disponible
_ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(_ROOT_DIR / ".env")

_PREFIX_ENCRYPTED = "enc:"
_fernet: Fernet | None = None


def _get_fernet() -> Fernet | None:
    """Obtiene instancia Fernet desde ENCRYPTION_KEY_SMTP_IMAP (base64) o deriva de SECRET_KEY."""
    global _fernet
    if _fernet is not None:
        return _fernet
    key_b64 = os.getenv("ENCRYPTION_KEY_SMTP_IMAP", "").strip()
    if key_b64:
        try:
            key = key_b64.encode() if isinstance(key_b64, str) else key_b64
            _fernet = Fernet(key)
            return _fernet
        except Exception:
            pass
    secret = os.getenv("SECRET_KEY", "").strip()
    if secret and len(secret) >= 16:
        try:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b"reservify_smtp_imap_v1",
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(secret.encode()[:64]))
            _fernet = Fernet(key)
            return _fernet
        except Exception:
            pass
    return None


def encrypt_password(plain: str) -> str:
    """Cifra la contraseña para guardar en BD. Si no hay clave de cifrado, lanza error (nunca guardar en claro)."""
    if not plain or not plain.strip():
        return ""
    f = _get_fernet()
    if not f:
        raise ValueError(
            "No se puede cifrar la contraseña: configura SECRET_KEY en .env (o ENCRYPTION_KEY_SMTP_IMAP). "
            "Las contraseñas SMTP/IMAP deben guardarse cifradas."
        )
    token = f.encrypt(plain.encode("utf-8"))
    return _PREFIX_ENCRYPTED + token.decode("ascii")


def decrypt_password(stored: str | None) -> str:
    """Descifra la contraseña guardada. Si no está cifrada o falla, devuelve el valor original (legacy)."""
    if not stored or not stored.strip():
        return ""
    if not stored.startswith(_PREFIX_ENCRYPTED):
        return stored
    f = _get_fernet()
    if not f:
        return stored
    try:
        token = stored[len(_PREFIX_ENCRYPTED) :].encode("ascii")
        return f.decrypt(token).decode("utf-8")
    except InvalidToken:
        return ""
    except Exception:
        return ""
