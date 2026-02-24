"""
Reservify - API Principal
Sistema de reservas para restaurantes.
"""
from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import BACKEND_HOST, BACKEND_PORT
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True,     reload_excludes=["venv"]
)
