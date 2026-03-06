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

# CORS: con credentials el navegador no acepta '*'. Lista de orígenes separados por coma.
# Incluye el puerto del frontend (ej. 5123 o 5173) y la URL de devtunnels si la usas.
CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5123,http://127.0.0.1:5123")
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
