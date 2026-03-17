import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { ROUTES } from "../routes/paths";

export default function Terminos() {
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
                Términos y Condiciones de Uso
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Última actualización: {new Date().toLocaleDateString("es-ES")}
              </p>
            </div>
          </header>

          <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                1. Aceptación de los términos
              </h2>
              <p>
                Al registrarte, acceder o utilizar Reservify, aceptas estos Términos y
                Condiciones y te comprometes a cumplirlos. Si no estás de acuerdo con
                alguna de las disposiciones, debes abstenerte de usar la plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                2. Objeto del servicio
              </h2>
              <p>
                Reservify es una plataforma que facilita la gestión y reserva de mesas
                en restaurantes. Actuamos como intermediarios tecnológicos entre
                clientes y establecimientos, pero no somos responsables de la calidad
                del servicio gastronómico, el estado de las instalaciones ni del
                cumplimiento de las políticas internas de cada restaurante.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                3. Registro de usuarios y veracidad de la información
              </h2>
              <p>
                Para usar ciertas funcionalidades es necesario crear una cuenta.
                Te comprometes a proporcionar información veraz, actualizada y
                completa, y a mantener la confidencialidad de tus credenciales de
                acceso. Eres responsable de todas las actividades que se realicen
                desde tu cuenta.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                4. Reservas, cancelaciones y no presentación (no-show)
              </h2>
              <p>
                Cada restaurante define sus políticas de cancelación, horarios de
                tolerancia y posibles cobros por no presentación. Al confirmar una
                reserva, aceptas dichas políticas, que podrán incluir cargos por
                cancelaciones tardías o no asistencia cuando exista una garantía de
                pago o prepago asociado.
              </p>
              <p>
                Reservify podrá, a solicitud del restaurante o tras detectar abuso,
                restringir temporal o definitivamente el acceso de usuarios que
                acumulen reiterados no-shows o incumplimientos de las políticas.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                5. Pagos y facturación
              </h2>
              <p>
                Cuando una reserva requiera pago en línea, este se procesará a través
                de pasarelas de pago autorizadas y seguras. Reservify no almacena los
                datos completos de tarjetas de crédito o débito. La facturación del
                consumo final corresponde al restaurante, salvo que expresamente se
                indique lo contrario.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                6. Comportamiento del usuario
              </h2>
              <p>
                Te comprometes a hacer un uso responsable y respetuoso de la
                plataforma y de los establecimientos asociados, absteniéndote de
                realizar conductas fraudulentas, ofensivas, ilegales o que afecten la
                operación de Reservify o de los restaurantes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                7. Responsabilidad y limitación
              </h2>
              <p>
                Reservify no garantiza la disponibilidad ininterrumpida del servicio
                ni se hace responsable por fallas técnicas, indisponibilidad temporal
                de la plataforma, sobreventas de mesas, errores en datos
                suministrados por los restaurantes o situaciones de fuerza mayor.
              </p>
              <p>
                En ningún caso nuestra responsabilidad total frente a ti excederá el
                valor de las tarifas que hayas pagado directamente a Reservify por el
                uso del servicio en los últimos 12 meses.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                8. Propiedad intelectual
              </h2>
              <p>
                Todos los derechos sobre la plataforma, incluyendo software, marcas,
                logos, diseño y contenidos generados por Reservify, pertenecen a sus
                titulares y se encuentran protegidos por la normativa aplicable.
                Queda prohibida su reproducción, distribución o modificación sin
                autorización previa y por escrito.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                9. Modificaciones de los términos
              </h2>
              <p>
                Reservify podrá actualizar estos Términos y Condiciones en cualquier
                momento para reflejar cambios legales, operativos o de negocio. Las
                modificaciones serán notificadas a través de la plataforma y serán
                aplicables desde su publicación. El uso continuado del servicio
                implica la aceptación de las nuevas condiciones.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                10. Legislación aplicable y jurisdicción
              </h2>
              <p>
                Estos Términos se rigen por la legislación aplicable en la
                jurisdicción donde opera Reservify. Cualquier controversia será
                sometida a los jueces y tribunales competentes de dicha jurisdicción,
                sin perjuicio de las normas de protección al consumidor que
                pudieran resultar aplicables.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

