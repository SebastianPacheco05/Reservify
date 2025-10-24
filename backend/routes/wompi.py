from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from funciones.wompi.wompi_service import crear_transaccion, tokenizar_tarjeta
from models import PagoRequest

load_dotenv()

router = APIRouter(
    prefix="/wompi",
    tags=["Wompi"]
)

@router.get("/public-key")
async def obtener_clave_publica():
    """
    Endpoint para obtener la clave pública de Wompi (seguro exponerla)
    """
    public_key = os.getenv("WOMPI_PUBLIC_KEY")
    if not public_key:
        raise HTTPException(status_code=500, detail="Clave pública de Wompi no configurada")
    return {"public_key": public_key}

@router.post("/crear_pago")
async def crear_pago(data: PagoRequest):
    try:
        print("Request recibido Wompi:", data.dict())  # Depuración
        
        pm = data.payment_method
        
        # Si es pago con tarjeta y vienen los datos de la tarjeta, tokenizar primero
        if pm.type == "CARD" and pm.card_number and not pm.token:
            print("Tokenizando tarjeta en el backend...")
            token_result = tokenizar_tarjeta(
                numero=pm.card_number,
                cvc=pm.cvc,
                exp_month=pm.exp_month,
                exp_year=pm.exp_year,
                card_holder=pm.card_holder
            )
            
            if not token_result["success"]:
                raise HTTPException(status_code=400, detail=f"Error al tokenizar tarjeta: {token_result['error']}")
            
            # Usar el token generado
            pm.token = token_result["token"]
            print(f"Token generado: {pm.token}")
        
        # Preparar el método de pago para Wompi (sin datos sensibles de tarjeta)
        pm_dict = {
            "type": pm.type,
            "token": pm.token,
            "installments": pm.installments,
            "payment_description": pm.payment_description
        }
        # Remover None values
        pm_dict = {k: v for k, v in pm_dict.items() if v is not None}

        respuesta = crear_transaccion(
            monto=data.monto,
            moneda="COP",
            referencia=data.referencia,
            descripcion="Pago de reserva",
            correo_cliente=data.correo_cliente,
            metodo_pago=pm_dict
        )
        return respuesta
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en crear_pago: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
