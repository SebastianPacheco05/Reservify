import type React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

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
  onSearch,
  onSearchSubmit,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-emerald-50/40 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20">
      {/* Fondo de estrellas */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`star-bg star-${i + 1}`}
            style={{ animationDuration: `${2.5 + (i % 3) * 0.8}s` }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center w-full space-y-12 sm:space-y-14 md:space-y-16"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="space-y-4">
          <motion.h2
            variants={fadeInUp}
            transition={transitionNormal}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            <span className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Reserva en tu restaurante favorito
            </span>
          </motion.h2>
        </div>

        <motion.p
          id="buscar"
          variants={fadeInUp}
          transition={{ ...transitionNormal, delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          Desde comida gourmet hasta cocina casera, encuentra el lugar ideal
          para cada ocasión
        </motion.p>

        <motion.div
          variants={fadeInUp}
          transition={{ ...transitionNormal, delay: 0.2 }}
          className="flex justify-center"
        >
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={onSearch}
            onSearchSubmit={onSearchSubmit}
          />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          transition={{ ...transitionNormal, delay: 0.3 }}
          className="flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <MapPin className="w-5 h-5 mr-2 shrink-0" />
          <span className="text-lg font-medium">Usar mi ubicación actual</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
