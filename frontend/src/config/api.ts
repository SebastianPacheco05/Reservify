/**
 * Configuración centralizada de la API
 * Todas las URLs y configuraciones se obtienen desde las variables de entorno
 * definidas en el archivo .env de la raíz del proyecto
 */

// Validar que VITE_API_URL esté definida
const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    const error = `
      ❌ ERROR: VITE_API_URL no está definida en las variables de entorno.
      
      Por favor, asegúrate de tener en el archivo .env de la raíz del proyecto:
      VITE_API_URL=http://tu-host:tu-puerto
      
      Ejemplo:
      VITE_API_URL=http://localhost:5080
      o
      VITE_API_URL=http://10.5.213.111:5080
    `;
    console.error(error);
    throw new Error("VITE_API_URL no está configurada. Revisa el archivo .env en la raíz del proyecto.");
  }
  
  // Eliminar barra final si existe para evitar dobles barras
  return apiUrl.replace(/\/$/, '');
};

/**
 * URL base de la API del backend
 * Se obtiene desde VITE_API_URL en el .env de la raíz
 */
export const API_BASE_URL = getApiUrl();

/**
 * Función helper para construir URLs completas de endpoints
 * @param endpoint - Ruta del endpoint (ej: "/credenciales/login")
 * @returns URL completa (ej: "http://localhost:5080/credenciales/login")
 */
export const getApiEndpoint = (endpoint: string): string => {
  // Asegurar que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

// Log de configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 Configuración de API cargada:', {
    API_BASE_URL,
    fuente: 'variables de entorno (.env raíz)',
  });
}
