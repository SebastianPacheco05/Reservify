import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Phone, Clock, Users, MessageSquare } from "lucide-react"
import { todayReservations, tables } from "../../data/employeeData"

export function Reservations() {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pendiente" },
      confirmed: { variant: "default" as const, label: "Confirmada" },
      arrived: { variant: "outline" as const, label: "Cliente Llegó" },
      seated: { variant: "default" as const, label: "Sentado" },
      completed: { variant: "outline" as const, label: "Completada" },
      cancelled: { variant: "destructive" as const, label: "Cancelada" },
      no_show: { variant: "destructive" as const, label: "No Apareció" },
    }

    const config = variants[status as keyof typeof variants] || { variant: "outline" as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusActions = (reservation: any) => {
    switch (reservation.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Confirmar
            </Button>
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </div>
        )
      case "confirmed":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Cliente Llegó
            </Button>
            <Button size="sm" variant="outline">
              Llamar
            </Button>
          </div>
        )
      case "arrived":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Sentar
            </Button>
            <Button size="sm" variant="outline">
              Asignar Mesa
            </Button>
          </div>
        )
      case "seated":
        return (
          <Button size="sm" variant="outline">
            Ver Mesa
          </Button>
        )
      default:
        return null
    }
  }

  const sortedReservations = [...todayReservations].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reservas de Hoy</h1>
        <p className="text-gray-600">Gestiona todas las reservas del día</p>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {todayReservations.filter((r) => r.status === "pending").length}
            </div>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {todayReservations.filter((r) => r.status === "confirmed").length}
            </div>
            <p className="text-sm text-gray-600">Confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {todayReservations.filter((r) => r.status === "arrived" || r.status === "seated").length}
            </div>
            <p className="text-sm text-gray-600">En Proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {todayReservations.filter((r) => r.status === "completed").length}
            </div>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        {sortedReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{reservation.guests} personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                    {reservation.tableId && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Mesa:</span>
                        <span className="font-medium">{tables.find((t) => t.id === reservation.tableId)?.number}</span>
                      </div>
                    )}
                  </div>

                  {reservation.specialRequests && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p className="text-sm text-blue-700">{reservation.specialRequests}</p>
                    </div>
                  )}

                  {reservation.arrivalTime && (
                    <div className="text-sm text-green-600">Cliente llegó a las {reservation.arrivalTime}</div>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-2">{getStatusActions(reservation)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
