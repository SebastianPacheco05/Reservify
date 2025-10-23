import requests
import os
from dotenv import load_dotenv

load_dotenv()

WOMPI_PUBLIC_KEY = os.getenv("WOMPI_PUBLIC_KEY")
WOMPI_PRIVATE_KEY = os.getenv("WOMPI_PRIVATE_KEY")
WOMPI_API_URL = os.getenv("WOMPI_API_URL")

def crear_transaccion(monto, moneda, referencia, descripcion, correo_cliente, metodo_pago):
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
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
