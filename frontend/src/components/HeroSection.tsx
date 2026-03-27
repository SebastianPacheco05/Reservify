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
      <div className="relative z-10 max-w-7xl mx-auto w-full min-w-0">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8 md:space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight break-words">
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Reserva tu mesa sin complicaciones
              </span>
            </h2>

            <p
              id="buscar"
              className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed px-0 sm:px-2"
            >
              Elige una cocina, encuentra el restaurante ideal y confirma tu reserva en minutos.
            </p>

            <div className="flex justify-center lg:justify-start">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                onSearch={onSearch}
                onSearchSubmit={onSearchSubmit}
              />
            </div>

            <div className="flex justify-center lg:justify-start w-full">
              <motion.button
                type="button"
                onClick={onUseMyLocation}
                className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors border-0 bg-transparent p-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Ver restaurantes cerca de mi ubicación actual"
              >
                <MapPin className="w-5 h-5 shrink-0" />
                <span className="text-sm sm:text-base md:text-lg font-medium">
                  Usar mi ubicación actual
                </span>
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md shadow-xl p-6 sm:p-8">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-tr from-primary/30 to-accent/10 blur-2xl pointer-events-none" />
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary tracking-wide">
                    Tu reserva, paso a paso
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Así funciona Reservify
                  </h3>
                </div>

                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold shadow-[0_0_18px_rgba(255,106,0,0.25)]">
                      1
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Busca la cocina que te gusta</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Escríbela o elige una sugerencia rápida.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent font-bold shadow-[0_0_18px_rgba(255,45,85,0.22)]">
                      2
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Elige tu restaurante</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Revisa destacados y filtra por lo que buscas.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold shadow-[0_0_18px_rgba(255,106,0,0.25)]">
                      3
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Reserva y listo</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Confirma tu mesa y evita llamadas innecesarias.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="rounded-2xl bg-muted/60 border border-border/50 px-5 py-4">
                  <p className="text-sm text-muted-foreground">
                    Explora por ubicación o por tipo de cocina y encuentra tu plan ideal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
