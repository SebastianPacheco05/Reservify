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
    <div className="space-y-6">
      {/* Header del restaurante */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full md:w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600 mt-1">{restaurant.address}</p>
            <p className="text-gray-600">{restaurant.phone}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">
                Horario: {restaurant.openTime} - {restaurant.closeTime}
              </Badge>
              <Badge variant="default">Hora actual: {currentTime}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Disponibles</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableTables}</div>
            <p className="text-xs text-muted-foreground">de {tables.length} totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedTables}</div>
            <p className="text-xs text-muted-foreground">actualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingReservations}</div>
            <p className="text-xs text-muted-foreground">para hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalBills.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">hasta ahora</p>
          </CardContent>
        </Card>
      </div>

      {/* Próximas reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayReservations
              .filter((r) => r.status === "pending" || r.status === "confirmed")
              .slice(0, 3)
              .map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{reservation.customerName}</h4>
                      <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                        {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {reservation.time} - {reservation.guests} personas
                      {reservation.tableId && ` - Mesa ${tables.find((t) => t.id === reservation.tableId)?.number}`}
                    </p>
                    {reservation.specialRequests && (
                      <p className="text-sm text-gray-500 italic">{reservation.specialRequests}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{reservation.estimatedDuration}min</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
