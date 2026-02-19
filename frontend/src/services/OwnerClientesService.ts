import { API_BASE_URL } from "../config/api";
import type { ClienteGestor } from "../types/dashboard";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró token de autenticación");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export interface ClientesResponse {
  clientes?: ClienteGestor[];
}

export class OwnerClientesService {
  /** Clientes con reservas en restaurantes del gestor (Dueño/Admin). */
  public static async getClientes(): Promise<ClienteGestor[]> {
    const res = await fetch(`${API_BASE_URL}/data-owner/clientes`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    return (data as ClientesResponse).clientes ?? [];
  }
}
