"""
Script de diagnóstico para verificar conectividad con Wompi.

Formas de ejecutar:
1. Desde el directorio raíz del proyecto:
   python3 backend/functions/wompi/diagnostico_conectividad.py

2. Desde el directorio backend:
   python3 functions/wompi/diagnostico_conectividad.py
"""
import socket
import requests
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Asegurar que se carga el .env desde el directorio raíz del proyecto
project_root = Path(__file__).parent.parent.parent.parent
env_path = project_root / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    # Fallback: intentar cargar desde el directorio actual
    load_dotenv()

def verificar_dns(hostname):
    """Verifica si se puede resolver el DNS de un hostname."""
    try:
        ip = socket.gethostbyname(hostname)
        print(f"✅ DNS resuelto: {hostname} -> {ip}")
        return True
    except socket.gaierror as e:
        print(f"❌ Error de DNS: {hostname} - {e}")
        return False

def verificar_conectividad_http(url):
    """Verifica conectividad HTTP/HTTPS."""
    try:
        response = requests.get(url, timeout=10)
        print(f"✅ Conectividad HTTP OK: {url} - Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Error de conexión: {url} - {e}")
        return False
    except requests.exceptions.Timeout as e:
        print(f"⚠️ Timeout: {url} - {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {url} - {e}")
        return False

def main():
    print("=" * 80)
    print("🔍 DIAGNÓSTICO DE CONECTIVIDAD CON WOMPI")
    print("=" * 80)
    
    # Verificar variables de entorno
    print("\n1. Verificando variables de entorno...")
    wompi_url = os.getenv("WOMPI_API_URL", "https://sandbox.wompi.co/v1")
    wompi_public_key = os.getenv("WOMPI_PUBLIC_KEY")
    wompi_private_key = os.getenv("WOMPI_PRIVATE_KEY")
    wompi_integrity_secret = os.getenv("WOMPI_INTEGRITY_SECRET")
    
    print(f"   WOMPI_API_URL: {wompi_url}")
    print(f"   WOMPI_PUBLIC_KEY: {'✅ Configurada' if wompi_public_key else '❌ NO CONFIGURADA'}")
    print(f"   WOMPI_PRIVATE_KEY: {'✅ Configurada' if wompi_private_key else '❌ NO CONFIGURADA'}")
    print(f"   WOMPI_INTEGRITY_SECRET: {'✅ Configurada' if wompi_integrity_secret else '❌ NO CONFIGURADA'}")
    
    # Extraer hostname de la URL
    if "sandbox.wompi.co" in wompi_url:
        hostname = "sandbox.wompi.co"
    elif "production.wompi.co" in wompi_url:
        hostname = "production.wompi.co"
    else:
        print("⚠️ URL de Wompi no reconocida")
        return
    
    # Verificar DNS
    print("\n2. Verificando resolución DNS...")
    dns_ok = verificar_dns(hostname)
    
    if not dns_ok:
        print("\n⚠️ PROBLEMA DE DNS DETECTADO")
        print("   Soluciones posibles:")
        print("   1. Verificar conectividad a internet del servidor")
        print("   2. Verificar configuración DNS en /etc/resolv.conf")
        print("   3. Probar con DNS públicos (8.8.8.8, 1.1.1.1)")
        print("   4. Verificar firewall/proxy que pueda estar bloqueando")
        print("\n   Comando para probar DNS manualmente:")
        print(f"   nslookup {hostname} 8.8.8.8")
        return
    
    # Verificar conectividad HTTP
    print("\n3. Verificando conectividad HTTP...")
    base_url = f"https://{hostname}/v1"
    http_ok = verificar_conectividad_http(base_url)
    
    if not http_ok:
        print("\n⚠️ PROBLEMA DE CONECTIVIDAD HTTP DETECTADO")
        print("   Soluciones posibles:")
        print("   1. Verificar firewall que permita HTTPS (puerto 443)")
        print("   2. Verificar proxy si el servidor está detrás de uno")
        print("   3. Verificar certificados SSL")
        return
    
    print("\n✅ Todas las verificaciones pasaron correctamente")
    print("=" * 80)

if __name__ == "__main__":
    main()
