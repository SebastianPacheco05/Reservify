import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Phone, Clock, Users, MessageSquare } from "lucide-react"
import { Skeleton } from "./skeleton"
import type { Reservation, Table } from "../../types/employee"

interface ReservationsProps {
  reservations?: Reservation[]
  tables?: Table[]
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  isLoading?: boolean
}

export function Reservations({
  reservations = [],
  tables = [],
  onConfirm,
  onCancel,
  isLoading = false,
}: ReservationsProps) {
  const todayReservations = reservations
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

  const getStatusActions = (reservation: Reservation) => {
    switch (reservation.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => onConfirm?.(reservation.id)}>Pasar a activa</Button>
            <Button size="sm" variant="outline" onClick={() => onCancel?.(reservation.id)}>Cancelar</Button>
          </div>
        )
      case "confirmed":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onCancel?.(reservation.id)}>Cancelar</Button>
          </div>
        )
      default:
        return null
    }
  }

  const sortedReservations = [...todayReservations].sort((a, b) => a.time.localeCompare(b.time))

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Reservas de hoy</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona todas las reservas del día</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[80px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    )
  }

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
        {sortedReservations.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No hay reservas de hoy.</p>
          </div>
        ) : (
        sortedReservations.map((reservation) => (
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
        ))
        )}
      </div>
    </div>
  )
}
