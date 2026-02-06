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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Reservas de hoy</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Gestiona todas las reservas del día</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {todayReservations.filter((r) => r.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {todayReservations.filter((r) => r.status === "confirmed").length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {todayReservations.filter((r) => r.status === "arrived" || r.status === "seated").length}
            </div>
            <p className="text-sm text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {todayReservations.filter((r) => r.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {sortedReservations.map((reservation) => (
          <Card key={reservation.id} className="border-border/80 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{reservation.customerName}</h3>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{reservation.guests} personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                    {reservation.tableId && (
                      <div className="flex items-center gap-2">
                        <span>Mesa:</span>
                        <span className="font-medium text-foreground">{tables.find((t) => t.id === reservation.tableId)?.number}</span>
                      </div>
                    )}
                  </div>

                  {reservation.specialRequests && (
                    <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-border">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{reservation.specialRequests}</p>
                    </div>
                  )}

                  {reservation.arrivalTime && (
                    <div className="text-sm text-muted-foreground">Cliente llegó a las {reservation.arrivalTime}</div>
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
