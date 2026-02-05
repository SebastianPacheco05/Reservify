const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.5.213.111:1106";

export interface OwnerMetrics {
  total_restaurantes: number;
  reservas_activas: number;
  revenue_mes: number;
}

export class OwnerMetricsService {
  /**
   * Obtiene las métricas del dueño logueado
   * Requiere token de autenticación
   */
  public static async getMetrics(): Promise<OwnerMetrics> {
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/data-owner/metricas`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener métricas: ${response.status}`);
      }

      const data: OwnerMetrics = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener métricas del dueño:", error);
      // Retornar valores por defecto en caso de error
      return {
        total_restaurantes: 0,
        reservas_activas: 0,
        revenue_mes: 0,
      };
    }
  }
}

