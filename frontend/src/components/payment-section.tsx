interface PaymentSectionProps {
    customerData: any
    reservationData: any
    onSuccess: () => void
    onBack: () => void
}

export function PaymentSection({ customerData, reservationData, onSuccess, onBack }: PaymentSectionProps) {
    const handlePayment = () => {
        // Aquí se integrará con Mercado Pago
        setTimeout(() => {
            onSuccess()
        }, 1500)
    }

    return (
        <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6">Método de Pago</h2>

            <div className="mb-6 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)]">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-2">Resumen del Cliente</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    {customerData.nombre} {customerData.apellido}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">{customerData.email}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{customerData.telefono}</p>
            </div>

            <div className="mb-6">
                <div className="border-2 border-[var(--color-primary)] rounded-[var(--radius-lg)] p-4 cursor-pointer hover:bg-[var(--color-primary-light)] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold">
                            MP
                        </div>
                        <div>
                            <h4 className="font-semibold text-[var(--color-secondary)]">Mercado Pago</h4>
                            <p className="text-sm text-[var(--color-text-secondary)]">Pago seguro con tarjeta o PSE</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-secondary)] rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-surface)] transition-colors"
                >
                    Volver
                </button>
                <button
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                    Pagar ${reservationData.anticipo.toLocaleString()}
                </button>
            </div>
        </div>
    )
}

