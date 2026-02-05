from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from pathlib import Path

# Obtener la ruta del directorio padre (raíz del proyecto)
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

# Cargar variables de entorno desde el .env en la raíz del proyecto
load_dotenv(ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL")

# Configuración de host y puerto del backend desde .env
BACKEND_HOST = os.getenv("BACKEND_PORT", "0.0.0.0")  # BACKEND_PORT en .env contiene el host
BACKEND_PORT = int(os.getenv("BACKEND_HOST", "8000"))  # BACKEND_HOST en .env contiene el puerto

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
