"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useToastContext } from "./ToastProvider";
import { Brand } from "./Brand";
import { getApiEndpoint } from "../config/api";
import { cn } from "../lib/utils";

export interface ReservationData {
  id_encab_fact: number;
  restaurant: { nombre_restaurante?: string };
  mesa: { id_mesa?: number; precio?: number };
  guests: number;
  fecha: string;
  horario: string;
}

interface CheckoutPageProps {
  reservationData: ReservationData;
}

interface ValidationErrors {
  cardNumber?: string;
  cvc?: string;
  expiry?: string;
  cardHolder?: string;
}

export default function CheckoutPage({ reservationData }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { toast } = useToastContext();

  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  /** Dígitos MMYY; la vista se formatea como MM/YY */
  const [expiry, setExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingBank, setWaitingBank] = useState(false);
  const [emailCliente, setEmailCliente] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const WOMPI_MIN_AMOUNT_COP = 1500;

  const precio = reservationData.mesa?.precio ?? 0;
  const nombreRestaurante = reservationData.restaurant?.nombre_restaurante ?? "Restaurante";

  const formatDateNoTimezoneShift = (dateValue: string): string => {
    const raw = (dateValue || "").trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return raw;

    const [, year, month, day] = match;
    const safeDate = new Date(Number(year), Number(month) - 1, Number(day));
    return safeDate.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fechaFormateada = useMemo(() => {
    if (!reservationData.fecha) return "—";
    return formatDateNoTimezoneShift(reservationData.fecha) || reservationData.fecha;
  }, [reservationData.fecha]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        setEmailCliente(tokenPayload.sub ?? "");
      } catch {
        /* ignore */
      }
    }
  }, []);

  const validateCard = () => {
    const newErrors: ValidationErrors = {};
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "16 dígitos";
    }
    if (!cvc || cvc.length !== 3) {
      newErrors.cvc = "3 dígitos";
    }
    const expDigits = expiry.replace(/\D/g, "");
    if (expDigits.length !== 4) {
      newErrors.expiry = "MM/YY completo";
    } else {
      const mm = Number.parseInt(expDigits.slice(0, 2), 10);
      const yy = Number.parseInt(expDigits.slice(2, 4), 10);
      if (mm < 1 || mm > 12) {
        newErrors.expiry = "Mes 01–12";
      } else {
        const fullYear = 2000 + yy;
        const now = new Date();
        const curY = now.getFullYear();
        const curM = now.getMonth() + 1;
        if (fullYear < curY || (fullYear === curY && mm < curM)) {
          newErrors.expiry = "Tarjeta vencida";
        }
      }
    }
    if (!cardHolder || cardHolder.trim().length < 3) {
      newErrors.cardHolder = "Nombre como en la tarjeta";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatExpiryMMYY = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = (v.match(/\d{4,16}/g) && v.match(/\d{4,16}/g)![0]) || "";
    const parts: string[] = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setTouched((t) => ({ ...t, cardNumber: true }));
  };

  const consultarEstadoTransaccion = async (transactionId: string): Promise<string | null> => {
    try {
      const response = await fetch(getApiEndpoint(`/wompi/transaccion/${transactionId}`), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const result = await response.json();
      return result.data?.status ?? null;
    } catch {
      return null;
    }
  };

  const pollTransactionStatus = (transactionId: string): void => {
    setWaitingBank(true);
    const maxAttempts = 60;
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      attempts++;
      const status = await consultarEstadoTransaccion(transactionId);

      if (status === "APPROVED") {
        clearInterval(pollInterval);
        setLoading(false);
        setWaitingBank(false);
        sessionStorage.removeItem("pendingReservation");
        sessionStorage.setItem("openProfileReservasAfterPayment", "1");
        toast({
          title: "Pago confirmado",
          description: "Tu reserva quedó registrada. Te enviaremos los detalles por correo.",
          variant: "success",
        });
        window.location.href = "/";
      } else if (status === "DECLINED") {
        clearInterval(pollInterval);
        setLoading(false);
        setWaitingBank(false);
        toast({
          title: "Pago rechazado",
          description: "Prueba con otra tarjeta.",
          variant: "destructive",
        });
      } else if (status === "VOIDED" || status === "ERROR") {
        clearInterval(pollInterval);
        setLoading(false);
        setWaitingBank(false);
        toast({
          title: "No se pudo completar el pago",
          description: "Intenta de nuevo en unos minutos.",
          variant: "destructive",
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setLoading(false);
        setWaitingBank(false);
        toast({
          title: "Tiempo de espera agotado",
          description: "Revisa más tarde el estado de tu pago en tu banco o contacto.",
          variant: "warning",
        });
      }
    }, 5000);
  };

  const handlePayment = async () => {
    if (!emailCliente) {
      toast({
        title: "Sesión incompleta",
        description: "No encontramos tu correo. Vuelve a iniciar sesión.",
        variant: "warning",
      });
      return;
    }

    if (!validateCard()) {
      toast({
        title: "Revisa los datos de la tarjeta",
        description: "Corrige los campos antes de continuar.",
        variant: "warning",
      });
      return;
    }

    if (precio < WOMPI_MIN_AMOUNT_COP) {
      toast({
        title: "Monto no permitido",
        description: `El pago mínimo permitido por Wompi es $${WOMPI_MIN_AMOUNT_COP.toLocaleString("es-CO")} COP.`,
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const paymentReference = `RES-${reservationData.id_encab_fact}-${Date.now()}-${Math.floor(
        Math.random() * 10000,
      )
        .toString()
        .padStart(4, "0")}`;

      const expDigits = expiry.replace(/\D/g, "");
      const expMonthPadded = expDigits.slice(0, 2);
      const expYearShort = expDigits.slice(2, 4);
      const paymentMethod = {
        type: "CARD",
        card_number: cardNumber.replace(/\s/g, ""),
        cvc,
        exp_month: expMonthPadded,
        exp_year: expYearShort,
        card_holder: cardHolder,
        installments: 1,
      };

      const response = await fetch(getApiEndpoint("/wompi/crear_pago"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: reservationData.mesa.precio,
          referencia: paymentReference,
          correo_cliente: emailCliente,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al iniciar el pago");
      }

      const result = await response.json();

      if (result.data?.payment_method?.extra?.async_payment_url) {
        window.location.href = result.data.payment_method.extra.async_payment_url;
        return;
      }

      if (result.reserva_confirmada === true) {
        sessionStorage.removeItem("pendingReservation");
        sessionStorage.setItem("openProfileReservasAfterPayment", "1");
        toast({
          title: "Pago confirmado",
          description: "Tu reserva está lista.",
          variant: "success",
        });
        window.location.href = "/";
        return;
      }

      const httpStatus = result.http_status_code;
      const tieneData = result.data && result.data !== null;
      const transactionStatus = result.data?.status;
      const transactionId = result.transaction_id || result.data?.id;

      if ((httpStatus === 200 || httpStatus === 201) && tieneData) {
        if (transactionStatus === "APPROVED") {
          sessionStorage.removeItem("pendingReservation");
          sessionStorage.setItem("openProfileReservasAfterPayment", "1");
          toast({
            title: "Pago confirmado",
            description: "Tu reserva está lista.",
            variant: "success",
          });
          window.location.href = "/";
          return;
        }

        if (transactionStatus === "DECLINED") {
          setLoading(false);
          toast({
            title: "Pago rechazado",
            description: "El banco no autorizó la transacción.",
            variant: "destructive",
          });
          return;
        }

        if (transactionStatus === "ERROR") {
          setLoading(false);
          toast({
            title: "Error en el pago",
            description: "Intenta de nuevo.",
            variant: "destructive",
          });
          return;
        }

        if (transactionStatus === "PENDING" && transactionId) {
          pollTransactionStatus(transactionId);
          return;
        }

        if (transactionId) {
          sessionStorage.removeItem("pendingReservation");
          sessionStorage.setItem("openProfileReservasAfterPayment", "1");
          toast({
            title: "Procesando pago",
            description: "Te llevamos a tus reservas para que puedas verificar el estado.",
            variant: "default",
          });
          window.location.href = "/";
          return;
        }
      }

      if (transactionStatus === "PENDING") {
        sessionStorage.removeItem("pendingReservation");
        sessionStorage.setItem("openProfileReservasAfterPayment", "1");
        setLoading(false);
        toast({
          title: "Pago en proceso",
          description: "Revisa el estado en tu perfil, pestaña Reservas.",
          variant: "default",
        });
        window.location.href = "/";
        return;
      }

      setLoading(false);
      toast({
        title: "Estado del pago",
        description: String(transactionStatus ?? "PENDIENTE"),
        variant: "default",
      });
    } catch (err) {
      setLoading(false);
      setWaitingBank(false);
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "No se pudo procesar", description: msg, variant: "destructive" });
    }
  };

  const cardReady =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cvc.length === 3 &&
    expiry.replace(/\D/g, "").length === 4 &&
    cardHolder.trim().length >= 3;

  const canSubmit = Boolean(emailCliente) && !loading && !waitingBank && cardReady;
  const canPayAmount = precio >= WOMPI_MIN_AMOUNT_COP;

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else window.location.href = "/";
  };

  const inputError = (field: keyof ValidationErrors) =>
    touched[field] && errors[field] ? "border-destructive focus-visible:ring-destructive/30" : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="flex items-center gap-2">
            <Brand variant="full" className="h-7 w-auto object-contain" alt="Reservify" />
            <span className="hidden text-sm font-semibold sm:inline">Pago con tarjeta</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Wompi
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <div className="mb-6 lg:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Checkout</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Paga tu reserva</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Solo aceptamos tarjeta débito o crédito. El cobro lo procesa Wompi de forma segura.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* Columna izquierda: resumen + formulario */}
          <div className="space-y-6 lg:col-span-7">
            {/* Resumen en una fila densa */}
            <section
              aria-label="Resumen de la reserva"
              className="grid gap-3 sm:grid-cols-3 sm:gap-4"
            >
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:col-span-1">
                <div className="flex items-start gap-2.5">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Restaurante
                    </p>
                    <p className="truncate text-sm font-semibold">{nombreRestaurante}</p>
                    <p className="text-xs text-muted-foreground">Factura #{reservationData.id_encab_fact}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Fecha y hora
                    </p>
                    <p className="text-sm font-medium leading-snug">{fechaFormateada}</p>
                    <p className="text-sm text-muted-foreground">{reservationData.horario}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Mesa
                    </p>
                    <p className="text-sm font-medium">#{reservationData.mesa?.id_mesa ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">{reservationData.guests} personas</p>
                  </div>
                </div>
              </div>
            </section>

            <Card className="border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/60 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-semibold">Datos de la tarjeta</p>
                    <p className="text-xs text-muted-foreground">
                      Los datos viajan cifrados; no guardamos tu número completo.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-4 sm:p-6">
                <div className="space-y-2">
                  <Label htmlFor="cc-num">Número de tarjeta</Label>
                  <Input
                    id="cc-num"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onBlur={() => setTouched((t) => ({ ...t, cardNumber: true }))}
                    maxLength={19}
                    className={cn("h-12 font-mono text-base tracking-wide sm:max-w-xl", inputError("cardNumber"))}
                  />
                  {errors.cardNumber && touched.cardNumber && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cc-name">Titular</Label>
                  <Input
                    id="cc-name"
                    autoComplete="cc-name"
                    placeholder="NOMBRE COMO EN LA TARJETA"
                    value={cardHolder}
                    onChange={(e) => {
                      setCardHolder(e.target.value.toUpperCase());
                      setTouched((t) => ({ ...t, cardHolder: true }));
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, cardHolder: true }))}
                    className={cn("h-12 uppercase sm:max-w-xl", inputError("cardHolder"))}
                  />
                  {errors.cardHolder && touched.cardHolder && (
                    <p className="text-xs text-destructive">{errors.cardHolder}</p>
                  )}
                </div>

                <div className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="cc-exp">Vencimiento</Label>
                    <Input
                      id="cc-exp"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        setExpiry(formatExpiryMMYY(e.target.value));
                        setTouched((t) => ({ ...t, expiry: true }));
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
                      maxLength={5}
                      className={cn("h-12 font-mono text-center tracking-widest sm:text-left", inputError("expiry"))}
                    />
                    {errors.expiry && touched.expiry && (
                      <p className="text-xs text-destructive">{errors.expiry}</p>
                    )}
                  </div>
                  <div className="w-full space-y-2 sm:w-32 sm:shrink-0">
                    <Label htmlFor="cc-cvc">CVC</Label>
                    <Input
                      id="cc-cvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => {
                        setCvc(e.target.value.slice(0, 3));
                        setTouched((t) => ({ ...t, cvc: true }));
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, cvc: true }))}
                      maxLength={3}
                      className={cn("h-12 text-center font-mono", inputError("cvc"))}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground sm:text-sm">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  No compartas tu CVC por WhatsApp ni teléfono. Reservify nunca te pedirá la clave por correo.
                </div>
              </CardContent>
            </Card>

            <div className="lg:hidden">
              <Button
                type="button"
                size="lg"
                className="h-12 w-full rounded-xl text-base font-semibold"
                disabled={!canSubmit || !canPayAmount}
                onClick={handlePayment}
              >
                {loading || waitingBank ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {waitingBank ? "Esperando confirmación…" : "Procesando…"}
                  </>
                ) : (
                  <>Pagar ${precio.toLocaleString("es-CO")} COP</>
                )}
              </Button>
            </div>
          </div>

          {/* Columna derecha: total fijo */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <Card className="overflow-hidden border-border/80 shadow-md">
                <div className="bg-linear-to-br from-foreground to-foreground/95 px-6 py-8 text-background">
                  <p className="text-xs font-medium uppercase tracking-wider opacity-90">Total a pagar</p>
                  <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                    ${precio.toLocaleString("es-CO")}
                  </p>
                  <p className="mt-2 text-xs opacity-85">COP · Reserva de mesa</p>
                </div>
                <CardContent className="space-y-5 p-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Correo de la cuenta</p>
                    <p className="mt-1 break-all text-sm font-medium">
                      {emailCliente || <span className="text-destructive">No disponible — inicia sesión</span>}
                    </p>
                  </div>
                  <Separator />
                  <Button
                    type="button"
                    size="lg"
                    className="hidden h-12 w-full rounded-xl text-base font-semibold lg:inline-flex"
                    disabled={!canSubmit || !canPayAmount}
                    onClick={handlePayment}
                  >
                    {loading || waitingBank ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {waitingBank ? "Confirmando…" : "Procesando…"}
                      </>
                    ) : (
                      "Confirmar pago"
                    )}
                  </Button>
                  <p className="hidden text-center text-[11px] leading-relaxed text-muted-foreground lg:block">
                    Al pagar aceptas los términos del procesador Wompi. Cargo único por esta reserva.
                  </p>
                  {!canPayAmount && (
                    <p className="text-center text-xs text-amber-600 dark:text-amber-500">
                      Monto mínimo para pagar con Wompi: ${WOMPI_MIN_AMOUNT_COP.toLocaleString("es-CO")} COP.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      {(loading || waitingBank) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          role="alertdialog"
          aria-busy="true"
          aria-label="Procesando pago"
        >
          <div className="mx-4 max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-semibold text-foreground">
              {waitingBank ? "Esperando respuesta del banco" : "Procesando tu pago"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              No cierres esta ventana. Puede tardar unos segundos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
