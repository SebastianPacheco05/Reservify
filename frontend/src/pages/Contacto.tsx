import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { sendContactEmail, type ContactFormData } from "../services/contactService";
import { ROUTES } from "../routes/paths";

export default function Contacto() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setErrorMessage("Por favor completa al menos tu nombre, email y mensaje.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactEmail(formData);
      setSuccessMessage(
        "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo lo antes posible."
      );
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-muted/80 to-accent/20 dark:from-background dark:to-muted transition-colors duration-300">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={!!localStorage.getItem("access_token")}
        onLogout={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          localStorage.removeItem("tipo_usuario");
          window.location.href = "/";
        }}
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

        <div className="relative z-10 max-w-3xl mx-auto w-full space-y-8">
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
                Contáctanos
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                ¿Tienes dudas, sugerencias o quieres reportar un problema? Escríbenos y el
                equipo de Reservify se pondrá en contacto contigo.
              </p>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="nombre">
                  Nombre completo
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu.correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="asunto">
                Asunto
              </label>
              <Input
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                placeholder="Consulta sobre mi reserva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="mensaje">
                Mensaje
              </label>
              <Textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos en detalle cómo podemos ayudarte."
                rows={6}
                required
              />
            </div>

            {successMessage && (
              <p className="text-sm text-emerald-500">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[160px]"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

