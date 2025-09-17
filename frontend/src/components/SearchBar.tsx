import type React from "react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  filteredCuisines: string[];
  onSearch: (cuisine: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  filteredCuisines,
  onSearch,
  onSearchSubmit,
}: SearchBarProps) {
  // Cerrar sugerencias cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  return (
    <div className="search-container relative max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
      <form onSubmit={onSearchSubmit} className="relative">
        <div className="relative group">
          {/* Icono de búsqueda con animación */}
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110 z-10" />

          {/* Input principal con efectos mejorados */}
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué tipo de cocina te apetece hoy?"
            className="pl-16 pr-20 py-8 text-xl rounded-3xl border-3 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 focus:shadow-blue-300/50 focus:scale-105 group-hover:border-blue-300 dark:text-white dark:placeholder-gray-400"
          />

          {/* Botón de búsqueda mejorado */}
          <Button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-2 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-300/50"
          >
            Buscar
          </Button>
        </div>

        {/* Sugerencias de búsqueda */}
        {showSuggestions && filteredCuisines.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-600 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top duration-300">
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCuisines.slice(0, 12).map((cuisine, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onSearch(cuisine)}
                    className="text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors duration-200"></div>
                      <span className="font-medium text-sm dark:text-gray-200">
                        {cuisine}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {filteredCuisines.length > 12 && (
                <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Y {filteredCuisines.length - 12} más...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sugerencias rápidas cuando no hay búsqueda */}
        {!showSuggestions && searchQuery === "" && (
          <div className="absolute top-full left-0 right-0 mt-4 flex flex-wrap justify-center gap-3 animate-in fade-in duration-500 delay-300">
            {["Italiana", "Japonesa", "Mexicana", "Mediterránea"].map(
              (cuisine, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSearch(cuisine)}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {cuisine}
                </button>
              )
            )}
          </div>
        )}
      </form>
    </div>
  );
}
