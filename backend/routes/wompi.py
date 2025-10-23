from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from funciones.wompi.wompi_service import crear_transaccion

router = APIRouter(
    prefix="/wompi",
    tags=["Wompi"]
)

class PagoRequest(BaseModel):
    monto: float
    referencia: str
    correo_cliente: str

@router.post("/crear_pago")
async def crear_pago(data: PagoRequest):
    try:
        metodo_pago = {"type": "CARD"}  # Por ahora, ejemplo con tarjeta
        respuesta = crear_transaccion(
            monto=data.monto,
            moneda="COP",
            referencia=data.referencia,
            descripcion="Pago de reserva",
            correo_cliente=data.correo_cliente,
            metodo_pago=metodo_pago
        )
        return respuesta
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
