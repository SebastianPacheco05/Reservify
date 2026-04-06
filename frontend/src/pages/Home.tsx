"use client";

import type React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import RestaurantMap from "../components/RestaurantMap";
import Footer from "../components/Footer";
import { ProfileModal } from "../components/ProfileModal";
import { ROUTES } from "../routes/paths";

const CuisineCarousel = lazy(() => import("../components/CuisineCarousel"));
const RestaurantGrid = lazy(() => import("../components/RestaurantGrid"));
const AboutSection = lazy(() => import("../components/AboutSection"));
const FeaturesSection = lazy(() => import("../components/FeaturesSection"));

// Estilos CSS personalizados para la animación de color y brillos

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);
  const [showMapByLocation, setShowMapByLocation] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
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
    const normalized = cuisine.trim();
    if (!normalized) return;
    setSearchQuery(normalized);
    setShowSuggestions(false);
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(normalized)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
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
    <main className="min-h-screen bg-linear-to-br from-muted/60 via-background to-accent/10 dark:from-background dark:via-background dark:to-muted/60 transition-colors duration-300">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {isLoggedIn && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

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
        <section
          id="mapa-ubicacion"
          className="scroll-mt-20 px-4 sm:px-6 md:px-8 py-12 bg-muted/10 border-y border-border/50 backdrop-blur-sm"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
              Restaurantes cerca de ti
            </h2>
            <RestaurantMap />
          </div>
        </section>
      )}

      <Suspense fallback={<div className="min-h-[120px]" aria-hidden="true" />}>
        <CuisineCarousel onCategoryClick={handleSearch} />
      </Suspense>

      <Suspense fallback={<div className="min-h-[280px]" aria-hidden="true" />}>
        <RestaurantGrid searchQuery={searchQuery} />
      </Suspense>

      <Suspense fallback={<div className="min-h-[180px]" aria-hidden="true" />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
        <FeaturesSection />
      </Suspense>

      <Footer />
    </main>
  );
}
