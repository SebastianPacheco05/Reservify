"use client"

import { Link } from "react-router-dom"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Clock, Users, Menu, X, ChefHat, Utensils, Coffee, Pizza } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
// import { ModeToggle } from "../components/mode-toggle";

// Estilos CSS personalizados para la animación de color y brillos
const colorAnimationStyles = `
  @keyframes colorShift {
    0% {
      background: linear-gradient(to right, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    25% {
      background: linear-gradient(to right, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    50% {
      background: linear-gradient(to right, #d97706, #ea580c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    75% {
      background: linear-gradient(to right, #ea580c, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    100% {
      background: linear-gradient(to right, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .animate-color-shift {
    animation: colorShift 4s ease-in-out infinite;
  }

  @keyframes sparkle1 {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    25% {
      opacity: 1;
      transform: scale(1) rotate(90deg);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2) rotate(180deg);
    }
    75% {
      opacity: 0.6;
      transform: scale(0.8) rotate(270deg);
    }
  }

  @keyframes sparkle2 {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(180deg);
    }
    75% {
      opacity: 0.7;
      transform: scale(1.3) rotate(270deg);
    }
  }

  @keyframes sparkle3 {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    75% {
      opacity: 1;
      transform: scale(1) rotate(270deg);
    }
    25% {
      opacity: 0.6;
      transform: scale(1.1) rotate(90deg);
    }
  }

  @keyframes sparkle4 {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    25% {
      opacity: 0.8;
      transform: scale(0.9) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
    75% {
      opacity: 0.5;
      transform: scale(0.7) rotate(270deg);
    }
  }

  .sparkle-1 {
    animation: sparkle1 3s ease-in-out infinite;
    animation-delay: 0s;
  }

  .sparkle-2 {
    animation: sparkle2 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  .sparkle-3 {
    animation: sparkle3 3s ease-in-out infinite;
    animation-delay: 1s;
  }

  .sparkle-4 {
    animation: sparkle4 3s ease-in-out infinite;
    animation-delay: 1.5s;
  }

  .sparkle-5 {
    animation: sparkle1 3s ease-in-out infinite;
    animation-delay: 2s;
  }

  .sparkle-6 {
    animation: sparkle2 3s ease-in-out infinite;
    animation-delay: 2.5s;
  }

  .sparkle-7 {
    animation: sparkle3 3s ease-in-out infinite;
    animation-delay: 0.75s;
  }

  .sparkle-8 {
    animation: sparkle4 3s ease-in-out infinite;
    animation-delay: 1.25s;
  }
`

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  // Lista completa de tipos de cocina disponibles
  const allCuisines = [
    "Italiana", "Japonesa", "Mexicana", "Vegetariana", "Mediterránea", 
    "China", "India", "Francesa", "Española", "Tailandesa", "Vietnamita",
    "Coreana", "Griega", "Turca", "Libanesa", "Peruana", "Argentina",
    "Brasileña", "Colombiana", "Venezolana", "Caribeña", "Americana",
    "Alemana", "Inglesa", "Portuguesa", "Rusa", "Marroquí", "Etíope",
    "Sudafricana", "Australiana", "Fusión", "Vegana", "Sin Gluten"
  ]

  // Filtrar cocinas basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCuisines([])
      setShowSuggestions(false)
    } else {
      const filtered = allCuisines.filter(cuisine =>
        cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCuisines(filtered)
      setShowSuggestions(true)
    }
  }, [searchQuery])

  const handleSearch = (cuisine: string) => {
    setSearchQuery(cuisine)
    setShowSuggestions(false)
    // Aquí puedes agregar la lógica para navegar a la sección de restaurantes
    // o filtrar los restaurantes por tipo de cocina
    console.log(`Buscando restaurantes de cocina: ${cuisine}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  // Cerrar sugerencias cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.search-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(categories.length / 4))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(categories.length / 4)) % Math.ceil(categories.length / 4))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const categories = [
    {
      name: "Italiana",
      icon: Pizza,
      color: "bg-orange-50 text-orange-600 border-orange-300 hover:bg-orange-100",
    },
    {
      name: "Japonesa",
      icon: Utensils,
      color: "bg-red-50 text-red-600 border-red-300 hover:bg-red-100",
    },
    {
      name: "Mexicana",
      icon: ChefHat,
      color: "bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100",
    },
    {
      name: "Vegetariana",
      icon: Coffee,
      color: "bg-red-50 text-red-700 border-red-300 hover:bg-red-100",
    },
    {
      name: "China",
      icon: ChefHat,
      color: "bg-red-50 text-red-800 border-red-400 hover:bg-red-100",
    },
    {
      name: "India",
      icon: Utensils,
      color: "bg-orange-50 text-orange-800 border-orange-400 hover:bg-orange-100",
    },
    {
      name: "Francesa",
      icon: ChefHat,
      color: "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100",
    },
    {
      name: "Española",
      icon: Pizza,
      color: "bg-yellow-50 text-yellow-600 border-yellow-300 hover:bg-yellow-100",
    },
    {
      name: "Tailandesa",
      icon: Utensils,
      color: "bg-red-50 text-red-900 border-red-500 hover:bg-red-100",
    },
    {
      name: "Vietnamita",
      icon: ChefHat,
      color: "bg-green-50 text-green-600 border-green-300 hover:bg-green-100",
    },
    {
      name: "Coreana",
      icon: Utensils,
      color: "bg-blue-50 text-blue-700 border-blue-400 hover:bg-blue-100",
    },
    {
      name: "Griega",
      icon: Pizza,
      color: "bg-blue-50 text-blue-800 border-blue-500 hover:bg-blue-100",
    },
    {
      name: "Turca",
      icon: ChefHat,
      color: "bg-red-50 text-red-700 border-red-400 hover:bg-red-100",
    },
    {
      name: "Libanesa",
      icon: Utensils,
      color: "bg-green-50 text-green-700 border-green-400 hover:bg-green-100",
    },
    {
      name: "Peruana",
      icon: ChefHat,
      color: "bg-red-50 text-red-600 border-red-300 hover:bg-red-100",
    },
    {
      name: "Argentina",
      icon: Pizza,
      color: "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100",
    },
  ]

  const restaurants = [
    {
      id: 1,
      name: "La Terraza",
      description: "Cocina mediterránea con vista al mar",
      location: "Cartagena",
      image: "https://imagenes.20minutos.es/files/image_640_auto/uploads/imagenes/2021/07/30/mirandoalmar.jpeg",
      rating: 4.8,
      reviews: 124,
      priceRange: "$$$",
      availableToday: true,
      cuisine: "Mediterránea",
    },
    {
      id: 2,
      name: "Sushi House",
      description: "Experiencia japonesa tradicional",
      location: "Bogotá",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 89,
      priceRange: "$$$$",
      availableToday: true,
      cuisine: "Japonesa",
    },
    {
      id: 3,
      name: "El Rincón Mexicano",
      description: "Tacos, tequila y tradición",
      location: "Medellín",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 156,
      priceRange: "$$",
      availableToday: false,
      cuisine: "Mexicana",
    },
    {
      id: 4,
      name: "Trattoria Bella Vista",
      description: "Auténtica cocina italiana con pasta artesanal",
      location: "Cali",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviews: 203,
      priceRange: "$$$",
      availableToday: true,
      cuisine: "Italiana",
    },
    {
      id: 5,
      name: "Garden Greens",
      description: "Cocina vegetariana gourmet con ingredientes orgánicos",
      location: "Bogotá",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviews: 178,
      priceRange: "$$",
      availableToday: true,
      cuisine: "Vegetariana",
    },
    {
      id: 6,
      name: "Dragon Palace",
      description: "Especialidades chinas auténticas y dim sum",
      location: "Medellín",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
      rating: 4.4,
      reviews: 145,
      priceRange: "$$",
      availableToday: false,
      cuisine: "China",
    },
    {
      id: 7,
      name: "Le Petit Bistrot",
      description: "Cocina francesa clásica en ambiente romántico",
      location: "Cartagena",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 92,
      priceRange: "$$$$",
      availableToday: true,
      cuisine: "Francesa",
    },
    {
      id: 8,
      name: "Spice Garden",
      description: "Sabores auténticos de la India con tandoor",
      location: "Cali",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      rating: 4.3,
      reviews: 167,
      priceRange: "$$",
      availableToday: true,
      cuisine: "India",
    },
    {
      id: 9,
      name: "Thai Delight",
      description: "Cocina tailandesa picante y aromática",
      location: "Bogotá",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 134,
      priceRange: "$$",
      availableToday: false,
      cuisine: "Tailandesa",
    },
    {
      id: 10,
      name: "El Asador Argentino",
      description: "Carnes premium y parrilla tradicional",
      location: "Medellín",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviews: 189,
      priceRange: "$$$",
      availableToday: true,
      cuisine: "Argentina",
    },
    {
      id: 11,
      name: "Seoul Kitchen",
      description: "BBQ coreano y platos tradicionales",
      location: "Cali",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
      rating: 4.4,
      reviews: 112,
      priceRange: "$$",
      availableToday: true,
      cuisine: "Coreana",
    },
    {
      id: 12,
      name: "Cevichería del Pacífico",
      description: "Ceviches frescos y mariscos del Pacífico",
      location: "Cartagena",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviews: 156,
      priceRange: "$$$",
      availableToday: false,
      cuisine: "Peruana",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <style dangerouslySetInnerHTML={{ __html: colorAnimationStyles }} />
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-lg border-b border-orange-100 animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-2 animate-in fade-in duration-1000">
            <img src="../../../public/logoreservify.png" className="w-full h-15" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 animate-in slide-in-from-right duration-700 delay-300">
            <a
              href="#restaurantes"
              className="text-black hover:text-orange-600 transition-all duration-300 hover:scale-105 font-medium"
            >
              Restaurantes
            </a>
            {!isLoggedIn && (
              <>
                <Link to="/Login">
                  <Button
                    className="text-white bg-black hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform"
                    size="sm"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/Registrar">
                  <Button
                    className="text-white bg-red-600 hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform"
                    size="sm"
                  >
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-orange-100 transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a href="#" className="block text-black hover:text-orange-600 font-medium transition-colors duration-300">
              Restaurantes
            </a>
            <a href="#" className="block text-black hover:text-orange-600 font-medium transition-colors duration-300">
              Ofertas
            </a>

            {!isLoggedIn && (
              <div className="flex space-x-2 pt-2">
                <Link to="/Login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-black text-black hover:bg-orange-50 bg-transparent transition-all duration-300"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/Registrar">
                  <Button size="sm" className="flex-1 bg-red-600 hover:bg-orange-600 transition-all duration-300">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
              <span className="text-orange-500">
                Reserva en tu restaurante favorito
              </span>
            </h2>
            
            {/* Brillos alrededor del título */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Brillo superior izquierdo */}
              <div className="sparkle-1 absolute -top-4 -left-8 w-4 h-4">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full shadow-lg shadow-orange-300/50"></div>
              </div>
              
              {/* Brillo superior derecho */}
              <div className="sparkle-2 absolute -top-6 -right-12 w-3 h-3">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg shadow-red-300/50"></div>
              </div>
              
              {/* Brillo inferior izquierdo */}
              <div className="sparkle-3 absolute -bottom-2 -left-4 w-2 h-2">
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-lg shadow-orange-400/50"></div>
              </div>
              
              {/* Brillo inferior derecho */}
              <div className="sparkle-4 absolute -bottom-4 -right-6 w-3 h-3">
                <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400 rounded-full shadow-lg shadow-orange-300/50"></div>
              </div>
              
              {/* Brillo medio izquierdo */}
              <div className="sparkle-5 absolute top-1/2 -left-2 w-2 h-2">
                <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-700 rounded-full shadow-lg shadow-yellow-400/50"></div>
              </div>
              
              {/* Brillo medio derecho */}
              <div className="sparkle-6 absolute top-1/3 -right-4 w-2 h-2">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-lg shadow-orange-500/50"></div>
              </div>
              
              {/* Brillo superior central */}
              <div className="sparkle-7 absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg shadow-yellow-300/50"></div>
              </div>
              
              {/* Brillo inferior central */}
              <div className="sparkle-8 absolute -bottom-1 left-1/4 w-2 h-2">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg shadow-orange-400/50"></div>
              </div>
            </div>
          </div>
          <p
            id="buscar"
            className="text-xl text-black mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-300"
          >
            Desde comida gourmet hasta cocina casera, encuentra el lugar ideal para cada ocasión
          </p>

          {/* Search Bar Mejorada */}
          <div className="search-container relative max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                {/* Icono de búsqueda con animación */}
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-orange-400 w-6 h-6 group-hover:text-orange-600 transition-all duration-300 group-hover:scale-110 z-10" />
                
                {/* Input principal con efectos mejorados */}
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Qué tipo de cocina te apetece hoy?"
                  className="pl-16 pr-20 py-8 text-xl rounded-3xl border-3 border-orange-200 focus:border-orange-500 bg-white/90 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-orange-200/50 focus:shadow-orange-300/50 focus:scale-105 group-hover:border-orange-300"
                />
                
                {/* Botón de búsqueda mejorado */}
                <Button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-300/50"
                >
                  Buscar
                </Button>
              </div>

              {/* Sugerencias de búsqueda */}
              {showSuggestions && filteredCuisines.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-200 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top duration-300">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
                      Tipos de cocina disponibles
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredCuisines.slice(0, 12).map((cuisine, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSearch(cuisine)}
                          className="text-left p-3 rounded-xl hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 hover:scale-105 group"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-600 transition-colors duration-200"></div>
                            <span className="font-medium text-sm">{cuisine}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {filteredCuisines.length > 12 && (
                      <div className="mt-3 pt-3 border-t border-orange-100">
                        <p className="text-xs text-gray-500 text-center">
                          Y {filteredCuisines.length - 12} más...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sugerencias rápidas cuando no hay búsqueda */}
              {!showSuggestions && searchQuery === "" && (
                <div className="absolute top-full left-0 right-0 mt-4 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-top duration-500 delay-300">
                  {["Italiana", "Japonesa", "Mexicana", "Mediterránea"].map((cuisine, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSearch(cuisine)}
                      className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg border border-orange-200 hover:border-orange-300"
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

            <div className="flex items-center justify-center text-gray-600 hover:text-orange-600 cursor-pointer transition-all duration-300 hover:scale-105 animate-in fade-in duration-100 delay-400 mt-30">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Usar mi ubicación actual</span>
            </div>
        </div>
      </section>

             {/* Categories Carrusel */}
       <section id="cocinas" className="max-w-7xl mx-auto px-4 py-16">
         <h3 className="text-3xl font-bold mb-12 text-center text-black animate-in fade-in slide-in-from-bottom duration-800">
           Tipos de Cocina
         </h3>
         
         <div className="relative">
           {/* Botones de navegación */}
           <button
             onClick={prevSlide}
             className="absolute left-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 hover:text-orange-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-orange-300"
           >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
           
           <button
             onClick={nextSlide}
             className="absolute right-4 top-[calc(50%-2rem)] transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 hover:text-orange-700 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-orange-300"
           >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
             </svg>
           </button>

           {/* Contenedor del carrusel */}
           <div className="overflow-hidden">
             <div 
               className="flex transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
             >
               {Array.from({ length: Math.ceil(categories.length / 4) }, (_, slideIndex) => (
                 <div key={slideIndex} className="w-full flex-shrink-0 px-8">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {categories.slice(slideIndex * 4, (slideIndex + 1) * 4).map((category, index) => {
                       const IconComponent = category.icon
                       const actualIndex = slideIndex * 4 + index
                       return (
                         <div key={actualIndex} className="p-2">
                           <Card
                             className={`${category.color} border-4 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group animate-in fade-in slide-in-from-bottom duration-800`}
                             style={{ animationDelay: `${actualIndex * 150}ms` }}
                           >
                             <CardContent className="p-6 text-center">
                               <IconComponent className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                               <h4 className="font-semibold text-lg group-hover:scale-105 transition-transform duration-300">
                                 {category.name}
                               </h4>
                             </CardContent>
                           </Card>
                         </div>
                       )
                     })}
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Indicadores de navegación */}
           <div className="flex justify-center mt-12 space-x-3">
             {Array.from({ length: Math.ceil(categories.length / 4) }, (_, index) => (
               <button
                 key={index}
                 onClick={() => goToSlide(index)}
                 className={`w-4 h-4 rounded-full transition-all duration-300 ${
                   index === currentSlide 
                     ? 'bg-orange-600 scale-125' 
                     : 'bg-orange-300 hover:bg-orange-400'
                 }`}
               />
             ))}
           </div>
         </div>
       </section>

      {/* Featured Restaurants */}
      <section id="restaurantes" className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">
              Restaurantes Destacados
            </h3>
            <p className="text-gray-700 text-lg">
              Los favoritos de nuestra comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 hover:border-orange-200"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={restaurant.availableToday ? "default" : "secondary"}
                      className={`${restaurant.availableToday ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800"} transition-all duration-300 group-hover:scale-105`}
                    >
                      {restaurant.availableToday ? "Disponible hoy" : "Reservar mañana"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-black group-hover:text-orange-600 transition-colors duration-300">
                      {restaurant.name}
                    </h4>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-orange-500 transition-colors duration-300">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-orange-500 fill-current group-hover:scale-110 transition-transform duration-300" />
                    <span className="ml-1 font-medium group-hover:text-orange-600 transition-colors duration-300">
                      {restaurant.rating}
                    </span>
                    <span className="ml-1 text-gray-500">({restaurant.reviews} reseñas)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700 group-hover:border-orange-500 group-hover:text-orange-800 transition-all duration-300"
                    >
                      {restaurant.cuisine}
                    </Badge>
                  </div>

                  <Link to="/Restaurant">
                    <Button className="w-full mt-4 text-white bg-orange-600 hover:bg-red-600 transition-all duration-300 hover:scale-105 transform">
                      Ver disponibilidad
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="acerca_de" className="py-20 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">
              ¿Por qué elegir Reservify?
            </h3>
            <p className="text-gray-700 text-lg">
              La forma más fácil de reservar mesa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Reserva Instantánea",
                description: "Confirma tu mesa en segundos, sin esperas ni llamadas",
                bgColor: "bg-orange-100",
                iconColor: "text-orange-600",
              },
              {
                icon: Users,
                title: "Para Todos",
                description: "Desde cenas románticas hasta eventos familiares",
                bgColor: "bg-red-100",
                iconColor: "text-red-600",
              },
              {
                icon: Star,
                title: "Los Mejores",
                description: "Solo restaurantes verificados y con excelentes reseñas",
                bgColor: "bg-orange-100",
                iconColor: "text-orange-600",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-black group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            ¿Listo para tu próxima experiencia culinaria?
          </h3>
          <p className="text-xl mb-8 text-orange-100">
            Miles de mesas disponibles en los mejores restaurantes de tu ciudad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="border-white bg-white text-black hover:bg-orange-100 hover:text-orange-700 transition-all duration-300 hover:scale-105 transform"
            >
              Descargar app
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 animate-in fade-in duration-1000">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">Reservify</h4>
              </div>
              <p className="text-gray-400">La plataforma líder en reservas de restaurantes</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Restaurantes</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#buscar" className="hover:text-orange-400 transition-colors">
                    Buscar
                  </a>
                </li>
                <li>
                  <a href="#cocinas" className="hover:text-orange-400 transition-colors">
                    Cocinas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#acerca_de" className="hover:text-orange-400 transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Soporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">
                    Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Reservify. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
