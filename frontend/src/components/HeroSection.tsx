import type React from "react";
import { MapPin } from "lucide-react";
import SearchBar from "./SearchBar";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  filteredCuisines: string[];
  onSearch: (cuisine: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  filteredCuisines,
  onSearch,
  onSearchSubmit,
}: HeroSectionProps) {
  return (
    <section className="pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
            <span className="text-blue-500 dark:text-blue-400">
              Reserva en tu restaurante favorito
            </span>
          </h2>

          {/* Brillos alrededor del título */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Brillo superior izquierdo */}
            <div className="sparkle-1 absolute -top-4 -left-8 w-4 h-4">
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-blue-500 rounded-full shadow-lg shadow-blue-300/50"></div>
            </div>

            {/* Brillo superior derecho */}
            <div className="sparkle-2 absolute -top-6 -right-12 w-3 h-3">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-500 rounded-full shadow-lg shadow-green-300/50"></div>
            </div>

            {/* Brillo inferior izquierdo */}
            <div className="sparkle-3 absolute -bottom-2 -left-4 w-2 h-2">
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-blue-600 rounded-full shadow-lg shadow-blue-400/50"></div>
            </div>

            {/* Brillo inferior derecho */}
            <div className="sparkle-4 absolute -bottom-4 -right-6 w-3 h-3">
              <div className="w-full h-full bg-gradient-to-br from-blue-300 to-green-400 rounded-full shadow-lg shadow-blue-300/50"></div>
            </div>

            {/* Brillo medio izquierdo */}
            <div className="sparkle-5 absolute top-1/2 -left-2 w-2 h-2">
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-blue-700 rounded-full shadow-lg shadow-yellow-400/50"></div>
            </div>

            {/* Brillo medio derecho */}
            <div className="sparkle-6 absolute top-1/3 -right-4 w-2 h-2">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-600 rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>

            {/* Brillo superior central */}
            <div className="sparkle-7 absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2">
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-blue-400 rounded-full shadow-lg shadow-yellow-300/50"></div>
            </div>

            {/* Brillo inferior central */}
            <div className="sparkle-8 absolute -bottom-1 left-1/4 w-2 h-2">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-500 rounded-full shadow-lg shadow-blue-400/50"></div>
            </div>
          </div>
        </div>

        <p
          id="buscar"
          className="text-xl text-black dark:text-gray-200 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-300"
        >
          Desde comida gourmet hasta cocina casera, encuentra el lugar ideal
          para cada ocasión
        </p>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          // filteredCuisines={filteredCuisines}
          onSearch={onSearch}
          onSearchSubmit={onSearchSubmit}
        />

        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all hover:scale-105 animate-in fade-in duration-100 delay-400 mt-30">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Usar mi ubicación actual</span>
        </div>
      </div>
    </section>
  );
}
