import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { MapPin, Settings, Star, Users } from "lucide-react";
import type { Restaurant } from "@/types/dashboard";

interface RestaurantsGridProps {
  restaurants: Restaurant[];
}

export function RestaurantsGrid({ restaurants }: RestaurantsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {restaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          className="overflow-hidden border-border/80 bg-card shadow-sm transition-all hover:shadow-md"
        >
          <div className="aspect-[2/1] relative bg-muted">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-3 right-3 ${
                restaurant.status === "active"
                  ? "bg-emerald-500/90 text-white border-0 hover:bg-emerald-600"
                  : "bg-muted-foreground/80 text-white border-0"
              }`}
            >
              {restaurant.status === "active" ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <span className="truncate">{restaurant.name}</span>
              <span className="flex items-center gap-1 shrink-0 text-muted-foreground font-normal">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {restaurant.rating}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                {restaurant.totalTables} mesas
              </div>
              <Badge variant="secondary" className="font-normal">
                {restaurant.cuisine}
              </Badge>
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" className="flex-1">
                Ver reservas
              </Button>
              <Button size="sm" variant="outline" aria-label="Configuración">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
