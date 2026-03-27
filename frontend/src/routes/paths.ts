export const ROUTES = {
  HOME: "/",
  SEARCH: "/buscar",
  LOGIN: "/Login",
  REGISTER: "/Registrar",
  CONTACTO: "/contacto",
  AYUDA: "/ayuda",
  TERMINOS: "/terminos",
  PRIVACIDAD: "/privacidad",
  OWNER_DASHBOARD: "/duenodashboard",
  ADMIN_DASHBOARD: "/admindashboard",
  EMPLOYEE_DASHBOARD: "/EmpleadoDashboard",
  CLIENT_DASHBOARD: "/ClienteDashboard",
  VIEW_EMAIL: "/ver-correo/:uid",
  RESTAURANT: "/Restaurant",
  PERSONAL_DATA: "/Datos_personales",
  PAYMENT_GATEWAY: "/Pasarela_pagos",
  PAGO_EXITOSO: "/pago-exitoso",
} as const;

export type AppRole = "dueño" | "dueno" | "administrador" | "empleado" | "cliente";

function normalizeRole(role: string): string {
  return role
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes (dueño -> dueno)
}

export function getRoleRedirectPath(role: string | null | undefined): string {
  const r = role ? normalizeRole(role) : "";
  switch (r) {
    case "dueno":
      return ROUTES.OWNER_DASHBOARD;
    case "administrador":
      return ROUTES.ADMIN_DASHBOARD;
    case "empleado":
      return ROUTES.EMPLOYEE_DASHBOARD;
    case "cliente":
      return ROUTES.CLIENT_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

export function isPrivilegedRole(role: string | null | undefined): boolean {
  const r = role ? normalizeRole(role) : "";
  return r === "dueno" || r === "administrador" || r === "empleado";
}

export function rolesMatch(userRole: string, required: string): boolean {
  return normalizeRole(userRole) === normalizeRole(required);
}

