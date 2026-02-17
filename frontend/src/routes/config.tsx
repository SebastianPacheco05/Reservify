import Home from "../pages/Home";
import Login from "../pages/Login";
import Registrar from "../pages/registrar";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/employee-dashboard";
import ClientDashboard from "../pages/ClientDashboard";
import ViewEmailPage from "../pages/ViewEmailPage";
import Restaurant from "../pages/Restaurant";
import NotFound from "../pages/NotFound";
import PersonalData from "../pages/PersonalData";
import PaymentGateway from "../pages/PaymentGateway";
import ProtectedRoute from "../components/ProtectedRoute";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/Login",
  REGISTER: "/Registrar",
  OWNER_DASHBOARD: "/duenodashboard",
  ADMIN_DASHBOARD: "/admindashboard",
  EMPLOYEE_DASHBOARD: "/EmpleadoDashboard",
  CLIENT_DASHBOARD: "/ClienteDashboard",
  VIEW_EMAIL: "/ver-correo/:uid",
  RESTAURANT: "/Restaurant",
  PERSONAL_DATA: "/Datos_personales",
  PAYMENT_GATEWAY: "/Pasarela_pagos",
} as const;

export const ROLE_REDIRECTS: Record<string, string> = {
  dueno: ROUTES.OWNER_DASHBOARD,
  administrador: ROUTES.ADMIN_DASHBOARD,
  empleado: ROUTES.EMPLOYEE_DASHBOARD,
  cliente: ROUTES.HOME,
};

export const getProtectedRoutes = (PageWrapper: React.FC<{ children: React.ReactNode }>) => [
  {
    path: ROUTES.OWNER_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="dueño">
        <PageWrapper><Dashboard /></PageWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="administrador">
        <PageWrapper><AdminDashboard /></PageWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EMPLOYEE_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="empleado">
        <PageWrapper><EmployeeDashboard /></PageWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CLIENT_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="cliente">
        <PageWrapper><ClientDashboard /></PageWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.VIEW_EMAIL,
    element: (
      <ProtectedRoute requiredRole={["dueño", "administrador", "empleado"]}>
        <PageWrapper><ViewEmailPage /></PageWrapper>
      </ProtectedRoute>
    ),
  },
];

export const getPublicRoutes = (PageWrapper: React.FC<{ children: React.ReactNode }>) => [
  { path: ROUTES.HOME, element: <PageWrapper><Home /></PageWrapper> },
  { path: ROUTES.LOGIN, element: <PageWrapper><Login /></PageWrapper> },
  { path: ROUTES.REGISTER, element: <PageWrapper><Registrar /></PageWrapper> },
  { path: ROUTES.RESTAURANT, element: <PageWrapper><Restaurant /></PageWrapper> },
  { path: ROUTES.PERSONAL_DATA, element: <PageWrapper><PersonalData /></PageWrapper> },
  { path: ROUTES.PAYMENT_GATEWAY, element: <PageWrapper><PaymentGateway /></PageWrapper> },
  { path: "*", element: <PageWrapper><NotFound /></PageWrapper> },
];
