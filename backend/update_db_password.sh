#!/bin/bash
# Script para actualizar la contraseña de PostgreSQL en .env

echo "=========================================="
echo "Actualizar contraseña de PostgreSQL en .env"
echo "=========================================="
echo ""
echo "Línea actual:"
sed -n '3p' .env
echo ""
read -sp "Ingresa la contraseña de PostgreSQL para el usuario 'postgres': " PASSWORD
echo ""

# Escapar caracteres especiales para URL
PASSWORD_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$PASSWORD'))")

# Actualizar la línea 3
sed -i "3s|postgresql://postgres:.*@localhost|postgresql://postgres:$PASSWORD_ENCODED@localhost|" .env

echo ""
echo "✓ Archivo .env actualizado"
echo ""
echo "Nueva línea 3:"
sed -n '3p' .env
echo ""
echo "¿Deseas probar la conexión? (s/n)"
read -r TEST
if [ "$TEST" = "s" ] || [ "$TEST" = "S" ]; then
    echo "Probando conexión..."
    python3 -c "
from config import engine
try:
    with engine.connect() as conn:
        print('✓ Conexión exitosa a la base de datos')
except Exception as e:
    print(f'✗ Error de conexión: {e}')
"
fi
