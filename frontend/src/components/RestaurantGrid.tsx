import { Link } from "react-router-dom";
import { Star, MapPin, Loader2, AlertCircle, Search } from "lucide-react";
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

interface RestaurantGridProps {
  searchQuery?: string;
}

export default function RestaurantGrid({ searchQuery }: RestaurantGridProps) {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [filteredRestaurantes, setFilteredRestaurantes] =
    useState<Restaurante[]>([]);
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
          setFilteredRestaurantes(list);
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

  // Normalizar texto para comparación (minúsculas, sin tildes)
  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Filtrar restaurantes según el término de búsqueda usando palabras aproximadas
  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) {
      setFilteredRestaurantes(restaurantes);
      return;
    }

    const normalizedTerm = normalizeText(searchQuery);
    const terms = normalizedTerm
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const filtrados = restaurantes.filter((restaurant) => {
      const nombre = normalizeText(restaurant.nombre_restaurante ?? "");
      const categoria = normalizeText(restaurant.nombre_categoria ?? "");
      const descripcion = normalizeText(
        restaurant.descripcion_restaurante ?? "",
      );

      const combined = `${nombre} ${categoria} ${descripcion}`;

      // Cada palabra que escribe el usuario debe aparecer en alguna parte del contenido combinado
      return terms.every((t) => combined.includes(t));
    });

    setFilteredRestaurantes(filtrados);
  }, [searchQuery, restaurantes]);

  return (
    <section
      id="restaurantes"
      className="bg-background/80 backdrop-blur-sm py-16 sm:py-20 md:py-24 px-4 sm:px-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Restaurantes Destacados
          </h3>
          <div className="flex flex-col items-center gap-2">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Los favoritos de nuestra comunidad
            </p>
            {searchQuery && searchQuery.trim() && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/30">
                <Search className="w-4 h-4" />
                <span>
                  Resultados para:{" "}
                  <span className="font-semibold">
                    {searchQuery}
                  </span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              Cargando restaurantes destacados...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">
              Error al cargar restaurantes
            </p>
            <p className="text-muted-foreground text-sm text-center max-w-md">
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

        {!loading && !error && filteredRestaurantes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-lg">
              No encontramos restaurantes que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {!loading && !error && filteredRestaurantes.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {filteredRestaurantes.map((restaurant) => (
              <motion.div
                key={restaurant.restaurante_uid}
                variants={fadeInUp}
                transition={transitionNormal}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 border-border hover:border-primary rounded-2xl h-full">
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
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
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
                      <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {restaurant.nombre_restaurante}
                      </h4>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {restaurant.priceRange ?? "$$"}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-3 group-hover:text-foreground transition-colors duration-300 line-clamp-2 sm:line-clamp-3">
                      {restaurant.descripcion_restaurante ?? "Sin descripción"}
                    </p>

                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-primary fill-current group-hover:scale-110 transition-transform duration-300" />
                      <span className="ml-1 font-medium group-hover:text-primary transition-colors duration-300">
                        {restaurant.rating}
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        ({restaurant.reviews} reseñas)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {restaurant.horario_apertura} -{" "}
                        {restaurant.horario_cierre}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
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
                        className="border-primary/50 text-primary group-hover:border-primary group-hover:text-primary transition-all duration-300"
                      >
                        {restaurant.nombre_categoria}
                      </Badge>
                    </div>

                    <Link to={`/Restaurant?uid=${restaurant.restaurante_uid}`}>
                      <Button className="w-full mt-4 text-primary-foreground bg-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-xl">
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
