import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { fadeInUp, transitionNormal } from "../lib/animations";
import { useToastContext } from "./ToastProvider";

export default function CTASection() {
  const { toast } = useToastContext();

  return (
    <motion.section
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-24 bg-[#090a0f] text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(255,106,0,0.35),transparent_45%),radial-gradient(circle_at_85%_40%,rgba(236,72,153,0.28),transparent_42%)]" />
      <div className="relative z-10 max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-xl px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-16 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <motion.h3
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 break-words tracking-tight"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          Tu próxima mesa está a un toque
        </motion.h3>
        <motion.p
          className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-white/80 px-2 max-w-2xl mx-auto"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ ...transitionNormal, delay: 0.1 }}
        >
          Descubre lugares increíbles, filtra según tu plan y confirma en minutos sin llamadas ni
          complicaciones.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ ...transitionNormal, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="rounded-xl px-8 py-6 text-base sm:text-lg font-semibold bg-white text-zinc-900 hover:bg-white/90 border border-white shadow-lg shadow-black/30 transition-all duration-300"
              type="button"
              onClick={() =>
                toast({
                  title: "Próximamente",
                  description: "Muy pronto podrás descargar la app de Reservify.",
                  variant: "warning",
                })
              }
            >
              Descargar app
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
