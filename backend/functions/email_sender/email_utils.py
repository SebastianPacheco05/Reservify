import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email(to_email: str, subject: str, message: str) -> bool:
    """Envía correo usando variables de entorno (fallback si no hay config en BD)."""
    return send_email_with_config(None, to_email, subject, message)


def send_email_with_config(
    smtp_config: dict | None, to_email: str, subject: str, message: str
) -> bool:
    """
    Envía correo. Si smtp_config está definido (desde BD), lo usa;
    si no, usa variables de entorno.
    smtp_config: { "host", "port", "usuario", "password_encrypted", "from_email" }
    """
    if smtp_config and smtp_config.get("host") and smtp_config.get("usuario"):
        host = smtp_config["host"]
        port = int(smtp_config.get("port", 587))
        usuario = smtp_config["usuario"]
        password = smtp_config.get("password_encrypted") or ""
        from_email = smtp_config.get("from_email") or usuario
    else:
        host = EMAIL_HOST
        port = int(EMAIL_PORT) if EMAIL_PORT else 587
        usuario = EMAIL_ADDRESS
        password = EMAIL_PASSWORD or ""
        from_email = EMAIL_ADDRESS or ""

    if not host or not usuario:
        print("No hay configuración SMTP (ni BD ni env)")
        return False

    try:
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "plain"))

        server = smtplib.SMTP(host, port)
        server.starttls()
        if password:
            server.login(usuario, password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print("Error al enviar correo:", e)
        return False
