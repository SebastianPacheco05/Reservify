"use client";
import { Link } from "react-router-dom";
import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AuthPageShell } from "../components/AuthPageShell";
import { useToastContext } from "../components/ToastProvider";
import { startProactiveRefresh } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { ROUTES } from "../routes/paths";
import { AnimatedOTPInput } from "../components/smoothui/animated-o-t-p-input";

type RecoveryStep = "email" | "code" | "reset";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToastContext();

  const [mainView, setMainView] = useState<"login" | "recovery">("login");
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [recoverLoading, setRecoverLoading] = useState(false);

  const canSubmitEmail = useMemo(() => forgotEmail.trim().length > 3, [forgotEmail]);
  const canSubmitCode = useMemo(() => /^[A-Z0-9]{8}$/.test(code), [code]);
  const canSubmitReset = useMemo(
    () =>
      Boolean(resetToken) &&
      newPassword.length >= 8 &&
      confirmNewPassword.length >= 8 &&
      newPassword === confirmNewPassword,
    [resetToken, newPassword, confirmNewPassword]
  );

  const resetRecoveryState = () => {
    setRecoveryStep("email");
    setForgotEmail("");
    setCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setRecoverLoading(false);
  };

  const goToLogin = () => {
    setMainView("login");
    resetRecoveryState();
  };

  const openRecovery = () => {
    setCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotEmail(email.trim());
    setMainView("recovery");
    setRecoveryStep("email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/credenciales/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Error en el login");

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type ?? "bearer");
      localStorage.setItem("tipo_usuario", data.tipo_usuario);
      localStorage.setItem("email", email);
      if (data.documento != null) localStorage.setItem("documento", String(data.documento));

      startProactiveRefresh();

      if (data.redirect_to) {
        navigate(data.redirect_to);
      } else {
        navigate("/");
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a Reservify",
        variant: "default",
      });
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      toast({
        title: "No pudimos iniciar tu sesión",
        description: "Verifica tu correo y contraseña o inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitEmail) return;
    setRecoverLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "No se pudo enviar el código");

      setRecoveryStep("code");
      toast({
        title: "Revisa tu correo",
        description: "Te enviamos un código para recuperar tu contraseña.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "No pudimos enviar el código",
        description: "Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setRecoverLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitCode) return;
    setRecoverLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "Código incorrecto");

      setResetToken(String(data.reset_token || ""));
      setRecoveryStep("reset");
      toast({
        title: "Código verificado",
        description: "Ahora crea tu nueva contraseña.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Código inválido",
        description: "Verifica que esté escrito exactamente como en el correo (XXXX-XXXX).",
        variant: "destructive",
      });
    } finally {
      setRecoverLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitReset) return;
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Revisa y vuelve a intentarlo.",
        variant: "destructive",
      });
      return;
    }
    setRecoverLoading(true);
    try {
      const res = await fetch(getApiEndpoint("/password-reset/reset"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: resetToken,
          password: newPassword,
          confirm_password: confirmNewPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail ?? "No se pudo cambiar la contraseña");

      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes iniciar sesión con tu nueva contraseña.",
        variant: "success",
      });
      setEmail(forgotEmail);
      setPassword("");
      goToLogin();
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "No pudimos cambiar tu contraseña",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setRecoverLoading(false);
    }
  };

  const inputClass =
    "h-12 rounded-xl border border-input bg-muted/40 px-4 pr-11 text-base shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";
  const inputClassNoRightPad = inputClass.replace(" pr-11", "");

  return (
    <AuthPageShell>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
        <aside
          className="relative shrink-0 lg:w-[44%] lg:min-h-[calc(100vh-3.5rem)] border-b border-border bg-muted/70 px-6 py-10 text-foreground sm:px-10 lg:border-b-0 lg:border-r lg:py-20 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col justify-between overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] text-foreground dark:opacity-[0.08] dark:text-white"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -18deg,
                transparent,
                transparent 48px,
                currentColor 48px,
                currentColor 49px
              )`,
            }}
          />
          <div className="relative z-10 max-w-md">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-primary mb-5">
              {mainView === "login" ? "Acceso" : "Recuperación"}
            </p>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-tight">
              {mainView === "login" ? "Tu mesa te espera." : "Recupera tu acceso."}
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground max-w-sm dark:text-zinc-400">
              {mainView === "login"
                ? "Entra para reservar, revisar tus visitas y volver a los sitios que más te gustan."
                : "Te enviaremos un código a tu correo para crear una contraseña nueva con calma."}
            </p>
          </div>
          <p className="relative z-10 text-[11px] tracking-wide text-muted-foreground mt-10 lg:mt-0 dark:text-zinc-500">
            Reservify — reservas claras, sin vueltas.
          </p>
        </aside>

        <section className="flex-1 flex flex-col justify-center px-5 sm:px-12 py-12 lg:py-16 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,106,0,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,106,0,0.12),transparent)]">
          <div className="w-full max-w-md mx-auto">
            {mainView === "login" ? (
              <>
                <header className="mb-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Iniciar sesión
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Entra con tu correo
                  </h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Correo
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClassNoRightPad}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Contraseña
                      </Label>
                      <button
                        type="button"
                        onClick={openRecovery}
                        className="text-xs font-medium text-primary hover:underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-[0.15em] bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Entrando…
                      </span>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </form>

                <p className="mt-10 text-sm text-muted-foreground">
                  ¿Aún no tienes cuenta?{" "}
                  <Link
                    to="/Registrar"
                    className="font-semibold text-foreground underline underline-offset-4 decoration-primary/50 hover:decoration-primary"
                  >
                    Crear una cuenta
                  </Link>
                </p>

                <div className="mt-14 pt-8 border-t border-border/80 text-center text-[11px] text-muted-foreground leading-relaxed">
                  <p>Al continuar, aceptas nuestros</p>
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
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-6 -ml-2 gap-2 text-foreground hover:!bg-muted/90 hover:!text-foreground [&_svg]:text-foreground hover:[&_svg]:!text-foreground dark:hover:!bg-zinc-800 dark:hover:!text-zinc-50 dark:hover:[&_svg]:!text-zinc-50"
                  onClick={goToLogin}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio de sesión
                </Button>

                <header className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Recuperar contraseña
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {recoveryStep === "email" && "Te enviamos un código"}
                    {recoveryStep === "code" && "Verifica el código"}
                    {recoveryStep === "reset" && "Nueva contraseña"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {recoveryStep === "email" && "Ingresa el correo con el que te registraste."}
                    {recoveryStep === "code" &&
                      "8 caracteres alfanuméricos, igual que en el correo (con o sin guión)."}
                    {recoveryStep === "reset" && "Mínimo 8 caracteres; confirma antes de guardar."}
                  </p>
                </header>

                {recoveryStep === "email" && (
                  <form onSubmit={handleRequestCode} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Correo electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="tu@ejemplo.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className={`${inputClassNoRightPad} pl-10`}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={recoverLoading || !canSubmitEmail}
                      className="w-full h-12 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {recoverLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          Enviar código
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {recoveryStep === "code" && (
                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div className="space-y-3">
                      <Label id="recovery-code-label">Código de verificación</Label>
                      <div className="flex justify-center py-1">
                        <AnimatedOTPInput
                          maxLength={8}
                          value={code}
                          onChange={setCode}
                          aria-labelledby="recovery-code-label"
                          containerClassName="justify-center gap-1 sm:gap-2"
                          className="gap-1 sm:gap-2"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={recoverLoading || !canSubmitCode}
                      className="w-full h-12 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {recoverLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Verificando…
                        </>
                      ) : (
                        <>
                          Verificar
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 rounded-xl"
                      onClick={() => {
                        setCode("");
                        setRecoveryStep("email");
                      }}
                      disabled={recoverLoading}
                    >
                      Cambiar correo
                    </Button>
                  </form>
                )}

                {recoveryStep === "reset" && (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="new-pw">Nueva contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                          id="new-pw"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`${inputClass} pl-10`}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted"
                          aria-label={showNewPassword ? "Ocultar" : "Mostrar"}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-pw">Confirmar contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                          id="confirm-new-pw"
                          type={showNewPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className={`${inputClass} pl-10`}
                          required
                          minLength={8}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={recoverLoading || !canSubmitReset}
                      className="w-full h-12 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {recoverLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Guardando…
                        </>
                      ) : (
                        <>
                          Cambiar contraseña
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                <div className="mt-12 pt-8 border-t border-border/80 text-center text-[11px] text-muted-foreground">
                  <p>Al recuperar tu acceso, aceptas nuestros</p>
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
              </>
            )}
          </div>
        </section>
      </div>
    </AuthPageShell>
  );
}
