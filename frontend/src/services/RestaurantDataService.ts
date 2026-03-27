import type {
  RestaurantDetailFromDB,
  MesaFromDB,
  ComentarioFromDB,
} from "../types/restaurant.types";
import { API_BASE_URL } from "../config/api";
import { isCompleteISODate } from "../lib/dateValidators";

export class RestaurantDataService {
  private static instance: RestaurantDataService;
  private restauranteUid: string;

  private parseTimeToMinutes(timeStr: string): number | null {
    // Acepta "HH:MM" o "HH:MM:SS"
    const clean = (timeStr || "").trim();
    if (!clean) return null;
    const parts = clean.split(":");
    if (parts.length < 2) return null;
    const hh = Number.parseInt(parts[0], 10);
    const mm = Number.parseInt(parts[1], 10);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    return hh * 60 + mm;
  }

  private formatMinutesToTime(totalMinutes: number): string {
    const minutesInDay = 24 * 60;
    const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
    const hh = Math.floor(normalized / 60)
      .toString()
      .padStart(2, "0");
    const mm = (normalized % 60).toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  private build30MinSlots(
    horarioApertura?: string | null,
    horarioCierre?: string | null
  ): string[] {
    const open = this.parseTimeToMinutes(horarioApertura || "");
    const close = this.parseTimeToMinutes(horarioCierre || "");
    if (open == null || close == null) return [];

    // Si cierra "antes" que abre, interpretamos cruce de medianoche.
    let end = close;
    if (end < open) end += 24 * 60;

    // Evitar bucles infinitos por datos malos: máximo 48 slots (24h a 30min).
    const slots: string[] = [];
    for (let t = open; t <= end && slots.length < 48; t += 30) {
      slots.push(this.formatMinutesToTime(t));
    }
    return slots;
  }

  constructor(restauranteUid = "") {
    this.restauranteUid = restauranteUid;
  }

  public static getInstance(restauranteUid?: string): RestaurantDataService {
    if (!RestaurantDataService.instance) {
      RestaurantDataService.instance = new RestaurantDataService(restauranteUid);
    }
    return RestaurantDataService.instance;
  }

  // Método para obtener información completa del restaurante desde la BD
  public async getRestaurantInfo(): Promise<RestaurantDetailFromDB | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurante/${this.restauranteUid}`
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
        `${API_BASE_URL}/mesas/restaurante/${this.restauranteUid}`
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
        `${API_BASE_URL}/comentarios/restaurante/${this.restauranteUid}`
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
    if (!isCompleteISODate(date)) {
      return [];
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/reserva/slots-disponibles?restaurante_uid=${this.restauranteUid}&fecha=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        // Si el backend devuelve slots válidos, priorizamos esa respuesta.
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Fallback dinámico: generar intervalos de 30 minutos según horario del restaurante.
    try {
      const info = await this.getRestaurantInfo();
      const slots = this.build30MinSlots(
        info?.horario_apertura ?? "",
        info?.horario_cierre ?? ""
      );
      return slots;
    } catch {
      return [];
    }
  }
}
