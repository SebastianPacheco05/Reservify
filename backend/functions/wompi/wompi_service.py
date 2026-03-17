import os
import requests
import hashlib
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from sqlalchemy.orm import Session
from sqlalchemy import text

WOMPI_PUBLIC_KEY = os.getenv("WOMPI_PUBLIC_KEY")
WOMPI_PRIVATE_KEY = os.getenv("WOMPI_PRIVATE_KEY")
WOMPI_API_URL = os.getenv("WOMPI_API_URL")
WOMPI_INTEGRITY_SECRET = os.getenv("WOMPI_INTEGRITY_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Configurar sesión de requests con reintentos y timeout
def crear_sesion_wompi():
    """
    Crea una sesión de requests configurada con reintentos y timeout para Wompi.
    """
    session = requests.Session()
    
    # Configurar estrategia de reintentos
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"]
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    return session

# Sesión global para reutilizar conexiones
_wompi_session = None

def obtener_sesion_wompi():
    """Obtiene o crea la sesión de Wompi."""
    global _wompi_session
    if _wompi_session is None:
        _wompi_session = crear_sesion_wompi()
    return _wompi_session

def obtener_acceptance_token() -> dict:
    """
    Obtiene el acceptance_token del endpoint de merchant usando la clave pública.
    Este token es requerido para crear transacciones según la documentación de Wompi.
    
    Retorna:
        dict con acceptance_token y accept_personal_auth
    """
    if not WOMPI_PUBLIC_KEY or not WOMPI_API_URL:
        raise ValueError("Error: las variables de entorno no se cargaron correctamente")
    
    url = f"{WOMPI_API_URL}/merchants/{WOMPI_PUBLIC_KEY}"
    headers = {
        "Authorization": f"Bearer {WOMPI_PUBLIC_KEY}",
        "Content-Type": "application/json"
    }
    
    print("=" * 80)
    print("🔑 OBTENIENDO ACCEPTANCE TOKEN:")
    print(f"  URL: {url}")
    print("=" * 80)
    
    try:
        session = obtener_sesion_wompi()
        response = session.get(url, headers=headers, timeout=30)
    except requests.exceptions.ConnectionError as e:
        error_str = str(e)
        if "Failed to resolve" in error_str or "name resolution" in error_str.lower():
            error_msg = "Error de resolución DNS: No se puede resolver 'sandbox.wompi.co'. Verifica la configuración DNS del servidor."
            print(f"  ❌ {error_msg}")
            print("  Soluciones:")
            print("    1. Ejecuta: python -m functions.wompi.diagnostico_conectividad")
            print("    2. Verifica /etc/resolv.conf tiene servidores DNS válidos")
            print("    3. Prueba: nslookup sandbox.wompi.co")
            print("    4. Verifica firewall/proxy que pueda estar bloqueando DNS")
        else:
            error_msg = f"Error de conexión con Wompi: {error_str}"
            print(f"  ❌ {error_msg}")
            print("  Verifica conectividad a internet y firewall")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except requests.exceptions.Timeout as e:
        error_msg = f"Timeout al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except Exception as e:
        error_msg = f"Error inesperado al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    
    print(f"📥 RESPUESTA ACCEPTANCE TOKEN:")
    print(f"  Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        acceptance_token = data.get("data", {}).get("presigned_acceptance", {}).get("acceptance_token")
        accept_personal_auth = data.get("data", {}).get("presigned_acceptance", {}).get("accept_personal_auth")
        
        if not acceptance_token:
            raise ValueError("No se pudo obtener acceptance_token de la respuesta de Wompi")
        
        print(f"  ✅ Acceptance token obtenido")
        print("=" * 80)
        return {
            "success": True,
            "acceptance_token": acceptance_token,
            "accept_personal_auth": accept_personal_auth
        }
    else:
        print(f"  ❌ Error al obtener acceptance token")
        print(f"  Respuesta: {response.text}")
        print("=" * 80)
        raise ValueError(f"Error al obtener acceptance token: {response.text}")


def generar_signature(reference: str, amount_in_cents: int, currency: str, integrity_secret: str) -> str:
    """
    Genera la firma de integridad SHA256 requerida por Wompi.
    Formato: SHA256(reference + amount_in_cents + currency + integrity_secret)
    
    Parámetros:
        reference: Referencia única de la transacción
        amount_in_cents: Monto en centavos
        currency: Moneda (COP)
        integrity_secret: Secreto de integridad de Wompi
    
    Retorna:
        Firma SHA256 en hexadecimal
    """
    if not integrity_secret:
        raise ValueError("WOMPI_INTEGRITY_SECRET no está configurado")
    
    # Convertir amount_in_cents a string
    amount_str = str(amount_in_cents)
    
    # Concatenar en el orden especificado por Wompi
    concatenated = f"{reference}{amount_str}{currency}{integrity_secret}"
    
    # Generar SHA256
    signature = hashlib.sha256(concatenated.encode('utf-8')).hexdigest()
    
    print(f"🔐 Generando signature:")
    print(f"  Reference: {reference}")
    print(f"  Amount: {amount_str}")
    print(f"  Currency: {currency}")
    print(f"  Signature: {signature[:20]}...")
    
    return signature


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
    
    print("=" * 80)
    print("🔐 TOKENIZANDO TARJETA:")
    print(f"  URL: {url}")
    print(f"  Tarjeta: ****{numero[-4:] if len(numero) >= 4 else '****'}")
    print(f"  CVC: ***")
    print(f"  Exp: {exp_month}/{exp_year}")
    print(f"  Titular: {card_holder}")
    print("=" * 80)
    
    try:
        session = obtener_sesion_wompi()
        response = session.post(url, json=payload, headers=headers, timeout=30)
    except requests.exceptions.ConnectionError as e:
        error_str = str(e)
        if "Failed to resolve" in error_str or "name resolution" in error_str.lower():
            error_msg = "Error de resolución DNS: No se puede resolver 'sandbox.wompi.co'. Verifica la configuración DNS del servidor."
            print(f"  ❌ {error_msg}")
            print("  Soluciones:")
            print("    1. Ejecuta: python -m functions.wompi.diagnostico_conectividad")
            print("    2. Verifica /etc/resolv.conf tiene servidores DNS válidos")
            print("    3. Prueba: nslookup sandbox.wompi.co")
            print("    4. Verifica firewall/proxy que pueda estar bloqueando DNS")
        else:
            error_msg = f"Error de conexión con Wompi: {error_str}"
            print(f"  ❌ {error_msg}")
            print("  Verifica conectividad a internet y firewall")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except requests.exceptions.Timeout as e:
        error_msg = f"Timeout al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except Exception as e:
        error_msg = f"Error inesperado al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    
    print(f"📥 RESPUESTA TOKENIZACIÓN:")
    print(f"  Status Code: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        token = data["data"]["id"]
        print(f"  ✅ Token generado: {token[:20]}...")
        print("=" * 80)
        return {"success": True, "token": token}
    else:
        print(f"  ❌ Error al tokenizar")
        print(f"  Respuesta: {response.text}")
        print("=" * 80)
        return {"success": False, "error": response.text}

def crear_transaccion(
    monto: float,
    moneda: str,
    referencia: str,
    descripcion: str,
    correo_cliente: str,
    metodo_pago: dict,
    acceptance_token: str,
    signature: str,
    ip_address: str = None,
    redirect_url: str = None
):
    """
    Crea una transacción en Wompi con todos los campos requeridos según la documentación.
    
    Parámetros:
        monto: Monto de la transacción
        moneda: Moneda (COP)
        referencia: Referencia única de la transacción
        descripcion: Descripción de la transacción
        correo_cliente: Email del cliente
        metodo_pago: Diccionario con los datos del método de pago
        acceptance_token: Token de aceptación obtenido del endpoint de merchant
        signature: Firma de integridad SHA256
        ip_address: IP del cliente (opcional pero recomendado)
        redirect_url: URL de redirección después del pago (opcional)
    """
    if not WOMPI_PRIVATE_KEY or not WOMPI_API_URL:
        raise ValueError("Error: las variables de entorno no se cargaron correctamente")
    
    if not acceptance_token:
        raise ValueError("acceptance_token es requerido")
    
    if not signature:
        raise ValueError("signature es requerida")

    url = f"{WOMPI_API_URL}/transactions"
    headers = {
        "Authorization": f"Bearer {WOMPI_PRIVATE_KEY}",
        "Content-Type": "application/json"
    }
    
    amount_in_cents = int(monto * 100)
    
    # Construir redirect_url si no se proporciona
    # Incluir referencia como parámetro para facilitar el seguimiento
    if not redirect_url:
        redirect_url = f"{FRONTEND_URL}/pago-exitoso?reference={referencia}"

    payload = {
        "amount_in_cents": amount_in_cents,
        "currency": moneda,
        "customer_email": correo_cliente,
        "payment_method": metodo_pago,
        "reference": referencia,
        "description": descripcion,
        "acceptance_token": acceptance_token,
        "signature": signature,
        "redirect_url": redirect_url
    }
    
    # Agregar IP si está disponible
    if ip_address:
        payload["ip"] = ip_address

    print("=" * 80)
    print("📤 ENVIANDO TRANSACCIÓN A WOMPI:")
    print(f"  URL: {url}")
    print(f"  Monto: ${monto:,.0f} COP ({int(monto * 100)} centavos)")
    print(f"  Email: {correo_cliente}")
    print(f"  Referencia: {referencia}")
    print(f"  Método de pago: {metodo_pago.get('type')}")
    print(f"  Payload completo: {payload}")
    print("=" * 80)

    try:
        session = obtener_sesion_wompi()
        response = session.post(url, json=payload, headers=headers, timeout=30)
    except requests.exceptions.ConnectionError as e:
        error_str = str(e)
        if "Failed to resolve" in error_str or "name resolution" in error_str.lower():
            error_msg = "Error de resolución DNS: No se puede resolver 'sandbox.wompi.co'. Verifica la configuración DNS del servidor."
            print(f"  ❌ {error_msg}")
            print("  Soluciones:")
            print("    1. Ejecuta: python -m functions.wompi.diagnostico_conectividad")
            print("    2. Verifica /etc/resolv.conf tiene servidores DNS válidos")
            print("    3. Prueba: nslookup sandbox.wompi.co")
            print("    4. Verifica firewall/proxy que pueda estar bloqueando DNS")
        else:
            error_msg = f"Error de conexión con Wompi: {error_str}"
            print(f"  ❌ {error_msg}")
            print("  Verifica conectividad a internet y firewall")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except requests.exceptions.Timeout as e:
        error_msg = f"Timeout al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except Exception as e:
        error_msg = f"Error inesperado al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e

    print(f"📥 RESPUESTA DE WOMPI:")
    print(f"  Status Code: {response.status_code}")
    print(f"  Respuesta completa: {response.text}")
    print("=" * 80)

    try:
        data = response.json()
        # Agregar el status code HTTP a la respuesta para facilitar la verificación
        data["http_status_code"] = response.status_code
        
        # Verificar si hay error en la respuesta
        if "error" in data:
            print(f"❌ ERROR EN WOMPI: {data['error']}")
            if "messages" in data["error"]:
                print(f"   Mensajes: {data['error']['messages']}")
        
        # Si es asincrónico (ej. BANCOLOMBIA_TRANSFER), devolver async_payment_url
        if "data" in data and "payment_method" in data["data"]:
            pm = data["data"]["payment_method"]
            if pm.get("extra") and pm["extra"].get("async_payment_url"):
                data["redirect_to"] = pm["extra"]["async_payment_url"]
        
        return data
    except Exception as e:
        print(f"❌ ERROR AL PARSEAR RESPUESTA: {str(e)}")
        return {
            "status": "error",
            "mensaje": response.text,
            "http_status_code": response.status_code
        }


def consultar_transaccion(transaction_id: str) -> dict:
    """
    Consulta el estado actual de una transacción usando la clave pública.
    Endpoint: GET /v1/transactions/{transaction_id}
    
    Parámetros:
        transaction_id: ID de la transacción en Wompi
    
    Retorna:
        dict con los datos de la transacción
    """
    if not WOMPI_PUBLIC_KEY or not WOMPI_API_URL:
        raise ValueError("Error: las variables de entorno no se cargaron correctamente")
    
    url = f"{WOMPI_API_URL}/transactions/{transaction_id}"
    headers = {
        "Authorization": f"Bearer {WOMPI_PUBLIC_KEY}",
        "Content-Type": "application/json"
    }
    
    print("=" * 80)
    print("🔍 CONSULTANDO TRANSACCIÓN:")
    print(f"  URL: {url}")
    print(f"  Transaction ID: {transaction_id}")
    print("=" * 80)
    
    try:
        session = obtener_sesion_wompi()
        response = session.get(url, headers=headers, timeout=30)
    except requests.exceptions.ConnectionError as e:
        error_str = str(e)
        if "Failed to resolve" in error_str or "name resolution" in error_str.lower():
            error_msg = "Error de resolución DNS: No se puede resolver 'sandbox.wompi.co'. Verifica la configuración DNS del servidor."
            print(f"  ❌ {error_msg}")
            print("  Soluciones:")
            print("    1. Ejecuta: python -m functions.wompi.diagnostico_conectividad")
            print("    2. Verifica /etc/resolv.conf tiene servidores DNS válidos")
            print("    3. Prueba: nslookup sandbox.wompi.co")
            print("    4. Verifica firewall/proxy que pueda estar bloqueando DNS")
        else:
            error_msg = f"Error de conexión con Wompi: {error_str}"
            print(f"  ❌ {error_msg}")
            print("  Verifica conectividad a internet y firewall")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except requests.exceptions.Timeout as e:
        error_msg = f"Timeout al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    except Exception as e:
        error_msg = f"Error inesperado al conectar con Wompi: {str(e)}"
        print(f"  ❌ {error_msg}")
        print("=" * 80)
        raise ValueError(error_msg) from e
    
    print(f"📥 RESPUESTA CONSULTA:")
    print(f"  Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"  ✅ Transacción encontrada")
        print(f"  Estado: {data.get('data', {}).get('status', 'N/A')}")
        print("=" * 80)
        return data
    else:
        print(f"  ❌ Error al consultar transacción")
        print(f"  Respuesta: {response.text}")
        print("=" * 80)
        raise ValueError(f"Error al consultar transacción: {response.text}")


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
