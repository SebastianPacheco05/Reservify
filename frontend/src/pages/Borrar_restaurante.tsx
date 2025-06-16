"use client";

import type React from "react";

import { useState } from "react";
import { Utensils, ArrowRight, } from "lucide-react";
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

export default function Borrar_restaurante() {
  const [NIT, setNIT] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Login attempt:", { NIT,isLoading });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ModeToggle />

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
              Elimina tu cuenta de restaurante
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Ingresa tus datos para Elimina tu cuenta de restaurante
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


              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Eliminando tu Restaurante...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Elimina tu Restaurante</span>
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
