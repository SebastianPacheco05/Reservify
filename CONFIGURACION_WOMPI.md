# Configuración de Wompi para Reservify

## 🔑 Variables de Entorno Necesarias

### 1. Crear archivo `.env` en la carpeta `backend/`

Crea un archivo llamado `.env` en `backend/` con el siguiente contenido:

```env
# Configuración de Wompi
WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxxxxxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxxxxxxxxxx
WOMPI_API_URL=https://sandbox.wompi.co/v1

# Configuración de Base de Datos (si no la tienes ya)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/reservify

# Configuración JWT (si no la tienes ya)
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Obtener tus claves de Wompi

#### Para pruebas (Modo Sandbox):

1. Ve a: https://comercios.wompi.co/
2. Regístrate o inicia sesión
3. Ve a la sección **"Desarrolladores"** o **"API Keys"**
4. Copia:
   - **Clave Pública de Prueba** (empieza con `pub_test_`)
   - **Clave Privada de Prueba** (empieza con `prv_test_`)

#### Claves de prueba de Wompi (sandbox):

Si no tienes cuenta aún, puedes usar estas claves temporales para desarrollo:

```env
WOMPI_PUBLIC_KEY=pub_test_g2u0ERG8Wk8DTgZfhJLnwYeN3DUy
WOMPI_PRIVATE_KEY=prv_test_1tZ0zZqUr8sYSGjkNxZ3dVt1WHV8
WOMPI_API_URL=https://sandbox.wompi.co/v1
```

⚠️ **IMPORTANTE**: Estas son claves de prueba. Para producción necesitas obtener tus propias claves.

## 🧪 Tarjetas de Prueba

Para probar pagos en modo sandbox, usa estas tarjetas:

### ✅ Tarjeta que APRUEBA:

- **Número**: `4242424242424242`
- **CVC**: `123`
- **Fecha**: Cualquier fecha futura (ej: 12/2025)
- **Titular**: Cualquier nombre

### ❌ Tarjeta que RECHAZA:

- **Número**: `4111111111111111`
- **CVC**: `123`
- **Fecha**: Cualquier fecha futura
- **Titular**: Cualquier nombre

## 🚀 Pasos para Activar el Sistema

### 1. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear archivo .env con tus claves (ver arriba)
# Puedes usar notepad, VS Code, o cualquier editor:
notepad .env

# Reiniciar el servidor backend
# Detén el servidor actual (Ctrl+C) y vuelve a iniciarlo:
python -m uvicorn main:app --reload
```

### 2. Verificar que el Backend esté Corriendo

Abre tu navegador en: http://10.5.213.111:8001/docs

Deberías ver la documentación de la API (Swagger UI)

### 3. Probar el Endpoint de Clave Pública

En tu navegador, ve a: http://10.5.213.111:8001/wompi/public-key

Deberías ver algo como:

```json
{
  "public_key": "pub_test_xxxxxxxxxxxxxxxxxx"
}
```

### 4. Iniciar Frontend

```bash
# En otra terminal, navega a frontend
cd frontend

# Inicia el servidor de desarrollo
npm run dev
```

### 5. Probar el Flujo Completo

1. Abre la aplicación: http://localhost:5173
2. Inicia sesión como cliente
3. Selecciona un restaurante
4. Haz una reserva
5. En la página de pago:

   - Verás "Debug: Wompi ✓ | Email ✓" al final
   - El mensaje "Cargando pasarela de pago..." debe desaparecer
   - El botón "Pagar" debe activarse

6. Usa la tarjeta de prueba para pagar

## 🐛 Solución de Problemas

### Problema: "Error al cargar la pasarela de pago"

**Causa**: El backend no está devolviendo la clave pública de Wompi

**Solución**:

1. Verifica que el archivo `.env` existe en `backend/`
2. Verifica que tiene `WOMPI_PUBLIC_KEY=pub_test_...`
3. Reinicia el backend
4. Verifica en http://10.5.213.111:8001/wompi/public-key

### Problema: "Clave pública de Wompi no configurada"

**Causa**: La variable `WOMPI_PUBLIC_KEY` no está en el `.env`

**Solución**:

1. Abre `backend/.env`
2. Agrega la línea: `WOMPI_PUBLIC_KEY=pub_test_...`
3. Reinicia el backend

### Problema: El botón "Pagar" está deshabilitado

**Revisa el Debug al final de la página**:

- **"Wompi ✗"** → El script de Wompi no cargó
  - Verifica tu conexión a internet
  - Verifica que el backend devuelve la clave pública
- **"Email ✗"** → No se pudo extraer el email del token
  - Verifica que iniciaste sesión correctamente
  - Abre DevTools (F12) → Application → Local Storage
  - Debe haber una entrada "token"

### Problema: "Error en el pago"

**Causa**: El backend rechazó la transacción

**Solución**:

1. Verifica los logs del backend en la terminal
2. Asegúrate de que `WOMPI_PRIVATE_KEY` está configurado
3. Verifica que `WOMPI_API_URL` es correcta

## 📞 Logs de Debugging

### En la Consola del Navegador (F12 → Console):

Deberías ver:

```
=== CheckoutPage montado ===
Obteniendo clave pública de Wompi...
Clave pública obtenida: pub_test_g2u0ERG8Wk8D...
Extrayendo email del token...
Email extraído: usuario@ejemplo.com
Iniciando carga de Wompi con clave pública...
Script de Wompi cargado
Wompi disponible y listo
```

### En la Terminal del Backend:

Al hacer un pago verás:

```
Request recibido Wompi: {'monto': 60000, 'referencia': 'RES-123', ...}
Payload Wompi: {'amount_in_cents': 6000000, ...}
```

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Archivo `backend/.env` existe
- [ ] `WOMPI_PUBLIC_KEY` está configurado en `.env`
- [ ] `WOMPI_PRIVATE_KEY` está configurado en `.env`
- [ ] `WOMPI_API_URL` está configurado en `.env`
- [ ] Backend está corriendo (http://10.5.213.111:8001/docs funciona)
- [ ] Frontend está corriendo (http://localhost:5173 funciona)
- [ ] Has iniciado sesión en la aplicación
- [ ] La consola del navegador muestra los logs de Wompi
- [ ] http://10.5.213.111:8001/wompi/public-key devuelve la clave

## 🎉 ¡Todo Funciona!

Si ves "Debug: Wompi ✓ | Email ✓" y el botón está activo, ¡el sistema está configurado correctamente!

Ahora puedes:

1. Ingresar datos de tarjeta de prueba
2. Hacer clic en "Pagar"
3. Ver el pago procesarse
4. La reserva se confirmará automáticamente si el pago es aprobado

---

**Desarrollado para Reservify - SENA**
