# Configuración de Wompi - Guía de Verificación

## ✅ Configuración Actual

### Variables de Entorno (.env)

Las siguientes variables están configuradas según el panel de Wompi:

```env
WOMPI_PUBLIC_KEY=pub_test_JKzokuTKhYEwqPe8BtXbgTQgtmqfNnMZ
WOMPI_PRIVATE_KEY=prv_test_bla7VrondXfNukrGjgDqkIeJzFBAcfQW
WOMPI_API_URL=https://sandbox.wompi.co/v1
WOMPI_INTEGRITY_SECRET=test_integrity_vsIcBDLshYnhxtRbXcxA7XcM@yoXvfC
```

### ⚠️ IMPORTANTE: Configuración del Webhook en Wompi

Según el panel de Wompi, la URL de eventos está configurada como:
```
https://7654d8ac0c1e.ngrok-free.app/
```

**DEBE actualizarse a:**
```
https://7654d8ac0c1e.ngrok-free.app/wompi/webhook
```

#### Pasos para actualizar la URL del webhook:

1. Accede al panel de Wompi: https://dashboard.wompi.co
2. Ve a **Desarrollo > Programadores**
3. En la sección **"Seguimiento de Transacciones"**, busca el campo **"URL de Eventos"**
4. Cambia la URL de:
   ```
   https://7654d8ac0c1e.ngrok-free.app/
   ```
   a:
   ```
   https://7654d8ac0c1e.ngrok-free.app/wompi/webhook
   ```
5. Haz clic en **"Guardar"**

### 🔍 Verificación de Configuración

#### 1. Verificar que las variables estén cargadas:

```bash
cd /var/www/html/reservify/Reservify
python3 -c "from dotenv import load_dotenv; import os; load_dotenv(); print('PUBLIC_KEY:', os.getenv('WOMPI_PUBLIC_KEY')[:20] + '...'); print('INTEGRITY_SECRET:', 'Configurado' if os.getenv('WOMPI_INTEGRITY_SECRET') else 'NO CONFIGURADO')"
```

#### 2. Verificar conectividad con Wompi:

```bash
# Desde el directorio raíz del proyecto:
python3 backend/functions/wompi/diagnostico_conectividad.py

# O desde el directorio backend:
cd backend
python3 functions/wompi/diagnostico_conectividad.py
```

#### 3. Probar el endpoint del webhook localmente:

```bash
# Si tienes ngrok corriendo, prueba con:
curl -X POST https://7654d8ac0c1e.ngrok-free.app/wompi/webhook \
  -H "Content-Type: application/json" \
  -H "X-Event-Checksum: test" \
  -d '{"event": "transaction.updated", "data": {"transaction": {"id": "test", "status": "APPROVED", "reference": "RES-1"}}}'
```

### 📋 Checklist de Configuración

- [x] Variables de entorno configuradas en `.env`
- [x] `WOMPI_PUBLIC_KEY` configurada
- [x] `WOMPI_PRIVATE_KEY` configurada
- [x] `WOMPI_API_URL` configurada (sandbox)
- [x] `WOMPI_INTEGRITY_SECRET` configurada
- [ ] **URL del webhook actualizada en el panel de Wompi** ⚠️
- [ ] Ngrok corriendo y accesible públicamente
- [ ] Endpoint `/wompi/webhook` respondiendo correctamente

### 🐛 Problema Actual: Error de DNS

**Error:** `Failed to resolve 'sandbox.wompi.co'`

**Estado:** El servidor no puede resolver el DNS de `sandbox.wompi.co`

**Soluciones aplicadas:**
1. ✅ Manejo de errores mejorado con mensajes específicos
2. ✅ Sesión de requests con reintentos automáticos
3. ✅ Script de diagnóstico creado

**Próximos pasos:**
1. Verificar configuración DNS del servidor
2. Probar con DNS públicos (8.8.8.8, 1.1.1.1)
3. Verificar firewall/proxy

### 📚 Referencias

- [Documentación Wompi - Ambientes y Llaves](https://docs.wompi.co/en/docs/colombia/ambientes-y-llaves/)
- [Documentación Wompi - Webhooks](https://docs.wompi.co/en/docs/colombia/webhooks/)
- [Panel de Wompi](https://dashboard.wompi.co)
