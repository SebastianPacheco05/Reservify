import type React from "react";
import { useState } from "react";
import { ChefHat, Utensils, Coffee, Pizza } from "lucide-react";
import { Card, CardContent } from "./ui/card";

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
    <section id="cocinas" className="max-w-7xl mx-auto px-4 py-16">
      <h3 className="text-3xl font-bold mb-12 text-center text-black dark:text-white animate-in fade-in slide-in-from-bottom duration-800">
        Tipos de Cocina
      </h3>

      <div className="relative">
        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-300"
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
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-300"
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
        </button>

        {/* Contenedor del carrusel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
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
                          <div key={actualIndex} className="p-2">
                            <Card
                              className={`${category.color} border-4 hover:shadow-xl cursor-pointer group dark:bg-gray-400/20 transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom duration-800`}
                              style={{
                                animationDelay: `${actualIndex * 150}ms`,
                              }}
                            >
                              <CardContent className="p-6 text-center">
                                <IconComponent className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="font-semibold text-lg group-hover:scale-105 transition-transform duration-300">
                                  {category.name}
                                </h4>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Indicadores de navegación */}
        <div className="flex justify-center mt-12 space-x-3">
          {Array.from(
            { length: Math.ceil(cuisineTypes.length / 4) },
            (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-blue-600 scale-125"
                    : "bg-blue-300 hover:bg-blue-400"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
