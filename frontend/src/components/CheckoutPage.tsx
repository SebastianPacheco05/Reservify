"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, Check, AlertCircle, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

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

      const response = await fetch("http://10.5.213.111:1106/wompi/crear_pago", {
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
        throw new Error("Error en la solicitud de pago")
      }

      const result = await response.json()

      if (result.data?.payment_method?.extra?.async_payment_url) {
        window.location.href = result.data.payment_method.extra.async_payment_url
        return
      }

      if (result.reserva_confirmada === true) {
        alert("¡Pago exitoso! Tu reserva ha sido confirmada")
        sessionStorage.removeItem("pendingReservation")
        window.location.href = "/"
        return
      }

      const httpStatus = result.http_status_code
      const tieneData = result.data && result.data !== null
      const dataStatus = result.data?.status

      if ((httpStatus === 200 || httpStatus === 201) && tieneData) {
        alert("¡Pago exitoso! Tu reserva ha sido confirmada")
        sessionStorage.removeItem("pendingReservation")
        window.location.href = "/"
      } else if (dataStatus === "APPROVED") {
        alert("¡Pago aprobado! Tu reserva ha sido confirmada")
        sessionStorage.removeItem("pendingReservation")
        window.location.href = "/"
      } else if (dataStatus === "DECLINED") {
        alert("El pago fue rechazado. Por favor intenta con otra tarjeta")
      } else if (dataStatus === "ERROR") {
        alert("Error al procesar el pago. Por favor intenta de nuevo")
      } else {
        alert("Pago procesado. Estado: " + (dataStatus || "PENDIENTE"))
      }
    } catch (err) {
      alert("Error en el pago: " + (err as Error).message)
    }
    setLoading(false)
  }

  const isCardFormValid = cardNumber && cvc && expMonth && expYear && cardHolder && Object.keys(errors).length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Completa tu reserva</h1>
          <p className="text-slate-600 mt-2">Revisa los detalles y elige tu método de pago</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Reservation Summary Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Resumen de tu reserva</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Restaurante</p>
                    <p className="text-base font-semibold text-slate-900 mt-1">
                      {reservationData.restaurant?.nombre_restaurante}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mesa</p>
                    <p className="text-base font-semibold text-slate-900 mt-1">#{reservationData.mesa?.id_mesa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Fecha</p>
                    <p className="text-base font-semibold text-slate-900 mt-1">{reservationData.fecha}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Hora</p>
                    <p className="text-base font-semibold text-slate-900 mt-1">{reservationData.horario}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Comensales</p>
                    <p className="text-base font-semibold text-slate-900 mt-1">{reservationData.guests} personas</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total a pagar:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ${reservationData.mesa?.precio?.toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Método de pago</h2>
              </div>
              <div className="p-6 space-y-3">
                {/* Card Payment Option */}
                <button
                  onClick={() => {
                    setPaymentType("CARD")
                    setErrors({})
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    paymentType === "CARD"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Tarjeta de crédito o débito</p>
                      <p className="text-sm text-slate-600 mt-1">Visa, Mastercard, Amex</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentType === "CARD" ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                      }`}
                    >
                      {paymentType === "CARD" && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>

                {/* Bank Transfer Option */}
                <button
                  onClick={() => {
                    setPaymentType("BANCOLOMBIA_TRANSFER")
                    setErrors({})
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    paymentType === "BANCOLOMBIA_TRANSFER"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Botón Bancolombia</p>
                      <p className="text-sm text-slate-600 mt-1">Transferencia bancaria segura</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentType === "BANCOLOMBIA_TRANSFER" ? "border-blue-500 bg-blue-500" : "border-slate-300"
                      }`}
                    >
                      {paymentType === "BANCOLOMBIA_TRANSFER" && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Card Form */}
            {paymentType === "CARD" && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Información de la tarjeta</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Número de tarjeta</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={() => setTouched({ ...touched, cardNumber: true })}
                        maxLength={19}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors ${
                          errors.cardNumber && touched.cardNumber
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {errors.cardNumber && touched.cardNumber && (
                      <div className="flex items-center gap-2 mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.cardNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Holder */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del titular</label>
                    <input
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value.toUpperCase())
                        setTouched({ ...touched, cardHolder: true })
                      }}
                      onBlur={() => setTouched({ ...touched, cardHolder: true })}
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors ${
                        errors.cardHolder && touched.cardHolder
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200 focus:border-emerald-500"
                      }`}
                    />
                    {errors.cardHolder && touched.cardHolder && (
                      <div className="flex items-center gap-2 mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.cardHolder}</span>
                      </div>
                    )}
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Mes</label>
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
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors text-center ${
                          errors.expMonth && touched.expMonth
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-emerald-500"
                        }`}
                      />
                      {errors.expMonth && touched.expMonth && (
                        <p className="text-xs text-red-600 mt-1">{errors.expMonth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Año</label>
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
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors text-center ${
                          errors.expYear && touched.expYear
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-emerald-500"
                        }`}
                      />
                      {errors.expYear && touched.expYear && (
                        <p className="text-xs text-red-600 mt-1">{errors.expYear}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVC</label>
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
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors text-center ${
                          errors.cvc && touched.cvc
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-emerald-500"
                        }`}
                      />
                      {errors.cvc && touched.cvc && <p className="text-xs text-red-600 mt-1">{errors.cvc}</p>}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">Tu información de pago está encriptada y es 100% segura</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Bank Transfer Info */}
            {paymentType === "BANCOLOMBIA_TRANSFER" && (
              <Card className="border-0 shadow-lg overflow-hidden border-l-4 border-l-blue-500">
                <div className="bg-blue-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Serás redirigido a Bancolombia</p>
                      <p className="text-sm text-slate-600 mt-2">
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
            <Card className="sticky top-6 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white">
                <p className="text-sm font-medium opacity-90">Total a pagar</p>
                <p className="text-4xl font-bold mt-2">${reservationData.mesa?.precio?.toLocaleString()} COP</p>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={loading || !emailCliente || (paymentType === "CARD" && !isCardFormValid)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    loading || !emailCliente || (paymentType === "CARD" && !isCardFormValid)
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar pago
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-xs text-slate-500 text-center">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Pagos seguros con encriptación
                </div>

                {paymentType === "CARD" && (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <p className="text-xs font-medium text-slate-700">Estado del formulario:</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        {cardNumber && touched.cardNumber && !errors.cardNumber ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-slate-300" />
                        )}
                        <span>Número de tarjeta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cardHolder && touched.cardHolder && !errors.cardHolder ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-slate-300" />
                        )}
                        <span>Titular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {expMonth &&
                        expYear &&
                        touched.expMonth &&
                        touched.expYear &&
                        !errors.expMonth &&
                        !errors.expYear ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-slate-300" />
                        )}
                        <span>Fecha de expiración</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cvc && touched.cvc && !errors.cvc ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-slate-300" />
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
