from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routes.credenciales import router as credenciales_router
from routes.roles import protected_router as roles_router
from routes.dueno import router as dueno_router
from routes.restaurante import router as restaurante_router
from routes.mesas import router as mesas_router
from routes.cliente import router as cliente_router
from routes.empleado import router as empleado_router
from routes.enc_fac import router as enc_fac_router
from routes.det_fac import router as det_fac_router
from routes.reserva import router as reserva_router
from routes.categorias import router as categorias_router
from routes.comentarios import router as comentarios_router
from routes.cal_mensuales import router as cal_mensuales_router
from routes.register import router as register_router
from routes.top import app as top_router
from routes.searchBox import app as searchBox_router
from routes.data_owner import router as data_owner_router
from routes.mercado_pago import router as mercado_pago_router

from models import EmailSchema
from funciones.email_sender.timer_reserv import tarea_programada
from funciones.email_sender.email_utils import send_email

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(credenciales_router, prefix="/credenciales")
app.include_router(roles_router)
app.include_router(dueno_router)
app.include_router(restaurante_router)
app.include_router(mesas_router)
app.include_router(cliente_router)
app.include_router(empleado_router)
app.include_router(enc_fac_router)
app.include_router(det_fac_router)
app.include_router(reserva_router)
app.include_router(register_router)
app.include_router(categorias_router)
app.include_router(comentarios_router)
app.include_router(cal_mensuales_router)
app.include_router(top_router)
app.include_router(searchBox_router)
app.include_router(data_owner_router, prefix="/data-owner")
app.include_router(mercado_pago_router)

@app.post("/contactanos")
async def enviar_correo(data: EmailSchema):
    enviado = send_email(data.to, data.subject, data.message)
    if enviado:
        return {"mensaje": "Correo enviado correctamente"}
    else:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")

@app.on_event("startup")
async def startup_event():
    import asyncio
    asyncio.create_task(tarea_programada())
