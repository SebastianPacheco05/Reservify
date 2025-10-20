interface PaymentSectionProps {
    customerData: any
    reservationData: any
    onSuccess: () => void
    onBack: () => void
}

export function PaymentSection({ customerData, reservationData, onSuccess, onBack }: PaymentSectionProps) {
    const [paymentData, setPaymentData] = useState({
        numero_tarjeta: "",
        fecha_vencimiento: "",
        nombre_titular: "",
        cvc: ""
    })

    const handlePayment = async () => {
        // Validar campos de pago
        if (!paymentData.numero_tarjeta || !paymentData.fecha_vencimiento || !paymentData.nombre_titular || !paymentData.cvc) {
            alert("Por favor completa todos los campos de pago")
            return
        }
        
        try {
            // Aquí se integraría con Mercado Pago
            console.log("Procesando pago con:", paymentData)
            
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Aquí actualizarías el estado de la reserva a "confirmada"
            // Por ahora simulamos el éxito
            console.log("Pago exitoso, confirmando reserva...")
            
            onSuccess()
        } catch (error) {
            console.error("Error al procesar el pago:", error)
            alert("Error al procesar el pago. Inténtalo de nuevo.")
        }
    }

    const formatCardNumber = (value: string) => {
        // Formatear número de tarjeta con espacios cada 4 dígitos
        return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    }

    const formatExpiryDate = (value: string) => {
        // Formatear fecha de vencimiento MM/YY
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Método de Pago</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Información del Cliente</h3>
                <p className="text-sm text-gray-600">
                    {customerData.nombre_completo}
                </p>
                <p className="text-sm text-gray-600">{customerData.email}</p>
                <p className="text-sm text-gray-600">{customerData.telefono}</p>
            </div>

            {/* Formulario de Pago */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Tarjeta
                    </label>
                    <input
                        type="text"
                        required
                        value={paymentData.numero_tarjeta}
                        onChange={(e) => setPaymentData({ ...paymentData, numero_tarjeta: formatCardNumber(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de Vencimiento
                        </label>
                        <input
                            type="text"
                            required
                            value={paymentData.fecha_vencimiento}
                            onChange={(e) => setPaymentData({ ...paymentData, fecha_vencimiento: formatExpiryDate(e.target.value) })}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                        </label>
                        <input
                            type="text"
                            required
                            value={paymentData.cvc}
                            onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value.replace(/\D/g, '') })}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Titular
                    </label>
                    <input
                        type="text"
                        required
                        value={paymentData.nombre_titular}
                        onChange={(e) => setPaymentData({ ...paymentData, nombre_titular: e.target.value.toUpperCase() })}
                        placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-sm text-green-700 font-medium">Pago 100% seguro con encriptación SSL</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                    Volver
                </button>
                <button
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                    Pagar ${reservationData?.mesa?.precio?.toLocaleString() || '0'}
                </button>
            </div>
        </div>
    )
}

