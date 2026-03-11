import { Link } from "react-router-dom";
import { X, MenuIcon, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { fadeInDown, transitionNormal } from "../lib/animations";
import { ROUTES } from "../routes/config";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenProfile?: () => void;
}

export default function Header({
  isMenuOpen,
  setIsMenuOpen,
  isLoggedIn,
  onLogout,
  onOpenProfile,
}: HeaderProps) {
  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={fadeInDown}
      transition={transitionNormal}
      className="bg-background/95 backdrop-blur-xl fixed top-0 w-full z-50 shadow-lg border-b border-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-4 h-14 sm:h-16 gap-2">
        <motion.div
          className="flex items-center shrink-0 min-w-0 max-w-[180px] sm:max-w-[220px]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link to={ROUTES.HOME} aria-label="Ir al inicio de Reservify">
            <img
              src="/logoreservify.png"
              width="140"
              height="32"
              className="w-full h-8 sm:h-9 object-contain object-left dark:invert"
              alt="Reservify - Reserva en tu restaurante favorito"
              fetchPriority="low"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 shrink-0">
          <motion.a
            href="#restaurantes"
            className="text-foreground hover:text-primary font-medium"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Restaurantes
          </motion.a>

          {/* Botón de cambio de tema (Light / Dark / System) */}
          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 text-foreground p-0"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Abrir menú de perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onOpenProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/Login">
                <Button
                  className="text-background bg-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 transform"
                  size="sm"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/Registrar">
                <Button
                  className="text-secondary-foreground bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 transform"
                  size="sm"
                >
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden hover:bg-muted transition-all duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <MenuIcon className="w-5 h-5 text-foreground" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden bg-background border-t border-border px-4 py-4 space-y-4 overflow-hidden"
        >
          <a
            href="#"
            className="block text-foreground hover:text-primary font-medium transition-colors duration-300"
          >
            Restaurantes
          </a>
          <a
            href="#"
            className="block text-foreground hover:text-primary font-medium transition-colors duration-300"
          >
            Ofertas
          </a>

          {/* Botón de cambio de tema en móvil */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-foreground font-medium">Tema</span>
            <ModeToggle />
          </div>

          {isLoggedIn ? (
            <div className="pt-2 space-y-2">
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenProfile?.();
                }}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
              <Button
                onClick={onLogout}
                size="sm"
                className="w-full bg-destructive hover:bg-destructive/90 transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 pt-2">
              <Link to="/Login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-foreground text-foreground hover:bg-muted bg-transparent transition-all duration-300"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/Registrar">
                <Button
                  size="sm"
                  className="flex-1 bg-secondary hover:bg-primary transition-all duration-300"
                >
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  );
}
