import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustración 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-slate-300 dark:text-slate-600 mb-4">
            404
          </div>
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <Home className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            ¡Página no encontrada!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Verifica la URL o regresa a la página principal.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir al Inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver Atrás
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Si crees que esto es un error, por favor contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
