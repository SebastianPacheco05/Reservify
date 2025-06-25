import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Star, MapPin, Users, Settings } from "lucide-react"
import type { Restaurant } from "../../types/dashboard"

interface RestaurantsGridProps {
  restaurants: Restaurant[]
}

export function RestaurantsGrid({ restaurants }: RestaurantsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${
                restaurant.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {restaurant.status === "active" ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{restaurant.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{restaurant.rating}</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {restaurant.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {restaurant.totalTables} mesas disponibles
              </div>
              <Badge variant="outline">{restaurant.cuisine}</Badge>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Ver Reservas
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
