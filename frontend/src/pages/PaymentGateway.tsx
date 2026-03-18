import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutPage from "../components/CheckoutPage"

interface ReservationData {
    id_encab_fact: number
    restaurant: any
    mesa: any
    guests: number
    fecha: string
    horario: string
}

export default function PaymentGateway() {
    const [reservationData, setReservationData] = useState<ReservationData | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const data = sessionStorage.getItem("pendingReservation")
        if (data) {
            setReservationData(JSON.parse(data))
        } else {
            navigate("/")
        }
    }, [navigate])

    if (!reservationData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Cargando...</h2>
                    <p className="text-muted-foreground">Preparando tu reserva</p>
                </div>
            </div>
        )
    }

    return <CheckoutPage reservationData={reservationData} />
}
