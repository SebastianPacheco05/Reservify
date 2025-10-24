import os
from dotenv import load_dotenv
import requests

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
            "code": response.status_code
        }
