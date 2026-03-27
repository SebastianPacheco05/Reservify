import { motion } from "framer-motion";
import { Building2, Sparkles, Users2 } from "lucide-react";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

const pillars = [
  {
    icon: Users2,
    title: "Pensado para personas",
    description: "Diseñamos reservas simples, rápidas y claras para cualquier plan.",
  },
  {
    icon: Building2,
    title: "Aliado de restaurantes",
    description: "Conectamos clientes con establecimientos que cuidan su servicio.",
  },
  {
    icon: Sparkles,
    title: "Experiencia confiable",
    description: "Priorizamos seguridad, transparencia y buena atención en cada reserva.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="acerca_de"
      className="px-4 py-16 sm:px-6 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            Acerca de
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Reservify conecta antojos con buenas mesas
          </h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Somos una plataforma creada para facilitar reservas en restaurantes de forma
            transparente. Queremos que encontrar y confirmar mesa deje de ser complicado.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                variants={fadeInUp}
                transition={transitionNormal}
                className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

