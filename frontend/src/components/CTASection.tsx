import type React from "react";
import { Button } from "./ui/button";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20 px-4">
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
            className="border-white bg-white text-black hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 hover:scale-105 transform"
          >
            Descargar app
          </Button>
        </div>
      </div>
    </section>
  );
}
