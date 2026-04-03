import { getApiEndpoint } from "../config/api";

/**
 * Sube una imagen al endpoint de restaurante (Cloudinary) con refresh de token si hace falta.
 */
export async function uploadRestaurantImage(file: File): Promise<string> {
  const makeRequest = async (token: string | null): Promise<Response> => {
    const formData = new FormData();
    formData.append("file", file);
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(getApiEndpoint("/restaurante/upload-imagen"), {
      method: "POST",
      headers,
      body: formData,
    });
  };

  const token = localStorage.getItem("access_token");
  let res = await makeRequest(token);

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshRes = await fetch(getApiEndpoint("/credenciales/refresh"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.access_token;
          if (newToken) {
            localStorage.setItem("access_token", newToken);
            res = await makeRequest(newToken);
          } else {
            throw new Error("No se recibió nuevo token");
          }
        } else {
          localStorage.clear();
          window.location.href = "/Login";
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
      } catch {
        localStorage.clear();
        window.location.href = "/Login";
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }
    } else {
      localStorage.clear();
      window.location.href = "/Login";
      throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
    }
  }

  if (!res.ok) {
    let errorMessage = "Error al subir imagen";
    try {
      const err = await res.json();
      errorMessage =
        (err as { detail?: string })?.detail ||
        (err as { message?: string })?.message ||
        `Error ${res.status}: ${res.statusText}`;
    } catch {
      errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  const url = data?.url;
  if (!url || typeof url !== "string") {
    throw new Error("El servidor no devolvió la URL de la imagen");
  }
  return url;
}
