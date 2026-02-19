import { API_BASE_URL } from "../config/api";
import type { MonthlyFlow, DailyFlow } from "../types/dashboard";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró token de autenticación");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export class OwnerMonthlyFlowService {
  /** Métricas mensuales para la gráfica (Dueño/Admin). */
  public static async getMetricasMensuales(): Promise<MonthlyFlow[]> {
    const res = await fetch(`${API_BASE_URL}/data-owner/metricas-mensuales`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  /** Flujo diario por hora (Dueño/Admin). */
  public static async getFlujoDiario(): Promise<DailyFlow[]> {
    const res = await fetch(`${API_BASE_URL}/data-owner/flujo-diario`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }
}
