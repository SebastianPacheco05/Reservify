"""Configuración SMTP e IMAP desde BD (uso solo admin/dueño/empleado en dashboard)."""
from email.utils import parsedate_to_datetime
from sqlalchemy.orm import Session
from sqlalchemy import text

from functions.email_sender.password_cipher import encrypt_password, decrypt_password


def get_smtp_config(db: Session, id_credencial: int) -> dict | None:
    """
    Obtiene la configuración SMTP del usuario (id_credencial).
    Retorna dict con host, port, usuario, password_encrypted, from_email, consentimiento_archivo.
    """
    try:
        row = db.execute(
            text(
                'SELECT host, port, usuario, password_encrypted, from_email, '
                'COALESCE(consentimiento_archivo, FALSE) FROM "SMTP_config" WHERE id_credencial = :id_credencial LIMIT 1'
            ),
            {"id_credencial": id_credencial},
        ).fetchone()
        if not row:
            return None
        pwd = decrypt_password(row[3])
        return {
            "host": row[0],
            "port": row[1],
            "usuario": row[2],
            "password_encrypted": pwd,
            "from_email": row[4],
            "consentimiento_archivo": bool(row[5]) if len(row) > 5 else False,
        }
    except Exception:
        try:
            row = db.execute(
                text(
                    'SELECT host, port, usuario, password_encrypted, from_email FROM "SMTP_config" WHERE id_credencial = :id_credencial LIMIT 1'
                ),
                {"id_credencial": id_credencial},
            ).fetchone()
            if not row:
                return None
            pwd = decrypt_password(row[3])
            return {
                "host": row[0],
                "port": row[1],
                "usuario": row[2],
                "password_encrypted": pwd,
                "from_email": row[4],
                "consentimiento_archivo": False,
            }
        except Exception:
            return None


def get_smtp_config_para_dashboard(db: Session, id_credencial: int) -> dict | None:
    """GET para dashboard: misma estructura pero sin devolver password (solo indicador)."""
    c = get_smtp_config(db, id_credencial)
    if not c:
        return None
    return {
        "host": c["host"],
        "port": c["port"],
        "usuario": c["usuario"],
        "from_email": c["from_email"],
        "tiene_password": bool(c.get("password_encrypted")),
        "consentimiento_archivo": c.get("consentimiento_archivo", False),
    }


