import { useState, useEffect } from "react"

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

interface PaymentMethod {
    type: PaymentType
    token?: string
    installments?: number
    payment_description?: string
    card_number?: string
    cvc?: string
    exp_month?: string
    exp_year?: string
    card_holder?: string
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

    // Log inicial para debugging
    useEffect(() => {
        console.log("=== CheckoutPage montado ===")
        console.log("Datos de reserva:", reservationData)
    }, [reservationData])

    // Extraer email del token JWT
    useEffect(() => {
        console.log("Extrayendo email del token...")
        const token = localStorage.getItem("token")
        console.log("Token encontrado:", !!token)

        if (token) {
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]))
                console.log("Email extraído:", tokenPayload.sub)
                setEmailCliente(tokenPayload.sub)
            } catch (error) {
                console.error("Error al extraer email del token:", error)
            }
        } else {
            console.error("No se encontró token en localStorage")
        }
    }, [])

    const handlePayment = async () => {
        console.log("=== handlePayment iniciado ===")
        console.log("emailCliente:", emailCliente)

        if (!emailCliente) {
            console.error("Email cliente no disponible")
            alert("No se pudo obtener el email del cliente")
            return
        }

        console.log("Iniciando proceso de pago...")
        setLoading(true)
        try {
            let paymentMethod: any

            if (paymentType === "CARD") {
                // Validar campos
                if (!cardNumber || !cvc || !expMonth || !expYear || !cardHolder) {
                    console.log("Campos incompletos")
                    alert("Por favor completa todos los campos de la tarjeta")
                    setLoading(false)
                    return
                }

                console.log("Enviando datos de tarjeta al backend para tokenización...")
                // Enviar datos de tarjeta al backend para tokenización segura
                paymentMethod = {
                    type: "CARD",
                    card_number: cardNumber.replace(/\s/g, ""), // Eliminar espacios
                    cvc,
                    exp_month: expMonth,
                    exp_year: expYear,
                    card_holder: cardHolder,
                    installments: 1
                }
            } else {
                paymentMethod = {
                    type: "BANCOLOMBIA_TRANSFER",
                    payment_description: `Pago reserva ${reservationData.id_encab_fact}`
                }
            }

            console.log("Enviando pago al backend...")
            console.log("Datos de pago:", {
                monto: reservationData.mesa.precio,
                referencia: `RES-${reservationData.id_encab_fact}`,
                correo_cliente: emailCliente,
                payment_method: paymentMethod
            })

            const response = await fetch("http://localhost:8000/wompi/crear_pago", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    monto: reservationData.mesa.precio,
                    referencia: `RES-${reservationData.id_encab_fact}`,
                    correo_cliente: emailCliente,
                    payment_method: paymentMethod
                })
            })

            console.log("Respuesta del backend:", response.status)

            if (!response.ok) {
                throw new Error("Error en la solicitud de pago")
            }

            const result = await response.json()
            console.log("Resultado de la transacción:", result)

            // Redirigir si es asincrónico (Bancolombia)
            if (result.data?.payment_method?.extra?.async_payment_url) {
                window.location.href = result.data.payment_method.extra.async_payment_url
                return
            }

            // Verificar si la reserva fue confirmada en el backend (prioridad máxima)
            if (result.reserva_confirmada === true) {
                alert("¡Pago exitoso! Tu reserva ha sido confirmada")
                sessionStorage.removeItem("pendingReservation")
                window.location.href = "/"
                return
            }

            // Verificar estado del pago si la reserva no fue confirmada
            const httpStatus = result.http_status_code
            const tieneData = result.data && result.data !== null
            const dataStatus = result.data?.status

            // Si el HTTP status es 200 o 201 y hay data, consideramos el pago exitoso
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
            console.error(err)
            alert("Error en el pago: " + (err as Error).message)
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-4">
            <h2 className="text-xl font-bold mb-4">Resumen de Reserva</h2>

            {/* Resumen de la reserva */}
            <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="text-sm text-gray-600">Restaurante: <span className="font-semibold">{reservationData.restaurant?.nombre_restaurante}</span></p>
                <p className="text-sm text-gray-600">Fecha: <span className="font-semibold">{reservationData.fecha}</span></p>
                <p className="text-sm text-gray-600">Horario: <span className="font-semibold">{reservationData.horario}</span></p>
                <p className="text-sm text-gray-600">Comensales: <span className="font-semibold">{reservationData.guests}</span></p>
                <p className="text-sm text-gray-600">Mesa: <span className="font-semibold">#{reservationData.mesa?.id_mesa}</span></p>
                <p className="text-lg font-bold text-gray-800 mt-2">Total: ${reservationData.mesa?.precio?.toLocaleString()} COP</p>
            </div>

            <h3 className="text-lg font-bold mb-2">Método de pago</h3>

            <select
                value={paymentType}
                onChange={e => setPaymentType(e.target.value as PaymentType)}
                className="input w-full mb-4"
            >
                <option value="CARD">Tarjeta de Crédito</option>
                <option value="BANCOLOMBIA_TRANSFER">Botón Bancolombia</option>
            </select>

            {paymentType === "CARD" && (
                <>
                    <input
                        placeholder="Número de tarjeta"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="input w-full"
                    />
                    <input
                        placeholder="CVC"
                        value={cvc}
                        onChange={e => setCvc(e.target.value)}
                        className="input w-full"
                    />
                    <input
                        placeholder="Mes Exp (MM)"
                        value={expMonth}
                        onChange={e => setExpMonth(e.target.value)}
                        className="input w-full"
                    />
                    <input
                        placeholder="Año Exp (YYYY)"
                        value={expYear}
                        onChange={e => setExpYear(e.target.value)}
                        className="input w-full"
                    />
                    <input
                        placeholder="Nombre titular"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        className="input w-full"
                    />
                </>
            )}

            {paymentType === "BANCOLOMBIA_TRANSFER" && (
                <div className="bg-blue-50 p-4 rounded text-sm text-gray-700">
                    <p>Serás redirigido a la plataforma de Bancolombia para completar el pago.</p>
                </div>
            )}

            <button
                onClick={() => {
                    console.log("=== Botón Pagar clickeado ===")
                    console.log("Botón deshabilitado:", loading || !emailCliente)
                    console.log("- loading:", loading)
                    console.log("- emailCliente:", emailCliente)
                    handlePayment()
                }}
                disabled={loading || !emailCliente}
                className="btn w-full mt-4"
            >
                {loading ? "Procesando..." : `Pagar $${reservationData.mesa?.precio?.toLocaleString()} COP`}
            </button>

            {/* Debug info */}
            <div className="text-xs text-gray-400 text-center mt-2">
                <p>Debug: Email {emailCliente ? "✓" : "✗"} | Backend ready ✓</p>
            </div>
        </div>
    )
}
