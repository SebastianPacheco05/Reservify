"use client";
import { Link } from "react-router-dom";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Home, Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { transitionNormal } from "../lib/animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToastContext } from "../components/ToastProvider";
import { startProactiveRefresh } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { useTheme } from "../components/theme-provider";
import { ROUTES } from "../routes/paths";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/credenciales/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Error en el login");

      // Guardar access token, tipo de usuario, documento y email
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type ?? "bearer");
      localStorage.setItem("tipo_usuario", data.tipo_usuario);
      localStorage.setItem("email", email);
      if (data.documento != null) localStorage.setItem("documento", String(data.documento));

      // Iniciar renovación proactiva del token (sin salir de la página)
      startProactiveRefresh();

      // 🔑 Redirigir a la ruta que devuelve el backend
      if (data.redirect_to) {
        navigate(data.redirect_to);
      } else {
        navigate("/"); // fallback por si no hay ruta
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a Reservify",
        variant: "default"
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Error de inicio de sesión:", err);
      toast({
        title: "No pudimos iniciar tu sesión",
        description: "Verifica tu correo y contraseña o inténtalo de nuevo en unos minutos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const isDarkMode = theme === "dark";

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-muted via-background to-accent/20 dark:from-background dark:via-muted dark:to-secondary/20 flex items-center justify-center p-4 transition-colors duration-500">
        <div className="w-full max-w-md">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitionNormal}
          >
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted text-primary transition-all duration-200 bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
            <Button
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted text-primary transition-all duration-200"
            >
              {isDarkMode ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
            </Button>
          </motion.div>

          {/* Logo/Brand */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground transition-colors duration-300">
              Bienvenido a Reservify
            </h1>
            <p className="text-muted-foreground mt-2">
              Inicia sesión en tu cuenta
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="shadow-xl bg-card/90 backdrop-blur-md rounded-2xl border border-border">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-xl text-center text-foreground transition-colors duration-300">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground transition-colors duration-300">
                  Ingresa tus credenciales para acceder
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground transition-colors duration-300"
                    >
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-300" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground transition-colors duration-300"
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-300" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-colors duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2"></div>
                    <button
                      type="button"
                      onClick={() => navigate("/lost")}
                      className="text-sm text-primary hover:text-accent font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Iniciando sesión...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Iniciar Sesión</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>



                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground transition-colors duration-300">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/Registrar">
                      <button className="text-primary hover:text-accent font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                        Regístrate aquí
                      </button>
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground transition-colors duration-300">
            <p>Al iniciar sesión, aceptas nuestros</p>
            <div className="space-x-4 mt-1">
              <Link
                to={ROUTES.TERMINOS}
                className="hover:text-foreground transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                Términos de Servicio
              </Link>
              <span>•</span>
              <Link
                to={ROUTES.PRIVACIDAD}
                className="hover:text-foreground transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
