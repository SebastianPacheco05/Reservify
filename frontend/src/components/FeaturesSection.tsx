import type React from "react";
import { Clock, Users, Star } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Reserva Instantánea",
    description: "Confirma tu mesa en segundos, sin esperas ni llamadas",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Para Todos",
    description: "Desde cenas románticas hasta eventos familiares",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Star,
    title: "Los Mejores",
    description: "Solo restaurantes verificados y con excelentes reseñas",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="acerca_de"
      className="py-20 px-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-black dark:text-white mb-4">
            ¿Por qué elegir Reservify?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            La forma más fácil de reservar mesa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}
                >
                  <IconComponent
                    className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-black dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
