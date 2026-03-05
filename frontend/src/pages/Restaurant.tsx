"use client";

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { authFetch, isAuthenticated } from "../services/authService";
import { Skeleton } from "../components/ui/skeleton";
import {
  MapPin,
  Clock,
  Star,
  Calendar,
  Users,
  CreditCard,
  UserCircle,
  ArrowLeft,
} from "lucide-react";

import { useRestaurantData } from "../hooks/useRestaurantData";
import { useToastContext } from "../components/ToastProvider";
import { getApiEndpoint } from "../config/api";
import RestaurantMap from "../components/RestaurantMap";
import ReviewForm from "../components/ReviewForm";
import { ModeToggle } from "../components/mode-toggle";

export default function RestaurantPage() {
  const { toast } = useToastContext();
  const [searchParams] = useSearchParams();
  const restaurantNIT = Number(searchParams.get("nit") || 0);
  const { restaurantInfo, mesas, comentarios, loading, getAvailableSlots } =
    useRestaurantData(restaurantNIT);

  // Asegurar que siempre que entremos/cambiemos de restaurante, el scroll vuelva al inicio
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [restaurantNIT]);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    mesaId: "",
  });
  // Promedio de reseñas: si hay comentarios se calcula desde ellos; si no, se usa el rating del backend
  const ratingPromedio =
    comentarios.length > 0
      ? comentarios.reduce((acc, c) => acc + c.calificacion, 0) / comentarios.length
      : (restaurantInfo?.rating ?? 0);

  const handleDateChange = async (date: string) => {
    setReservationData({ ...reservationData, date });
    if (date) {
      const slots = await getAvailableSlots(date);
      setAvailableSlots(slots);
    }
  };

  const handleBackToHome = () => {
    // Redirige a "/" y fuerza recarga de la página
    window.location.href = "/";
  };

  const handlePaymentReservation = async () => {
    try {
      // Validar que todos los campos estén completos
      if (
        !reservationData.date ||
        !reservationData.time ||
        !reservationData.guests ||
        !reservationData.mesaId
      ) {
        toast({
          title: "Campos incompletos",
          description: "Por favor completa todos los campos de la reserva",
          variant: "warning",
        });
        return;
      }

      // Verificar autenticación usando el nuevo servicio
      if (!isAuthenticated()) {
        toast({
          title: "Sesión requerida",
          description: "Debes iniciar sesión para hacer una reserva",
          variant: "warning",
        });
        return;
      }

      // Obtener el precio de la mesa seleccionada
      const mesaSeleccionada = mesas.find(
        (m) => m.id_mesa.toString() === reservationData.mesaId,
      );
      if (!mesaSeleccionada) {
        toast({
          title: "Error de selección",
          description: "Mesa no encontrada",
          variant: "destructive",
        });
        return;
      }

      // Obtener el email del cliente desde el token JWT
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const emailCliente = tokenPayload.sub;

      if (!emailCliente) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo obtener la información del cliente",
          variant: "destructive",
        });
        return;
      }

      // Usar authFetch que maneja automáticamente la renovación de tokens
      const reservaResponse = await authFetch(
        getApiEndpoint("/facturas/reservar"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // El header Authorization se agrega automáticamente
          },
          body: JSON.stringify({
            p_nit: restaurantNIT,
            p_nombre_restaurante: restaurantInfo?.nombre_restaurante || "",
            p_direccion: restaurantInfo?.direccion || "",
            p_ciudad: "Bogotá",
            p_email_cliente: emailCliente,
            p_id_mesa: parseInt(reservationData.mesaId),
            p_num_comensales: parseInt(reservationData.guests),
            p_horario: reservationData.time,
            p_fecha: reservationData.date,
            p_forma_pago: "Pendiente",
            p_precio_total: mesaSeleccionada.precio,
          }),
        },
      );

      if (!reservaResponse.ok) {
        const errorData = await reservaResponse.json();
        throw new Error(errorData.detail || "Error al procesar la reserva");
      }

      const reservaData = await reservaResponse.json();

      // Guardar datos para la pasarela de pagos
      const paymentData = {
        id_encab_fact: reservaData.id_encab_fact,
        restaurant: restaurantInfo,
        mesa: mesaSeleccionada,
        guests: parseInt(reservationData.guests),
        fecha: reservationData.date,
        horario: reservationData.time,
      };

      sessionStorage.setItem("pendingReservation", JSON.stringify(paymentData));

      // Redirigir a la pasarela de pagos
      window.location.href = "/Pasarela_pagos";
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      toast({
        title: "No pudimos completar tu reserva",
        description:
          "Hubo un problema al validar tu información como cliente. Intenta de nuevo más tarde o comunícate con soporte si el problema persiste.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/50"
          }`}
      />
    ));
  };

  if (loading.info) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" /> Volver
            </Link>
            <ModeToggle />
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
          <Skeleton className="h-[28rem] w-full rounded-2xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay información del restaurante después de cargar
  if (!loading.info && !restaurantInfo) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" /> Volver
            </Link>
            <ModeToggle />
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Restaurante no encontrado</h2>
              <p className="text-muted-foreground mb-6">
                No se pudo cargar la información del restaurante. Verifica que el NIT sea correcto.
              </p>
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Barra superior: navegación + cambio de tema */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium rounded-lg px-3 py-2 hover:bg-accent/50"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Volver al inicio</span>
            <span className="sm:hidden">Volver</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logoreservify.png" alt="Reservify" className="h-8 dark:invert" />
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-10">
        {/* Hero imagen */}
        {restaurantInfo && (
          <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden group shadow-xl ring-1 ring-border/50">
            {restaurantInfo.url_image && restaurantInfo.url_image.trim() ? (
              <img
                src={restaurantInfo.url_image}
                alt={restaurantInfo.nombre_restaurante}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='400' y='200' fill='%23999' text-anchor='middle' dy='.3em' font-size='24'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sin imagen principal</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                {restaurantInfo.nombre_restaurante}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {renderStars(Math.round(ratingPromedio))}
                  <span className="text-sm font-medium text-white/95">{ratingPromedio.toFixed(1)}</span>
                </div>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                  {restaurantInfo.nombre_categoria}
                </Badge>
                <Badge
                  variant={restaurantInfo.availabletoday ? "default" : "secondary"}
                  className={restaurantInfo.availabletoday ? "bg-primary text-primary-foreground border-0" : "bg-white/20 text-white border-0"}
                >
                  {restaurantInfo.availabletoday ? "Disponible hoy" : "No disponible"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Descripción */}
            {restaurantInfo && (
              <Card className="border-border bg-card shadow-sm overflow-hidden">
                <CardContent className="">
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {restaurantInfo.descripcion_restaurante}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Galería de Imágenes de Referencia */}
            {restaurantInfo && (
              <Card className="border-border bg-card shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-foreground">Galería de Imágenes</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {restaurantInfo.imagenes_referencia?.length
                      ? `${restaurantInfo.imagenes_referencia.length} ${restaurantInfo.imagenes_referencia.length === 1 ? "imagen" : "imágenes"} de referencia`
                      : "Imágenes de referencia del restaurante"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {restaurantInfo.imagenes_referencia && restaurantInfo.imagenes_referencia.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                      {restaurantInfo.imagenes_referencia.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="aspect-square rounded-lg overflow-hidden bg-muted border border-border"
                        >
                          <img
                            src={url}
                            alt={`Imagen de referencia ${index + 1} - ${restaurantInfo.nombre_restaurante}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              t.onerror = null;
                              t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext x='100' y='100' fill='%23999' text-anchor='middle' dy='.3em' font-size='14'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 aspect-video flex items-center justify-center min-h-[200px]">
                      <p className="text-muted-foreground text-center px-4">
                        Este restaurante aún no tiene imágenes de referencia.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Información de Contacto */}
            {restaurantInfo && (
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Información del Restaurante</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Dirección</p>
                        <p className="text-muted-foreground text-sm mt-0.5">
                          {restaurantInfo.direccion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Horarios</p>
                        <p className="text-muted-foreground text-sm mt-0.5">
                          {restaurantInfo.horario_apertura} – {restaurantInfo.horario_cierre}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mapa del Restaurante (solo este NIT) */}
            {restaurantInfo && (
              <Card className="border-border bg-card shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Ubicación en el mapa</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Visualiza la ubicación exacta de este restaurante.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RestaurantMap
                    onlyNit={restaurantInfo.nit}
                    initialCenter={
                      restaurantInfo.lat != null && restaurantInfo.lng != null
                        ? { lat: restaurantInfo.lat, lng: restaurantInfo.lng }
                        : undefined
                    }
                  />
                </CardContent>
              </Card>
            )}

            {/* Mesas Disponibles */}
            {!loading.mesas && mesas.length > 0 && (
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Mesas Disponibles</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Seleccione una mesa para su reserva
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {mesas
                      .filter((mesa) => mesa.estado_de_disponibilidad)
                      .map((mesa) => (
                        <div
                          key={mesa.id_mesa}
                          className="border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 bg-card transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              Mesa #{mesa.id_mesa}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              Disponible
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {mesa.cant_personas} personas
                            </span>
                          </div>
                          <p className="font-bold text-lg text-primary">
                            ${mesa.precio.toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formulario de Reseña */}
            <ReviewForm
              restaurantNIT={restaurantNIT}
              onReviewSubmitted={() => {
                // Recargar comentarios después de enviar reseña
                window.location.reload();
              }}
            />

            {/* Reseñas */}
            {!loading.comentarios && comentarios.length > 0 && (
              <Card className="overflow-hidden border-border bg-card shadow-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
                        <Star className="h-6 w-6 text-primary fill-primary" />
                        <span>Reseñas de Clientes</span>
                      </CardTitle>
                      <CardDescription className="mt-2 text-base text-muted-foreground">
                        {comentarios.length}{" "}
                        {comentarios.length === 1 ? "reseña" : "reseñas"} de
                        nuestros clientes
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {ratingPromedio.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-end mt-1">
                        {renderStars(Math.round(ratingPromedio))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {comentarios.map((comentario, index) => {
                      const fecha = new Date(comentario.fecha);
                      const fechaFormateada = fecha.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      const tiempoRelativo = (() => {
                        const ahora = new Date();
                        const diffMs = ahora.getTime() - fecha.getTime();
                        const diffDias = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24),
                        );
                        if (diffDias === 0) return "Hoy";
                        if (diffDias === 1) return "Ayer";
                        if (diffDias < 7) return `Hace ${diffDias} días`;
                        if (diffDias < 30)
                          return `Hace ${Math.floor(diffDias / 7)} semanas`;
                        if (diffDias < 365)
                          return `Hace ${Math.floor(diffDias / 30)} meses`;
                        return `Hace ${Math.floor(diffDias / 365)} años`;
                      })();

                      return (
                        <div
                          key={comentario.id_comentario}
                          className="group relative bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
                                <UserCircle className="w-10 h-10" />
                              </div>
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-foreground">
                                      {[comentario.nombre, comentario.apellido].filter(Boolean).join(" ") || `Cliente ${index + 1}`}
                                    </h4>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-primary/10 text-primary"
                                    >
                                      Verificado
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                      {renderStars(comentario.calificacion)}
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {comentario.calificacion}.0
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-medium text-foreground">
                                    {tiempoRelativo}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {fechaFormateada}
                                  </div>
                                </div>
                              </div>

                              <p className="text-muted-foreground leading-relaxed mt-3">
                                {comentario.comentario}
                              </p>

                              {/* Indicador de calificación */}
                              <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${comentario.calificacion >= 4
                                      ? "bg-primary/10 text-primary"
                                      : comentario.calificacion >= 3
                                        ? "bg-accent/20 text-accent-foreground"
                                        : "bg-destructive/10 text-destructive"
                                      }`}
                                  >
                                    {comentario.calificacion >= 4
                                      ? "Excelente"
                                      : comentario.calificacion >= 3
                                        ? "Bueno"
                                        : "Regular"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje cuando no hay comentarios */}
            {!loading.comentarios && comentarios.length === 0 && (
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="py-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Aún no hay reseñas
                  </h3>
                  <p className="text-muted-foreground">
                    Sé el primero en dejar una reseña sobre este restaurante
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulario de Reserva */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Hacer Reserva</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Reserve su mesa ahora</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Select
                      onValueChange={(value) =>
                        setReservationData({ ...reservationData, time: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Número de Comensales</Label>
                  <Select
                    onValueChange={(value) =>
                      setReservationData({ ...reservationData, guests: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "persona" : "personas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mesa">Seleccionar Mesa</Label>
                  <Select
                    onValueChange={(value) =>
                      setReservationData({ ...reservationData, mesaId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mesa" />
                    </SelectTrigger>
                    <SelectContent>
                      {mesas
                        .filter((mesa) => mesa.estado_de_disponibilidad)
                        .map((mesa) => (
                          <SelectItem
                            key={mesa.id_mesa}
                            value={mesa.id_mesa.toString()}
                          >
                            Mesa #{mesa.id_mesa} - {mesa.cant_personas} personas -
                            ${mesa.precio}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Hacer Pago de Reserva
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Confirmar Pago de Reserva</DialogTitle>
                      <DialogDescription>
                        Revise los detalles de su reserva antes de proceder al
                        pago
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Resumen de Reserva */}
                      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                        <h3 className="font-semibold text-lg text-foreground">
                          Resumen de Reserva
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Restaurante:</span>
                            <span className="font-medium">
                              {restaurantInfo?.nombre_restaurante ||
                                "No disponible"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="font-medium text-foreground">
                              {reservationData.date
                                ? new Date(
                                  reservationData.date,
                                ).toLocaleDateString("es-ES")
                                : "No seleccionada"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hora:</span>
                            <span className="font-medium text-foreground">
                              {reservationData.time || "No seleccionada"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Comensales:</span>
                            <span className="font-medium text-foreground">
                              {reservationData.guests || "0"} personas
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mesa:</span>
                            <span className="font-medium text-foreground">
                              Mesa #{reservationData.mesaId || "No seleccionada"}{" "}
                              –{" "}
                              {mesas.find(
                                (m) =>
                                  m.id_mesa.toString() === reservationData.mesaId,
                              )?.cant_personas || 0}{" "}
                              personas
                            </span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">Total a Pagar:</span>
                            <span className="text-2xl font-bold text-primary">
                              $
                              {mesas
                                .find(
                                  (m) =>
                                    m.id_mesa.toString() ===
                                    reservationData.mesaId,
                                )
                                ?.precio.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            * El pago se procesará en la siguiente pantalla
                          </p>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handlePaymentReservation}
                        >
                          Proceder al Pago
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Información Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Las reservas se confirman tras el pago</p>
                <p>• Cancelaciones gratuitas hasta 2 horas antes</p>
                <p>• Mesa reservada por 2 horas máximo</p>
                <p>• Aceptamos todas las tarjetas de crédito</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
