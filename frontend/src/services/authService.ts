/**
 * Servicio de autenticación con renovación automática de tokens
 */

const API_BASE_URL = "http://10.5.213.111:1106";
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Agrega un callback a la cola de espera para cuando se renueve el token
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notifica a todos los callbacks en espera que el token se renovó
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Renueva el access token usando el refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  
  if (!refreshToken) {
    console.error("No hay refresh token disponible");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/credenciales/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // Si el refresh token también expiró, redirigir al login
      console.error("Refresh token inválido o expirado");
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    
    // Guardar el nuevo access token
    localStorage.setItem("access_token", newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error("Error al renovar token:", error);
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
}

/**
 * Función fetch mejorada con renovación automática de tokens
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Agregar el token de autorización
  const token = localStorage.getItem("access_token");
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Primera solicitud
  let response = await fetch(url, { ...options, headers });

  // Si recibimos 401 (Unauthorized), intentar renovar el token
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    
    // Verificar si el error es por token expirado
    if (errorData.detail && (
      errorData.detail.includes("Token inválido") || 
      errorData.detail.includes("expirado") ||
      errorData.detail.includes("revocado")
    )) {
      // Si ya se está renovando el token, esperar
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            // Reintentar la solicitud con el nuevo token
            headers.Authorization = `Bearer ${newToken}`;
            resolve(fetch(url, { ...options, headers }));
          });
        });
      }

      // Iniciar renovación del token
      isRefreshing = true;
      
      const newToken = await refreshAccessToken();
      
      isRefreshing = false;

      if (newToken) {
        // Notificar a todas las solicitudes en espera
        onTokenRefreshed(newToken);
        
        // Reintentar la solicitud original con el nuevo token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        // Si no se pudo renovar, redirigir al login
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }
    }
  }

  return response;
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("tipo_usuario");
  window.location.href = "/login";
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token");
}


