import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutPage from "../components/checkout-page"

export default function Pasarela_pagos() {
    const [reservationData, setReservationData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Obtener datos de la reserva desde sessionStorage
        const data = sessionStorage.getItem("pendingReservation")
        if (data) {
            setReservationData(JSON.parse(data))
        } else {
            // Si no hay datos, redirigir al home
            navigate("/")
        }
    }, [navigate])

    if (!reservationData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Cargando...</h2>
                    <p className="text-gray-600">Preparando tu reserva</p>
                </div>
            </div>
        )
    }

    return <CheckoutPage reservationData={reservationData} />
}
