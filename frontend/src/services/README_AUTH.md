# Servicio de Autenticación con Renovación Automática de Tokens

Este servicio proporciona renovación automática de tokens JWT cuando expiran, mejorando la experiencia del usuario al evitar que tenga que iniciar sesión repetidamente.

## Características

- ✅ **Renovación automática**: Cuando un token expira, se renueva automáticamente usando el refresh token
- ✅ **Sin interrupciones**: El usuario no nota cuando se renueva el token
- ✅ **Manejo de cola**: Si múltiples peticiones detectan un token expirado simultáneamente, solo se renueva una vez
- ✅ **Redirección automática**: Si el refresh token también expiró, redirige al login automáticamente

## Uso Básico

### Importar el servicio

```typescript
import { authFetch, logout, isAuthenticated } from '../services/authService';
```

### Reemplazar fetch con authFetch

**Antes:**
```typescript
const token = localStorage.getItem("access_token");
const response = await fetch("http://10.5.213.111:1106/api/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

**Después:**
```typescript
// authFetch agrega automáticamente el token de autorización
const response = await authFetch("http://10.5.213.111:1106/api/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});
```

## Ejemplos de Uso

### 1. Petición GET autenticada

```typescript
import { authFetch } from '../services/authService';

const fetchUserData = async () => {
  try {
    const response = await authFetch("http://10.5.213.111:1106/usuarios/perfil");
    
    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 2. Petición POST autenticada

```typescript
import { authFetch } from '../services/authService';

const updateProfile = async (profileData) => {
  try {
    const response = await authFetch("http://10.5.213.111:1106/editarcliente", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error("Error al actualizar perfil");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3. Cerrar sesión

```typescript
import { logout } from '../services/authService';

const handleLogout = () => {
  logout(); // Limpia todos los tokens y redirige a /login
};
```

### 4. Verificar si el usuario está autenticado

```typescript
import { isAuthenticated } from '../services/authService';

const MyComponent = () => {
  if (!isAuthenticated()) {
    // Redirigir al login o mostrar mensaje
    return <Navigate to="/login" />;
  }
  
  // Resto del componente...
};
```

## Cómo Funciona

1. **Login inicial**: El usuario inicia sesión y recibe:
   - `access_token`: Token de corta duración (30 minutos)
   - `refresh_token`: Token de larga duración (7 días)

2. **Uso normal**: Las peticiones usan el `access_token`

3. **Token expirado**: Cuando el `access_token` expira:
   - `authFetch` detecta el error 401
   - Automáticamente llama al endpoint `/credenciales/refresh`
   - Obtiene un nuevo `access_token`
   - Reintenta la petición original con el nuevo token
   - Todo esto ocurre de forma transparente para el usuario

4. **Refresh token expirado**: Si el `refresh_token` también expiró:
   - El usuario es redirigido al login
   - Se limpian todos los tokens almacenados

## Migración de Código Existente

Para migrar código existente, sigue estos pasos:

### Paso 1: Importar authFetch

```typescript
import { authFetch } from '../services/authService';
```

### Paso 2: Reemplazar fetch por authFetch

Busca todas las instancias de:
```typescript
const token = localStorage.getItem("access_token");
fetch(url, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
```

Y reemplázalas con:
```typescript
authFetch(url, {
  // headers sin Authorization, se agrega automáticamente
})
```

### Paso 3: Eliminar código de manejo manual de tokens

Ya no necesitas:
- Obtener el token manualmente con `localStorage.getItem("access_token")`
- Agregar el header `Authorization` manualmente
- Manejar errores 401 manualmente

## Notas Importantes

- ⚠️ No uses `authFetch` para el endpoint de login (no requiere autenticación)
- ⚠️ El refresh token se guarda en localStorage (considera usar httpOnly cookies en producción para mayor seguridad)
- ✅ `authFetch` es compatible con todas las opciones de fetch nativo
- ✅ Funciona automáticamente en segundo plano sin afectar la UX

## Seguridad

Para mayor seguridad en producción:
1. Considera usar httpOnly cookies para almacenar tokens
2. Implementa CSRF protection
3. Usa HTTPS siempre
4. Implementa rate limiting en el backend para el endpoint de refresh


