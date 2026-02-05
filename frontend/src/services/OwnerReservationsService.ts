const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.5.213.111:1106";

export interface Reserva {
  id_reserva: number;
  horario: string;
  fecha: string;
  estado_reserva: string;
  id_mesa: number;
  cant_personas: number;
  nombre_restaurante: string;
  nit: number;
  num_comensales: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_documento: number;
}

export interface ReservasResponse {
  reservas: Reserva[];
  total?: number;
}

export class OwnerReservationsService {
  /**
   * Obtiene las 50 reservas más recientes del dueño logueado
   * Requiere token de autenticación
   */
  public static async getRecentReservations(): Promise<Reserva[]> {
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/data-owner/reservas`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener reservas: ${response.status}`);
      }

      const data: ReservasResponse = await response.json();
      return data.reservas || [];
    } catch (error) {
      console.error("Error al obtener reservas recientes:", error);
      return [];
    }
  }

  /**
   * Obtiene TODAS las reservas del dueño logueado
   * Requiere token de autenticación
   */
  public static async getAllReservations(): Promise<ReservasResponse> {
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/data-owner/reservas/todas`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener todas las reservas: ${response.status}`);
      }

      const data: ReservasResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error);
      return { reservas: [], total: 0 };
    }
  }
}

