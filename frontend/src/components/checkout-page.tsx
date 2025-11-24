"use client"

import { useState } from "react"
import { ReservationSummary } from "./reservation-summary"
import { CustomerForm } from "./customer-form"
import { PaymentSection } from "./payment-section"
import { CheckCircle2 } from "lucide-react"
import { useToastContext } from "./ToastProvider"

interface CheckoutPageProps {
    reservationData?: any
}

export default function CheckoutPage({ reservationData: propReservationData }: CheckoutPageProps) {
    const { toast } = useToastContext();
    const [step, setStep] = useState<"form" | "payment" | "success">("form")
    const [customerData, setCustomerData] = useState({
        nombre_completo: "",
        email: "",
        telefono: "",
    })

    // Usar datos de la reserva pasados como prop o datos por defecto
    const reservationData = propReservationData || {
        restaurant: { nombre_restaurante: "La Terraza Gourmet" },
        reservation: { fecha: "2025-10-25", horario: "20:00" },
        guests: 4,
        mesa: { id_mesa: 12, precio: 50000, cant_personas: 4 },
        encabezado_factura: { nit: 123456789 }
    }

    const handleCustomerSubmit = (data: typeof customerData) => {
        setCustomerData(data)
        setStep("payment")
    }

    const handlePaymentSuccess = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast({
                    title: "Sesión expirada",
                    description: "Por favor inicia sesión nuevamente.",
                    variant: "warning"
                });
                window.location.href = "/login"
                return
            }

            // Obtener ID de reserva desde los datos
            const idReserva = reservationData.id_reserva
            
            if (!idReserva) {
                throw new Error("No se encontró el ID de la reserva")
            }

            // Actualizar estado de reserva a "confirmada"
            const response = await fetch(`http://10.5.213.111:8001/reserva/confirmar/${idReserva}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Error al confirmar la reserva")
            }

            console.log("Pago exitoso, reserva confirmada")
            setStep("success")
        } catch (error) {
            console.error("Error al confirmar la reserva:", error)
            toast({
                title: "Error en la confirmación",
                description: "Error al confirmar la reserva. Inténtalo de nuevo.",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Reservify</h1>
                    <p className="text-gray-600">Completa tu reserva de forma segura</p>
                </div>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <StepIndicator number={1} label="Información" active={step === "form"} completed={step !== "form"} />
                        <div className="h-[2px] w-16 bg-gray-300" />
                        <StepIndicator number={2} label="Pago" active={step === "payment"} completed={step === "success"} />
                        <div className="h-[2px] w-16 bg-gray-300" />
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
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
                                    <p className="text-gray-600 mb-6">
                                        Tu reserva ha sido confirmada. Recibirás un correo con los detalles.
                                    </p>
                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-gray-600 mb-1">Número de confirmación</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            RSV-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            // Limpiar datos de reserva y volver al home
                                            sessionStorage.removeItem("pendingReservation")
                                            window.location.href = "/"
                                        }}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Volver al Inicio
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
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    completed
                        ? "bg-blue-600 text-white"
                        : active
                            ? "bg-blue-600 text-white"
                            : "bg-white border-2 border-gray-300 text-gray-500"
                }`}
            >
                {completed ? "✓" : number}
            </div>
            <span
                className={`text-xs font-medium ${active ? "text-blue-600" : "text-gray-500"}`}
            >
                {label}
            </span>
        </div>
    )
}
