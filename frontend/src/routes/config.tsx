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
import PagoExitoso from "../pages/PagoExitoso";
import ProtectedRoute from "../components/ProtectedRoute";
import Contacto from "../pages/Contacto";
import Ayuda from "../pages/Ayuda";
import Terminos from "../pages/Terminos";
import Privacidad from "../pages/Privacidad";
import Lost from "../pages/Lost";
import { ROUTES } from "./paths";

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
  { path: ROUTES.LOST, element: <PageWrapper><Lost /></PageWrapper> },
  { path: ROUTES.CONTACTO, element: <PageWrapper><Contacto /></PageWrapper> },
  { path: ROUTES.AYUDA, element: <PageWrapper><Ayuda /></PageWrapper> },
  { path: ROUTES.TERMINOS, element: <PageWrapper><Terminos /></PageWrapper> },
  { path: ROUTES.PRIVACIDAD, element: <PageWrapper><Privacidad /></PageWrapper> },
  { path: ROUTES.RESTAURANT, element: <PageWrapper><Restaurant /></PageWrapper> },
  { path: ROUTES.PERSONAL_DATA, element: <PageWrapper><PersonalData /></PageWrapper> },
  { path: ROUTES.PAYMENT_GATEWAY, element: <PageWrapper><PaymentGateway /></PageWrapper> },
  { path: ROUTES.PAGO_EXITOSO, element: <PageWrapper><PagoExitoso /></PageWrapper> },
  { path: "*", element: <PageWrapper><NotFound /></PageWrapper> },
];
