#!/usr/bin/env python3
"""
Script de prueba para diagnosticar problemas con Wompi
Uso: python test_wompi.py
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

WOMPI_PUBLIC_KEY = os.getenv("WOMPI_PUBLIC_KEY")
WOMPI_PRIVATE_KEY = os.getenv("WOMPI_PRIVATE_KEY")
WOMPI_API_URL = os.getenv("WOMPI_API_URL", "https://sandbox.wompi.co/v1")

def print_section(title):
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)

def test_env_variables():
    """Verifica que las variables de entorno estén configuradas"""
    print_section("1. VERIFICANDO VARIABLES DE ENTORNO")
    
    if not WOMPI_PUBLIC_KEY:
        print("❌ WOMPI_PUBLIC_KEY no está configurada")
        return False
    else:
        print(f"✅ WOMPI_PUBLIC_KEY: {WOMPI_PUBLIC_KEY[:20]}...")
    
    if not WOMPI_PRIVATE_KEY:
        print("❌ WOMPI_PRIVATE_KEY no está configurada")
        return False
    else:
        print(f"✅ WOMPI_PRIVATE_KEY: {WOMPI_PRIVATE_KEY[:20]}...")
    
    if not WOMPI_API_URL:
        print("❌ WOMPI_API_URL no está configurada")
        return False
    else:
        print(f"✅ WOMPI_API_URL: {WOMPI_API_URL}")
    
    # Verificar formato de las claves
    if WOMPI_PUBLIC_KEY and not WOMPI_PUBLIC_KEY.startswith("pub_"):
        print("⚠️  ADVERTENCIA: La clave pública no empieza con 'pub_'")
    
    if WOMPI_PRIVATE_KEY and not WOMPI_PRIVATE_KEY.startswith("prv_"):
        print("⚠️  ADVERTENCIA: La clave privada no empieza con 'prv_'")
    
    return True

def test_tokenization():
    """Prueba la tokenización de una tarjeta de prueba"""
    print_section("2. PROBANDO TOKENIZACIÓN DE TARJETA")
    
    url = f"{WOMPI_API_URL}/tokens/cards"
    headers = {
        "Authorization": f"Bearer {WOMPI_PUBLIC_KEY}",
        "Content-Type": "application/json"
    }
    
    # Tarjeta de prueba que APRUEBA
    payload = {
        "number": "4242424242424241",
        "cvc": "123",
        "exp_month": "12",
        "exp_year": "28",
        "card_holder": "Test User"
    }
    
    print(f"URL: {url}")
    print(f"Tarjeta: ****4242")
    print(f"Titular: {payload['card_holder']}")
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            token = data["data"]["id"]
            print(f"✅ Tokenización exitosa")
            print(f"Token: {token[:30]}...")
            return token
        else:
            print(f"❌ Error en tokenización")
            print(f"Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Excepción: {str(e)}")
        return None

def test_transaction(token):
    """Prueba crear una transacción con el token"""
    print_section("3. PROBANDO CREACIÓN DE TRANSACCIÓN")
    
    url = f"{WOMPI_API_URL}/transactions"
    headers = {
        "Authorization": f"Bearer {WOMPI_PRIVATE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "amount_in_cents": 5000000,  # $50,000 COP
        "currency": "COP",
        "customer_email": "test@ejemplo.com",
        "reference": f"TEST-{int(__import__('time').time())}",  # Referencia única
        "payment_method": {
            "type": "CARD",
            "token": token
        }
    }
    
    print(f"URL: {url}")
    print(f"Monto: $50,000 COP (5,000,000 centavos)")
    print(f"Email: {payload['customer_email']}")
    print(f"Referencia: {payload['reference']}")
    print(f"Token: {token[:30]}...")
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        
        data = response.json()
        
        if response.status_code in [200, 201]:
            print(f"✅ Transacción creada exitosamente")
            
            if "data" in data:
                trans_data = data["data"]
                print(f"\nDetalles de la transacción:")
                print(f"  ID: {trans_data.get('id')}")
                print(f"  Status: {trans_data.get('status')}")
                print(f"  Status Message: {trans_data.get('status_message', 'N/A')}")
                
                if "payment_method" in trans_data:
                    pm = trans_data["payment_method"]
                    print(f"  Método de pago: {pm.get('type')}")
                    if "extra" in pm:
                        print(f"  Extra info: {pm['extra']}")
            
            return True
        else:
            print(f"❌ Error en transacción")
            print(f"\nRespuesta completa:")
            print(response.text)
            
            if "error" in data:
                error = data["error"]
                print(f"\n❌ DETALLES DEL ERROR:")
                print(f"  Tipo: {error.get('type')}")
                if "messages" in error:
                    print(f"  Mensajes:")
                    for field, msgs in error["messages"].items():
                        print(f"    - {field}: {msgs}")
            
            return False
    except Exception as e:
        print(f"❌ Excepción: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔧 WOMPI DIAGNOSTIC TOOL")
    print("Este script probará la configuración de Wompi paso a paso")
    
    # Paso 1: Verificar variables de entorno
    if not test_env_variables():
        print("\n❌ PRUEBA FALLIDA: Configura las variables de entorno primero")
        print("   Revisa el archivo backend/.env")
        sys.exit(1)
    
    # Paso 2: Probar tokenización
    token = test_tokenization()
    if not token:
        print("\n❌ PRUEBA FALLIDA: No se pudo tokenizar la tarjeta")
        print("   Verifica que WOMPI_PUBLIC_KEY sea correcta")
        sys.exit(1)
    
    # Paso 3: Probar transacción
    success = test_transaction(token)
    
    # Resumen
    print_section("RESUMEN")
    if success:
        print("✅ TODAS LAS PRUEBAS PASARON")
        print("\nTu configuración de Wompi está correcta.")
        print("Si aún tienes problemas, revisa:")
        print("  1. Los datos que envías desde el frontend")
        print("  2. El email del cliente (debe ser válido)")
        print("  3. Los logs del backend durante un pago real")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON")
        print("\nRevisa los errores anteriores y:")
        print("  1. Verifica que estés en modo sandbox")
        print("  2. Usa las claves de prueba correctas")
        print("  3. Revisa TROUBLESHOOTING_WOMPI.md para más ayuda")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()

