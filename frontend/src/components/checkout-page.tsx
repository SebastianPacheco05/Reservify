"use client"

import { useState } from "react"
import { ReservationSummary } from "./reservation-summary"
import { CustomerForm } from "./customer-form"
import { PaymentSection } from "./payment-section"
import { CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
    const [step, setStep] = useState<"form" | "payment" | "success">("form")
    const [customerData, setCustomerData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        tipo_documento: "CC",
        documento: "",
    })

    // Datos de ejemplo de la reserva (en producción vendrían de la URL o API)
    const reservationData = {
        restaurante: "La Terraza Gourmet",
        fecha: "2025-10-25",
        horario: "20:00",
        num_comensales: 4,
        mesa: 12,
        precio_mesa: 50000,
        anticipo: 20000, // 40% de anticipo
    }

    const handleCustomerSubmit = (data: typeof customerData) => {
        setCustomerData(data)
        setStep("payment")
    }

    const handlePaymentSuccess = () => {
        setStep("success")
    }

    return (
        <div className="min-h-screen bg-[var(--color-surface)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)] mb-2">Reservify</h1>
                    <p className="text-[var(--color-text-secondary)]">Completa tu reserva de forma segura</p>
                </div>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <StepIndicator number={1} label="Información" active={step === "form"} completed={step !== "form"} />
                        <div className="h-[2px] w-16 bg-[var(--color-border)]" />
                        <StepIndicator number={2} label="Pago" active={step === "payment"} completed={step === "success"} />
                        <div className="h-[2px] w-16 bg-[var(--color-border)]" />
                        <StepIndicator number={3} label="Confirmación" active={step === "success"} completed={false} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2">
                        {step === "form" && <CustomerForm onSubmit={handleCustomerSubmit} initialData={customerData} />}

                        {step === "payment" && (
                            <PaymentSection
                                customerData={customerData}
                                reservationData={reservationData}
                                onSuccess={handlePaymentSuccess}
                                onBack={() => setStep("form")}
                            />
                        )}

                        {step === "success" && (
                            <div className="bg-white rounded-[var(--radius-xl)] p-8 shadow-sm border border-[var(--color-border)]">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-success)]/10 rounded-full mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-2">¡Pago Exitoso!</h2>
                                    <p className="text-[var(--color-text-secondary)] mb-6">
                                        Tu reserva ha sido confirmada. Recibirás un correo con los detalles.
                                    </p>
                                    <div className="bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] p-4 mb-6">
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">Número de confirmación</p>
                                        <p className="text-xl font-bold text-[var(--color-primary)]">
                                            RSV-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                                    >
                                        Hacer otra reserva
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <ReservationSummary data={reservationData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StepIndicator({
    number,
    label,
    active,
    completed,
}: { number: number; label: string; active: boolean; completed: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${completed
                    ? "bg-[var(--color-primary)] text-white"
                    : active
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-white border-2 border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
            >
                {completed ? "✓" : number}
            </div>
            <span
                className={`text-xs font-medium ${active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}
            >
                {label}
            </span>
        </div>
    )
}
