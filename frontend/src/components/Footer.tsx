import type React from "react";
import { Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";

export default function Footer() {
  const linkClass = "hover:text-blue-400 transition-colors duration-200";
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 dark:bg-black text-white py-12 sm:py-16 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Utensils className="w-5 h-5 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold">Reservify</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              La plataforma líder en reservas de restaurantes
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4 text-white">Restaurantes</h5>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#buscar" className={linkClass}>Buscar</a></li>
              <li><a href="#cocinas" className={linkClass}>Cocinas</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4 text-white">Empresa</h5>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#acerca_de" className={linkClass}>Acerca de</a></li>
              <li><a href="#" className={linkClass}>Contacto</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4 text-white">Soporte</h5>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className={linkClass}>Ayuda</a></li>
              <li><a href="#" className={linkClass}>Términos</a></li>
              <li><a href="#" className={linkClass}>Privacidad</a></li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Reservify. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
