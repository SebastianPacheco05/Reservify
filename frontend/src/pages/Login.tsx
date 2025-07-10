"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { ModeToggle } from "../components/mode-toggle";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Error en el login");
      }
  
      console.log("Login exitoso:", data);
  
      // Guardar token
      localStorage.setItem("token", data.access_token);
  
      // Redireccionar si quieres
      // navigate("/dashboard");
    } catch (err: any) {
      console.error("Error:", err.message);
      alert("Error de inicio de sesión: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        {/* Mode Toggle - Posicionado absolutamente para móviles */}
        <div className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto sm:flex sm:justify-end sm:mb-4">
          {/* <ModeToggle /> */}
        </div>
        
        {/* Logo/Brand */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-gray-500 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenido a Reservify
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-center text-gray-900 dark:text-white">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-9 sm:h-10 md:h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-9 sm:h-10 md:h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
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
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2"></div>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-9 sm:h-10 md:h-11 bg-gradient-to-r from-blue-600 to-gray-500 hover:from-blue-700 hover:to-gray-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
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

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-gray-200 dark:bg-gray-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="w-full h-9 sm:h-10 md:h-11 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                type="button"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200">Continuar con Google</span>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-1 sm:pt-2 md:pt-4">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                ¿No tienes una cuenta?{" "}
                <button 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
                  type="button"
                  onClick={() => navigate("/registrar")}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-1 sm:space-x-2 md:space-x-4 mt-1">
            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded">
              Términos de Servicio
            </button>
            <span>•</span>
            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded">
              Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
