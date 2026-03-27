import { API_BASE_URL } from "../config/api";

export interface RestauranteMapItem {
  nit: number;
  nombre_restaurante: string;
  direccion?: string;
  lat: number;
  lng: number;
  /** Si el backend lo envía, enlaza a /Restaurant?uid=… */
  restaurante_uid?: string;
}

const FALLBACK = { lat: 4.6097, lng: -74.0817 };

/** Evita lat=0&lng=0 (datos faltantes) que dispara queries inútiles */
export function normalizeMapQueryCoords(
  lat: number,
  lng: number,
): { lat: number; lng: number } {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return FALLBACK;
  if (lat === 0 && lng === 0) return FALLBACK;
  return { lat, lng };
}

function processList(
  list: RestauranteMapItem[],
  queryLat: number,
  queryLng: number,
): RestauranteMapItem[] {
  if (list.length && typeof list[0]?.lat === "undefined") {
    return list.map(
      (r: RestauranteMapItem & { lat?: number; lng?: number }, i: number) => ({
        ...r,
        lat: (r.lat ?? queryLat) + i * 0.002 * Math.cos(i),
        lng: (r.lng ?? queryLng) + i * 0.002 * Math.sin(i),
      }),
    );
  }
  return list;
}

export async function fetchRestaurantesMap(lat: number, lng: number): Promise<RestauranteMapItem[]> {
  const { lat: qlat, lng: qlng } = normalizeMapQueryCoords(lat, lng);
  const res = await fetch(`${API_BASE_URL}/restaurantes?lat=${qlat}&lng=${qlng}`);
  if (!res.ok) throw new Error("Error al cargar restaurantes");
  const data = await res.json();
  const raw = Array.isArray(data) ? data : (data?.respuesta ?? []);
  return processList(raw as RestauranteMapItem[], qlat, qlng);
}