def upsert_smtp_config(
    db: Session,
    id_credencial: int,
    host: str,
    port: int,
    usuario: str,
    from_email: str,
    password_encrypted: str | None = None,
    consentimiento_archivo: bool | None = None,
) -> None:
    """Crea o actualiza la configuración SMTP del usuario (id_credencial). Si consentimiento_archivo es None, no se cambia en UPDATE."""
    try:
        row = db.execute(
            text('SELECT id FROM "SMTP_config" WHERE id_credencial = :id_credencial LIMIT 1'),
            {"id_credencial": id_credencial},
        ).fetchone()
        consent = consentimiento_archivo if consentimiento_archivo is not None else False
        pwd_to_store = encrypt_password(password_encrypted) if (password_encrypted and password_encrypted.strip()) else None
        if row:
            if consentimiento_archivo is not None:
                if pwd_to_store:
                    db.execute(
                        text(
                            'UPDATE "SMTP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'from_email = :from_email, password_encrypted = :pwd, '
                            'consentimiento_archivo = :consent, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "from_email": from_email, "pwd": pwd_to_store, "consent": consent, "id": row[0]},
                    )
                else:
                    db.execute(
                        text(
                            'UPDATE "SMTP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'from_email = :from_email, consentimiento_archivo = :consent, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "from_email": from_email, "consent": consent, "id": row[0]},
                    )
            else:
                if pwd_to_store:
                    db.execute(
                        text(
                            'UPDATE "SMTP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'from_email = :from_email, password_encrypted = :pwd, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "from_email": from_email, "pwd": pwd_to_store, "id": row[0]},
                    )
                else:
                    db.execute(
                        text(
                            'UPDATE "SMTP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'from_email = :from_email, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "from_email": from_email, "id": row[0]},
                    )
        else:
            db.execute(
                text(
                    'INSERT INTO "SMTP_config" (id_credencial, host, port, usuario, password_encrypted, from_email, consentimiento_archivo) '
                    'VALUES (:id_credencial, :host, :port, :usuario, :pwd, :from_email, :consent)'
                ),
                {"id_credencial": id_credencial, "host": host, "port": port, "usuario": usuario, "pwd": pwd_to_store or "", "from_email": from_email, "consent": consent},
            )
        db.commit()
    except Exception:
        db.rollback()
        raise


def get_imap_config(db: Session, id_credencial: int) -> dict | None:
    """Obtiene la configuración IMAP del usuario (sin password para dashboard)."""
    try:
        row = db.execute(
            text(
                'SELECT host, port, usuario, password_encrypted, COALESCE(consentimiento_archivo, FALSE) FROM "IMAP_config" WHERE id_credencial = :id_credencial LIMIT 1'
            ),
            {"id_credencial": id_credencial},
        ).fetchone()
        if not row:
            return None
        return {
            "host": row[0],
            "port": row[1],
            "usuario": row[2],
            "tiene_password": bool(row[3]),
            "consentimiento_archivo": bool(row[4]) if len(row) > 4 else False,
        }
    except Exception:
        try:
            row = db.execute(
                text('SELECT host, port, usuario, password_encrypted FROM "IMAP_config" WHERE id_credencial = :id_credencial LIMIT 1'),
                {"id_credencial": id_credencial},
            ).fetchone()
            if not row:
                return None
            return {
                "host": row[0],
                "port": row[1],
                "usuario": row[2],
                "tiene_password": bool(row[3]),
                "consentimiento_archivo": False,
            }
        except Exception:
            return None


def get_imap_config_with_password(db: Session, id_credencial: int) -> dict | None:
    """Obtiene IMAP_config del usuario con password y consentimiento para uso interno."""
    try:
        row = db.execute(
            text(
                'SELECT host, port, usuario, password_encrypted, COALESCE(consentimiento_archivo, FALSE) FROM "IMAP_config" WHERE id_credencial = :id_credencial LIMIT 1'
            ),
            {"id_credencial": id_credencial},
        ).fetchone()
        if not row or not row[0] or not row[2]:
            return None
        pwd = decrypt_password(row[3])
        return {
            "host": row[0],
            "port": row[1] or 993,
            "usuario": row[2],
            "password_encrypted": pwd or "",
            "consentimiento_archivo": bool(row[4]) if len(row) > 4 else False,
        }
    except Exception:
        try:
            row = db.execute(
                text('SELECT host, port, usuario, password_encrypted FROM "IMAP_config" WHERE id_credencial = :id_credencial LIMIT 1'),
                {"id_credencial": id_credencial},
            ).fetchone()
            if not row or not row[0] or not row[2]:
                return None
            pwd = decrypt_password(row[3])
            return {
                "host": row[0],
                "port": row[1] or 993,
                "usuario": row[2],
                "password_encrypted": pwd or "",
                "consentimiento_archivo": False,
            }
        except Exception:
            return None


def upsert_imap_config(
    db: Session,
    id_credencial: int,
    host: str,
    port: int,
    usuario: str,
    password_encrypted: str | None = None,
    consentimiento_archivo: bool | None = None,
) -> None:
    """Crea o actualiza la configuración IMAP del usuario (id_credencial)."""
    try:
        row = db.execute(
            text('SELECT id FROM "IMAP_config" WHERE id_credencial = :id_credencial LIMIT 1'),
            {"id_credencial": id_credencial},
        ).fetchone()
        consent = consentimiento_archivo if consentimiento_archivo is not None else False
        pwd_imap_to_store = encrypt_password(password_encrypted) if (password_encrypted and password_encrypted.strip()) else None
        if row:
            if consentimiento_archivo is not None:
                if pwd_imap_to_store is not None:
                    db.execute(
                        text(
                            'UPDATE "IMAP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'password_encrypted = :pwd, consentimiento_archivo = :consent, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "pwd": pwd_imap_to_store, "consent": consent, "id": row[0]},
                    )
                else:
                    db.execute(
                        text(
                            'UPDATE "IMAP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'consentimiento_archivo = :consent, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "consent": consent, "id": row[0]},
                    )
            else:
                if pwd_imap_to_store is not None:
                    db.execute(
                        text(
                            'UPDATE "IMAP_config" SET host = :host, port = :port, usuario = :usuario, '
                            'password_encrypted = :pwd, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "pwd": pwd_imap_to_store, "id": row[0]},
                    )
                else:
                    db.execute(
                        text(
                            'UPDATE "IMAP_config" SET host = :host, port = :port, usuario = :usuario, updated_at = NOW() WHERE id = :id'
                        ),
                        {"host": host, "port": port, "usuario": usuario, "id": row[0]},
                    )
        else:
            db.execute(
                text(
                    'INSERT INTO "IMAP_config" (id_credencial, host, port, usuario, password_encrypted, consentimiento_archivo) '
                    'VALUES (:id_credencial, :host, :port, :usuario, :pwd, :consent)'
                ),
                {"id_credencial": id_credencial, "host": host, "port": port, "usuario": usuario, "pwd": pwd_imap_to_store or "", "consent": consent},
            )
        db.commit()
    except Exception:
        db.rollback()
        raise


def insert_mails(db: Session, correos: list[dict], id_credencial: int) -> None:
    """
    Inserta o actualiza correos en la tabla Mails (por id_credencial + imap_uid).
    Cada item debe tener: uid, from, subject, date (string RFC), snippet; opcional: body_text, body_html, to_email.
    id_credencial: usuario al que le llega el correo (para filtrar y acelerar SELECT).
    """
    if not correos:
        return
    try:
        for c in correos:
            date_received = None
            if c.get("date"):
                try:
                    date_received = parsedate_to_datetime(c["date"])
                except Exception:
                    pass
            body_text = (c.get("body_text") or "")[:50000] or None
            body_html = (c.get("body_html") or "")[:500000] or None  # HTML puede ser grande
            try:
                db.execute(
                    text(
                        'INSERT INTO "Mails" (id_credencial, imap_uid, from_email, to_email, subject, snippet, body_text, body_html, date_received) '
                        'VALUES (:id_credencial, :imap_uid, :from_email, :to_email, :subject, :snippet, :body_text, :body_html, :date_received) '
                        'ON CONFLICT (id_credencial, imap_uid) DO UPDATE SET '
                        'subject = EXCLUDED.subject, snippet = EXCLUDED.snippet, '
                        'body_text = COALESCE(EXCLUDED.body_text, "Mails".body_text), '
                        'body_html = COALESCE(EXCLUDED.body_html, "Mails".body_html), '
                        'date_received = EXCLUDED.date_received'
                    ),
                    {
                        "id_credencial": id_credencial,
                        "imap_uid": c.get("uid"),
                        "from_email": (c.get("from") or "")[:512],
                        "to_email": (c.get("to_email") or "")[:512] or None,
                        "subject": (c.get("subject") or "")[:1024],
                        "snippet": (c.get("snippet") or "")[:1024] or None,
                        "body_text": body_text,
                        "body_html": body_html,
                        "date_received": date_received,
                    },
                )
            except Exception:
                continue
        db.commit()
    except Exception:
        db.rollback()
        raise


def get_mails_by_credencial(db: Session, id_credencial: int, limit: int = 50) -> list[dict]:
    """
    Lista correos de Mails filtrados por usuario (id_credencial), ordenados por fecha.
    Usa índice (id_credencial, date_received) para respuestas rápidas.
    """
    try:
        rows = db.execute(
            text(
                'SELECT imap_uid, from_email, subject, date_received, snippet '
                'FROM "Mails" WHERE id_credencial = :id_credencial '
                'ORDER BY date_received DESC NULLS LAST, created_at DESC NULLS LAST LIMIT :lim'
            ),
            {"id_credencial": id_credencial, "lim": limit},
        ).fetchall()
        return [
            {
                "uid": r[0],
                "from": r[1] or "",
                "subject": r[2] or "",
                "date": r[3].isoformat() if r[3] else "",
                "snippet": r[4] or "",
            }
            for r in rows
        ]
    except Exception:
        return []


def get_mail_by_uid(db: Session, imap_uid: int, id_credencial: int) -> dict | None:
    """Obtiene un correo de Mails por imap_uid y id_credencial (con body_text y body_html)."""
    try:
        row = db.execute(
            text(
                'SELECT imap_uid, from_email, to_email, subject, snippet, body_text, body_html, date_received, created_at '
                'FROM "Mails" WHERE imap_uid = :uid AND id_credencial = :id_credencial LIMIT 1'
            ),
            {"uid": imap_uid, "id_credencial": id_credencial},
        ).fetchone()
        if not row:
            return None
        return {
            "uid": row[0],
            "from": row[1],
            "to_email": row[2],
            "subject": row[3],
            "snippet": row[4],
            "body_text": row[5],
            "body_html": row[6],
            "date": row[7].isoformat() if row[7] else "",
            "created_at": row[8].isoformat() if row[8] else "",
        }
    except Exception:
        return None
