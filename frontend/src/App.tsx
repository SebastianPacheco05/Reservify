import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar_login from "./pages/Registrar_login";
// import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/registrar_login" element={<Registrar_login />} />
        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
