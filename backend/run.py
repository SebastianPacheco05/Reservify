"""
Script para ejecutar el servidor uvicorn con configuración desde .env
"""
import uvicorn
from config import BACKEND_HOST, BACKEND_PORT

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=BACKEND_HOST,
        port=BACKEND_PORT,
        reload=True
    )

