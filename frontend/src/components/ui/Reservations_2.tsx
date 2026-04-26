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
          <div className="flex items-center gap-2 flex-nowrap">
            <Button size="sm" variant="default" onClick={() => onConfirm?.(reservation.id)}>Pasar a activa</Button>
            <Button size="sm" variant="outline" onClick={() => onCancel?.(reservation.id)}>Cancelar</Button>
          </div>
        )
      case "confirmed":
        return (
          <div className="flex items-center gap-2 flex-nowrap">
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
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="min-w-0 lg:w-[16%] lg:shrink-0">
                  <h3 className="text-lg font-semibold text-foreground truncate lg:whitespace-nowrap">{reservation.customerName}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground lg:w-[10%] lg:shrink-0">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground lg:w-[11%] lg:shrink-0">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{reservation.guests} personas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground lg:w-[13%] lg:shrink-0">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{reservation.customerPhone}</span>
                </div>
                <div className="text-sm text-muted-foreground lg:w-[7%] lg:shrink-0">
                  {reservation.tableId ? (
                    <>
                      <span>Mesa: </span>
                      <span className="font-medium text-foreground">{tables.find((t) => t.id === reservation.tableId)?.number}</span>
                    </>
                  ) : (
                    <span>Mesa: —</span>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:ml-auto lg:flex-1 lg:min-w-0 lg:justify-end lg:flex-nowrap">
                  {getStatusBadge(reservation.status)}
                  {getStatusActions(reservation)}
                </div>

                {reservation.specialRequests && (
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-border lg:basis-full">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{reservation.specialRequests}</p>
                  </div>
                )}

                {reservation.arrivalTime && (
                  <div className="text-sm text-muted-foreground lg:basis-full">
                    Cliente llegó a las {reservation.arrivalTime}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>
    </div>
  )
}
