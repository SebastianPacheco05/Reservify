import { useState, useEffect } from "react"

interface ReservationData {
    id: string
    restaurante: string
    total: number
    email: string
}

interface CheckoutPageProps {
    reservationData: ReservationData
}

interface PaymentMethod {
    type: string
    token: string
    installments: number
}

export default function CheckoutPage({ reservationData }: CheckoutPageProps) {
    const [cardNumber, setCardNumber] = useState("")
    const [cvc, setCvc] = useState("")
    const [expMonth, setExpMonth] = useState("")
    const [expYear, setExpYear] = useState("")
    const [cardHolder, setCardHolder] = useState("")
    const [loading, setLoading] = useState(false)
    const [wompiLoaded, setWompiLoaded] = useState(false)

    // Cargar script de Wompi dinámicamente
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.wompi.co/widget.js"
        script.async = true
        script.onload = () => setWompiLoaded(true)
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handlePayment = async () => {
        if (!wompiLoaded) {
            alert("Wompi aún no está listo")
            return
        }

        setLoading(true)
        try {
            // @ts-ignore
            const tokenResponse: any = await new Promise((resolve, reject) => {
                // @ts-ignore
                Wompi.createCardToken({
                    number: cardNumber,
                    cvc,
                    exp_month: expMonth,
                    exp_year: expYear,
                    card_holder: cardHolder
                }, (error: any, token: any) => {
                    if (error) reject(error)
                    else resolve(token)
                })
            })

            const paymentMethod: PaymentMethod = {
                type: "CARD",
                token: tokenResponse.id,
                installments: 1
            }

            const response = await fetch("http://localhost:8000/crear_transaccion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    monto: reservationData.total,
                    moneda: "COP",
                    correo_cliente: reservationData.email,
                    referencia: `RES-${reservationData.id}`,
                    descripcion: `Reserva en ${reservationData.restaurante}`,
                    metodo_pago: paymentMethod
                })
            })

            const result = await response.json()
            console.log("Resultado de la transacción:", result)
            alert("Pago realizado correctamente")
        } catch (err) {
            console.error(err)
            alert("Error en el pago")
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-2">
            <h2 className="text-xl font-bold mb-4">Datos de la tarjeta</h2>
            <input placeholder="Número de tarjeta" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="input w-full" />
            <input placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value)} className="input w-full" />
            <input placeholder="Mes Exp" value={expMonth} onChange={e => setExpMonth(e.target.value)} className="input w-full" />
            <input placeholder="Año Exp" value={expYear} onChange={e => setExpYear(e.target.value)} className="input w-full" />
            <input placeholder="Nombre titular" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className="input w-full" />
            <button onClick={handlePayment} disabled={loading || !wompiLoaded} className="btn w-full mt-4">
                {loading ? "Procesando..." : "Pagar"}
            </button>
        </div>
    )
}
