import { useEffect, useState, type ReactNode } from "react";
import Header from "./Header";
import { ProfileModal } from "./ProfileModal";

export function AuthPageShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("tipo_usuario");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/60 via-background to-accent/10 dark:from-background dark:via-background dark:to-muted/60 transition-colors duration-300">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
      {isLoggedIn && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
      <div className="pt-14 sm:pt-16">{children}</div>
    </div>
  );
}
