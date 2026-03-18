import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authFetch, isAuthenticated } from "../services/authService";
import { useToastContext } from "./ToastProvider";
import { getApiEndpoint } from "../config/api";
import { getRoleRedirectPath, rolesMatch } from "../routes/paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // "dueño", "cliente", "empleado", "administrador" o array de roles
}

export default function ProtectedRoute({
  children,
  requiredRole = "dueño"
}: ProtectedRouteProps) {
  const { toast } = useToastContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>("/");

  useEffect(() => {
    const checkAccess = async () => {
      // Verificar autenticación
      if (!isAuthenticated()) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        // Obtener el rol del usuario actual
        const response = await authFetch(
          getApiEndpoint("/credenciales/me/role"),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Error al verificar rol");
        }

        const roleData = await response.json();
        const userRole = roleData.nombre_rol || "";
        setRedirectPath(getRoleRedirectPath(userRole));

        // Verificar si el usuario tiene el rol requerido
        // Los roles en la DB son: "dueño", "cliente", "empleado", "administrador"
        // Cada usuario solo puede acceder a su propio dashboard
        const requiredRoles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];

        const hasRequiredRole = requiredRoles.some((r) => rolesMatch(userRole, r));

        if (hasRequiredRole) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          // Mensaje personalizado según el dashboard intentado
          const dashboardName = requiredRoles.some((r) => rolesMatch(r, "dueño"))
            ? "Dashboard de Dueño"
            : requiredRoles.some((r) => rolesMatch(r, "administrador"))
              ? "Dashboard de Administrador"
              : requiredRoles.some((r) => rolesMatch(r, "empleado"))
                ? "Dashboard de Empleado"
                : "Dashboard de Cliente";

          toast({
            title: "Acceso denegado",
            description: `No tienes permisos para acceder al ${dashboardName}. Solo los usuarios con el rol correspondiente pueden acceder.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error al verificar rol:", error);
        setHasAccess(false);
        toast({
          title: "Error de verificación",
          description: "No se pudo verificar tu rol. Por favor, inicia sesión nuevamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [requiredRole, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to={redirectPath || "/"} replace />;
  }

  return <>{children}</>;
}
