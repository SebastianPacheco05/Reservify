import type React from "react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  onSearch: (cuisine: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  onSearch,
  onSearchSubmit,
}: SearchBarProps) {
  // Estado local para las sugerencias filtradas
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);

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

  // Efecto para buscar restaurantes cuando cambia la query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCuisines([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/buscar_restaurante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_restaurante: searchQuery }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          const results = (data.respuesta ?? []).map(
            (r: { nombre_restaurante: string }) => r.nombre_restaurante
          );
          setFilteredCuisines(results);
          setShowSuggestions(results.length > 0);
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    }, 250); // debounce 250ms

    return () => {
      clearTimeout(timer);
      controller.abort();
      console.log("Abortado");
    };
  }, [searchQuery, setShowSuggestions]);

  return (
    <div className="search-container relative w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={onSearchSubmit} className="relative">
        <div className="relative group">
          {/* Icono de búsqueda */}
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-400 w-7 h-7 group-hover:text-blue-600 transition-all duration-300 z-10 pointer-events-none" />

          {/* Input principal: más grande y cómodo */}
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué tipo de cocina te apetece hoy?"
            className="w-full min-h-[4.5rem] pl-[3.25rem] pr-[6.5rem] py-4 text-xl sm:text-2xl rounded-3xl border-2 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-blue-200/30 focus:shadow-blue-300/40 group-hover:border-blue-300 dark:text-white dark:placeholder-gray-400 placeholder:text-base sm:placeholder:text-lg"
          />

          {/* Botón Buscar más grande */}
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Buscar
          </Button>
        </div>

        {/* Sugerencias de búsqueda */}
        {showSuggestions && filteredCuisines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto z-50"
          >
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
          </motion.div>
        )}

        {/* Botones de cocina rápida: siempre en fila */}
        {!showSuggestions && searchQuery === "" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-full left-0 right-0 mt-5 flex flex-row flex-nowrap justify-center items-center gap-3 sm:gap-4 overflow-x-auto pb-1"
          >
            {["Italiana", "Japonesa", "Mexicana", "Mediterránea"].map(
              (cuisine, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSearch(cuisine)}
                  className="shrink-0 px-5 py-3 sm:px-6 sm:py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 whitespace-nowrap"
                >
                  {cuisine}
                </button>
              )
            )}
          </motion.div>
        )}
      </form>
    </div>
  );
}