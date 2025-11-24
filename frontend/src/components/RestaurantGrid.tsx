import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import type { Restaurante } from "../types/restaurant.types";


export default function RestaurantGrid() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);

  useEffect(() => {
    fetch("http://10.5.213.111:8001/top")
      .then((res) => res.json())
      .then((data: Restaurante[]) => setRestaurantes(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section
      id="restaurantes"
      className="bg-white dark:bg-gray-900 py-20 px-4 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-black dark:text-white mb-4">
            Restaurantes Destacados
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Los favoritos de nuestra comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurantes.map((restaurant) => (
            <Card
              key={restaurant.nit}
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600"
            >
              <div className="relative">
                <img
                  src={restaurant.url_image}
                  alt={restaurant.nombre_restaurante}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      restaurant.availabletoday ? "default" : "secondary"
                    }
                    className={`${restaurant.availabletoday
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                      } transition-all duration-300 group-hover:scale-105`}
                  >
                    {restaurant.availabletoday
                      ? "Disponible hoy"
                      : "Reservar mañana"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {restaurant.nombre_restaurante}
                  </h4>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {restaurant.priceRange ?? "$$"}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {restaurant.descripcion_restaurante ?? "Sin descripción"}
                </p>

                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-blue-500 fill-current group-hover:scale-110 transition-transform duration-300" />
                  <span className="ml-1 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {restaurant.rating}
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    ({restaurant.reviews} reseñas)
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {restaurant.horario_apertura} - {restaurant.horario_cierre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{restaurant.direccion}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-all duration-300"
                  >
                    {restaurant.nombre_categoria}
                  </Badge>
                </div>

                <Link to={`/Restaurant?nit=${restaurant.nit}`}>
                  <Button className="w-full mt-4 text-white bg-blue-600 hover:bg-green-600 transition-all duration-300 hover:scale-105 transform">
                    Ver disponibilidad
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
