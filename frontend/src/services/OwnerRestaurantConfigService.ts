import { getApiEndpoint } from "../config/api";
import { authFetch } from "./authService";

async function throwOnError(res: Response, fallbackError: string): Promise<never> {
  const err = await res.json().catch(() => ({}));
  throw new Error((err as { detail?: string })?.detail || fallbackError);
}

export interface RestauranteConfig {
  nit: number;
  direccion: string;
  nombre_restaurante: string;
  descripcion_restaurante: string;
  horario_apertura: string;
  horario_cierre: string;
  documento: number;
  id_categoria: number;
  url_image?: string;
  imagenes_referencia?: string[];
  /** Antelación mínima para reservar (en horas). 0 = sin restricción. */
  min_anticipacion_horas?: number;
}

export interface RestauranteUpdateBody {
  nit: number;
  direccion: string;
  nombre_restaurante: string;
  descripcion_restaurante: string;
  horario_apertura: string;
  horario_cierre: string;
  documento: number;
  id_categoria: number;
  min_anticipacion_horas: number;
}

export interface MesaConfig {
  id_mesa: number;
  estado_de_disponibilidad: boolean;
  cant_personas: number;
  nit: number;
  precio: number;
}

export interface MesaAddBody {
  estado_de_disponibilidad: boolean;
  cant_personas: number;
  nit: number;
  precio: number;
}

export interface MesaUpdateBody extends MesaAddBody {
  id_mesa: number;
}

export interface AdministradorConfig {
  id_credencial: number;
  nombre: string;
  apellido: string;
  documento: number;
  email: string;
}

export interface EmpleadoAsignable {
  id_credencial: number;
  nombre: string;
  apellido: string;
  documento: number;
  email: string;
  nombre_rol: string;
  nit: number | null;
}

export interface RestauranteDelDueno {
  nit: number;
  nombre_restaurante: string;
}

export const OwnerRestaurantConfigService = {
  async getRestaurantesDelDueno(): Promise<RestauranteDelDueno[]> {
    const res = await authFetch(getApiEndpoint("/data-owner/restaurantes"), { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    const list = data?.restaurantes ?? [];
    return list.map((r: { nit: number; nombre_restaurante?: string }) => ({
      nit: r.nit,
      nombre_restaurante: r.nombre_restaurante ?? "",
    }));
  },

  async getRestauranteConfig(nit: number): Promise<RestauranteConfig | null> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}`), { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.restaurante ?? data ?? null;
  },

  async putRestauranteConfig(nit: number, body: RestauranteUpdateBody): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) await throwOnError(res, "Error al guardar restaurante");
  },

  async getMesas(nit: number): Promise<MesaConfig[]> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/mesas`), { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.mesas ?? [];
  },

  async addMesa(nit: number, body: MesaAddBody): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/mesas`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, nit }),
    });
    if (!res.ok && res.status !== 201) await throwOnError(res, "Error al agregar mesa");
  },

  async updateMesa(nit: number, id_mesa: number, body: MesaUpdateBody): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/mesas/${id_mesa}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, nit, id_mesa }),
    });
    if (!res.ok) await throwOnError(res, "Error al editar mesa");
  },

  async deleteMesa(nit: number, id_mesa: number): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/mesas/${id_mesa}`), {
      method: "DELETE",
    });
    if (!res.ok) await throwOnError(res, "Error al eliminar mesa");
  },

  async getAdministrador(nit: number): Promise<AdministradorConfig | null> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/administrador`), { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.administrador ?? null;
  },

  async putAdministrador(nit: number, id_credencial: number): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/administrador`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_credencial }),
    });
    if (!res.ok) await throwOnError(res, "Error al asignar administrador");
  },

  async getEmpleados(): Promise<EmpleadoAsignable[]> {
    const res = await authFetch(getApiEndpoint("/data-owner/empleados"), { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.empleados ?? [];
  },

  async buscarEmail(email: string): Promise<{ existe: boolean; id_credencial?: number; nombre?: string; apellido?: string }> {
    const res = await authFetch(getApiEndpoint("/data-owner/buscar-email"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!res.ok) throw new Error("Error al buscar el correo");
    return res.json();
  },

  async asignarEmpleado(nit: number, id_credencial: number): Promise<void> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/asignar-empleado`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_credencial }),
    });
    if (!res.ok) await throwOnError(res, "Error al asignar empleado");
  },

  async cambiarRolACliente(id_credencial: number): Promise<void> {
    const res = await authFetch(getApiEndpoint("/data-owner/cambiar-rol-cliente"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_credencial }),
    });
    if (!res.ok) await throwOnError(res, "Error al cambiar rol a cliente");
  },

  async crearEmpleado(nit: number, email: string): Promise<{ email: string; password: string }> {
    const res = await authFetch(getApiEndpoint(`/data-owner/restaurantes/${nit}/crear-empleado`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al crear empleado");
    }
    const data = await res.json();
    return { email: data.email ?? email, password: data.password ?? "" };
  },
};
