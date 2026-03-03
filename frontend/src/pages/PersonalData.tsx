"use client";

import type React from "react";
import { useState } from "react";

export default function PersonalData() {
  const [nombre] = useState("");
  const [apellidos] = useState("");
  const [nacionalidad] = useState("");
  const [tipo_documento] = useState("");
  const [numero_documento] = useState("");
  const [telefono] = useState("");
  const [rememberMe] = useState(false);
  const [, setIsLoading] = useState(false);

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
  void _handleSubmit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 via-background to-accent/20 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl"></div>
    </div>
  );
}
