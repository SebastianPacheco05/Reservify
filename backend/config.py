from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os
from pathlib import Path
from typing import Optional

# Obtener la ruta del directorio padre (raíz del proyecto)
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

# Cargar variables de entorno desde el .env en la raíz del proyecto
load_dotenv(ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL")

# Configuración de host y puerto del backend desde .env
BACKEND_HOST = os.getenv("BACKEND_HOST", "10.5.213.111")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

# Host y puerto del frontend desde .env para construir CORS por defecto
FRONTEND_HOST = os.getenv("FRONTEND_HOST", "localhost")
FRONTEND_PORT = os.getenv("FRONTEND_PORT", "5173")

# CORS: con credentials el navegador no acepta '*'.
# Lista de orígenes separados por coma, totalmente configurable desde .env.
# Si CORS_ORIGINS no está definido, se deriva de FRONTEND_HOST y FRONTEND_PORT.
cors_origins_env = os.getenv("CORS_ORIGINS")
if cors_origins_env and cors_origins_env.strip():
    CORS_ORIGINS_RAW = cors_origins_env
else:
    CORS_ORIGINS_RAW = f"http://{FRONTEND_HOST}:{FRONTEND_PORT}"

CORS_ORIGINS = [o.strip().rstrip("/") for o in CORS_ORIGINS_RAW.split(",") if o.strip()]

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def set_audit_user(db: Session, user_id: Optional[str]) -> None:
    """
    Establece el usuario de aplicación para Auditoria_Usuario (auditoría por usuario final).
    Debe llamarse al inicio de la transacción cuando hay un usuario logueado (ej. documento o id_credencial).
    Si user_id es None, los triggers guardarán usuario_app NULL (operación de sistema).
    """
    if user_id is None:
        return
    db.execute(text("SELECT set_config('app.usuario_id', :uid, true)"), {"uid": str(user_id)})
