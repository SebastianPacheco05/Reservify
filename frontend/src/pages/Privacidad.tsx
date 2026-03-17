import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { ROUTES } from "../routes/paths";

export default function Privacidad() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("tipo_usuario");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-muted/80 to-accent/20 dark:from-background dark:to-muted transition-colors duration-300">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenProfile={undefined}
      />

      <section className="relative min-h-[100dvh] sm:min-h-screen flex flex-col justify-center pt-24 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-accent/20 dark:from-primary/10 dark:via-transparent dark:to-accent/10">
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`star-bg star-${i + 1}`}
              style={{ animationDuration: `${2.5 + (i % 3) * 0.8}s` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-8">
          <header className="text-center space-y-4">
            <div className="flex justify-center">
              <Link to={ROUTES.HOME}>
                <Button variant="outline" size="sm">
                  Volver al inicio
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Política de Privacidad
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Te explicamos cómo tratamos tus datos personales en Reservify.
              </p>
            </div>
          </header>

          <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                1. Responsable del tratamiento
              </h2>
              <p>
                El responsable del tratamiento de tus datos es Reservify, plataforma
                digital para la gestión de reservas en restaurantes. Para cualquier
                consulta relacionada con la protección de datos puedes escribirnos a
                través del formulario de contacto.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                2. Datos que recopilamos
              </h2>
              <p>
                Recopilamos datos de identificación (nombre, apellidos, documento
                cuando aplique), datos de contacto (correo electrónico, teléfono),
                información de tus reservas (fechas, horarios, número de personas,
                restaurante seleccionado), preferencias de consumo y, en su caso,
                datos de facturación. En pagos en línea trabajamos con pasarelas
                certificadas y no almacenamos la información completa de tus tarjetas.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                3. Finalidades del tratamiento
              </h2>
              <p>
                Utilizamos tus datos para: (i) gestionar tus reservas, (ii) permitir
                que los restaurantes conozcan los datos necesarios para atenderte,{" "}
                (iii) enviarte comunicaciones transaccionales relacionadas con tus
                reservas, (iv) mejorar la experiencia de usuario mediante análisis
                estadísticos y (v) enviarte comunicaciones comerciales sobre
                Reservify o restaurantes asociados cuando hayas dado tu
                consentimiento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                4. Base legal
              </h2>
              <p>
                Tratamos tus datos principalmente sobre la base de la ejecución del
                contrato de prestación de servicios (gestión de reservas) y del
                cumplimiento de obligaciones legales. Para el envío de comunicaciones
                comerciales utilizamos tu consentimiento, que podrás retirar en
                cualquier momento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                5. Cesión de datos a restaurantes y terceros
              </h2>
              <p>
                Compartimos con los restaurantes únicamente la información necesaria
                para gestionar tu reserva y mejorar la atención (por ejemplo, nombre,
                contacto, hora y tamaño de la mesa). También podemos compartir datos
                con proveedores tecnológicos, pasarelas de pago y otros encargados
                de tratamiento que nos prestan servicios de infraestructura,
                comunicaciones o análisis, siempre bajo contratos de confidencialidad
                y protección de datos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                6. Plazo de conservación
              </h2>
              <p>
                Conservaremos tus datos durante el tiempo necesario para prestar el
                servicio, cumplir obligaciones legales (por ejemplo, en materia
                contable o fiscal) y mientras sea necesario para atender posibles
                responsabilidades derivadas del tratamiento. Pasados dichos plazos,
                los datos se anonimizarán o eliminarán de forma segura.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                7. Derechos de los usuarios
              </h2>
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, supresión,
                oposición, limitación del tratamiento y portabilidad de tus datos,
                así como revocar tu consentimiento, contactándonos a través del
                formulario de contacto. También puedes actualizar parte de tu
                información directamente desde tu perfil de usuario.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                8. Seguridad de la información
              </h2>
              <p>
                Implementamos medidas técnicas y organizativas razonables para
                proteger tus datos frente a accesos no autorizados, pérdida,
                alteración o divulgación. No obstante, ningún sistema es completamente
                infalible; por ello, te recomendamos mantener buenas prácticas de
                seguridad, como no compartir tus credenciales con terceros.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                9. Uso de cookies y tecnologías similares
              </h2>
              <p>
                Utilizamos cookies y tecnologías similares para recordar tus
                preferencias, mejorar el rendimiento de la plataforma y medir el uso
                del servicio. Puedes gestionar tus preferencias de cookies desde la
                configuración del navegador y a través de los controles que ofrezca
                la propia plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                10. Cambios en la política de privacidad
              </h2>
              <p>
                Podemos actualizar esta Política de Privacidad para adaptarla a
                cambios normativos o de la propia plataforma. Te notificaremos los
                cambios relevantes a través de la aplicación o por correo
                electrónico cuando corresponda. El uso continuado de Reservify tras
                la publicación de las actualizaciones implica la aceptación de la
                nueva versión.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

