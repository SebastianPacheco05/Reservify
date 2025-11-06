import { Link } from "react-router-dom";
import { X, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Header({
  isMenuOpen,
  setIsMenuOpen,
  isLoggedIn,
  isDarkMode,
  toggleDarkMode,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-lg border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex items-center space-x-2 animate-in fade-in duration-1000 dark:flex">
          <img
            src="/logoreservify.png"
            className="w-full dark:w-full dark:invert h-15"
            alt="Reservify Logo"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 animate-in slide-in-from-right duration-700 delay-300">
          <a
            href="#restaurantes"
            className="text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 font-medium"
          >
            Restaurantes
          </a>

          {/* Botón de cambio de tema */}
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

          {isLoggedIn ? (
            <Button
              onClick={onLogout}
              className="text-white bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 transform"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Link to="/Login">
                <Button
                  className="text-white bg-black hover:bg-blue-600 transition-all duration-300 hover:scale-105 transform"
                  size="sm"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/Registrar">
                <Button
                  className="text-white bg-red-600 hover:bg-blue-600 transition-all duration-300 hover:scale-105 transform"
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
          className="md:hidden hover:bg-blue-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-black dark:text-white" />
          ) : (
            <MenuIcon className="w-5 h-5 text-black dark:text-white" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-700 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <a
            href="#"
            className="block text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
          >
            Restaurantes
          </a>
          <a
            href="#"
            className="block text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
          >
            Ofertas
          </a>

          {/* Botón de cambio de tema en móvil */}
          <div className="flex items-center justify-between py-2 border-t border-blue-100 dark:border-gray-700">
            <span className="text-black dark:text-white font-medium">Tema</span>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>

          {isLoggedIn ? (
            <div className="pt-2">
              <Button
                onClick={onLogout}
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300"
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 pt-2">
              <Link to="/Login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-black dark:border-white text-black dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 bg-transparent transition-all duration-300"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/Registrar">
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-blue-600 transition-all duration-300"
                >
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
