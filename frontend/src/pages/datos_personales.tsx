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
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl"></div>
    </div>
  );
}
