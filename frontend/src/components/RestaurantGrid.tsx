import { Link } from "react-router-dom";
import { Star, MapPin, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import type { Restaurante } from "../types/restaurant.types";
import {
  fadeInUp,
  staggerContainer,
  transitionNormal,
} from "../lib/animations";
import { getApiEndpoint } from "../config/api";

export default function RestaurantGrid() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    fetch(getApiEndpoint("/top"), { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(
        (
          data:
            | Restaurante[]
            | {
                respuesta?: Restaurante[];
              },
        ) => {
          const list = Array.isArray(data) ? data : (data?.respuesta ?? []);
          setRestaurantes(list);
          setLoading(false);
        },
      )
      .catch((err) => {
        // No mostrar error si fue cancelado intencionalmente
        if (err.name === "AbortError") {
          return;
        }
        console.error("Error obteniendo /top:", err);
        setError(err.message || "Error al cargar restaurantes destacados");
        setRestaurantes([]);
        setLoading(false);
      });

    // Cleanup: cancelar petición si el componente se desmonta
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <section
      id="restaurantes"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-16 sm:py-20 md:py-24 px-4 sm:px-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Restaurantes Destacados
          </h3>
          <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Los favoritos de nuestra comunidad
          </p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Cargando restaurantes destacados...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">
              Error al cargar restaurantes
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center max-w-md">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && restaurantes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay restaurantes destacados disponibles en este momento.
            </p>
          </div>
        )}

        {!loading && !error && restaurantes.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {restaurantes.map((restaurant) => (
              <motion.div
                key={restaurant.nit}
                variants={fadeInUp}
                transition={transitionNormal}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 border-slate-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600 rounded-2xl h-full">
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
                        className={`${
                          restaurant.availabletoday
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
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

                    <p className="text-gray-600 dark:text-gray-300 mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 sm:line-clamp-3">
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
                        {restaurant.horario_apertura} -{" "}
                        {restaurant.horario_cierre}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span
                          className="text-sm truncate max-w-[180px] sm:max-w-none"
                          title={restaurant.direccion}
                        >
                          {restaurant.direccion}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-all duration-300"
                      >
                        {restaurant.nombre_categoria}
                      </Badge>
                    </div>

                    <Link to={`/Restaurant?nit=${restaurant.nit}`}>
                      <Button className="w-full mt-4 text-white bg-blue-600 hover:bg-emerald-600 transition-all duration-300 rounded-xl">
                        Ver disponibilidad
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
