"use client";

import type React from "react";

import { useState } from "react";
import { Utensils,Clock ,MapPin, ArrowRight, User , IdCard,CopyCheck } from "lucide-react";
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
import { ModeToggle } from "../components/mode-toggle";

export default function Editar_restaurante() {
  const [NIT, setNIT] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [nombre_restaurante, setnombre_restaurante] = useState("");
  const [descripcion_restaurante, setdescripcion_restaurante ] = useState("");
  const [horario_apertura , sethorario_apertura ] = useState("");
  const [horario_cierre , sethorario_cierre ] = useState("");
  const [id_dueno, setid_dueno] = useState("");
  const [id_categoria , setid_categoria ] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Login attempt:", { NIT, Direccion, nombre_restaurante,descripcion_restaurante,horario_apertura,horario_cierre,id_dueno,id_categoria,isLoading });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ModeToggle />

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
              Actualiza tu cuenta de restaurante
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Ingresa tus datos para Actualizar tu cuenta de restaurante
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NIT Field */}
              <div className="space-y-2">
                <Label
                  htmlFor=" NIT"     
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Numero de NIT
                </Label>
                <div className="relative">
                  < Utensils  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="NIT"
                    type="NIT"
                    placeholder="NIT del restaurante"
                    value={NIT}
                    onChange={(e) => setNIT(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Direccion Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="Direccion"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Direccion
                </Label>
                <div className="relative">
                < MapPin  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="Direccion"
                    type="Direccion"
                    placeholder="Direccion del restaurante"
                    value={Direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* nombre del restaurante  Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombre_estaurante"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Nombre del Restaurante
                </Label>
                <div className="relative">
                < Utensils  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="nombre_restaurante"
                    type="nombre_restaurante"
                    placeholder="Nombre de tu Restaurante"
                    value={nombre_restaurante}
                    onChange={(e) => setnombre_restaurante(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* descripcion_restaurante  Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="descripcion_restaurante "
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Descripcion del Restaurante 
                </Label>
                <div className="relative">
                < User  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="descripcion_restaurante "
                    type="descripcion_restaurante "
                    placeholder="Describe tu Restaurante"
                    value={descripcion_restaurante }
                    onChange={(e) => setdescripcion_restaurante (e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* horario_apertura  Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="horario_apertura "
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Horario de Apertura del Restaurante
                </Label>
                <div className="relative">
                < Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="horario_apertura "
                    type="horario_apertura "
                    placeholder="tu horario de apertura del restaurante "
                    value={horario_apertura }
                    onChange={(e) => sethorario_apertura (e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* horario_cierre  Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="horario_cierre "
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Horario de cierre del Restaurante
                </Label>
                <div className="relative">
                < Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="horario_cierre "
                    type="horario_cierre "
                    placeholder="tu horario de cierre del restaurante "
                    value={horario_cierre }
                    onChange={(e) => sethorario_cierre (e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>


              {/* id_dueno Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_dueno"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ID del Dueño
                </Label>
                <div className="relative">
                < IdCard  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="id_dueno"
                    type="id_dueno"
                    placeholder="tu identificador de dueño"
                    value={id_dueno}
                    onChange={(e) => setid_dueno(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* id_categoria  Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_categoria "
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ID categoria 
                </Label>
                <div className="relative">
                < CopyCheck  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="id_categoria "
                    type="id_categoria "
                    placeholder="identificador de tu categoria"
                    value={id_categoria }
                    onChange={(e) => setid_categoria (e.target.value)}
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
                    <span>Actualizando perfil del Restaurante...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>acualiza tu perfil del Restaurante</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
            
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
