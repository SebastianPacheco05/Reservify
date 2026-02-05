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
import { motion } from "framer-motion";
import { fadeIn } from "./lib/animations";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/Login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/Registrar" element={<PageWrapper><Registrar /></PageWrapper>} />
        <Route path="/DuenoDashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/EmpleadoDashboard" element={<PageWrapper><EmployeeDashboard /></PageWrapper>} />
        <Route path="/ClienteDashboard" element={<PageWrapper><ClientDashboard /></PageWrapper>} />
        <Route path="/Restaurant" element={<PageWrapper><Restaurant /></PageWrapper>} />
        <Route path="/Datos_personales" element={<PageWrapper><Datos_personales /></PageWrapper>} />
        <Route path="/Pasarela_pagos" element={<PageWrapper><Pasarela_pagos /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
