import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authFetch, isAuthenticated } from "../services/authService";
import { useToastContext } from "./ToastProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // "dueño", "cliente", "empleado" o array de roles
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = "dueño" 
}: ProtectedRouteProps) {
  const { toast } = useToastContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

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
          `${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/credenciales/me/role`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Error al verificar rol");
        }

        const roleData = await response.json();
        const userRole = roleData.nombre_rol?.toLowerCase() || "";

        // Verificar si el usuario tiene el rol requerido
        // Los roles en la DB son: "dueño", "cliente", "empleado"
        // Cada usuario solo puede acceder a su propio dashboard
        const requiredRoles = Array.isArray(requiredRole) 
          ? requiredRole.map(r => r.toLowerCase())
          : [requiredRole.toLowerCase()];
        
        const hasRequiredRole = requiredRoles.includes(userRole);
        
        if (hasRequiredRole) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          // Mensaje personalizado según el dashboard intentado
          const dashboardName = requiredRoles.includes("dueño") 
            ? "Dashboard de Dueño" 
            : requiredRoles.includes("empleado")
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
