import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { MenuIcon as Restaurant, Users, Calendar, DollarSign } from "lucide-react"
import { restaurants, reservations, monthlyFlow } from "../../data/mockData"

export function Overview() {
  const activeRestaurants = restaurants.filter((r) => r.status === "active").length
  const totalReservations = reservations.length
  const pendingReservations = reservations.filter((r) => r.status === "pending").length
  const currentMonthRevenue = monthlyFlow[monthlyFlow.length - 1]?.revenue || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu negocio</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurantes Activos</CardTitle>
            <Restaurant className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRestaurants}</div>
            <p className="text-xs text-muted-foreground">de {restaurants.length} totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">{pendingReservations} pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes del Mes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyFlow[monthlyFlow.length - 1]?.visitors || 0}</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{currentMonthRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservas recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.slice(0, 5).map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{reservation.customerName}</h4>
                    <Badge
                      variant={
                        reservation.status === "confirmed"
                          ? "default"
                          : reservation.status === "pending"
                            ? "secondary"
                            : reservation.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reservation.restaurantName}</p>
                  <p className="text-sm text-gray-500">
                    {reservation.date} a las {reservation.time} - {reservation.guests} personas
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
