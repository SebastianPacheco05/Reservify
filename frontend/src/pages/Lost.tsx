"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, KeyRound, Lock, Mail } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToastContext } from "../components/ToastProvider";
import { getApiEndpoint } from "../config/api";
import { transitionNormal } from "../lib/animations";

type Step = "email" | "code" | "reset";

function formatCode(raw: string) {
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
  const left = cleaned.slice(0, 4);
  const right = cleaned.slice(4, 8);
  return right.length > 0 ? `${left}-${right}` : left;
}

export default function Lost() {
  const navigate = useNavigate();
  const { toast } = useToastContext();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmitEmail = useMemo(() => email.trim().length > 3, [email]);
  const canSubmitCode = useMemo(() => /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code), [code]);
  const canSubmitReset = useMemo(
    () => resetToken && password.length >= 8 && confirmPassword.length >= 8,
    [resetToken, password, confirmPassword]
  );

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitEmail) return;
    setIsLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "No se pudo enviar el código");

      setStep("code");
      toast({
        title: "Revisa tu correo",
        description: "Te enviamos un código para recuperar tu contraseña.",
        variant: "success",
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: "No pudimos enviar el código",
        description: "Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitCode) return;
    setIsLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "Código incorrecto");

      setResetToken(String(data.reset_token || ""));
      setStep("reset");
      toast({
        title: "Código verificado",
        description: "Ahora crea tu nueva contraseña.",
        variant: "success",
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: "Código inválido",
        description: "Verifica que esté escrito exactamente como en el correo (XXXX-XXXX).",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitReset) return;
    setIsLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/reset"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: resetToken,
          password,
          confirm_password: confirmPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "No se pudo cambiar la contraseña");

      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes iniciar sesión con tu nueva contraseña.",
        variant: "success",
      });
      navigate("/Login");
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: "No pudimos cambiar tu contraseña",
        description: String(err?.message || "Inténtalo de nuevo."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted text-primary transition-all duration-200 bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </motion.div>

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
              <KeyRound className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground transition-colors duration-300">
              Recuperar contraseña
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === "email" && "Ingresa tu correo para enviarte un código"}
              {step === "code" && "Escribe el código exactamente como te llegó"}
              {step === "reset" && "Crea tu nueva contraseña"}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
            <Card className="shadow-xl bg-card/90 backdrop-blur-md rounded-2xl border border-border">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-xl text-center text-foreground transition-colors duration-300">
                  {step === "email" && "Enviar código"}
                  {step === "code" && "Verificar código"}
                  {step === "reset" && "Nueva contraseña"}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground transition-colors duration-300">
                  {step === "email" && "Te enviaremos un código de 8 caracteres (XXXX-XXXX)."}
                  {step === "code" && "Formato requerido: XXXX-XXXX"}
                  {step === "reset" && "Mínimo 8 caracteres."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === "email" && (
                  <form onSubmit={handleRequestCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground transition-colors duration-300">
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

                    <Button type="submit" className="w-full h-11 bg-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg" disabled={isLoading || !canSubmitEmail}>
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Enviar código</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                )}

                {step === "code" && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium text-foreground transition-colors duration-300">
                        Código
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-300" />
                        <Input
                          id="code"
                          inputMode="text"
                          autoComplete="one-time-code"
                          placeholder="XXXX-XXXX"
                          value={code}
                          onChange={(e) => setCode(formatCode(e.target.value))}
                          className="pl-10 h-11 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-colors duration-300 tracking-widest text-center"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg" disabled={isLoading || !canSubmitCode}>
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verificando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Verificar</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCode("");
                        setStep("email");
                      }}
                      disabled={isLoading}
                    >
                      Cambiar correo
                    </Button>
                  </form>
                )}

                {step === "reset" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground transition-colors duration-300">
                        Escribe tu nueva contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-300" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-colors duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground transition-colors duration-300">
                        Confirma tu nueva contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-300" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 h-11 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-colors duration-300"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg" disabled={isLoading || !canSubmitReset}>
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Guardando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Cambiar contraseña</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

