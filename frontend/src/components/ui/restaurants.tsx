import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { Phone, MapPin, Users } from "lucide-react"
import { restaurants } from "../../data/mockData"

export function Restaurants() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurantes</h1>
          <p className="text-gray-600">Gestiona tus restaurantes</p>
        </div>
        <Button>Agregar Restaurante</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <Badge
                className="absolute top-2 right-2"
                variant={restaurant.status === "active" ? "default" : "secondary"}
              >
                {restaurant.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-xl">{restaurant.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.address}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{restaurant.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Capacidad: {restaurant.capacity} personas</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Reservas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

