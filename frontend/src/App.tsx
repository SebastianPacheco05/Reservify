import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/registrar";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/employee-dashboard";
import ClientDashboard from "./pages/Dashboard_cliente";
import Restaurant from "./pages/Restaurant";
import NotFound from "./pages/NotFound";

import Datos_personales from "./pages/datos_personales";
import Pasarela_pagos from "./pages/Pasarela_pagos";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registrar" element={<Registrar />} />
        <Route path="/DuenoDashboard" element={<Dashboard />} />
        <Route path="/EmpleadoDashboard" element={<EmployeeDashboard />} />
        <Route path="/ClienteDashboard" element={<ClientDashboard />} />
        <Route path="/Restaurant" element={<Restaurant />} />
        <Route path="/Datos_personales" element={<Datos_personales />} />
        <Route path="/Pasarela_pagos" element={<Pasarela_pagos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
