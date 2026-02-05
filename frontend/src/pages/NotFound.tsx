import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, transitionSpring } from "../lib/animations";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionSpring, delay: 0.1 }}
      >
        {/* Ilustración 404 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <motion.div
            className="text-9xl font-bold text-slate-300 dark:text-slate-600 mb-4 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 bg-clip-text text-transparent"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.div>
          <motion.div
            className="w-24 h-24 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Home className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </motion.div>
        </motion.div>

        {/* Mensaje principal */}
        <motion.div
          className="mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            ¡Página no encontrada!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida.
            Verifica la URL o regresa a la página principal.
          </p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Link>
          </motion.div>
          <motion.button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver Atrás
          </motion.button>
        </motion.div>

        {/* Información adicional */}
        <motion.div
          className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Si crees que esto es un error, por favor contacta al soporte técnico.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
