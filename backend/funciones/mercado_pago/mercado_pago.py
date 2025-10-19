import os
import mercadopago
from sqlalchemy.orm import Session

MP_ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN")
mp_sdk = mercadopago.SDK(MP_ACCESS_TOKEN)
FRONTEND_URL = os.getenv("FRONTEND_URL")
BACKEND_URL = os.getenv("BACKEND_URL")
MP_CURRENCY_ID = os.getenv("MP_CURRENCY_ID")

if not FRONTEND_URL or not BACKEND_URL or not MP_CURRENCY_ID:
    raise ValueError("Las variables de entorno FRONTEND_URL o BACKEND_URL o MP_CURRENCY_ID no están definidas. Verifique el archivo .env")

def save_pending_payment(db, id_encab_fact, id_reserva, documento, NIT, preference_id, amount):
    db.execute(
        """
        INSERT INTO "Pagos_MercadoPago" (id_factura, id_reserva, external_reference, id_mercadopago, monto, estado_pago)
        VALUES (:id_encab_fact, :id_reserva, :external_ref, :preference_id, :amount, 'pendiente')
        """,
        {
            "id_encab_fact": id_encab_fact,
            "id_reserva": id_reserva,
            "external_ref": f"{id_encab_fact}_{id_reserva}",
            "preference_id": preference_id,
            "amount": amount
        }
    )
    db.commit()


def update_payment_status(db: Session, external_reference: str, estado: str, monto: float):
    db.execute(
        """
        UPDATE "Pagos_MercadoPago"
        SET estado_pago = :estado, monto = :monto
        WHERE external_reference = :external_reference
        """,
        {"estado": estado, "monto": monto, "external_reference": external_reference}
    )
    db.commit()
    return {"external_reference": external_reference, "estado": estado, "monto": monto}


def create_preference_on_mp(items: list, external_reference: str):
    preference_data = {
        "items": [{"title": item["title"], "quantity": item["quantity"], "unit_price": item["unit_price"], "currency_id": MP_CURRENCY_ID} for item in items],
        "payer": {"email": "cliente@example.com"},
        "external_reference": external_reference,
        "back_urls": {
            "success": f"{FRONTEND_URL}/success",
            "failure": f"{FRONTEND_URL}/failure",
            "pending": f"{FRONTEND_URL}/pending"
        },
        "auto_return": "approved",
        "notification_url": f"{BACKEND_URL}/mercadopago/webhook",
    }

    pref_response = mp_sdk.preference().create(preference_data)
    print("Respuesta Mercado Pago:", pref_response)  # <-- Aquí revisa qué devuelve exactamente
    return pref_response.get("response")

