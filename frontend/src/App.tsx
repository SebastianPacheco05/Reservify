import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
