interface ReservationSummaryProps {
    data: {
        restaurante: string
        fecha: string
        horario: string
        num_comensales: number
        mesa: number
        precio_mesa: number
        anticipo: number
    }
}

export function ReservationSummary({ data }: ReservationSummaryProps) {
    return (
        <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--color-border)] sticky top-8">
            <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6">Resumen de Reserva</h2>

            <div className="space-y-4 mb-6">
                <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Restaurante</p>
                    <p className="font-semibold text-[var(--color-secondary)]">{data.restaurante}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Fecha</p>
                        <p className="font-semibold text-[var(--color-secondary)]">{data.fecha}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Hora</p>
                        <p className="font-semibold text-[var(--color-secondary)]">{data.horario}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Comensales</p>
                        <p className="font-semibold text-[var(--color-secondary)]">{data.num_comensales}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Mesa</p>
                        <p className="font-semibold text-[var(--color-secondary)]">#{data.mesa}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Precio Mesa</span>
                    <span className="font-medium">${data.precio_mesa.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Anticipo (40%)</span>
                    <span className="font-medium">${data.anticipo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="font-bold text-[var(--color-secondary)]">Total a Pagar</span>
                    <span className="font-bold text-[var(--color-primary)] text-lg">${data.anticipo.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-4 p-3 bg-[var(--color-primary-light)] rounded-[var(--radius-md)]">
                <p className="text-xs text-[var(--color-text-secondary)]">
                    El saldo restante de ${(data.precio_mesa - data.anticipo).toLocaleString()} se pagará en el restaurante.
                </p>
            </div>
        </div>
    )
}

