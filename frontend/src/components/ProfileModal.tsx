"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Users, Loader2 } from "lucide-react";
import { useToastContext } from "./ToastProvider";
import { getApiEndpoint } from "../config/api";
import { authFetch } from "../services/authService";

interface PerfilData {
  id_credencial: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: number;
  nacionalidad: string;
  telefono: string;
  id_rol: number;
  email: string;
}

interface Reserva {
  id_reserva: number;
  horario: string;
  fecha: string;
  estado_reserva: string;
  num_comensales: number;
  motivo_cancelacion: string | null;
  nombre_restaurante: string;
  nit: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "perfil" | "reservas";
}

export function ProfileModal({ isOpen, onClose, initialTab = "perfil" }: ProfileModalProps) {
  const { toast } = useToastContext();
  const [activeTab, setActiveTab] = useState<"perfil" | "reservas">(initialTab);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(false);
  const [isLoadingReservas, setIsLoadingReservas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [cancelModalReserva, setCancelModalReserva] = useState<Reserva | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reserva | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Form state
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen && activeTab === "perfil") {
      loadPerfil();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen && activeTab === "reservas") {
      loadReservas();
    }
  }, [isOpen, activeTab]);

  const loadPerfil = async () => {
    setIsLoadingPerfil(true);
    try {
      const res = await authFetch(getApiEndpoint("/cliente/mi-perfil"), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Error al cargar perfil");
      const data = await res.json();
      const p = data.respuesta;
      if (p) {
        setPerfil(p);
        setNombre(p.nombre ?? "");
        setApellido(p.apellido ?? "");
        setEmail(p.email ?? "");
        setPassword("");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error al cargar perfil:", err);
      toast({ title: "No pudimos cargar tu perfil", description: "Inténtalo de nuevo más tarde.", variant: "destructive" });
    } finally {
      setIsLoadingPerfil(false);
    }
  };

  const loadReservas = async () => {
    setIsLoadingReservas(true);
    try {
      const res = await authFetch(getApiEndpoint("/cliente/mis-reservas"), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Error al cargar reservas");
      const data = await res.json();
      setReservas(data.reservas ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error al cargar reservas:", err);
      toast({ title: "No pudimos cargar tus reservas", description: "Inténtalo de nuevo más tarde.", variant: "destructive" });
    } finally {
      setIsLoadingReservas(false);
    }
  };

  const handleSavePerfil = async (e: FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    setIsSaving(true);
    try {
      // Actualizar nombre y apellido
      const resUsuario = await authFetch(getApiEndpoint("/cliente/editarcliente"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_credencial: perfil.id_credencial,
          nombre,
          apellido,
          tipo_documento: perfil.tipo_documento,
          documento: perfil.documento,
          nacionalidad: perfil.nacionalidad,
          telefono: perfil.telefono,
          id_rol: perfil.id_rol,
        }),
      });
      if (!resUsuario.ok) {
        const errData = await resUsuario.json().catch(() => ({}));
        throw new Error(errData.detail ?? "Error al actualizar datos");
      }

      // Actualizar email (y contraseña si se proporcionó)
      const resCred = await authFetch(getApiEndpoint("/credenciales/editarcredencial"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_credencial: perfil.id_credencial,
          email,
          password: password.trim() || undefined,
        }),
      });
      if (!resCred.ok) {
        const errData = await resCred.json().catch(() => ({}));
        throw new Error(errData.detail ?? "Error al actualizar credenciales");
      }

      toast({ title: "Perfil actualizado", description: "Tus datos se guardaron correctamente." });
      setPerfil((prev) => prev ? { ...prev, nombre, apellido, email } : null);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Error al guardar perfil:", err);
      toast({
        title: "No pudimos guardar tus datos",
        description: "Revisa la información ingresada o inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredReservas = reservas.filter((r) =>
    estadoFilter === "todos" ? true : r.estado_reserva.toLowerCase() === estadoFilter.toLowerCase()
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "confirmada":
      case "finalizada":
        return "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-primary shadow-lg shadow-primary/50";
      case "pendiente":
      case "no presentada":
        return "bg-gradient-to-r from-primary to-accent text-primary-foreground border-primary shadow-lg shadow-primary/50";
      case "cancelada":
        return "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground border-destructive shadow-lg shadow-destructive/50";
      default:
        return "bg-gradient-to-r from-muted to-accent text-foreground border-border shadow-lg shadow-muted/50";
    }
  };

  const puedeCancelar = (reserva: Reserva) => {
    const e = reserva.estado_reserva.toLowerCase();
    return e === "pendiente" || e === "confirmada" || e === "en curso";
  };

  const handleCancelarClick = (reserva: Reserva) => {
    if (!puedeCancelar(reserva)) return;
    setCancelTarget(reserva);
    setCancelReason("");
  };

  const handleConfirmCancelar = async () => {
    if (!cancelTarget) return;
    const motivo = cancelReason.trim();
    if (!motivo) {
      toast({ title: "Motivo requerido", description: "Debes indicar el motivo de la cancelación.", variant: "destructive" });
      return;
    }
    if (motivo.length > 250) {
      toast({
        title: "Motivo demasiado largo",
        description: "El motivo no puede superar los 250 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setIsCancelling(true);
    try {
      const res = await authFetch(
        getApiEndpoint(`/cliente/mis-reservas/${cancelTarget.id_reserva}/cancelar`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo_cancelacion: motivo }),
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail ?? "Error al cancelar la reserva");
      }
      toast({ title: "Reserva cancelada", description: "Tu reserva ha sido cancelada correctamente." });
      setCancelTarget(null);
      setCancelReason("");
      await loadReservas();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Error al cancelar reserva:", err);
      toast({
        title: "No pudimos cancelar tu reserva",
        description: "Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const raw = (fecha || "").trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return raw;
    const [, year, month, day] = match;
    return `${day} ${new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("es-ES", {
      month: "short",
    }).replace(".", "")} ${year}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[94vw] sm:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col p-0 bg-linear-to-br from-muted via-background to-accent/20 dark:from-background dark:via-muted dark:to-secondary/20 border-2 border-primary/30 dark:border-primary/50 shadow-2xl">
          <div className="bg-linear-to-r from-primary via-secondary to-accent px-4 py-4 sm:p-6 text-primary-foreground">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl sm:text-3xl font-bold">Mi Perfil</DialogTitle>
              <DialogDescription className="opacity-90 text-sm sm:text-base">
                Gestiona tu información personal y tus reservas
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-4 sm:px-6 pt-3 sm:pt-4">
            <div className="flex border-b-2 border-border gap-2 mb-4 sm:mb-6">
              <Button
                variant={activeTab === "perfil" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("perfil")}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === "perfil"
                    ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                Perfil
              </Button>
              <Button
                variant={activeTab === "reservas" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("reservas")}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === "reservas"
                    ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                Reservas
              </Button>
            </div>
          </div>

          {activeTab === "perfil" && (
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {isLoadingPerfil ? (
                <div className="flex justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando perfil...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSavePerfil} className="space-y-6 bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
                  <div className="space-y-3">
                    <Label htmlFor="nombre" className="text-base font-semibold text-foreground">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      disabled={isSaving}
                      className="h-12 text-base border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="apellido" className="text-base font-semibold text-foreground">
                      Apellido
                    </Label>
                    <Input
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      disabled={isSaving}
                      className="h-12 text-base border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSaving}
                      className="h-12 text-base border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-semibold text-foreground">
                      Nueva contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Dejar vacío para no cambiar"
                      disabled={isSaving}
                      className="h-12 text-base border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
                    />
                    <p className="text-sm text-muted-foreground italic">
                      Deja este campo vacío si no deseas cambiar tu contraseña
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSaving} 
                    className="w-full h-12 text-base font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-lg transition-all duration-200 rounded-lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}

          {activeTab === "reservas" && (
            <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap bg-card/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-border shadow-md">
                {["todos", "pendiente", "confirmada", "cancelada"].map((estado) => (
                  <Button
                    key={estado}
                    variant={estadoFilter === estado ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter(estado)}
                    className={`px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-200 ${
                      estadoFilter === estado
                        ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                        : "border-2 hover:bg-muted hover:border-primary"
                    }`}
                  >
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </Button>
                ))}
              </div>
              {isLoadingReservas ? (
                <div className="flex justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando reservas...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pr-2">
                  {filteredReservas.length === 0 ? (
                    <div className="text-center py-16 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-md">
                      <p className="text-lg text-muted-foreground font-medium">
                        No hay reservas con los filtros aplicados
                      </p>
                    </div>
                  ) : (
                    filteredReservas.map((reserva) => (
                      <div
                        key={reserva.id_reserva}
                        className={`p-4 sm:p-6 border-2 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 ${
                          reserva.estado_reserva.toLowerCase() === "cancelada"
                            ? "cursor-pointer hover:scale-[1.02] border-destructive/50 hover:border-destructive"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-3 flex-1">
                            <p className="font-bold text-lg sm:text-xl text-foreground">
                              {reserva.nombre_restaurante}
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base">
                              <span className="flex items-center gap-2 text-muted-foreground font-medium">
                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                {formatearFecha(reserva.fecha)}
                              </span>
                              <span className="flex items-center gap-2 text-muted-foreground font-medium">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                                {reserva.horario}
                              </span>
                              <span className="flex items-center gap-2 text-muted-foreground font-medium">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                                {reserva.num_comensales} {reserva.num_comensales === 1 ? "persona" : "personas"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getEstadoBadge(reserva.estado_reserva)} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold border-2 shadow-md`}
                          >
                            {reserva.estado_reserva}
                          </Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
                          {reserva.estado_reserva.toLowerCase() === "cancelada" ? (
                            <p className="text-sm text-destructive font-medium italic flex items-center gap-2 cursor-pointer"
                               onClick={() => setCancelModalReserva(reserva)}>
                              <span>👆</span> Clic para ver motivo de cancelación
                            </p>
                          ) : (
                            puedeCancelar(reserva) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelarClick(reserva)}
                                disabled={isCancelling}
                              >
                                Cancelar reserva
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de motivo de cancelación (ver detalle) */}
      <Dialog open={!!cancelModalReserva} onOpenChange={(open) => !open && setCancelModalReserva(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg bg-linear-to-br from-muted via-background to-destructive/10 dark:from-background dark:via-muted dark:to-destructive/20 border-2 border-destructive/50 shadow-2xl">
          <div className="bg-linear-to-r from-destructive via-secondary to-destructive p-6 text-background rounded-t-lg -m-6 mb-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Reserva Cancelada</DialogTitle>
            </DialogHeader>
          </div>
          {cancelModalReserva && (
            <div className="space-y-4">
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg border-2 border-destructive/50 shadow-md">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Reserva #{cancelModalReserva.id_reserva} - {cancelModalReserva.nombre_restaurante}
                </p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border-2 border-destructive/50 shadow-md">
                <DialogDescription className="text-base text-foreground font-medium">
                  {cancelModalReserva.motivo_cancelacion?.trim() ||
                    "No se especificó un motivo de cancelación."}
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para cancelar mi reserva */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && !isCancelling && setCancelTarget(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg bg-card border border-border shadow-xl">
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
            <DialogDescription>
              Indica el motivo de la cancelación (obligatorio, máx. 250 caracteres). Se guardará en el sistema.
            </DialogDescription>
          </DialogHeader>
          {cancelTarget && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Reserva #{cancelTarget.id_reserva} en{" "}
                <span className="font-semibold text-foreground">{cancelTarget.nombre_restaurante}</span>
              </p>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                maxLength={250}
                placeholder="Ej: No podré asistir a la hora reservada..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {cancelReason.length}/250
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelTarget(null)}
                  disabled={isCancelling}
                >
                  Volver
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmCancelar}
                  disabled={isCancelling || !cancelReason.trim() || cancelReason.length > 250}
                >
                  {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar cancelación"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
