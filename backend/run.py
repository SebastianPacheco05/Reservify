"""
Script para ejecutar el servidor uvicorn con configuración desde .env
"""
import uvicorn
from pathlib import Path

from config import BACKEND_HOST, BACKEND_PORT

BACKEND_DIR = str(Path(__file__).resolve().parent)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=BACKEND_HOST,
        port=BACKEND_PORT,
        reload=True,
        reload_dirs=[BACKEND_DIR],
        reload_excludes=["venv", "venv/**", "__pycache__", "**/__pycache__"],
    )

