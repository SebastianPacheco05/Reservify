import type React from "react";
import { useEffect, useState } from "react";
import { ChefHat, Utensils, Coffee, Pizza } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { transitionNormal } from "../lib/animations";
import { getApiEndpoint } from "../config/api";
import { useToast } from "../hooks/useToast";

interface CuisineType {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface CategoriaFromApi {
  id_categoria: number;
  nombre_categoria: string;
}

interface CuisineCarouselProps {
  onCategoryClick?: (categoria: string) => void;
}

const COLOR_CLASSES: string[] = [
  "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
  "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
  "bg-muted/40 text-foreground border-border/50 hover:bg-muted/60",
];

const getRandomColorClass = (): string => {
  const idx = Math.floor(Math.random() * COLOR_CLASSES.length);
  return COLOR_CLASSES[idx] ?? COLOR_CLASSES[0];
};

const getIconConfigForCategoria = (nombre: string): Pick<CuisineType, "icon" | "color"> => {
  const normalized = nombre.toLowerCase();

  if (normalized.includes("ital")) {
    return {
      icon: Pizza,
      color: getRandomColorClass(),
    };
  }
  if (normalized.includes("asia") || normalized.includes("jap") || normalized.includes("chin")) {
    return {
      icon: Utensils,
      color: getRandomColorClass(),
    };
  }
  if (normalized.includes("mex") || normalized.includes("lat") || normalized.includes("peru") || normalized.includes("arg")) {
    return {
      icon: ChefHat,
      color: getRandomColorClass(),
    };
  }
  if (normalized.includes("veg") || normalized.includes("salud")) {
    return {
      icon: Coffee,
      color: getRandomColorClass(),
    };
  }

  return {
    icon: Utensils,
    color: getRandomColorClass(),
  };
};

export default function CuisineCarousel({ onCategoryClick }: CuisineCarouselProps) {
  const { toast } = useToast();
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalSlides = cuisineTypes.length > 0 ? Math.ceil(cuisineTypes.length / 4) : 1;

  useEffect(() => {
    const loadCategorias = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(getApiEndpoint("/categorias/top?limit=20"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const list: CategoriaFromApi[] = Array.isArray(data) ? data : (data?.respuesta ?? []);

        const mapped: CuisineType[] = list.map((categoria) => {
          const cfg = getIconConfigForCategoria(categoria.nombre_categoria);
          return {
            name: categoria.nombre_categoria,
            icon: cfg.icon,
            color: cfg.color,
          };
        });

        setCuisineTypes(mapped);
        setCurrentSlide(0);
      } catch (e) {
        console.error("Error al cargar categorías para el carrusel:", e);
        toast({
          title: "Error al cargar categorías",
          description: "No se pudieron cargar los tipos de cocina. Inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategorias();
  }, [toast]);

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + totalSlides) %
        totalSlides
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index % totalSlides);
  };

  return (
    <section id="cocinas" className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20 overflow-hidden">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transitionNormal}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-foreground"
      >
        Tipos de Cocina
      </motion.h3>

      <div className="relative">
        {/* Botones de navegación */}
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 sm:left-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-background/90 hover:bg-background text-primary hover:text-primary rounded-full p-2.5 sm:p-4 shadow-xl hover:shadow-2xl transition-colors border-2 border-primary/30 dark:border-primary/40 dark:bg-muted/30"
        >
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 sm:right-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-background/90 hover:bg-background text-primary hover:text-primary rounded-full p-2.5 sm:p-4 shadow-xl hover:shadow-2xl transition-colors border-2 border-primary/30 dark:border-primary/40 dark:bg-muted/30"
        >
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>

        {/* Contenedor del carrusel */}
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${currentSlide * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "100%" }}
          >
            {cuisineTypes.length === 0 ? (
              <div className="w-full flex-shrink-0 px-4 py-8 flex items-center justify-center">
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isLoading ? "Cargando tipos de cocina..." : "No hay categorías disponibles por el momento."}
                </p>
              </div>
            ) : (
              Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-2 sm:px-4 md:px-8 min-w-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {cuisineTypes
                      .slice(slideIndex * 4, (slideIndex + 1) * 4)
                      .map((category, index) => {
                        const IconComponent = category.icon;
                        const actualIndex = slideIndex * 4 + index;
                        return (
                          <motion.div
                            key={actualIndex}
                            className="p-2"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transitionNormal, delay: index * 0.05 }}
                          >
                            <Card
                              className={`${category.color} border-2 hover:shadow-xl cursor-pointer group dark:bg-muted/30 transition-shadow rounded-2xl`}
                              onClick={() => {
                                if (onCategoryClick) {
                                  onCategoryClick(category.name);
                                }
                              }}
                            >
                              <CardContent className="p-4 sm:p-6 text-center min-w-0">
                                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="font-semibold text-sm sm:text-base md:text-lg group-hover:scale-105 transition-transform duration-300 break-words">
                                  {category.name}
                                </h4>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>

        {/* Indicadores de navegación */}
        {cuisineTypes.length > 0 && (
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: totalSlides }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-primary/30 hover:bg-primary/50 dark:bg-primary/20 dark:hover:bg-primary/30"
                }`}
                animate={{ scale: index === currentSlide ? 1.25 : 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
