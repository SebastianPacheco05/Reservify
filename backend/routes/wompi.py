from fastapi import APIRouter, HTTPException, Depends, Request
import os
import re
import traceback
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from config import get_db
from functions.wompi.wompi_service import (
    crear_transaccion, 
    tokenizar_tarjeta, 
    confirmar_reserva_por_pago,
    obtener_acceptance_token,
    generar_signature,
    consultar_transaccion
)
from functions.wompi.webhook_validator import validar_firma_webhook
from models import PagoRequest

# Cargar variables de entorno desde el .env de la raíz del proyecto
project_root = Path(__file__).parent.parent.parent
env_path = project_root / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
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


@router.get("/transaccion/{transaction_id}")
async def consultar_transaccion_endpoint(transaction_id: str):
    """
    Consulta el estado de una transacción específica en Wompi.
    """
    try:
        resultado = consultar_transaccion(transaction_id)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/webhook")
async def webhook_wompi(request: Request, db: Session = Depends(get_db)):
    """
    Endpoint para recibir notificaciones de Wompi sobre cambios en transacciones.
    Valida la firma antes de procesar el evento.
    """
    try:
        # Obtener el body del request
        body = await request.json()
        
        # Obtener checksum del header o del body
        checksum_header = request.headers.get("X-Event-Checksum")
        checksum_body = body.get("signature", {}).get("checksum")
        checksum = checksum_header or checksum_body
        
        if not checksum:
            print("⚠️ No se encontró checksum en el webhook")
            return {"status": "error", "message": "Checksum no encontrado"}, 400
        
        # Validar firma
        integrity_secret = os.getenv("WOMPI_INTEGRITY_SECRET")
        if not integrity_secret:
            print("⚠️ WOMPI_INTEGRITY_SECRET no está configurado")
            return {"status": "error", "message": "Configuración incompleta"}, 500
        
        if not validar_firma_webhook(body, checksum, integrity_secret):
            print("❌ Firma de webhook inválida")
            return {"status": "error", "message": "Firma inválida"}, 401
        
        # Procesar el evento
        event_type = body.get("event")
        event_data = body.get("data", {})
        transaction = event_data.get("transaction", {})
        
        print(f"📨 Webhook recibido: {event_type}")
        print(f"   Transaction ID: {transaction.get('id')}")
        print(f"   Status: {transaction.get('status')}")
        print(f"   Reference: {transaction.get('reference')}")
        
        # Solo procesar eventos de actualización de transacción
        if event_type == "transaction.updated":
            transaction_status = transaction.get("status")
            reference = transaction.get("reference")
            
            # Si la transacción fue aprobada, confirmar la reserva
            if transaction_status == "APPROVED":
                try:
                    id_encab_fact = extraer_id_encab_fact(reference)
                    reserva_confirmada = confirmar_reserva_por_pago(db, id_encab_fact)
                    
                    if reserva_confirmada:
                        print(f"✅ Reserva confirmada desde webhook para referencia: {reference}")
                    else:
                        print(f"⚠️ No se encontró reserva pendiente para referencia: {reference}")
                except ValueError as e:
                    print(f"⚠️ Error al extraer id_encab_fact: {str(e)}")
                except Exception as e:
                    print(f"⚠️ Error al confirmar reserva desde webhook: {str(e)}")
                    print(f"Traceback: {traceback.format_exc()}")
        
        # Responder con 200 OK para confirmar recepción
        return {"status": "ok", "message": "Webhook procesado correctamente"}, 200
        
    except Exception as e:
        print(f"❌ Error al procesar webhook: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        # Aún así responder con 200 para evitar reintentos de Wompi
        return {"status": "error", "message": str(e)}, 200

@router.post("/crear_pago")
async def crear_pago(data: PagoRequest, request: Request, db: Session = Depends(get_db)):
    try:
        print("Request recibido Wompi:", data.model_dump())  # Depuración
        
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

        # Obtener acceptance_token
        print("Obteniendo acceptance_token...")
        acceptance_result = obtener_acceptance_token()
        if not acceptance_result["success"]:
            raise HTTPException(status_code=500, detail="Error al obtener acceptance_token")
        acceptance_token = acceptance_result["acceptance_token"]
        
        # Generar signature
        amount_in_cents = int(data.monto * 100)
        integrity_secret = os.getenv("WOMPI_INTEGRITY_SECRET")
        if not integrity_secret:
            raise HTTPException(status_code=500, detail="WOMPI_INTEGRITY_SECRET no está configurado")
        
        signature = generar_signature(
            reference=data.referencia,
            amount_in_cents=amount_in_cents,
            currency="COP",
            integrity_secret=integrity_secret
        )
        
        # Extraer IP del cliente
        ip_address = None
        if "x-forwarded-for" in request.headers:
            ip_address = request.headers["x-forwarded-for"].split(",")[0].strip()
        elif request.client:
            ip_address = request.client.host
        
        # Crear transacción con todos los campos requeridos
        respuesta = crear_transaccion(
            monto=data.monto,
            moneda="COP",
            referencia=data.referencia,
            descripcion="Pago de reserva",
            correo_cliente=data.correo_cliente,
            metodo_pago=pm_dict,
            acceptance_token=acceptance_token,
            signature=signature,
            ip_address=ip_address
        )
        
        # Verificar el estado de la transacción antes de confirmar
        transaction_status = None
        transaction_id = None
        
        if respuesta.get("http_status_code") in [200, 201] and respuesta.get("data"):
            transaction_id = respuesta["data"].get("id")
            transaction_status = respuesta["data"].get("status")
            print(f"Transacción creada: {transaction_id}, Estado: {transaction_status}")
        
        # Solo confirmar reserva si el estado es APPROVED
        if transaction_status == "APPROVED":
            print("✅ Transacción aprobada, confirmando reserva...")
            try:
                id_encab_fact = extraer_id_encab_fact(data.referencia)
                reserva_confirmada = confirmar_reserva_por_pago(db, id_encab_fact)
                respuesta["reserva_confirmada"] = reserva_confirmada
            except Exception as e:
                print(f"⚠️ Error al confirmar reserva: {str(e)}")
                respuesta["reserva_confirmada"] = False
        else:
            print(f"⚠️ Transacción en estado {transaction_status}, no se confirma reserva aún")
            respuesta["reserva_confirmada"] = False
        
        # Agregar transaction_id para seguimiento
        if transaction_id:
            respuesta["transaction_id"] = transaction_id
        
        return respuesta
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en crear_pago: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) from e
