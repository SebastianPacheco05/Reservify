import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { monthlyFlow } from "../../data/mockData"

export function Analytics() {
  const maxVisitors = Math.max(...monthlyFlow.map((m) => m.visitors))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análisis</h1>
        <p className="text-gray-600">Flujo de personas y métricas mensuales</p>
      </div>

      {/* Gráfico de barras simple */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo de Visitantes Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyFlow.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{data.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(data.visitors / maxVisitors) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{data.visitors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Visitantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {monthlyFlow.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyFlow.reduce((acc, curr) => acc + curr.reservations, 0)}</div>
            <p className="text-sm text-gray-600">Últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${monthlyFlow.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Últimos 6 meses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
