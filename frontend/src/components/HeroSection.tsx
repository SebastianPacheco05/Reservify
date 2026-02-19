import type React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  filteredCuisines: string[];
  onSearch: (cuisine: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onUseMyLocation?: () => void;
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  onSearch,
  onSearchSubmit,
  onUseMyLocation,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] sm:min-h-screen flex flex-col justify-center pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-accent/20 dark:from-primary/10 dark:via-transparent dark:to-accent/10">
      {/* Fondo de estrellas: contenido decorativo, no bloquea LCP */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`star-bg star-${i + 1}`}
            style={{ animationDuration: `${2.5 + (i % 3) * 0.8}s` }}
          />
        ))}
      </div>

      {/* Sin motion en el contenedor para LCP inmediato; contenido visible desde el primer frame */}
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full space-y-8 sm:space-y-12 md:space-y-16 min-w-0">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight break-words">
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Reserva en tu restaurante favorito
            </span>
          </h2>
        </div>

        <p
          id="buscar"
          className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-0 sm:px-2"
        >
          Desde comida gourmet hasta cocina casera, encuentra el lugar ideal
          para cada ocasión
        </p>

        <div className="flex justify-center">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={onSearch}
            onSearchSubmit={onSearchSubmit}
          />
        </div>

        <div className="flex justify-center w-full min-h-[2.5rem]">
          <motion.button
            type="button"
            onClick={onUseMyLocation}
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors border-0 bg-transparent p-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Ver restaurantes cerca de mi ubicación actual"
          >
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-medium">Usar mi ubicación actual</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
