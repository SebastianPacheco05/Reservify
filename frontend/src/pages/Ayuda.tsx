import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { ROUTES } from "../routes/paths";

export default function Ayuda() {
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
                Centro de Ayuda
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Encuentra respuestas rápidas sobre cómo usar Reservify tanto si eres
                comensal como si administras un restaurante.
              </p>
            </div>
          </header>

          <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Soy cliente, ¿cómo reservo?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                1. Busca un restaurante por nombre, tipo de cocina o ubicación.{" "}
                2. Elige la fecha, hora y número de personas. 3. Confirma la reserva y
                revisa el correo de confirmación. Algunas reservas pueden requerir
                pago o garantía según las políticas del restaurante.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">
                No recibí el correo de confirmación
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Revisa tu bandeja de spam o correo no deseado. Si no aparece en unos
                minutos, verifica que el correo registrado sea correcto en tu perfil
                y vuelve a intentarlo. Si el problema persiste, contáctanos desde la
                sección de Contacto indicando la fecha y restaurante de la reserva.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">
                Soy dueño de un restaurante, ¿cómo administro mis reservas?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Accede al panel para dueños con tu usuario y contraseña. Desde allí
                podrás ver reservas en tiempo real, bloquear horarios, configurar tu
                capacidad, gestionar mesas y revisar métricas de ocupación para tomar
                mejores decisiones operativas.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">
                ¿Cómo reporto un problema o incidente?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Si detectas un error en la plataforma, un cobro que no reconoces o un
                comportamiento inadecuado, por favor envíanos un mensaje detallado
                desde la página de Contacto. Incluye capturas de pantalla si es
                posible; esto nos ayuda a resolver la incidencia más rápido.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

