"use client";

import type React from "react";

import { useState } from "react";
import { Lock, ArrowRight, User, IdCard, Flag, Phone } from "lucide-react";
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

export default function Registrar() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [tipo_documento, setTipo_documento] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Login attempt:", {
      nombre,
      apellidos,
      nacionalidad,
      tipo_documento,
      numero_documento,
      telefono,
      rememberMe,
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 ">
            Bienvenido a Reservify
          </h1>
          <p className="text-gray-600 mt-2">
            Ingresa tus datos personales para crear tu cuenta
          </p>
        </div>
        <div className="flex justify-center items-center h-full">
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
        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500 px-2">
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
