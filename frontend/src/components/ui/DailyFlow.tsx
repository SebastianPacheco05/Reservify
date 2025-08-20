import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { dailyFlow } from "../../data/employeeData"

export function DailyFlow() {
  const maxCustomers = Math.max(...dailyFlow.map((d) => d.customers))
  const totalCustomers = dailyFlow.reduce((acc, curr) => acc + curr.customers, 0)
  const totalReservations = dailyFlow.reduce((acc, curr) => acc + curr.reservations, 0)
  const totalWalkIns = dailyFlow.reduce((acc, curr) => acc + curr.walkIns, 0)

  const currentHour = new Date().getHours()
  const currentHourData = dailyFlow.find((d) => Number.parseInt(d.hour.split(":")[0]) === currentHour)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Flujo Diario</h1>
        <p className="text-gray-600">Análisis de clientes por hora</p>
      </div>

      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalCustomers}</div>
            <p className="text-sm text-gray-600">Hasta ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Con Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalReservations}</div>
            <p className="text-sm text-gray-600">
              {((totalReservations / totalCustomers) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sin Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{totalWalkIns}</div>
            <p className="text-sm text-gray-600">{((totalWalkIns / totalCustomers) * 100).toFixed(1)}% del total</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de flujo por horas */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo por Horas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyFlow.map((data, index) => {
              const isCurrentHour = Number.parseInt(data.hour.split(":")[0]) === currentHour
              return (
                <div
                  key={data.hour}
                  className={`p-4 rounded-lg ${isCurrentHour ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{data.hour}</span>
                      {isCurrentHour && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">AHORA</span>}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{data.customers}</div>
                      <div className="text-sm text-gray-600">clientes</div>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-3">
                    <div className="flex-1 bg-white rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-blue-500 h-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${(data.customers / maxCustomers) * 100}%` }}
                      >
                        <span className="text-white text-xs font-medium">{data.customers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Con reserva:</span>
                      <span className="font-medium text-green-600">{data.reservations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sin reserva:</span>
                      <span className="font-medium text-orange-600">{data.walkIns}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
