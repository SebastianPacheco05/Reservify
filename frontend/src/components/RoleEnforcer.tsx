import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authFetch, isAuthenticated } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { getRoleRedirectPath, isPrivilegedRole, ROUTES } from "../routes/paths";

/**
 * Fuerza el módulo correcto según rol.
 * Si el usuario es dueño/empleado/admin, aunque escriba otra URL (p.ej. "/"),
 * se le redirige a su dashboard.
 */
export default function RoleEnforcer() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    let cancelled = false;

    const enforce = async () => {
      if (!isAuthenticated()) return;

      // Evita loops por navegación repetida
      const currentPath = location.pathname;
      if (lastPathRef.current === currentPath) return;
      lastPathRef.current = currentPath;

      // No forzamos dentro de /Login o /Registrar
      if (currentPath === ROUTES.LOGIN || currentPath === ROUTES.REGISTER) return;

      // 1) Enforce inmediato con el rol guardado en login (más rápido y no depende del backend)
      const cachedRole = localStorage.getItem("tipo_usuario") ?? "";
      if (isPrivilegedRole(cachedRole)) {
        const cachedTarget = getRoleRedirectPath(cachedRole);
        if (!cancelled && cachedTarget && cachedTarget !== currentPath) {
          navigate(cachedTarget, { replace: true });
          return;
        }
      }

      try {
        // 2) Validación con backend (corrige si el rol guardado está desactualizado)
        const response = await authFetch(getApiEndpoint("/credenciales/me/role"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return;

        const roleData = await response.json();
        const userRole = roleData.nombre_rol ?? "";

        if (!isPrivilegedRole(userRole)) return;

        const target = getRoleRedirectPath(userRole);
        if (!cancelled && target && target !== currentPath) {
          navigate(target, { replace: true });
        }
      } catch {
        // Si falla, no bloqueamos la navegación; ProtectedRoute seguirá protegiendo.
      }
    };

    enforce();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, navigate]);

  return null;
}

