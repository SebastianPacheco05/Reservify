import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";
import { ROUTES } from "../routes/paths";
import { Brand } from "./Brand";

export default function Footer() {
  const linkClass = "text-foreground/70 hover:text-foreground transition-colors duration-200";
  const mutedTextClass = "text-foreground/65";
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-background text-foreground px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-black/40"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Brand variant="icon" alt="Reservify" className="w-8 h-8" />
              </motion.div>
              <h4 className="text-xl font-bold">Reservify</h4>
            </div>
            <p className={`${mutedTextClass} text-sm leading-relaxed`}>
              Reserva en restaurantes recomendados, sin complicaciones
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4">Restaurantes</h5>
            <ul className={`space-y-3 ${mutedTextClass}`}>
              <li><a href="/#buscar" className={linkClass}>Buscar</a></li>
              <li><a href="/#restaurantes" className={linkClass}>Restaurantes</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4">Empresa</h5>
            <ul className={`space-y-3 ${mutedTextClass}`}>
              <li><a href="#acerca_de" className={linkClass}>Acerca de</a></li>
              <li>
                <Link to={ROUTES.CONTACTO} className={linkClass}>
                  Contacto
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4">Soporte</h5>
            <ul className={`space-y-3 ${mutedTextClass}`}>
              <li>
                <Link to={ROUTES.AYUDA} className={linkClass}>
                  Ayuda
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMINOS} className={linkClass}>
                  Términos
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACIDAD} className={linkClass}>
                  Privacidad
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative z-10 border-t border-border/50 pt-8 text-center text-sm text-foreground/55"
        >
          <p>&copy; {new Date().getFullYear()} Reservify. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
