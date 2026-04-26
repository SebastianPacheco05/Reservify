"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  Search,
  Info,
  Images,
  Map as MapIcon,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { cn } from "../lib/utils";
import { isCompleteISODate } from "../lib/dateValidators";
import { useRestaurantData } from "../hooks/useRestaurantData";
import { useToastContext } from "../components/ToastProvider";
import { getApiEndpoint } from "../config/api";
import RestaurantMap from "../components/RestaurantMap";
import ReviewForm from "../components/ReviewForm";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Brand } from "../components/Brand";

export default function RestaurantPage() {
  const { toast } = useToastContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restauranteUid = searchParams.get("uid") || "";
  const { restaurantInfo, mesas, comentarios, loading, getAvailableSlots } =
    useRestaurantData(restauranteUid);

  // Asegurar que siempre que entremos/cambiemos de restaurante, el scroll vuelva al inicio
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [restauranteUid]);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [canSearch, setCanSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const rawRole = localStorage.getItem("tipo_usuario") ?? "";
    const normalized = rawRole
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setCanSearch(!!token && normalized === "cliente");
  }, []);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    mesaId: "",
  });
  const getTodayISO = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isReservationTimeAllowed = (date: string, time: string): boolean => {
    const rawDate = (date || "").trim();
    const rawTime = (time || "").trim();
    if (!rawDate || !rawTime) return false;

    const today = getTodayISO();
    if (rawDate < today) return false;
    if (rawDate > today) return true;

    const [hhStr, mmStr] = rawTime.split(":");
    const hh = Number.parseInt(hhStr ?? "", 10);
    const mm = Number.parseInt(mmStr ?? "", 10);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return false;

    const now = new Date();
    const selectedMinutes = hh * 60 + mm;
    const thresholdMinutes = now.getHours() * 60 + now.getMinutes() + 120; // 2 horas mínimas de anticipación
    return selectedMinutes >= thresholdMinutes;
  };
  const [detailTab, setDetailTab] = useState<"resumen" | "fotos" | "mapa" | "reseñas">("resumen");
  const [descExpanded, setDescExpanded] = useState(false);
  /** Índice de imagen abierta en el visor a pantalla completa; null = cerrado */
  const [photoLightboxIndex, setPhotoLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (detailTab !== "fotos") setPhotoLightboxIndex(null);
  }, [detailTab]);

  // Capacidad de personas según la mesa seleccionada (para limitar el dropdown).
  const selectedMesa = reservationData.mesaId
    ? mesas.find((m) => m.id_mesa.toString() === reservationData.mesaId)
    : null;
  const selectedMesaCantPersonas = selectedMesa?.cant_personas ?? 0;

  // Fallback si todavía no hay mesa seleccionada: usamos el máximo global de las mesas del restaurante.
  const globalMaxGuests = Math.max(
    0,
    ...mesas.map((m) => Number(m.cant_personas ?? 0) || 0),
  );
  const maxGuests = selectedMesaCantPersonas > 0 ? selectedMesaCantPersonas : globalMaxGuests > 0 ? globalMaxGuests : 1;

  // Si el usuario cambia la mesa y el número de comensales supera la capacidad,
  // ajustamos automáticamente para mantener la reserva válida.
  useEffect(() => {
    if (!reservationData.mesaId) return;
    if (selectedMesaCantPersonas <= 0) return;
    if (!reservationData.guests) return;

    const currentGuests = parseInt(reservationData.guests, 10);
    if (Number.isNaN(currentGuests)) return;

    if (currentGuests > selectedMesaCantPersonas) {
      setReservationData((prev) => ({
        ...prev,
        guests: String(selectedMesaCantPersonas),
      }));
    }
  }, [reservationData.mesaId, reservationData.guests, selectedMesaCantPersonas]);

  // Promedio de reseñas: si hay comentarios se calcula desde ellos; si no, se usa el rating del backend
  const ratingPromedio =
    comentarios.length > 0
      ? comentarios.reduce((acc, c) => acc + c.calificacion, 0) / comentarios.length
      : (restaurantInfo?.rating ?? 0);

  /** Espera 1 s tras dejar de cambiar la fecha y solo pide slots si YYYY-MM-DD es válida. */
  const SLOTS_DEBOUNCE_MS = 1000;

  const handleDateChange = (date: string) => {
    setReservationData((prev) => ({
      ...prev,
      date,
      time: "",
    }));
  };

  useEffect(() => {
    const raw = reservationData.date?.trim() ?? "";

    if (!raw) {
      setAvailableSlots([]);
      return;
    }

    if (!isCompleteISODate(raw)) {
      setAvailableSlots([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const slots = await getAvailableSlots(raw);
      if (!cancelled) {
        setAvailableSlots(slots);
      }
    }, SLOTS_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reservationData.date, getAvailableSlots]);

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

      if (!isReservationTimeAllowed(reservationData.date, reservationData.time)) {
        toast({
          title: "Hora no válida",
          description:
            "Para reservas del día de hoy debes elegir una hora con al menos 2 horas de anticipación.",
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
            p_restaurante_uid: restauranteUid,
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

  const formatReservationDate = (dateValue: string): string => {
    const raw = (dateValue || "").trim();
    if (!raw) return "No seleccionada";

    // Evita el desfase por zona horaria de new Date("YYYY-MM-DD")
    // y muestra exactamente la fecha elegida por el usuario.
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return raw;
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  };

  if (loading.info) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" /> Volver
            </Link>
            <AnimatedThemeToggler />
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
          <Skeleton className="h-48 sm:h-52 w-full rounded-2xl" />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-6">
            <div className="space-y-4 order-2 xl:order-1">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-2xl" />
            </div>
            <div className="order-1 xl:order-2">
              <Skeleton className="h-72 w-full rounded-xl" />
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
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" /> Volver
            </Link>
            <AnimatedThemeToggler />
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium rounded-xl px-3 py-2 hover:bg-primary/10 hover:shadow-[0_0_0_1px_rgba(255,106,0,0.22)]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Volver al inicio</span>
            <span className="sm:hidden">Volver</span>
          </button>
          <div className="flex items-center gap-2">
            {canSearch && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = searchValue.trim();
                  if (!q) return;
                  navigate(`/buscar?q=${encodeURIComponent(q)}`);
                  setSearchValue("");
                }}
                className="relative w-[160px] sm:w-[220px]"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar..."
                  className="pl-9 pr-10 h-9 rounded-xl bg-card/70 border-border/60 focus-visible:ring-primary/30"
                  aria-label="Buscar restaurantes"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 rounded-lg px-2"
                  variant="secondary"
                >
                  Ir
                </Button>
              </form>
            )}
            <Brand variant="full" className="h-8 w-auto object-contain" alt="Reservify" />
            <AnimatedThemeToggler />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-5">
        {/* Hero compacto: menos altura para ver reserva y pestañas antes */}
        {restaurantInfo && (
          <div className="relative h-44 sm:h-52 md:h-56 rounded-2xl overflow-hidden group shadow-lg ring-1 ring-border/50">
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
              <div className="w-full h-full bg-linear-to-br from-muted to-muted/80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sin imagen principal</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg leading-tight">
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

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(300px,22rem)] gap-6 xl:gap-8 xl:items-start">
          {/* Columna principal: pestañas para menos scroll vertical */}
          <div className="order-2 xl:order-1 space-y-4 min-w-0">
            {restaurantInfo && (
              <>
                <div
                  role="tablist"
                  aria-label="Secciones del restaurante"
                  className="sticky top-18 z-20 -mx-1 px-1 py-2 bg-background/95 backdrop-blur-md border-b border-border/80 xl:static xl:bg-transparent xl:backdrop-blur-none xl:border-0 xl:px-0"
                >
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {(
                      [
                        { id: "resumen" as const, label: "Resumen", Icon: Info },
                        { id: "fotos" as const, label: "Fotos", Icon: Images },
                        { id: "mapa" as const, label: "Mapa", Icon: MapIcon },
                        { id: "reseñas" as const, label: "Reseñas", Icon: MessageSquare },
                      ] as const
                    ).map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={detailTab === id}
                        onClick={() => setDetailTab(id)}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                          detailTab === id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card/50 p-4 sm:p-5 shadow-sm">
                  {detailTab === "resumen" && (
                    <div className="space-y-5">
                      <div>
                        <p
                          className={cn(
                            "text-sm leading-relaxed text-muted-foreground",
                            !descExpanded && "line-clamp-4",
                          )}
                        >
                          {restaurantInfo.descripcion_restaurante}
                        </p>
                        {(restaurantInfo.descripcion_restaurante?.length ?? 0) > 220 && (
                          <button
                            type="button"
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {descExpanded ? "Ver menos" : "Ver más"}
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", descExpanded && "rotate-180")}
                            />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-3 text-sm">
                          <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Dirección</p>
                            <p className="text-muted-foreground mt-0.5">{restaurantInfo.direccion}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-3 text-sm">
                          <Clock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Horario</p>
                            <p className="text-muted-foreground mt-0.5">
                              {restaurantInfo.horario_apertura} – {restaurantInfo.horario_cierre}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!loading.mesas && mesas.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Mesas del restaurante
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            {mesas.map((mesa) => (
                              <div
                                key={mesa.id_mesa}
                                className="min-w-[220px] shrink-0 rounded-xl border border-border bg-background px-3 py-2 text-left shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-foreground">Mesa #{mesa.id_mesa}</p>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full border ${mesa.estado_de_disponibilidad
                                        ? "border-emerald-500/40 text-emerald-400"
                                        : "border-rose-500/40 text-rose-400"
                                      }`}
                                  >
                                    {mesa.estado_de_disponibilidad ? "Disponible" : "No disponible"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Users className="h-3 w-3" />
                                  {mesa.cant_personas} pers.
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                                  {mesa.descripcion?.trim() || "Sin descripción"}
                                </p>
                                <p className="text-sm font-bold text-primary mt-1">${mesa.precio.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === "fotos" && restaurantInfo && (() => {
                    const gallery = restaurantInfo.imagenes_referencia ?? [];
                    if (gallery.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Este restaurante aún no tiene imágenes de referencia.
                        </p>
                      );
                    }
                    const total = gallery.length;
                    return (
                      <>
                        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">Galería</p>
                          <p className="text-xs text-muted-foreground">
                            {total} {total === 1 ? "foto" : "fotos"} · Toca una para ampliarla
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {gallery.map((url, index) => (
                            <button
                              key={`${url}-${index}`}
                              type="button"
                              onClick={() => setPhotoLightboxIndex(index)}
                              className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              <img
                                src={url}
                                alt={`${restaurantInfo.nombre_restaurante} — foto ${index + 1} de ${total}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  t.onerror = null;
                                  t.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3C/svg%3E";
                                }}
                              />
                              <span className="sr-only">Abrir imagen {index + 1} en grande</span>
                            </button>
                          ))}
                        </div>

                        <Dialog
                          open={photoLightboxIndex !== null}
                          onOpenChange={(open) => !open && setPhotoLightboxIndex(null)}
                        >
                          <DialogContent
                            showCloseButton={false}
                            className="max-h-[95vh] w-[min(100vw-1rem,56rem)] max-w-[calc(100vw-1rem)] gap-0 border-border/80 bg-background/95 p-0 sm:p-0 overflow-hidden"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-border/80 bg-muted/30 px-3 py-2 sm:px-4">
                              <DialogTitle className="text-sm font-medium text-foreground">
                                {restaurantInfo.nombre_restaurante}
                                {photoLightboxIndex !== null && (
                                  <span className="ml-2 font-normal text-muted-foreground">
                                    · {photoLightboxIndex + 1} / {total}
                                  </span>
                                )}
                              </DialogTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 rounded-full"
                                onClick={() => setPhotoLightboxIndex(null)}
                                aria-label="Cerrar galería"
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/90 p-2 sm:p-4">
                              {photoLightboxIndex !== null && (
                                <img
                                  src={gallery[photoLightboxIndex]}
                                  alt=""
                                  className="max-h-[min(78vh,720px)] w-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              {photoLightboxIndex !== null && total > 1 && (
                                <>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="absolute left-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-border/80 bg-background/90 shadow-md sm:left-2"
                                    onClick={() =>
                                      setPhotoLightboxIndex((i) =>
                                        i === null ? null : i === 0 ? total - 1 : i - 1,
                                      )
                                    }
                                    aria-label="Foto anterior"
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-border/80 bg-background/90 shadow-md sm:right-2"
                                    onClick={() =>
                                      setPhotoLightboxIndex((i) =>
                                        i === null ? null : i === total - 1 ? 0 : i + 1,
                                      )
                                    }
                                    aria-label="Foto siguiente"
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    );
                  })()}

                  {detailTab === "mapa" && restaurantInfo && (
                    <div className="rounded-xl overflow-hidden border border-border -m-1">
                      <RestaurantMap
                        onlyNit={restaurantInfo.nit}
                        mapHeightClassName="h-[200px] sm:h-[240px]"
                        initialCenter={
                          restaurantInfo.lat != null && restaurantInfo.lng != null
                            ? { lat: restaurantInfo.lat, lng: restaurantInfo.lng }
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {detailTab === "reseñas" && (
                    <div className="space-y-4 max-h-[min(520px,70vh)] overflow-y-auto pr-1 -mr-1">
                      <ReviewForm
                        restauranteUid={restauranteUid}
                        onReviewSubmitted={() => window.location.reload()}
                      />
                      {!loading.comentarios && comentarios.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-border">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {comentarios.length}{" "}
                              {comentarios.length === 1 ? "opinión" : "opiniones"} · {ratingPromedio.toFixed(1)}
                            </p>
                            <div className="flex">{renderStars(Math.round(ratingPromedio))}</div>
                          </div>
                          {comentarios.map((comentario, index) => {
                            const fecha = new Date(comentario.fecha);
                            const fechaFormateada = fecha.toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                            return (
                              <div
                                key={comentario.id_comentario}
                                className="rounded-xl border border-border bg-background/80 p-4 text-sm"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <UserCircle className="h-8 w-8 shrink-0 text-primary" />
                                    <div className="min-w-0">
                                      <p className="font-medium text-foreground truncate">
                                        {[comentario.nombre, comentario.apellido].filter(Boolean).join(" ") ||
                                          `Cliente ${index + 1}`}
                                      </p>
                                      <div className="flex items-center gap-1 mt-0.5">
                                        {renderStars(comentario.calificacion)}
                                        <span className="text-xs text-muted-foreground">{comentario.calificacion}.0</span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground shrink-0">{fechaFormateada}</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{comentario.comentario}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!loading.comentarios && comentarios.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          Aún no hay reseñas. ¡Sé el primero!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Reserva: primero en móvil para menos scroll hasta reservar */}
          <div className="order-1 xl:order-2 space-y-4">
            <Card className="xl:sticky xl:top-20 border-border bg-card shadow-lg ring-1 ring-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Hacer Reserva</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Reserve su mesa ahora</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getTodayISO()}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time">Hora</Label>
                    <Select
                      key={reservationData.date || "sin-fecha"}
                      value={reservationData.time || undefined}
                      onValueChange={(value) =>
                        setReservationData((prev) => ({ ...prev, time: value }))
                      }
                      disabled={!reservationData.date}
                    >
                      <SelectTrigger id="time" className="w-full">
                        <SelectValue
                          placeholder={
                            reservationData.date
                              ? "Seleccionar hora"
                              : "Primero elige una fecha"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {reservationData.date && availableSlots.length === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-500">
                        No hay franjas disponibles para este día. Si reservas para hoy, recuerda
                        que debes elegir un horario con mínimo 2 horas de anticipación.
                      </p>
                    )}
                    {!reservationData.date && (
                      <p className="text-xs text-muted-foreground">
                        Las horas se cargan después de elegir la fecha.
                      </p>
                    )}
                  </div>
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

                <div>
                  <Label htmlFor="guests">Número de Comensales</Label>
                  <Select
                    value={reservationData.guests || undefined}
                    onValueChange={(value) =>
                      setReservationData({ ...reservationData, guests: value })
                    }
                    disabled={!reservationData.mesaId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          reservationData.mesaId
                            ? "Seleccionar"
                            : "Seleccione una mesa primero"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: maxGuests }, (_, idx) => idx + 1).map(
                        (num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "persona" : "personas"}
                          </SelectItem>
                        ),
                      )}
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
                  <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                              {formatReservationDate(reservationData.date)}
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

            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-3 py-3 text-[11px] leading-snug text-muted-foreground">
              <p className="font-medium text-foreground mb-1.5">Antes de pagar</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Confirmación al completar el pago</li>
                <li>Cancelación gratis hasta 2 h antes</li>
                <li>Mesa hasta 2 h · tarjetas aceptadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
