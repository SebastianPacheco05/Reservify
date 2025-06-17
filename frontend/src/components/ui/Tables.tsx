import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Users, Clock, MapPin } from "lucide-react"
import { tables } from "../../data/employeeData"
import { cn } from "../../lib/utils"

export function Tables() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-300 text-green-800"
      case "occupied":
        return "bg-red-100 border-red-300 text-red-800"
      case "reserved":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "cleaning":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "out_of_service":
        return "bg-gray-100 border-gray-300 text-gray-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
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

  const getStatusActions = (table: any) => {
    switch (table.status) {
      case "available":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Asignar
            </Button>
            <Button size="sm" variant="outline">
              Reservar
            </Button>
          </div>
        )
      case "occupied":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Ver Cuenta
            </Button>
            <Button size="sm" variant="outline">
              Liberar
            </Button>
          </div>
        )
      case "reserved":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Cliente Llegó
            </Button>
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </div>
        )
      case "cleaning":
        return (
          <Button size="sm" variant="outline">
            Marcar Limpia
          </Button>
        )
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
    {} as Record<string, typeof tables>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600">Estado actual de todas las mesas</p>
        </div>

        {/* Leyenda de estados */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-100 text-green-800 border-green-300">Disponible</Badge>
          <Badge className="bg-red-100 text-red-800 border-red-300">Ocupada</Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">Reservada</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Limpieza</Badge>
        </div>
      </div>

      {/* Mesas agrupadas por sección */}
      {Object.entries(groupedTables).map(([section, sectionTables]) => (
        <div key={section}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {section}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionTables.map((table) => (
              <Card key={table.id} className={cn("transition-all duration-200", getStatusColor(table.status))}>
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
                    <div className="bg-white/50 p-3 rounded border">
                      <p className="font-medium text-sm">{table.currentReservation.customerName}</p>
                      <p className="text-xs text-gray-600">
                        {table.currentReservation.time} - {table.currentReservation.guests} personas
                      </p>
                      {table.currentReservation.specialRequests && (
                        <p className="text-xs text-gray-500 mt-1 italic">{table.currentReservation.specialRequests}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2">{getStatusActions(table)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
