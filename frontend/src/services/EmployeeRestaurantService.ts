import { API_BASE_URL } from "../config/api";
import type { MiRestauranteInfo } from "../types/dashboard";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró token de autenticación");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export class EmployeeRestaurantService {
  /** Info básica del restaurante del empleado/admin. */
  public static async getMiRestauranteInfo(): Promise<MiRestauranteInfo | null> {
    const res = await fetch(`${API_BASE_URL}/data-owner/mi-restaurante-info`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }
}
