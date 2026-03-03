import { Clock, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

const features = [
  {
    icon: Clock,
    title: "Reserva Instantánea",
    description: "Confirma tu mesa en segundos, sin esperas ni llamadas",
    bgColor: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    icon: Users,
    title: "Para Todos",
    description: "Desde cenas románticas hasta eventos familiares",
    bgColor: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    icon: Star,
    title: "Los Mejores",
    description: "Solo restaurantes verificados y con excelentes reseñas",
    bgColor: "bg-secondary/20",
    iconColor: "text-secondary",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="acerca_de"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-r from-muted via-background to-accent/20 dark:from-muted dark:via-background dark:to-secondary/20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Por qué elegir Reservify?
          </h3>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            La forma más fácil de reservar mesa
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10"
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
                <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
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
