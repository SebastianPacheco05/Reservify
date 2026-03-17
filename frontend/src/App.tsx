import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider";
import { startProactiveRefresh } from "./services/authService";
import { motion } from "framer-motion";
import { fadeIn } from "./lib/animations";
import { getProtectedRoutes, getPublicRoutes } from "./routes/config";
import { CookieConsentModal } from "./components/CookieConsentModal";
import RoleEnforcer from "./components/RoleEnforcer";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate="animate"
      variants={fadeIn}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  useEffect(() => {
    startProactiveRefresh();
  }, []);

  const protectedRoutes = getProtectedRoutes(PageWrapper);
  const publicRoutes = getPublicRoutes(PageWrapper);

  return (
    <ToastProvider>
      <CookieConsentModal />
      <RoleEnforcer />
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </ToastProvider>
  );
}

export default App;
