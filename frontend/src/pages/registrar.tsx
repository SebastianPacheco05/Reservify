"use client";

import type React from "react";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  IdCard,
  Phone,
  User,
  Flag,
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";

export default function Registrar() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [rememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tipo_documento, setTipo_documento] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
    } else {
      try {
        const res = await fetch(
          "http://localhost:8000/credenciales/insertarcredencial",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail ?? "Error en el registro");
      } catch (err: any) {
        alert("Error en el registro: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-max">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido a Reservify
          </h1>
          <p className="text-gray-600 mt-2">Registra tu cuenta de Reservify</p>
        </div>
        <div className="hidden justify-center items-center h-full">
          <Card className="shadow-xl w-full border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl text-center text-gray-900">
                Ingresa tus datos personales
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Ingresa tus datos para crear tu cuenta
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Columna Izquierda */}
                <div className="space-y-4">
                  {/* Tipo de documento Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="tipo_documento"
                      className="text-sm font-medium text-gray-900"
                    >
                      Tipo de documento
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="tipo_documento"
                        type="tipo_documento"
                        placeholder="tu tipo de documento"
                        value={tipo_documento}
                        onChange={(e) => setTipo_documento(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* numero de documento Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="numero_documento"
                      className="text-sm font-medium text-gray-900"
                    >
                      Numero de documento
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="numero_documento"
                        type="numero_documento"
                        placeholder="tu numero de documento"
                        value={numero_documento}
                        onChange={(e) => setNumero_documento(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Telefono Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="telefono"
                      className="text-sm font-medium text-gray-900"
                    >
                      Numero de telefono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <Input
                        id="telefono"
                        type="telefono"
                        placeholder="tu numero de telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Columna Derecha */}
                <div className="space-y-4">
                  {/* Nombre Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="nombre1"
                      className="text-sm font-medium text-gray-900"
                    >
                      Nombre
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="nombre"
                        type="nombre"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Apellido Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="apellido1"
                      className="text-sm font-medium text-gray-900"
                    >
                      Apellido
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="apellidos"
                        type="apellidos"
                        placeholder="Tu apellido"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Nacionalidad Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="nacionalidad"
                      className="text-sm font-medium text-gray-900"
                    >
                      Nacionalidad
                    </Label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="nacionalidad"
                        type="nacionalidad"
                        placeholder="tu nacionalidad"
                        value={nacionalidad}
                        onChange={(e) => setNacionalidad(e.target.value)}
                        className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Botón y resto del formulario */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2"></div>
                  </div>
                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cargando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center items-center space-x-4 h-full grid-cols-2">
          <Card className="shadow-xl w-[23rem] border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-0.5 pb-3">
              <CardTitle className="text-xl text-center text-gray-900">
                Crea tu cuenta
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Ingresa tus datos para crear tu cuenta
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900"
                  >
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0.5 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0.5 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2"></div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {/* <Link to="/datos_personales"> */}
                      <span>Crear cuenta</span>
                      {/* </Link> */}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-gray-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500">
                    O continúa con
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="h-11 w-full border-gray-200 hover:bg-gray-50 transition-colors bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                  <span className="h-6 bg-white-600 hover:to-gray-100 text-gray-700 font-medium transition-all duration-200 transform hover:scale-[1.02]">
                    Google
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-4 mt-1">
            <button className="hover:text-gray-700 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded">
              Términos de Servicio
            </button>
            <span>•</span>
            <button className="hover:text-gray-700 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded">
              Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
