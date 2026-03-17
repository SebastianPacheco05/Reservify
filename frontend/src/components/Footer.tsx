import icon_reservify from "../../public/icon_reservify.svg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInUp, staggerContainer, transitionNormal } from "../lib/animations";
import { ROUTES } from "../routes/paths";

export default function Footer() {
  const linkClass = "hover:text-accent transition-colors duration-200";
  const mutedTextClass = "text-background/75 dark:text-muted-foreground";
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="bg-foreground dark:bg-background text-background dark:text-foreground py-12 sm:py-16 px-4 sm:px-6"
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
                className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <img src={icon_reservify} alt="Reservify" className="w-8 h-8 items-center justify-center" />
              </motion.div>
              <h4 className="text-xl font-bold">Reservify</h4>
            </div>
            <p className={`${mutedTextClass} text-sm leading-relaxed`}>
              La plataforma líder en reservas de restaurantes
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} transition={transitionNormal}>
            <h5 className="font-semibold mb-4">Restaurantes</h5>
            <ul className={`space-y-3 ${mutedTextClass}`}>
              <li><a href="#buscar" className={linkClass}>Buscar</a></li>
              <li><a href="#cocinas" className={linkClass}>Cocinas</a></li>
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
          className="border-t border-background/20 dark:border-border pt-8 text-center text-sm text-background/70 dark:text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} Reservify. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
