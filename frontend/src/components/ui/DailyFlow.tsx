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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Flujo diario</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Análisis de clientes por hora</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground">Total clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalCustomers}</div>
            <p className="text-sm text-muted-foreground">Hasta ahora</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground">Con reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalReservations}</div>
            <p className="text-sm text-muted-foreground">
              {totalCustomers ? ((totalReservations / totalCustomers) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground">Sin reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalWalkIns}</div>
            <p className="text-sm text-muted-foreground">{totalCustomers ? ((totalWalkIns / totalCustomers) * 100).toFixed(1) : 0}% del total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Flujo por horas</CardTitle>
          <p className="text-sm text-muted-foreground">Clientes y reservas por franja</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyFlow.map((data) => {
              const isCurrentHour = Number.parseInt(data.hour.split(":")[0]) === currentHour
              return (
                <div
                  key={data.hour}
                  className={`p-4 rounded-lg border ${isCurrentHour ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{data.hour}</span>
                      {isCurrentHour && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Ahora</span>}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{data.customers}</div>
                      <div className="text-sm text-muted-foreground">clientes</div>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-3">
                    <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-primary h-full flex items-center justify-end pr-2 transition-all duration-500 min-w-[2rem]"
                        style={{ width: `${(data.customers / maxCustomers) * 100}%` }}
                      >
                        <span className="text-primary-foreground text-xs font-medium">{data.customers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Con reserva:</span>
                      <span className="font-medium text-foreground">{data.reservations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sin reserva:</span>
                      <span className="font-medium text-foreground">{data.walkIns}</span>
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
