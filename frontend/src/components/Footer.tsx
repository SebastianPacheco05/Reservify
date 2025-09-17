import type React from "react";
import { Utensils } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
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
                <a
                  href="#buscar"
                  className="hover:text-blue-400 transition-colors"
                >
                  Buscar
                </a>
              </li>
              <li>
                <a
                  href="#cocinas"
                  className="hover:text-blue-400 transition-colors"
                >
                  Cocinas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Empresa</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#acerca_de"
                  className="hover:text-blue-400 transition-colors"
                >
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Soporte</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
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
  );
}
