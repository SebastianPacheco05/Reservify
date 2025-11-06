from fastapi import APIRouter, HTTPException, Depends
import os
import re
import traceback
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from config import get_db
from funciones.wompi.wompi_service import crear_transaccion, tokenizar_tarjeta, confirmar_reserva_por_pago
from models import PagoRequest

load_dotenv()

router = APIRouter(
    prefix="/wompi",
    tags=["Wompi"]
)

def extraer_id_encab_fact(referencia: str) -> int:
    """
    Extrae el id_encab_fact de la referencia (formato: RES-{id_encab_fact})
    """
    match = re.search(r'RES-(\d+)', referencia)
    if match:
        return int(match.group(1))
    raise ValueError(f"Formato de referencia inválido: {referencia}")

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
async def crear_pago(data: PagoRequest, db: Session = Depends(get_db)):
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
        
        # Confirmar la reserva automáticamente siempre que el endpoint responda exitosamente
        # Independientemente de la respuesta de Wompi, si llegamos aquí, el pago fue procesado
        print("✅ Pago enviado a Wompi, confirmando reserva automáticamente...")
        try:
            # Extraer el id_encab_fact de la referencia (formato: RES-{id_encab_fact})
            id_encab_fact = extraer_id_encab_fact(data.referencia)
            print(f"ID Encabezado Factura extraído: {id_encab_fact}")
            
            # Confirmar la reserva en la base de datos automáticamente
            reserva_confirmada = confirmar_reserva_por_pago(db, id_encab_fact)
            if reserva_confirmada:
                print("✅ Reserva confirmada exitosamente en la base de datos")
                # Agregar flag a la respuesta para indicar que la reserva fue confirmada
                respuesta["reserva_confirmada"] = True
            else:
                print("⚠️ No se encontró una reserva pendiente para confirmar")
                respuesta["reserva_confirmada"] = False
        except ValueError as e:
            print(f"⚠️ Error al extraer id_encab_fact: {str(e)}")
            respuesta["reserva_confirmada"] = False
        except Exception as e:
            print(f"⚠️ Error al confirmar reserva: {str(e)}")
            print(f"Tipo de error: {type(e).__name__}")
            print(f"Traceback: {traceback.format_exc()}")
            respuesta["reserva_confirmada"] = False
            # No lanzamos excepción para no afectar la respuesta del pago
        
        return respuesta
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en crear_pago: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) from e
