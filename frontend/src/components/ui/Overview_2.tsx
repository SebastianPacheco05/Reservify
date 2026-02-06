import { Card, CardContent, CardHeader, CardTitle } from "../ui/card" 
import { Badge } from "../ui/badge"
import { Users, Calendar, Clock, DollarSign, Grid3X3 } from "lucide-react"
import { restaurant, tables, todayReservations, bills } from "../../data/employeeData" 

export function Overview() {
  const availableTables = tables.filter((t) => t.status === "available").length
  const occupiedTables = tables.filter((t) => t.status === "occupied").length
  const pendingReservations = todayReservations.filter((r) => r.status === "pending" || r.status === "confirmed").length
  const totalBills = bills.reduce((acc, bill) => acc + bill.total, 0)
  const currentTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-8">
      {/* Header del restaurante */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full md:w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{restaurant.name}</h2>
            <p className="text-muted-foreground mt-1">{restaurant.address}</p>
            <p className="text-muted-foreground">{restaurant.phone}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge variant="secondary">Horario: {restaurant.openTime} - {restaurant.closeTime}</Badge>
              <Badge variant="default">Hora actual: {currentTime}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mesas disponibles</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Grid3X3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{availableTables}</div>
            <p className="text-xs text-muted-foreground">de {tables.length} totales</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mesas ocupadas</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{occupiedTables}</div>
            <p className="text-xs text-muted-foreground">actualmente</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas pendientes</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{pendingReservations}</div>
            <p className="text-xs text-muted-foreground">para hoy</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas del día</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">€{totalBills.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">hasta ahora</p>
          </CardContent>
        </Card>
      </div>

      {/* Próximas reservas */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Próximas reservas</CardTitle>
          <p className="text-sm text-muted-foreground">Reservas de hoy confirmadas o pendientes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayReservations
              .filter((r) => r.status === "pending" || r.status === "confirmed")
              .slice(0, 3)
              .map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-foreground">{reservation.customerName}</h4>
                      <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                        {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {reservation.time} - {reservation.guests} personas
                      {reservation.tableId && ` - Mesa ${tables.find((t) => t.id === reservation.tableId)?.number}`}
                    </p>
                    {reservation.specialRequests && (
                      <p className="text-sm text-muted-foreground italic mt-0.5">{reservation.specialRequests}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{reservation.estimatedDuration} min</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
