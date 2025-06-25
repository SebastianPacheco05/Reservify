import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { MonthlyFlow } from "../../types/dashboard"

interface MonthlyChartProps {
  data: MonthlyFlow[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxVisitors = Math.max(...data.map((d) => d.visitors))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flujo de Visitantes Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.month}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.visitors.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.reservations} reservas</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.visitors / maxVisitors) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
