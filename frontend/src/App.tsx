import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/registrar";
import Insertar_restaurante from "./pages/Insertar_restaurante";
// el de credencial no lo veo necesario ya que en el cliente insertar se crea la credencial
import Insertar_credencial from "./pages/Insertar_credencial";
import Editar_cliente from "./pages/Editar_cliente";
import Editar_restaurante from "./pages/Editar_restaurante";
import Borrar_restaurante from "./pages/Borrar_restaurante";
import Borrar_cliente from "./pages/Borrar_cliente";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/employee-dashboard";
import ClientDashboard from "./pages/Dashboard_cliente";
import Restaurant from "./pages/Restaurant";

import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registrar" element={<Registrar />} />
        <Route
          path="/Insertar_restaurante"
          element={<Insertar_restaurante />}
        />
        <Route path="/Insertar_credencial" element={<Insertar_credencial />} />
        <Route path="/Editar_restaurante" element={<Editar_restaurante />} />
        <Route path="/Editar_cliente" element={<Editar_cliente />} />
        <Route path="/Borrar_restaurante" element={<Borrar_restaurante />} />
        <Route path="/Borrar_cliente" element={<Borrar_cliente />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/ClientDashboard" element={<ClientDashboard />} />
        <Route path="/Restaurant" element={<Restaurant />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
