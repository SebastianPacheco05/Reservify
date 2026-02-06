import type React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { fadeInUp, transitionNormal } from "../lib/animations";

export default function CTASection() {
  return (
    <motion.section
      className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h3
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 break-words"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={transitionNormal}
        >
          ¿Listo para tu próxima experiencia culinaria?
        </motion.h3>
        <motion.p
          className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-blue-100 px-2"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ ...transitionNormal, delay: 0.1 }}
        >
          Miles de mesas disponibles en los mejores restaurantes de tu ciudad
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
              className="border-2 border-white bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-100 font-semibold rounded-xl px-8 py-6 text-lg transition-all duration-300 shadow-xl"
            >
              Descargar app
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
