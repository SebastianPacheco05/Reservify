import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Users, Clock, MapPin } from "lucide-react"
import { cn } from "../../lib/utils"
import { Skeleton } from "./skeleton"
import type { Table } from "../../types/employee"

interface TablesProps {
  tables?: Table[]
  isLoading?: boolean
  readOnly?: boolean
}

export function Tables({ tables = [], isLoading = false, readOnly = false }: TablesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-primary/10 border-primary/30 text-primary"
      case "occupied":
        return "bg-destructive/10 border-destructive/30 text-destructive"
      case "reserved":
        return "bg-secondary/10 border-secondary/30 text-secondary"
      case "cleaning":
        return "bg-accent/20 border-accent/30 text-accent-foreground"
      case "out_of_service":
        return "bg-muted border-border text-muted-foreground"
      default:
        return "bg-muted border-border text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupada"
      case "reserved":
        return "Reservada"
      case "cleaning":
        return "Limpieza"
      case "out_of_service":
        return "Fuera de Servicio"
      default:
        return status
    }
  }

  const getStatusActions = (table: Table) => {
    if (readOnly) return null
    switch (table.status) {
      case "available":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>Asignar</Button>
            <Button size="sm" variant="outline" disabled>Reservar</Button>
          </div>
        )
      case "occupied":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>Ver Cuenta</Button>
            <Button size="sm" variant="outline" disabled>Liberar</Button>
          </div>
        )
      case "reserved":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default" disabled>Cliente Llegó</Button>
            <Button size="sm" variant="outline" disabled>Cancelar</Button>
          </div>
        )
      case "cleaning":
        return <Button size="sm" variant="outline" disabled>Marcar Limpia</Button>
      default:
        return null
    }
  }

  const groupedTables = tables.reduce(
    (acc, table) => {
      if (!acc[table.section]) {
        acc[table.section] = []
      }
      acc[table.section].push(table)
      return acc
    },
    {} as Record<string, Table[]>,
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Estado de mesas</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Estado actual de todas las mesas</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Disponible</Badge>
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">Ocupada</Badge>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">Reservada</Badge>
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0">Limpieza</Badge>
        </div>
      </div>

      {/* Mesas agrupadas por sección */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
      ) : Object.keys(groupedTables).length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No hay mesas cargadas.</p>
        </div>
      ) : (
      Object.entries(groupedTables).map(([section, sectionTables]) => (
        <div key={section}>
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {section}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionTables.map((table) => (
              <Card key={table.id} className={cn("border-border/80 bg-card shadow-sm transition-all duration-200", getStatusColor(table.status))}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                    <Badge variant="outline" className="bg-white">
                      {getStatusLabel(table.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{table.seats} asientos</span>
                  </div>

                  {table.estimatedFreeTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Libre aprox: {table.estimatedFreeTime}</span>
                    </div>
                  )}

                  {table.currentReservation && (
                    <div className="bg-muted/50 p-3 rounded-lg border border-border">
                      <p className="font-medium text-sm text-foreground">{table.currentReservation.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {table.currentReservation.time} - {table.currentReservation.guests} personas
                      </p>
                      {table.currentReservation.specialRequests && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{table.currentReservation.specialRequests}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2">{getStatusActions(table)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))
      )}
    </div>
  )
}
