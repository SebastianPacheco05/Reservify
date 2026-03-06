"""
Reservify - API Principal
Sistema de reservas para restaurantes.
"""
from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from config import BACKEND_HOST, BACKEND_PORT, CORS_ORIGINS
from models import EmailSchema
from functions.email_sender.timer_reserv import tarea_programada
from functions.email_sender.email_utils import send_email

# Routers
from routes.credenciales import router as credenciales_router
from routes.roles import protected_router as roles_router
from routes.usuario import router as usuario_router
from routes.restaurante import router as restaurante_router
from routes.mesas import router as mesas_router
from routes.cliente import router as cliente_router
from routes.enc_fac import router as enc_fac_router
from routes.det_fac import router as det_fac_router
from routes.categorias import router as categorias_router
from routes.comentarios import router as comentarios_router
from routes.cal_mensuales import router as cal_mensuales_router
from routes.register import router as register_router
from routes.top import app as top_router
from routes.searchBox import app as searchBox_router
from routes.data_owner import router as data_owner_router
from routes.enc_fac_reserva import router as enc_fac_reserva_router
from routes.wompi import router as wompi_router
from routes.restaurantes_map import router as restaurantes_map_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ciclo de vida: inicia tarea de emails programados."""
    asyncio.create_task(tarea_programada())
    yield


app = FastAPI(title="Reservify API", lifespan=lifespan)


def _origin_allowed(origin: str) -> bool:
    """True si el origen está permitido (lista CORS o localhost/127.0.0.1 en cualquier puerto)."""
    if not origin or not origin.strip():
        return False
    origin = origin.strip().rstrip("/")
    origins = CORS_ORIGINS if CORS_ORIGINS else ["*"]
    if origins == ["*"] or origin in origins:
        return True
    # En desarrollo: permitir localhost y 127.0.0.1 en cualquier puerto
    if origin.startswith("http://localhost:") or origin.startswith("https://localhost:"):
        return True
    if origin.startswith("http://127.0.0.1:") or origin.startswith("https://127.0.0.1:"):
        return True
    return False


class OptionalPreflightMiddleware(BaseHTTPMiddleware):
    """
    Responde 200 a OPTIONS (preflight) con CORS correctos.
    Usa siempre el Origin de la petición en Allow-Origin cuando está permitido, para que coincida.
    """
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            origin = (request.headers.get("origin") or "").strip().rstrip("/")
            # Devolver el mismo Origin que envió el navegador para que el POST no sea bloqueado
            allow_origin = origin if _origin_allowed(origin) else (CORS_ORIGINS[0] if CORS_ORIGINS else "*")
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": allow_origin,
                    "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
                    "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "content-type,authorization"),
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Max-Age": "600",
                },
            )
        return await call_next(request)


# Con credentials (cookies/tokens) el navegador no acepta Allow-Origin: *; hay que listar orígenes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Responde 200 a OPTIONS (preflight) antes que el CORS; así evitamos 400 si el origen no coincidía.
app.add_middleware(OptionalPreflightMiddleware)

# Routers (restaurante y mesas tienen rutas mixtas público/protegido)
app.include_router(credenciales_router, prefix="/credenciales")
app.include_router(roles_router)
app.include_router(usuario_router)
app.include_router(restaurante_router)
app.include_router(mesas_router)
app.include_router(cliente_router)
app.include_router(enc_fac_router)
app.include_router(det_fac_router)
app.include_router(comentarios_router)
app.include_router(cal_mensuales_router)
app.include_router(data_owner_router, prefix="/data-owner")
app.include_router(enc_fac_reserva_router)
app.include_router(wompi_router)
app.include_router(categorias_router)
app.include_router(register_router)
app.include_router(top_router)
app.include_router(searchBox_router)
app.include_router(restaurantes_map_router)


@app.post("/contactanos")
async def enviar_correo_contacto(data: EmailSchema):
    """Envía correo desde formulario de contacto."""
    enviado = send_email(data.to, data.subject, data.message)
    if not enviado:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")
    return {"mensaje": "Correo enviado correctamente"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=BACKEND_HOST,
        port=BACKEND_PORT,
        reload=True,
        reload_excludes=["venv", "venv/**", "**/venv/**"],
    )
