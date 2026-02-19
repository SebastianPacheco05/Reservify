import hashlib
import json
from typing import Dict, Any


def validar_firma_webhook(event_data: Dict[str, Any], checksum: str, integrity_secret: str) -> bool:
    """
    Valida la firma del webhook usando el algoritmo de Wompi.
    Compara el checksum recibido con el calculado localmente.
    
    Según la documentación de Wompi, el checksum se calcula usando los campos
    especificados en signature.properties concatenados en ese orden.
    
    Parámetros:
        event_data: Datos del evento recibido de Wompi
        checksum: Checksum recibido en el header o en signature.checksum
        integrity_secret: Secreto de integridad de Wompi
    
    Retorna:
        True si la firma es válida, False en caso contrario
    """
    if not integrity_secret:
        print("⚠️ WOMPI_INTEGRITY_SECRET no está configurado")
        return False
    
    if not checksum:
        print("⚠️ No se recibió checksum en el webhook")
        return False
    
    # Obtener las propiedades que se usaron para generar el checksum
    signature = event_data.get("signature", {})
    properties = signature.get("properties", [])
    
    if not properties:
        print("⚠️ No se encontraron propiedades en signature")
        return False
    
    # Construir el string a hashear concatenando los valores en el orden especificado
    values_to_hash = []
    
    for prop in properties:
        # Navegar por el objeto event_data usando la ruta de la propiedad
        value = event_data
        for key in prop.split("."):
            if isinstance(value, dict):
                value = value.get(key)
            else:
                value = None
                break
        
        if value is not None:
            # Convertir a string si es necesario
            values_to_hash.append(str(value))
    
    # Agregar el integrity_secret al final
    values_to_hash.append(integrity_secret)
    
    # Concatenar todos los valores
    concatenated = "".join(values_to_hash)
    
    # Calcular SHA256
    calculated_checksum = hashlib.sha256(concatenated.encode('utf-8')).hexdigest()
    
    # Comparar checksums directamente (usar comparación constante-time para seguridad)
    is_valid = checksum.lower() == calculated_checksum.lower()
    
    print("=" * 80)
    print("🔐 VALIDANDO FIRMA DE WEBHOOK:")
    print(f"  Checksum recibido: {checksum[:20]}...")
    print(f"  Checksum calculado: {calculated_checksum[:20]}...")
    print(f"  Propiedades usadas: {properties}")
    print(f"  ✅ Válido" if is_valid else "  ❌ Inválido")
    print("=" * 80)
    
    return is_valid
