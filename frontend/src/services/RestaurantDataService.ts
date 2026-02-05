import type {
  RestaurantDetailFromDB,
  MesaFromDB,
  ComentarioFromDB,
} from "../types/restaurant.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.5.213.111:1106";

export class RestaurantDataService {
  private static instance: RestaurantDataService;
  private restaurantNIT: number;

  constructor(restaurantNIT = 0) {
    this.restaurantNIT = restaurantNIT;
  }

  public static getInstance(restaurantNIT?: number): RestaurantDataService {
    if (!RestaurantDataService.instance) {
      RestaurantDataService.instance = new RestaurantDataService(restaurantNIT);
    }
    return RestaurantDataService.instance;
  }

  // Método para obtener información completa del restaurante desde la BD
  public async getRestaurantInfo(): Promise<RestaurantDetailFromDB | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurante/${this.restaurantNIT}`
      );
      if (!response.ok) throw new Error("Error al obtener restaurante");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  // Método para obtener las mesas del restaurante
  public async getMesas(): Promise<MesaFromDB[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/mesas/restaurante/${this.restaurantNIT}`
      );
      if (!response.ok) throw new Error("Error al obtener mesas");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Método para obtener comentarios del restaurante
  public async getComentarios(): Promise<ComentarioFromDB[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/comentarios/restaurante/${this.restaurantNIT}`
      );
      if (!response.ok) throw new Error("Error al obtener comentarios");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Método para obtener horarios disponibles basados en las mesas disponibles
  public async getAvailableTimeSlots(date: string): Promise<string[]> {
    try {
      // Aquí puedes hacer una llamada al backend para obtener slots disponibles
      const response = await fetch(
        `${API_BASE_URL}/reserva/slots-disponibles?nit=${this.restaurantNIT}&fecha=${date}`
      );
      if (!response.ok) throw new Error("Error al obtener slots");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      // Fallback: generar slots basados en horario del restaurante
      return [
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
      ];
    }
  }
}
