# Importacion del FastAPI
from fastapi import FastAPI, HTTPException , Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio


# Importacion de los routers
from routes.credenciales import router as credenciales_router
from routes.roles import protected_router as roles_router
from routes.dueno import router as dueno_router
from routes.restaurante import router as restaurante_router
from routes.mesas import router as mesas_router
from routes.cliente import router as cliente_router
from routes.empleado import router as empleado_router
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



# Importacion de los esquemas
from models import *

# Importacion de las funciones de envio de correos
from funciones.email_sender.timer_reserv import tarea_programada
from funciones.email_sender.email_utils import send_email


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Iniciar tarea programada
    asyncio.create_task(tarea_programada())
    yield
    # Shutdown: Aquí puedes agregar código de limpieza si es necesario


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia al dominio de tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # O especifica ["POST"]
    allow_headers=["*"],
)

# Routers protegidos (requieren autenticación)
app.include_router(credenciales_router, prefix="/credenciales")
app.include_router(roles_router)
app.include_router(dueno_router)
app.include_router(restaurante_router)
app.include_router(mesas_router)
app.include_router(cliente_router)
app.include_router(empleado_router)
app.include_router(enc_fac_router)
app.include_router(det_fac_router)
app.include_router(comentarios_router)
app.include_router(cal_mensuales_router)
app.include_router(data_owner_router, prefix="/data-owner")
app.include_router(enc_fac_reserva_router)
app.include_router(wompi_router)


# Routers públicos (sin autenticación)
app.include_router(categorias_router)
app.include_router(restaurante_router)
app.include_router(mesas_router)
app.include_router(register_router)
app.include_router(top_router)
app.include_router(searchBox_router)

# Contactanos
@app.post("/contactanos")
async def enviar_correo(data: EmailSchema):
    enviado = send_email(data.to, data.subject, data.message)
    if enviado:
        return {"mensaje": "Correo enviado correctamente"}
    else:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")

# Ejecutar servidor cuando se ejecute directamente con python3 main.py
if __name__ == "__main__":
    import uvicorn
    from config import BACKEND_HOST, BACKEND_PORT
    
    uvicorn.run(
        "main:app",
        host=BACKEND_HOST,
        port=BACKEND_PORT,
        reload=True
    )
