import type React from "react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getApiEndpoint } from "../config/api";

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
      fetch(getApiEndpoint("/buscar_restaurante"), {
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
    <div className="search-container relative w-full max-w-4xl mx-auto mb-6 sm:mb-8 px-0 sm:px-2 min-w-0 overflow-x-hidden">
      <form onSubmit={onSearchSubmit} className="relative">
        <div className="relative group min-w-0">
          {/* Icono de búsqueda */}
          <Search className="absolute left-3 sm:left-6 top-[26px] sm:top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 sm:w-7 sm:h-7 group-hover:text-primary transition-all duration-300 z-10 pointer-events-none" />

          {/* Input principal: más grande y cómodo */}
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué tipo de cocina te apetece hoy?"
            className="w-full min-h-[3.25rem] ml-[5px] sm:min-h-[4.5rem] pl-10 sm:pl-[3.25rem] pr-4 sm:pr-[7.5rem] py-3 sm:py-4 text-base sm:text-xl md:text-2xl rounded-2xl sm:rounded-3xl border-2 border-primary/30 focus:border-primary bg-background/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-primary/20 focus:shadow-primary/30 group-hover:border-primary/50 text-foreground placeholder:text-muted-foreground placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            aria-label="Buscar restaurantes por nombre o tipo de cocina"
          />

          {/* Botón Buscar más grande */}
          <Button
            type="submit"
            className="relative mt-2 w-full sm:w-auto sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-105 shadow-lg"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCuisines.slice(0, 12).map((cuisine, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSearch(cuisine);
                      setShowSuggestions(false);
                    }}
                    className="text-left p-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3 group-hover:bg-primary transition-colors duration-200"></div>
                      <span className="font-medium text-sm text-foreground">
                        {cuisine}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {filteredCuisines.length > 12 && (
                <div className="mt-3 pt-3 border-t border-primary/20 dark:border-primary/30">
                  <p className="text-xs text-muted-foreground text-center">
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
            className="mt-4 sm:mt-5 w-full max-w-full flex flex-row flex-nowrap justify-start sm:justify-center items-center gap-2 sm:gap-4 overflow-x-auto pb-2 px-0 scrollbar-thin"
          >
          </motion.div>
        )}
      </form>
    </div>
  );
}