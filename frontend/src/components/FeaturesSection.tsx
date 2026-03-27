import { CalendarCheck2, Clock, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

const features = [
  {
    icon: Clock,
    title: "Reserva en segundos",
    description: "Confirmas tu mesa al instante, sin llamadas ni tiempos muertos.",
    borderColor: "border-primary/30",
    iconColor: "text-primary/90",
  },
  {
    icon: Users,
    title: "Para cada ocasión",
    description: "Desde una cena casual hasta celebraciones en grupo.",
    borderColor: "border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
  },
  {
    icon: Star,
    title: "Restaurantes verificados",
    description: "Lugares recomendados y valorados para reservar con confianza.",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
  {
    icon: CalendarCheck2,
    title: "Confirmación al instante",
    description: "Recibes confirmación clara de tu reserva y detalles en tiempo real.",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: MapPin,
    title: "Encuentra cerca de ti",
    description: "Explora opciones por zona y descubre restaurantes ideales a tu alrededor.",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Datos protegidos",
    description: "Tu información se gestiona con controles de seguridad y privacidad.",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="acerca_de"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 md:py-28 bg-background text-foreground"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,106,0,0.18),transparent_35%),radial-gradient(circle_at_78%_12%,rgba(236,72,153,0.16),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="relative z-10 text-center mb-12 sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Reserva inteligente, de verdad
          </h3>
          <p className="text-foreground/70 text-base sm:text-lg max-w-2xl mx-auto">
            Encuentra restaurantes recomendados y asegura tu mesa en minutos con una experiencia
            clara, rápida y sin fricción.
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-7"
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
                className={`group rounded-2xl border ${feature.borderColor} bg-black/[0.02] dark:bg-white/[0.04] backdrop-blur-md p-6 sm:p-7`}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-5 shadow-lg shadow-black/20"
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
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
