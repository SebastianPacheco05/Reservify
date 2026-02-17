"""Listado de correos desde IMAP (bandeja de entrada) para el dashboard."""
import imaplib
import re
import email
from email.header import decode_header
from typing import Any


def _decode_mime(s: str | None) -> str:
    if not s:
        return ""
    try:
        parts = decode_header(s)
        out = []
        for part, enc in parts:
            if isinstance(part, bytes):
                out.append(part.decode(enc or "utf-8", errors="replace"))
            else:
                out.append(str(part))
        return " ".join(out).strip()
    except Exception:
        return str(s) if s else ""


def fetch_inbox(
    host: str,
    port: int,
    usuario: str,
    password: str,
    limit: int = 50,
) -> list[dict[str, Any]]:
    """
    Conecta por IMAP (SSL), selecciona INBOX y devuelve los correos no leídos (UNSEEN).
    Retorna lista de { "uid", "from", "subject", "date", "snippet" }.
    """
    result: list[dict[str, Any]] = []
    if not host or not usuario:
        return result
    try:
        port = port or 993
        use_ssl = port in (993, 143) or port >= 1000
        if use_ssl:
            M = imaplib.IMAP4_SSL(host, port=port)
        else:
            M = imaplib.IMAP4(host, port=port)
        try:
            M.login(usuario, password)
            M.select("INBOX", readonly=True)
            _, data = M.search(None, "UNSEEN")
            if not data or not data[0]:
                return result
            ids = data[0].split()
            # Últimos N (los IDs suelen ser ascendentes; tomamos los últimos)
            ids = ids[-limit:] if len(ids) > limit else ids
            ids.reverse()  # más recientes primero
            for bid in ids:
                try:
                    _, msg_data = M.fetch(bid, "(RFC822)")
                    if not msg_data or not msg_data[0]:
                        continue
                    raw = msg_data[0][1]
                    if isinstance(raw, bytes):
                        msg = email.message_from_bytes(raw)
                    else:
                        msg = email.message_from_string(raw)
                    from_ = _decode_mime(msg.get("From", ""))
                    subject = _decode_mime(msg.get("Subject", ""))
                    date_str = msg.get("Date", "")
                    snippet = ""
                    body_text = ""
                    body_html = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            ct = part.get_content_type()
                            if ct == "text/plain" and part.get_payload():
                                try:
                                    payload = part.get_payload(decode=True)
                                    if payload:
                                        body_text = payload.decode("utf-8", errors="replace").strip()
                                        snippet = body_text[:200]
                                except Exception:
                                    pass
                            elif ct == "text/html" and part.get_payload():
                                try:
                                    payload = part.get_payload(decode=True)
                                    if payload:
                                        body_html = payload.decode("utf-8", errors="replace").strip()
                                        if not snippet:
                                            plain = re.sub(r"<[^>]+>", " ", body_html)
                                            snippet = plain.strip()[:200]
                                except Exception:
                                    pass
                    else:
                        try:
                            payload = msg.get_payload(decode=True)
                            if payload:
                                raw = payload.decode("utf-8", errors="replace").strip()
                                if msg.get_content_type() == "text/html":
                                    body_html = raw
                                    snippet = re.sub(r"<[^>]+>", " ", raw).strip()[:200]
                                else:
                                    body_text = raw
                                    snippet = raw[:200]
                        except Exception:
                            pass
                    try:
                        uid = int(bid) if isinstance(bid, int) else int(bid.decode().strip().split()[0])
                    except Exception:
                        uid = len(result) + 1
                    result.append({
                        "uid": uid,
                        "from": from_,
                        "subject": subject or "(Sin asunto)",
                        "date": date_str,
                        "snippet": snippet,
                        "body_text": body_text,
                        "body_html": body_html,
                    })
                except Exception:
                    continue
        finally:
            try:
                M.logout()
            except Exception:
                pass
    except imaplib.IMAP4.error as e:
        raise ValueError(f"Error IMAP: {e}") from e
    except Exception as e:
        raise ValueError(f"Conexión IMAP: {e}") from e
    return result
