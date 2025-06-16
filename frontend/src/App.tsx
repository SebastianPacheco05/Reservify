import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Insertar_cliente from "./pages/Insertar_cliente";
import Insertar_restaurante from "./pages/Insertar_restaurante";

// import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Insertar_cliente" element={<Insertar_cliente />} />
        <Route path="/Insertar_restaurante" element={<Insertar_restaurante/>}/>
        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
