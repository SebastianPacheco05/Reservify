import { API_BASE_URL } from "../config/api";
import type { MiBalanceResponse } from "../types/dashboard";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró token de autenticación");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export class EmployeeBalanceService {
  /** Balance del empleado (facturas con id_credencial_empleado = usuario). */
  public static async getMiBalance(): Promise<MiBalanceResponse> {
    const res = await fetch(`${API_BASE_URL}/data-owner/mi-balance`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { total: data.total ?? 0, facturas: data.facturas ?? [] };
  }
}
