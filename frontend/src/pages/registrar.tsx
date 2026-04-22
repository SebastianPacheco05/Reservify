"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Award as IdCard,
  Phone,
  User,
  Flag,
  ArrowLeft,
} from "lucide-react";
import { transitionNormal } from "../lib/animations";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AuthPageShell } from "../components/AuthPageShell";
import { useToastContext } from "../components/ToastProvider";
import { getApiEndpoint } from "../config/api";
import { ROUTES } from "../routes/paths";

export default function Registrar() {
  const { toast } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tipo_documento, setTipo_documento] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const sanitizeApiErrorDetail = (detail: string) => {
    const lower = detail.toLowerCase();

    // Evitar exponer trazas internas (psycopg2/PLpgSQL) en el frontend.
    if (
      lower.includes("psycopg2") ||
      lower.includes("context:") ||
      lower.includes("fn_register_") ||
      lower.includes("raise exception") ||
      lower.includes("error de base de datos al registrar usuario")
    ) {
      return "No pudimos completar tu registro. Inténtalo de nuevo más tarde.";
    }

    if (lower.includes("ya existe") && lower.includes("registro con esos datos")) {
      return "Ya existe un usuario con esos datos. Revisa tus datos e intenta nuevamente o inicia sesión.";
    }

    if (lower.includes("faltan datos obligatorios")) {
      return "Faltan datos obligatorios. Verifica el formulario e inténtalo de nuevo.";
    }

    if (lower.includes("formato de datos inválido") || lower.includes("datos inválidos")) {
      return "Datos inválidos. Verifica la información e inténtalo de nuevo.";
    }

    // Si llega un mensaje demasiado largo, reemplazarlo por uno genérico.
    if (detail.length > 180) {
      return "No pudimos completar tu registro. Inténtalo de nuevo más tarde.";
    }

    return detail;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const data2send = {
      email,
      password,
      tipo_documento,
      documento,
      telefono,
      nombre,
      apellido,
      nacionalidad,
      id_rol: 2,
    };

    try {
      const res = await fetch(getApiEndpoint("/register/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data2send),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data.detail === "string"
            ? sanitizeApiErrorDetail(data.detail)
            : Array.isArray(data.detail)
              ? data.detail
                .map((x: { msg?: string }) => {
                  const m = x?.msg ?? "";
                  return m ? sanitizeApiErrorDetail(m) : "";
                })
                .filter(Boolean)
                .join(" ") || "Error en el registro"
              : "Error en el registro";
        throw new Error(msg);
      }

      toast({
        title: "Registro exitoso",
        description: data.message ?? "Tu cuenta ha sido creada correctamente",
        variant: "success",
      });

      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos completar tu registro. Inténtalo de nuevo más tarde.";

      console.error("Error en el registro:", err);
      toast({
        title: "Error en el registro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa un correo electrónico.",
        variant: "warning",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      toast({
        title: "Correo inválido",
        description: "Por favor, ingresa un correo electrónico válido (ej: usuario@dominio.com).",
        variant: "destructive",
      });
      return;
    }

    if (password === "" || confirmPassword === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa y confirma tu contraseña.",
        variant: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
  };

  const handleBackToStepOne = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      emailInputRef.current?.focus();
      return;
    }
    const input = document.getElementById("numero_documento") as HTMLInputElement | null;
    input?.focus();
  }, [currentStep]);

  const stepCircle = (step: 1 | 2) => {
    const active = currentStep === step;
    const done = currentStep > step;
    return (
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : done
              ? "border-foreground/30 bg-foreground text-background"
              : "border-border bg-muted/40 text-muted-foreground",
        ].join(" ")}
      >
        {step}
      </div>
    );
  };

  return (
    <AuthPageShell>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[linear-gradient(165deg,rgba(255,45,85,0.06)_0%,transparent_42%),linear-gradient(180deg,transparent_0%,rgba(255,106,0,0.04)_100%)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row lg:items-start lg:gap-12 lg:py-14">
          <aside className="lg:w-[260px] lg:shrink-0 lg:sticky lg:top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary">Alta</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground">
              Crea tu perfil en Reservify
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dos pasos: primero tu acceso, luego quién eres. Así mantenemos las reservas seguras y
              personalizadas.
            </p>

            <div className="mt-10 flex items-center gap-4">
              {stepCircle(1)}
              <div
                className={`h-0.5 flex-1 max-w-[72px] rounded-full transition-colors ${currentStep === 2 ? "bg-primary" : "bg-border"}`}
                aria-hidden
              />
              {stepCircle(2)}
            </div>
            <div className="mt-3 flex justify-between gap-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground max-w-[200px]">
              <span className={currentStep === 1 ? "text-foreground" : ""}>Cuenta</span>
              <span className={currentStep === 2 ? "text-foreground" : ""}>Identidad</span>
            </div>
          </aside>

          <div className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-card/90 p-6 shadow-[0_1px_0_rgba(45,49,66,0.06)] sm:p-9">
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="credenciales"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transitionNormal}
                >
                  <h2 className="text-lg font-semibold text-foreground">Credenciales</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Usa un correo válido y una contraseña que solo tú conozcas.
                  </p>

                  <form className="mt-8 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          ref={emailInputRef}
                          id="email"
                          type="email"
                          placeholder="tu@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pl-10 pr-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Repite la contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-11 pl-10 pr-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="mt-2 w-full h-11 gap-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="datos-personales"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transitionNormal}
                >
                  <h2 className="text-lg font-semibold text-foreground">Datos personales</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estos datos nos ayudan a confirmar tu identidad en las reservas.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tipo_documento">Tipo de documento</Label>
                      <Select value={tipo_documento} onValueChange={setTipo_documento} required>
                        <SelectTrigger
                          id="tipo_documento"
                          className="h-11 w-full border-input bg-background text-foreground"
                        >
                          <SelectValue placeholder="Selecciona el tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                          <SelectItem value="PP">Pasaporte</SelectItem>
                          <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numero_documento">Número de documento</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="numero_documento"
                          type="text"
                          placeholder="Sin puntos ni espacios"
                          value={documento}
                          onChange={(e) => setDocumento(e.target.value)}
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="+57…"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="nombre"
                          type="text"
                          placeholder="Tu nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellido</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="apellidos"
                          type="text"
                          placeholder="Tu apellido"
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nacionalidad">Nacionalidad</Label>
                      <div className="relative">
                        <Flag className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <select
                          id="nacionalidad"
                          value={nacionalidad}
                          onChange={(e) => setNacionalidad(e.target.value)}
                          className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        >
                          <option value="">Selecciona tu nacionalidad</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Belice">Belice</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Brasil">Brasil</option>
                          <option value="Canadá">Canadá</option>
                          <option value="Chile">Chile</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Costa Rica">Costa Rica</option>
                          <option value="Cuba">Cuba</option>
                          <option value="Dominica">Dominica</option>
                          <option value="Ecuador">Ecuador</option>
                          <option value="El Salvador">El Salvador</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="Guatemala">Guatemala</option>
                          <option value="Guyana">Guyana</option>
                          <option value="Haití">Haití</option>
                          <option value="Honduras">Honduras</option>
                          <option value="Jamaica">Jamaica</option>
                          <option value="México">México</option>
                          <option value="Nicaragua">Nicaragua</option>
                          <option value="Panamá">Panamá</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Perú">Perú</option>
                          <option value="República Dominicana">República Dominicana</option>
                          <option value="Surinam">Surinam</option>
                          <option value="Trinidad y Tobago">Trinidad y Tobago</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Venezuela">Venezuela</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackToStepOne}
                        className="gap-2 text-foreground hover:bg-muted"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 min-w-[200px] gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:ml-auto"
                      >
                        {isLoading ? (
                          <>
                            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            Creando cuenta…
                          </>
                        ) : (
                          <>
                            Finalizar registro
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 border-t border-border/60 pt-6 text-center text-[11px] text-muted-foreground">
              <p>Al registrarte, aceptas nuestros</p>
              <p className="mt-1">
                <Link to={ROUTES.TERMINOS} className="underline underline-offset-2 hover:text-foreground">
                  Términos de servicio
                </Link>
                <span className="mx-2 opacity-50">·</span>
                <Link to={ROUTES.PRIVACIDAD} className="underline underline-offset-2 hover:text-foreground">
                  Política de privacidad
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/Login"
                className="font-semibold text-foreground underline underline-offset-4 decoration-primary/50 hover:decoration-primary"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}
