"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CuisineCarousel from "../components/CuisineCarousel";
import RestaurantGrid from "../components/RestaurantGrid";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

// Estilos CSS personalizados para la animación de color y brillos

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
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

  const handleLogout = () => {
    // Eliminar token del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    // Actualizar estado
    setIsLoggedIn(false);
    // Recargar la página para actualizar el estado en toda la aplicación
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
      />

      <CuisineCarousel />

      <RestaurantGrid />

      <FeaturesSection />

      <CTASection />

      <Footer />
    </main>
  );
}
