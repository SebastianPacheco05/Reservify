"use client";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  Menu,
  X,
  ChefHat,
  Utensils,
  Coffee,
  Pizza,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
// import { ModeToggle } from "../components/mode-toggle";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ← nuevo estado

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  const categories = [
    {
      name: "Italiana",
      icon: Pizza,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      name: "Japonesa",
      icon: Utensils,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      name: "Mexicana",
      icon: ChefHat,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      name: "Vegetariana",
      icon: Coffee,
      color: "bg-green-50 text-green-600 border-green-200",
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "La Terraza",
      description: "Cocina mediterránea con vista al mar",
      location: "Cartagena",
      image:
        "https://imagenes.20minutos.es/files/image_640_auto/uploads/imagenes/2021/07/30/mirandoalmar.jpeg",
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
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 156,
      priceRange: "$$",
      availableToday: false,
      cuisine: "Mexicana",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white-/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-2">
          <img src="../../../public/Reservify-logo.svg" 
             className="w-full h-15 rounded-4xl"/>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#restaurantes"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Restaurantes
            </a>
            {!isLoggedIn && (
              <>
                <Link to="/Login">
                  <Button
                    className="text-white bg-neutral-700 hover:bg-blue-800"
                    size="sm"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/Registrar">
                  <Button
                    className="text-white bg-neutral-700 hover:bg-blue-800"
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
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Restaurantes
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Ofertas
            </a>

            {!isLoggedIn && (
              <div className="flex space-x-2 pt-2">
                <Link to="/Login">
                  <Button variant="outline" size="sm" className="flex-1">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/Registrar">
                  <Button size="sm" className="flex-1">
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-blue-800 bg-clip-text text-transparent leading-tight">
            Reserva en tu restaurante favorito
          </h2>
          <p id="buscar" className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Desde comida gourmet hasta cocina casera, encuentra el lugar ideal
            para cada ocasión
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="¿Dónde quieres comer hoy?"
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl hover:bg-neutral-700">
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Usar mi ubicación actual</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="cocinas" className="max-w-7xl mx-auto px-4 py-16">
        <h3  className="text-3xl font-bold mb-12 text-center text-gray-900">
          Tipos de Cocina
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={index}
                className={`${category.color} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 group`}
              >
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-lg">{category.name}</h4>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section id="restaurantes" className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div  className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Restaurantes Destacados
            </h3>
            <p className="text-gray-600 text-lg">
              Los favoritos de nuestra comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={
                        restaurant.availableToday ? "default" : "secondary"
                      }
                      className="bg-white/90 text-gray-800"
                    >
                      {restaurant.availableToday
                        ? "Disponible hoy"
                        : "Reservar mañana"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-gray-900">
                      {restaurant.name}
                    </h4>
                    <span className="text-sm font-medium text-gray-600">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{restaurant.description}</p>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">
                      {restaurant.rating}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({restaurant.reviews} reseñas)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                    <Badge variant="outline">{restaurant.cuisine}</Badge>
                  </div>

                  <Link to="/Restaurant">
                  <Button className="w-full mt-4 text-white bg-neutral-700 hover:bg-blue-800 ">
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
      <section id="acerca_de" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Reservify?
            </h3>
            <p className="text-gray-600 text-lg">
              La forma más fácil de reservar mesa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Reserva Instantánea
              </h4>
              <p className="text-gray-600">
                Confirma tu mesa en segundos, sin esperas ni llamadas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Para Todos</h4>
              <p className="text-gray-600">
                Desde cenas románticas hasta eventos familiares
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Los Mejores</h4>
              <p className="text-gray-600">
                Solo restaurantes verificados y con excelentes reseñas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            ¿Listo para tu próxima experiencia culinaria?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Miles de mesas disponibles en los mejores restaurantes de tu ciudad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="border-white bg-white text-black hover:bg-white  hover:text-blue-700"
            >
              Descargar app
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">Reservify</h4>
              </div>
              <p className="text-gray-400">
                La plataforma líder en reservas de restaurantes
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Restaurantes</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#buscar" className="hover:text-white transition-colors">
                    Buscar
                  </a>
                </li>
                <li>
                  <a href="#cocinas" className="hover:text-white transition-colors">
                    Cocinas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ofertas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#acerca_de" className="hover:text-white transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreras
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Soporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Reservify. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
