import type React from "react";
import { Clock, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

const features = [
  {
    icon: Clock,
    title: "Reserva Instantánea",
    description: "Confirma tu mesa en segundos, sin esperas ni llamadas",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    title: "Para Todos",
    description: "Desde cenas románticas hasta eventos familiares",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Star,
    title: "Los Mejores",
    description: "Solo restaurantes verificados y con excelentes reseñas",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="acerca_de"
      className="py-24 px-4 bg-gradient-to-r from-slate-50 via-blue-50/50 to-emerald-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            ¿Por qué elegir Reservify?
          </h3>
          <p className="text-slate-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
            La forma más fácil de reservar mesa
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={transitionNormal}
                className="text-center group"
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <IconComponent className={`w-10 h-10 ${feature.iconColor}`} />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
