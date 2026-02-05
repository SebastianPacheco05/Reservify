import type React from "react";
import { useState } from "react";
import { ChefHat, Utensils, Coffee, Pizza } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { fadeInUp, transitionNormal } from "../lib/animations";

interface CuisineType {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

const cuisineTypes: CuisineType[] = [
  {
    name: "Italiana",
    icon: Pizza,
    color: "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100",
  },
  {
    name: "Asiática",
    icon: Utensils,
    color: "bg-green-50 text-green-600 border-green-300 hover:bg-green-100",
  },
  {
    name: "Japonesa",
    icon: Utensils,
    color: "bg-yellow-50 text-yellow-600 border-yellow-300 hover:bg-yellow-100",
  },
  {
    name: "Mexicana",
    icon: ChefHat,
    color: "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100",
  },
  {
    name: "Vegetariana",
    icon: Coffee,
    color: "bg-green-50 text-green-700 border-green-300 hover:bg-green-100",
  },
  {
    name: "China",
    icon: ChefHat,
    color: "bg-yellow-50 text-yellow-800 border-yellow-400 hover:bg-yellow-100",
  },
  {
    name: "India",
    icon: Utensils,
    color: "bg-blue-50 text-blue-800 border-blue-400 hover:bg-blue-100",
  },
  {
    name: "Francesa",
    icon: ChefHat,
    color: "bg-green-50 text-green-600 border-green-300 hover:bg-green-100",
  },
  {
    name: "Española",
    icon: Pizza,
    color: "bg-yellow-50 text-yellow-600 border-yellow-300 hover:bg-yellow-100",
  },
  {
    name: "Tailandesa",
    icon: Utensils,
    color: "bg-blue-50 text-blue-900 border-blue-500 hover:bg-blue-100",
  },
  {
    name: "Vietnamita",
    icon: ChefHat,
    color: "bg-green-50 text-green-600 border-green-300 hover:bg-green-100",
  },
  {
    name: "Coreana",
    icon: Utensils,
    color: "bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100",
  },
  {
    name: "Griega",
    icon: Pizza,
    color: "bg-blue-50 text-blue-800 border-blue-500 hover:bg-blue-100",
  },
  {
    name: "Turca",
    icon: ChefHat,
    color: "bg-green-50 text-green-700 border-green-400 hover:bg-green-100",
  },
  {
    name: "Libanesa",
    icon: Utensils,
    color: "bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100",
  },
  {
    name: "Peruana",
    icon: ChefHat,
    color: "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100",
  },
  {
    name: "Argentina",
    icon: Pizza,
    color: "bg-green-50 text-green-600 border-green-300 hover:bg-green-100",
  },
];

export default function CuisineCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(cuisineTypes.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(cuisineTypes.length / 4)) %
        Math.ceil(cuisineTypes.length / 4)
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="cocinas" className="max-w-7xl mx-auto px-4 py-20">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transitionNormal}
        className="text-3xl md:text-4xl font-bold mb-12 text-center text-black dark:text-white"
      >
        Tipos de Cocina
      </motion.h3>

      <div className="relative">
        {/* Botones de navegación */}
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-colors border-2 border-blue-300 dark:border-blue-600 dark:bg-gray-800/90"
        >
          <svg
            className="w-7 h-7"
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
          className="absolute right-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-colors border-2 border-blue-300 dark:border-blue-600 dark:bg-gray-800/90"
        >
          <svg
            className="w-7 h-7"
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
            {Array.from(
              { length: Math.ceil(cuisineTypes.length / 4) },
              (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                              className={`${category.color} border-2 hover:shadow-xl cursor-pointer group dark:bg-gray-400/20 transition-shadow rounded-2xl`}
                            >
                              <CardContent className="p-6 text-center">
                                <IconComponent className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="font-semibold text-lg group-hover:scale-105 transition-transform duration-300">
                                  {category.name}
                                </h4>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* Indicadores de navegación */}
        <div className="flex justify-center mt-12 space-x-3">
          {Array.from(
            { length: Math.ceil(cuisineTypes.length / 4) },
            (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-blue-600"
                    : "bg-blue-300 hover:bg-blue-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
                animate={{ scale: index === currentSlide ? 1.25 : 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
