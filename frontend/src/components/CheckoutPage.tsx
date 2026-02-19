"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, Check, AlertCircle, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getApiEndpoint } from "../config/api"

interface ReservationData {
  id_encab_fact: number
  restaurant: any
  mesa: any
  guests: number
  fecha: string
  horario: string
}

interface CheckoutPageProps {
  reservationData: ReservationData
}

type PaymentType = "CARD" | "BANCOLOMBIA_TRANSFER"

interface ValidationErrors {
  cardNumber?: string
  cvc?: string
  expMonth?: string
  expYear?: string
  cardHolder?: string
}

export default function CheckoutPage({ reservationData }: CheckoutPageProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cvc, setCvc] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentType, setPaymentType] = useState<PaymentType>("CARD")
  const [emailCliente, setEmailCliente] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]))
        setEmailCliente(tokenPayload.sub)
      } catch (error) {
        console.error("Error al extraer email del token:", error)
      }
    }
  }, [])

  const validateCard = () => {
    const newErrors: ValidationErrors = {}

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "El número debe tener 16 dígitos"
    }
    if (!cvc || cvc.length !== 3) {
      newErrors.cvc = "CVC debe tener 3 dígitos"
    }
    if (!expMonth || Number.parseInt(expMonth) < 1 || Number.parseInt(expMonth) > 12) {
      newErrors.expMonth = "Mes inválido (01-12)"
    }
    if (!expYear || expYear.length !== 4 || Number.parseInt(expYear) < new Date().getFullYear()) {
      newErrors.expYear = "Año expirado o inválido"
    }
    if (!cardHolder || cardHolder.trim().length < 3) {
      newErrors.cardHolder = "Nombre debe tener al menos 3 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
    setTouched({ ...touched, cardNumber: true })
  }

  const consultarEstadoTransaccion = async (transactionId: string): Promise<string | null> => {
    try {
      const response = await fetch(getApiEndpoint(`/wompi/transaccion/${transactionId}`), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        return null
      }

      const result = await response.json()
      return result.data?.status || null
    } catch (error) {
      console.error("Error al consultar estado:", error)
      return null
    }
  }

  const pollTransactionStatus = async (transactionId: string): Promise<void> => {
    const maxAttempts = 60 // 5 minutos con intervalos de 5 segundos
    let attempts = 0

    const pollInterval = setInterval(async () => {
      attempts++
      const status = await consultarEstadoTransaccion(transactionId)

      if (status === "APPROVED") {
        clearInterval(pollInterval)
        alert("¡Pago exitoso! Tu reserva ha sido confirmada")
        sessionStorage.removeItem("pendingReservation")
        window.location.href = "/"
      } else if (status === "DECLINED") {
        clearInterval(pollInterval)
        setLoading(false)
        alert("El pago fue rechazado. Por favor intenta con otra tarjeta")
      } else if (status === "VOIDED" || status === "ERROR") {
        clearInterval(pollInterval)
        setLoading(false)
        alert("Error al procesar el pago. Por favor intenta de nuevo")
      } else if (attempts >= maxAttempts) {
        clearInterval(pollInterval)
        setLoading(false)
        alert("Tiempo de espera agotado. Por favor verifica el estado de tu pago más tarde")
      }
      // Si es PENDING, continuar polling
    }, 5000) // Consultar cada 5 segundos
  }

  const handlePayment = async () => {
    if (!emailCliente) {
      alert("No se pudo obtener el email del cliente")
      return
    }

    if (paymentType === "CARD" && !validateCard()) {
      return
    }

    setLoading(true)
    try {
      let paymentMethod: any
      if (paymentType === "CARD") {
        paymentMethod = {
          type: "CARD",
          card_number: cardNumber.replace(/\s/g, ""),
          cvc,
          exp_month: expMonth,
          exp_year: expYear,
          card_holder: cardHolder,
          installments: 1,
        }
      } else {
        paymentMethod = {
          type: "BANCOLOMBIA_TRANSFER",
          payment_description: `Pago reserva ${reservationData.id_encab_fact}`,
        }
      }

      const response = await fetch(getApiEndpoint("/wompi/crear_pago"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: reservationData.mesa.precio,
          referencia: `RES-${reservationData.id_encab_fact}`,
          correo_cliente: emailCliente,
          payment_method: paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Error en la solicitud de pago")
      }

      const result = await response.json()

      // Si hay async_payment_url (pagos asíncronos como BANCOLOMBIA_TRANSFER), redirigir
      if (result.data?.payment_method?.extra?.async_payment_url) {
        window.location.href = result.data.payment_method.extra.async_payment_url
        return
      }

      // Si la reserva ya fue confirmada (transacción APPROVED inmediatamente)
      if (result.reserva_confirmada === true) {
        alert("¡Pago exitoso! Tu reserva ha sido confirmada")
        sessionStorage.removeItem("pendingReservation")
        window.location.href = "/"
        return
      }

      const httpStatus = result.http_status_code
      const tieneData = result.data && result.data !== null
      const transactionStatus = result.data?.status
      const transactionId = result.transaction_id || result.data?.id

      // Si la transacción fue creada exitosamente
      if ((httpStatus === 200 || httpStatus === 201) && tieneData) {
        // Si el estado es APPROVED, confirmar inmediatamente
        if (transactionStatus === "APPROVED") {
          alert("¡Pago exitoso! Tu reserva ha sido confirmada")
          sessionStorage.removeItem("pendingReservation")
          window.location.href = "/"
          return
        }
        
        // Si el estado es DECLINED o ERROR, mostrar error
        if (transactionStatus === "DECLINED") {
          setLoading(false)
          alert("El pago fue rechazado. Por favor intenta con otra tarjeta")
          return
        }
        
        if (transactionStatus === "ERROR") {
          setLoading(false)
          alert("Error al procesar el pago. Por favor intenta de nuevo")
          return
        }
        
        // Si el estado es PENDING y tenemos transaction_id, iniciar polling
        if (transactionStatus === "PENDING" && transactionId) {
          await pollTransactionStatus(transactionId)
          return
        }
        
        // Si no tenemos transaction_id pero la transacción fue creada, esperar webhook
        if (transactionId) {
          alert("Tu pago está siendo procesado. Te notificaremos cuando se complete.")
          setLoading(false)
          return
        }
      }

      // Si llegamos aquí sin manejar el caso, mostrar mensaje genérico
      setLoading(false)
      alert("Pago procesado. Estado: " + (transactionStatus || "PENDIENTE"))
    } catch (err) {
      setLoading(false)
      const errorMessage = err instanceof Error ? err.message : "Error desconocido en el pago"
      alert(`Error en el pago: ${errorMessage}`)
      console.error("Error completo:", err)
    }
  }

  const isCardFormValid = cardNumber && cvc && expMonth && expYear && cardHolder && Object.keys(errors).length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">Completa tu reserva</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Revisa los detalles y elige tu método de pago</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2 space-y-8">
            {/* Reservation Summary Card */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-b border-primary/30 p-8">
                <h2 className="text-2xl font-bold text-foreground">Resumen de tu reserva</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Restaurante</p>
                    <p className="text-lg font-semibold text-foreground">
                      {reservationData.restaurant?.nombre_restaurante}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Mesa</p>
                    <p className="text-lg font-semibold text-foreground">#{reservationData.mesa?.id_mesa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Fecha</p>
                    <p className="text-lg font-semibold text-foreground">{reservationData.fecha}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Hora</p>
                    <p className="text-lg font-semibold text-foreground">{reservationData.horario}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Comensales</p>
                    <p className="text-lg font-semibold text-foreground">{reservationData.guests} personas</p>
                  </div>
                </div>
                <div className="border-t border-border pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground font-medium">Total a pagar:</span>
                    <span className="text-3xl font-bold text-primary">
                      ${reservationData.mesa?.precio?.toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b border-border p-8">
                <h2 className="text-2xl font-bold text-foreground">Método de pago</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Card Payment Option */}
                <button
                  onClick={() => {
                    setPaymentType("CARD")
                    setErrors({})
                  }}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    paymentType === "CARD"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Tarjeta de crédito o débito</p>
                      <p className="text-sm text-muted-foreground mt-1">Visa, Mastercard, Amex</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentType === "CARD" ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}
                    >
                      {paymentType === "CARD" && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </button>

                {/* Bank Transfer Option */}
                <button
                  onClick={() => {
                    setPaymentType("BANCOLOMBIA_TRANSFER")
                    setErrors({})
                  }}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    paymentType === "BANCOLOMBIA_TRANSFER"
                      ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/20"
                      : "border-border bg-card hover:border-secondary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Botón Bancolombia</p>
                      <p className="text-sm text-muted-foreground mt-1">Transferencia bancaria segura</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentType === "BANCOLOMBIA_TRANSFER" ? "border-secondary bg-secondary" : "border-muted-foreground/30"
                      }`}
                    >
                      {paymentType === "BANCOLOMBIA_TRANSFER" && <Check className="w-4 h-4 text-secondary-foreground" />}
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Card Form */}
            {paymentType === "CARD" && (
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground">Información de la tarjeta</h2>
                </div>
                <div className="p-8 space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-base font-medium text-foreground mb-3">Número de tarjeta</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={() => setTouched({ ...touched, cardNumber: true })}
                        maxLength={19}
                        className={`w-full px-5 py-4 text-lg rounded-xl border-2 outline-none transition-all ${
                          errors.cardNumber && touched.cardNumber
                            ? "border-destructive bg-destructive/10"
                            : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>
                    {errors.cardNumber && touched.cardNumber && (
                      <div className="flex items-center gap-2 mt-2 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{errors.cardNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Holder */}
                  <div>
                    <label className="block text-base font-medium text-foreground mb-3">Nombre del titular</label>
                    <input
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value.toUpperCase())
                        setTouched({ ...touched, cardHolder: true })
                      }}
                      onBlur={() => setTouched({ ...touched, cardHolder: true })}
                      className={`w-full px-5 py-4 text-lg rounded-xl border-2 outline-none transition-all ${
                        errors.cardHolder && touched.cardHolder
                          ? "border-destructive bg-destructive/10"
                          : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                    {errors.cardHolder && touched.cardHolder && (
                      <div className="flex items-center gap-2 mt-2 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{errors.cardHolder}</span>
                      </div>
                    )}
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-medium text-foreground mb-3">Mes</label>
                      <input
                        type="text"
                        placeholder="MM"
                        value={expMonth}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 2)
                          setExpMonth(val)
                          setTouched({ ...touched, expMonth: true })
                        }}
                        onBlur={() => setTouched({ ...touched, expMonth: true })}
                        maxLength={2}
                        className={`w-full px-4 py-4 text-lg rounded-xl border-2 outline-none transition-all text-center ${
                          errors.expMonth && touched.expMonth
                            ? "border-destructive bg-destructive/10"
                            : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                      {errors.expMonth && touched.expMonth && (
                        <p className="text-xs text-destructive mt-2">{errors.expMonth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-base font-medium text-foreground mb-3">Año</label>
                      <input
                        type="text"
                        placeholder="YYYY"
                        value={expYear}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 4)
                          setExpYear(val)
                          setTouched({ ...touched, expYear: true })
                        }}
                        onBlur={() => setTouched({ ...touched, expYear: true })}
                        maxLength={4}
                        className={`w-full px-4 py-4 text-lg rounded-xl border-2 outline-none transition-all text-center ${
                          errors.expYear && touched.expYear
                            ? "border-destructive bg-destructive/10"
                            : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                      {errors.expYear && touched.expYear && (
                        <p className="text-xs text-destructive mt-2">{errors.expYear}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-base font-medium text-foreground mb-3">CVC</label>
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cvc}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 3)
                          setCvc(val)
                          setTouched({ ...touched, cvc: true })
                        }}
                        onBlur={() => setTouched({ ...touched, cvc: true })}
                        maxLength={3}
                        className={`w-full px-4 py-4 text-lg rounded-xl border-2 outline-none transition-all text-center ${
                          errors.cvc && touched.cvc
                            ? "border-destructive bg-destructive/10"
                            : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                      {errors.cvc && touched.cvc && <p className="text-xs text-destructive mt-2">{errors.cvc}</p>}
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground font-medium">Tu información de pago está encriptada y es 100% segura</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Bank Transfer Info */}
            {paymentType === "BANCOLOMBIA_TRANSFER" && (
              <Card className="border-0 shadow-xl overflow-hidden border-l-4 border-l-secondary">
                <div className="bg-secondary/10 p-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/20 p-3 rounded-xl">
                      <Check className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Serás redirigido a Bancolombia</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Completarás el pago de forma segura en la plataforma de Bancolombia. No compartes tus datos
                        bancarios con nosotros.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Total and Payment Button */}
          <div className="md:col-span-1">
            <Card className="sticky top-8 border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-primary-foreground">
                <p className="text-base font-medium opacity-95 mb-3">Total a pagar</p>
                <p className="text-5xl font-bold">${reservationData.mesa?.precio?.toLocaleString()} COP</p>
              </div>
              <div className="p-6 space-y-5">
                <button
                  onClick={handlePayment}
                  disabled={loading || !emailCliente || (paymentType === "CARD" && !isCardFormValid)}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                    loading || !emailCliente || (paymentType === "CARD" && !isCardFormValid)
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 active:scale-95 shadow-primary/30"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar pago
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Pagos seguros con encriptación
                </div>

                {paymentType === "CARD" && (
                  <div className="pt-5 border-t border-border space-y-3">
                    <p className="text-sm font-semibold text-foreground mb-3">Estado del formulario:</p>
                    <div className="space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {cardNumber && touched.cardNumber && !errors.cardNumber ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span>Número de tarjeta</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {cardHolder && touched.cardHolder && !errors.cardHolder ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span>Titular</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {expMonth &&
                        expYear &&
                        touched.expMonth &&
                        touched.expYear &&
                        !errors.expMonth &&
                        !errors.expYear ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span>Fecha de expiración</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {cvc && touched.cvc && !errors.cvc ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span>CVC</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
