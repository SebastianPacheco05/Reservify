"use client";

import type React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";

const CuisineCarousel = lazy(() => import("../components/CuisineCarousel"));
const RestaurantGrid = lazy(() => import("../components/RestaurantGrid"));
const RestaurantMap = lazy(() => import("../components/RestaurantMap"));
const FeaturesSection = lazy(() => import("../components/FeaturesSection"));
const CTASection = lazy(() => import("../components/CTASection"));
const Footer = lazy(() => import("../components/Footer"));

// Estilos CSS personalizados para la animación de color y brillos

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMapByLocation, setShowMapByLocation] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);


  
  // Lista completa de tipos de cocina disponibles
  const allCuisines = [
    "Italiana",
    "Asiática",
    "Japonesa",
    "Mexicana",
    "Vegetariana",
    "China",
    "India",
    "Francesa",
    "Española",
    "Tailandesa",
    "Vietnamita",
    "Coreana",
    "Griega",
    "Turca",
    "Libanesa",
    "Peruana",
    "Argentina",
    "Brasileña",
    "Colombiana",
    "Venezolana",
    "Caribeña",
    "Americana",
    "Alemana",
    "Inglesa",
    "Portuguesa",
    "Rusa",
    "Marroquí",
    "Etíope",
    "Sudafricana",
    "Australiana",
    "Fusión",
    "Vegana",
    "Sin Gluten",
  ];

  // Filtrar cocinas basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCuisines([]);
      setShowSuggestions(false);
    } else {
      const filtered = allCuisines.filter((cuisine) =>
        cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCuisines(filtered);
      setShowSuggestions(true);
    }
  }, [searchQuery]);

  const handleSearch = (cuisine: string) => {
    setSearchQuery(cuisine);
    setShowSuggestions(false);
    // Aquí puedes agregar la lógica para navegar a la sección de restaurantes
    // o filtrar los restaurantes por tipo de cocina
    console.log(`Buscando restaurantes de cocina: ${cuisine}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleUseMyLocation = () => {
    setShowMapByLocation(true);
    setTimeout(() => {
      document.getElementById("mapa-ubicacion")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = () => {
    // Eliminar token del localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("tipo_usuario");
    // Actualizar estado
    setIsLoggedIn(false);
    // Recargar la página para actualizar el estado en toda la aplicación
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />

      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        filteredCuisines={filteredCuisines}
        onSearch={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        onUseMyLocation={handleUseMyLocation}
      />

      {showMapByLocation && (
        <section id="mapa-ubicacion" className="scroll-mt-20 px-4 sm:px-6 md:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">
              Restaurantes cerca de ti
            </h2>
            <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center text-slate-500">Cargando mapa…</div>}>
              <RestaurantMap />
            </Suspense>
          </div>
        </section>
      )}

      <Suspense fallback={<div className="min-h-[120px]" aria-hidden="true" />}>
        <CuisineCarousel />
      </Suspense>

      <Suspense fallback={<div className="min-h-[280px]" aria-hidden="true" />}>
        <RestaurantGrid />
      </Suspense>

      <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[180px]" aria-hidden="true" />}>
        <CTASection />
      </Suspense>

      <Suspense fallback={<footer className="min-h-[200px] bg-slate-100 dark:bg-slate-800" aria-hidden="true" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
