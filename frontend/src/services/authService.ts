/**
 * Servicio de autenticación con renovación automática de tokens.
 * - Renovación proactiva: refresca el token antes de que expire sin sacar de la página.
 * - Renovación reactiva: si una petición devuelve 401, intenta refresh y reintenta.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.5.213.111:1106";
/** Access token dura 30 min; refrescamos cada 25 min para no llegar al 401 */
const PROACTIVE_REFRESH_INTERVAL_MS = 25 * 60 * 1000;

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let proactiveRefreshTimerId: ReturnType<typeof setInterval> | null = null;

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Renueva el access token usando el refresh_token. No redirige a login;
 * solo devuelve null si falla (el llamador decide si sacar al usuario).
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/credenciales/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    if (newAccessToken) {
      localStorage.setItem("access_token", newAccessToken);
    }
    return newAccessToken;
  } catch {
    return null;
  }
}

/**
 * Refresco proactivo: se ejecuta en intervalo para renovar el token sin que
 * el usuario reciba 401. Solo redirige a login si el refresh falla (token revocado/expirado).
 */
async function runProactiveRefresh(): Promise<void> {
  if (!localStorage.getItem("refresh_token")) return;
  const newToken = await refreshAccessToken();
  if (newToken) return;
  // Refresh falló: sesión inválida o expirada; solo entonces sacar de la página
  clearProactiveRefresh();
  localStorage.clear();
  window.location.href = "/Login";
}

function clearProactiveRefresh(): void {
  if (proactiveRefreshTimerId !== null) {
    clearInterval(proactiveRefreshTimerId);
    proactiveRefreshTimerId = null;
  }
}

/**
 * Activa el refresco proactivo si hay sesión. Llamar al cargar la app o tras login.
 * El token se renovará cada 25 min sin salir de la página.
 */
export function startProactiveRefresh(): void {
  if (!localStorage.getItem("refresh_token") || !localStorage.getItem("access_token")) {
    return;
  }
  if (proactiveRefreshTimerId !== null) return;
  proactiveRefreshTimerId = setInterval(runProactiveRefresh, PROACTIVE_REFRESH_INTERVAL_MS);
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
        onTokenRefreshed(newToken);
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        clearProactiveRefresh();
        localStorage.clear();
        window.location.href = "/Login";
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }
    }
  }

  return response;
}

/**
 * Cierra la sesión del usuario y detiene el refresco proactivo
 */
export function logout() {
  clearProactiveRefresh();
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("tipo_usuario");
  window.location.href = "/Login";
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token");
}


