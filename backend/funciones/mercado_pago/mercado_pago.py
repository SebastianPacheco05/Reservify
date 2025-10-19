import os
import mercadopago
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MP_ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN")
mp_sdk = mercadopago.SDK(MP_ACCESS_TOKEN)
FRONTEND_URL = os.getenv("FRONTEND_URL")
BACKEND_URL = os.getenv("BACKEND_URL")
MP_CURRENCY_ID = os.getenv("MP_CURRENCY_ID")

# Verificar que el ACCESS_TOKEN sea de sandbox
if MP_ACCESS_TOKEN:
    if "TEST" not in MP_ACCESS_TOKEN:
        logger.warning("⚠️  El ACCESS_TOKEN no parece ser de sandbox. Asegúrate de usar credenciales de prueba.")
else:
    raise ValueError("MERCADOPAGO_ACCESS_TOKEN no está definido en las variables de entorno. Verifique el archivo .env")

def save_pending_payment(db: Session, id_encab_fact, id_reserva, documento, NIT, preference_id, amount):
    sql_insert = text("""
        INSERT INTO "Pagos_MercadoPago" 
        (id_factura, id_reserva, external_reference, id_mercadopago, monto, estado_pago)
        VALUES (:id_encab_fact, :id_reserva, :external_ref, :preference_id, :amount, 'pendiente')
    """)
    db.execute(sql_insert, {
        "id_encab_fact": id_encab_fact,
        "id_reserva": id_reserva,
        "external_ref": f"{id_encab_fact}_{id_reserva}",
        "preference_id": preference_id,
        "amount": amount
    })
    db.commit()


def update_payment_status(db: Session, external_reference: str, estado: str, monto: float):
    sql_update = text("""
        UPDATE "Pagos_MercadoPago"
        SET estado_pago = :estado, monto = :monto
        WHERE external_reference = :external_reference
    """)
    db.execute(sql_update, {
        "estado": estado,
        "monto": monto,
        "external_reference": external_reference
    })
    db.commit()
    return {"external_reference": external_reference, "estado": estado, "monto": monto}


def create_preference_on_mp(items: list, external_reference: str):
    preference_data = {
        "items": [
            {
                "title": item["title"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"],
                "currency_id": MP_CURRENCY_ID
            } for item in items
        ],
        "payer": {
            "email": "test_user_123456@testuser.com"  # Email único para pruebas
        },
        "external_reference": external_reference,
        "back_urls": {
            "success": f"{FRONTEND_URL}/success",
            "failure": f"{FRONTEND_URL}/failure",
            "pending": f"{FRONTEND_URL}/pending"
        },
        "auto_return": "approved",
        "notification_url": f"{BACKEND_URL}/mercadopago/webhook",
        "binary_mode": False,
        "site_id": "MCO"  # Colombia - el modo de prueba se determina por el ACCESS_TOKEN
    }

    # logger.info(f"🔧 Creando preferencia con datos: {preference_data}")
    
    try:
        pref_response = mp_sdk.preference().create(preference_data)
        # logger.info(f"📋 Respuesta de Mercado Pago: {pref_response}")
        
        if pref_response.get("status") == 201:
            return pref_response.get("response")
        else:
            logger.error(f"❌ Error en la creación de preferencia: {pref_response}")
            return None
            
    except Exception as e:
        logger.error(f"💥 Excepción al crear preferencia: {str(e)}")
        raise e
