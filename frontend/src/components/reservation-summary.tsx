interface ReservationSummaryProps {
    data: {
        id_reserva?: number
        restaurant?: {
            nombre_restaurante: string
        }
        reservation?: {
            fecha: string
            horario: string
        }
        guests?: number
        fecha?: string
        horario?: string
        mesa?: {
            id_mesa: number
            precio: number
            cant_personas: number
        } | number
        encabezado_factura?: {
            nit: number
        }
        // Datos legacy para compatibilidad
        restaurante?: string
        num_comensales?: number
        precio_mesa?: number
        anticipo?: number
    }
}

export function ReservationSummary({ data }: ReservationSummaryProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Resumen de Reserva</h2>

            <div className="space-y-4 mb-6">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Restaurante</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {data.restaurant?.nombre_restaurante || data.restaurante || "No disponible"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES') : 
                             data.reservation?.fecha ? new Date(data.reservation.fecha).toLocaleDateString('es-ES') : "No disponible"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hora</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {data.horario || data.reservation?.horario || "No disponible"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Comensales</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {data.guests || data.num_comensales || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mesa</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            #{typeof data.mesa === 'object' ? data.mesa?.id_mesa : data.mesa || "No disponible"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Precio Mesa</span>
                    <span className="font-medium text-foreground">
                        ${(typeof data.mesa === 'object' ? data.mesa?.precio : data.precio_mesa || 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Capacidad Mesa</span>
                    <span className="font-medium text-foreground">
                        {typeof data.mesa === 'object' ? data.mesa?.cant_personas || "N/A" : "N/A"} personas
                    </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-gray-900 dark:text-gray-100">Total a Pagar</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        ${(typeof data.mesa === 'object' ? data.mesa?.precio : data.precio_mesa || 0).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Pago completo por adelantado. Tu mesa estará reservada por 2 horas.
                </p>
            </div>
        </div>
    )
}

