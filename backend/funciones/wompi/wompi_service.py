import os
from dotenv import load_dotenv
import requests
from sqlalchemy.orm import Session
from sqlalchemy import text

load_dotenv()

WOMPI_PUBLIC_KEY = os.getenv("WOMPI_PUBLIC_KEY")
WOMPI_PRIVATE_KEY = os.getenv("WOMPI_PRIVATE_KEY")
WOMPI_API_URL = os.getenv("WOMPI_API_URL")

def tokenizar_tarjeta(numero: str, cvc: str, exp_month: str, exp_year: str, card_holder: str):
    """
    Tokeniza una tarjeta de crédito usando la API de Wompi
    """
    if not WOMPI_PUBLIC_KEY or not WOMPI_API_URL:
        raise ValueError("Error: las variables de entorno no se cargaron correctamente")
    
    url = f"{WOMPI_API_URL}/tokens/cards"
    headers = {
        "Authorization": f"Bearer {WOMPI_PUBLIC_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "number": numero,
        "cvc": cvc,
        "exp_month": exp_month,
        "exp_year": exp_year,
        "card_holder": card_holder
    }
    
    print("Tokenizando tarjeta...")  # Depuración
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        return {"success": True, "token": data["data"]["id"]}
    else:
        print(f"Error al tokenizar: {response.status_code} - {response.text}")
        return {"success": False, "error": response.text}

def crear_transaccion(
    monto: float,
    moneda: str,
    referencia: str,
    descripcion: str,
    correo_cliente: str,
    metodo_pago: dict
):
    if not WOMPI_PRIVATE_KEY or not WOMPI_API_URL:
        raise ValueError("Error: las variables de entorno no se cargaron correctamente")

    url = f"{WOMPI_API_URL}/transactions"
    headers = {
        "Authorization": f"Bearer {WOMPI_PRIVATE_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "amount_in_cents": int(monto * 100),
        "currency": moneda,
        "customer_email": correo_cliente,
        "payment_method": metodo_pago,
        "reference": referencia,
        "description": descripcion,
        "redirect_url": "https://tuweb.com/pago_exitoso"
    }

    print("Payload Wompi:", payload)  # Depuración

    response = requests.post(url, json=payload, headers=headers)

    try:
        data = response.json()
        # Agregar el status code HTTP a la respuesta para facilitar la verificación
        data["http_status_code"] = response.status_code
        # Si es asincrónico (ej. BANCOLOMBIA_TRANSFER), devolver async_payment_url
        if "data" in data and "payment_method" in data["data"]:
            pm = data["data"]["payment_method"]
            if pm.get("extra") and pm["extra"].get("async_payment_url"):
                data["redirect_to"] = pm["extra"]["async_payment_url"]
        return data
    except Exception:
        return {
            "status": "error",
            "mensaje": response.text,
            "http_status_code": response.status_code
        }


def confirmar_reserva_por_pago(db: Session, id_encab_fact: int) -> bool:
    """
    Ejecuta la función SQL confirmar_reserva_por_pago para actualizar el estado
    de la reserva de 'pendiente' a 'confirmada' cuando el pago ha sido aprobado.
    
    Parámetros:
        db: Sesión de base de datos
        id_encab_fact: ID del encabezado de factura asociado a la reserva
    
    Retorna:
        True si la reserva fue actualizada correctamente
        False si no se encontró una reserva pendiente con ese id_encab_fact
    """
    try:
        print(f"Ejecutando función SQL confirmar_reserva_por_pago con id_encab_fact: {id_encab_fact}")
        query = text("SELECT confirmar_reserva_por_pago(:id_encab_fact)")
        result = db.execute(query, {"id_encab_fact": id_encab_fact})
        db.commit()
        reserva_confirmada = result.scalar()
        print(f"Resultado de confirmar_reserva_por_pago: {reserva_confirmada}")
        return reserva_confirmada
    except Exception as e:
        db.rollback()
        print(f"Error al ejecutar confirmar_reserva_por_pago: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        raise
