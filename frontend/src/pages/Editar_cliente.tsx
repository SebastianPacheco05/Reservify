"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  IdCard,
  Flag,
  Phone,
  Eye,
  EyeOff,
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
import { ModeToggle } from "../components/mode-toggle";

interface Cliente {
  id_cliente: number;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  nacionalidad: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
}

export default function Editar_cliente() {
  const { id_cliente } = useParams();
  const [idCliente, setIdCliente] = useState("");
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [tipo_documento, setTipo_documento] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idCredencial, setIdCredencial] = useState("");
  const [idRol, setIdRol] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id_cliente) return;
    fetch("http://localhost:8000/listar_cliente", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente: Number(id_cliente) }),
    })
      .then((res) => res.json())
      .then((data) => {
        const cliente = data.respuesta;
        if (cliente) {
          setIdCliente(cliente.id_cliente);
          setIdCredencial(cliente.id_credencial);
          setNombre1(cliente.nombre1);
          setNombre2(cliente.nombre2);
          setApellido1(cliente.apellido1);
          setApellido2(cliente.apellido2);
          setNacionalidad(cliente.nacionalidad);
          setTipo_documento(cliente.tipo_documento);
          setNumero_documento(cliente.documento);
          setTelefono(cliente.telefono);
          setIdRol(cliente.id_rol);
        }
      });
  }, [id_cliente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch("http://localhost:8000/editarcliente", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_cliente: Number(idCliente),
        id_credencial: Number(idCredencial),
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        tipo_documento,
        documento: Number(numero_documento),
        nacionalidad,
        telefono,
        id_rol: Number(idRol),
      }),
    });
    setIsLoading(false);
    // Aquí puedes mostrar un mensaje de éxito o redirigir
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ModeToggle />
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenido a Reservify
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Edita tu cuenta de Reservify
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
              Edita tu cuenta
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Ingresa tus datos para editar tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo id_cliente para pruebas */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_cliente"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ID Cliente (prueba)
                </Label>
                <div className="relative">
                  <Input
                    id="id_cliente"
                    type="number"
                    placeholder="ID del cliente"
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    className="h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Campo id_credencial para pruebas */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_credencial"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ID Credencial (prueba)
                </Label>
                <div className="relative">
                  <Input
                    id="id_credencial"
                    type="number"
                    placeholder="ID de la credencial"
                    value={idCredencial}
                    onChange={(e) => setIdCredencial(e.target.value)}
                    className="h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Campo id_rol para pruebas */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_rol"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ID Rol (prueba)
                </Label>
                <div className="relative">
                  <Input
                    id="id_rol"
                    type="number"
                    placeholder="ID del rol"
                    value={idRol}
                    onChange={(e) => setIdRol(e.target.value)}
                    className="h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Nombre1 Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombre1"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Primer nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="nombre1"
                    type="text"
                    placeholder="tu primer nombre"
                    value={nombre1}
                    onChange={(e) => setNombre1(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Nombre2 Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombre2"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Segundo nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="nombre2"
                    type="text"
                    placeholder="tu segundo nombre"
                    value={nombre2}
                    onChange={(e) => setNombre2(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Apellido1 Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="apellido1"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Primer apellido
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="apellido1"
                    type="text"
                    placeholder="tu primer apellido"
                    value={apellido1}
                    onChange={(e) => setApellido1(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Apellido2 Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="apellido2"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Segundo apellido
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="apellido2"
                    type="text"
                    placeholder="tu segundo apellido"
                    value={apellido2}
                    onChange={(e) => setApellido2(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Tipo de documento Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="tipo_documento"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Tipo de documento
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="tipo_documento"
                    type="text"
                    placeholder="tu tipo de documento"
                    value={tipo_documento}
                    onChange={(e) => setTipo_documento(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* poner como primary key el numero de documento  ya que es un campo obligatorio y necesario para el registro o la actualizacion de datos y la eliminacion de el mismo cliente*/}

              {/* numero de documento Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="numero_documento"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Numero de documento
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="numero_documento"
                    type="number"
                    placeholder="tu numero de documento"
                    value={numero_documento}
                    onChange={(e) => setNumero_documento(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Nacionalidad Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nacionalidad"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Nacionalidad
                </Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="nacionalidad"
                    type="text"
                    placeholder="tu nacionalidad"
                    value={nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Telefono Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="telefono"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Numero de telefono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="telefono"
                    type="text"
                    placeholder="tu numero de telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>editando cuenta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Editar cuenta</span>
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 border-gray-50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
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
                <span className="text-gray-50 dark:text-gray-500">Google</span>
              </Button>
              <Button
                variant="outline"
                className="h-11 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                type="button"
              >
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-gray-50 dark:text-gray-500">
                  Facebook
                </span>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ¿ya tienes una cuenta?{" "}
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded">
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-4 mt-1">
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
