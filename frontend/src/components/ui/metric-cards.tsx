import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { MenuIcon as Restaurant, Calendar, DollarSign } from "lucide-react"

interface MetricCardsProps {
  totalRestaurants: number
  totalReservations: number
  monthlyRevenue: number
}

export function MetricCards({
  totalRestaurants,
  totalReservations,
  monthlyRevenue,
}: MetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Restaurantes</CardTitle>
          <Restaurant className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRestaurants}</div>
          {/* <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReservations}</div>
          {/* <p className="text-xs text-muted-foreground">+12% desde la semana pasada</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
          {/* <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p> */}
        </CardContent>
      </Card>
    </div>
  )
}
