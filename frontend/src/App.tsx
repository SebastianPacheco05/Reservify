import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/registrar";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/employee-dashboard";
import ClientDashboard from "./pages/Dashboard_cliente";
import Restaurant from "./pages/Restaurant";

import Datos_personales from "./pages/datos_personales";

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Registrar" element={<Registrar />} />
      <Route path="/DuenoDashboard" element={<Dashboard />} />
      <Route path="/EmpleadoDashboard" element={<EmployeeDashboard />} />
      <Route path="/ClienteDashboard" element={<ClientDashboard />} />
      <Route path="/Restaurant" element={<Restaurant />} />
      <Route path="/Datos_personales" element={<Datos_personales />} />
    </Routes>
    // </ThemeProvider>
  );
}

export default App;
