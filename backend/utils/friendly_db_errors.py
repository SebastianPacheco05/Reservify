from __future__ import annotations

from typing import Any

from sqlalchemy.exc import DBAPIError


def friendly_db_error_message(exc: Exception, default: str = "Error interno. Intenta nuevamente.") -> str:
    """
    Devuelve un mensaje seguro para exponer al cliente.

    - Si la BD ya relanzó un error controlado (ERRCODE=P0001), se usa ese mensaje.
    - En cualquier otro caso, se devuelve un mensaje genérico para evitar filtrar SQL/tabla/stack.
    """

    try:
        if isinstance(exc, DBAPIError):
            orig: Any = getattr(exc, "orig", None)
            pgcode = getattr(orig, "pgcode", None)
            if pgcode == "P0001":
                diag: Any = getattr(orig, "diag", None)
                msg = getattr(diag, "message_primary", None)
                if isinstance(msg, str) and msg.strip():
                    return msg.strip()

                # Fallback: primera línea del error original (sin query/params).
                s = str(orig).splitlines()[0].strip()
                return s or default
    except Exception:
        return default

    return default

