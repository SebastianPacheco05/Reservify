"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { User, Phone, Calendar, Clock, Users, UtensilsCrossed, Loader2, Search, X } from "lucide-react";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";

interface AllReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Filtro inicial por fecha (YYYY-MM-DD). Si se proporciona, solo se muestran reservas de ese día. */
  fechaInicial?: string;
}

export function AllReservationsModal({ isOpen, onClose, fechaInicial }: AllReservationsModalProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [fechaFilter, setFechaFilter] = useState<string>(fechaInicial ?? "");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [cancelReserva, setCancelReserva] = useState<Reserva | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [cancelando, setCancelando] = useState(false);

  const MAX_MOTIVO = 250;

  // Cargar todas las reservas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadAllReservations();
      setFechaFilter(fechaInicial ?? "");
    }
  }, [isOpen, fechaInicial]);

  // Filtrar reservas cuando cambia el searchQuery, estadoFilter, fechaFilter o reservas
  useEffect(() => {
    filterReservations();
  }, [searchQuery, estadoFilter, fechaFilter, reservas]);

  const loadAllReservations = async () => {
    setIsLoading(true);
    try {
      const response = await OwnerReservationsService.getAllReservations();
      setReservas(response.reservas || []);
    } catch (error) {
      console.error("Error al cargar todas las reservas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const puedeActivar = (r: Reserva) => {
    const e = (r.estado_reserva || "").toLowerCase().trim();
    return e === "pendiente" || e === "no presentada";
  };

  const puedeCancelar = (r: Reserva) => {
    const e = (r.estado_reserva || "").toLowerCase().trim();
    return ["pendiente", "no presentada", "confirmada", "en curso"].includes(e);
  };

  const handleActivar = async (r: Reserva) => {
    setUpdatingId(r.id_reserva);
    try {
      await OwnerReservationsService.updateReservationStatus(r.id_reserva, "activa");
      await loadAllReservations();
    } catch (e) {
      console.error("Error al activar reserva:", e);
      alert((e as Error).message || "Error al activar la reserva");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelarClick = (r: Reserva) => {
    setCancelReserva(r);
    setMotivoCancelacion("");
  };

  const handleCancelarConfirm = async () => {
    if (!cancelReserva) return;
    const motivo = motivoCancelacion.trim();
    if (!motivo) {
      alert("Escribe el motivo de la cancelación.");
      return;
    }
    if (motivo.length > MAX_MOTIVO) {
      alert(`El motivo no puede superar los ${MAX_MOTIVO} caracteres.`);
      return;
    }
    setCancelando(true);
    setUpdatingId(cancelReserva.id_reserva);
    try {
      await OwnerReservationsService.updateReservationStatus(cancelReserva.id_reserva, "cancelada", motivo);
      await loadAllReservations();
      setCancelReserva(null);
      setMotivoCancelacion("");
    } catch (e) {
      console.error("Error al cancelar reserva:", e);
      alert((e as Error).message || "Error al cancelar la reserva");
    } finally {
      setCancelando(false);
      setUpdatingId(null);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservas];

    // Filtrar por fecha (YYYY-MM-DD)
    if (fechaFilter) {
      filtered = filtered.filter((reserva) => reserva.fecha === fechaFilter);
    }

    // Filtrar por texto de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reserva) =>
          reserva.cliente_nombre.toLowerCase().includes(query) ||
          reserva.nombre_restaurante.toLowerCase().includes(query) ||
          reserva.cliente_telefono.includes(query) ||
          reserva.id_reserva.toString().includes(query)
      );
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      filtered = filtered.filter(
        (reserva) => reserva.estado_reserva.toLowerCase() === estadoFilter.toLowerCase()
      );
    }

    setFilteredReservas(filtered);
  };

  // Función para obtener el color del badge según el estado
  const getEstadoBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "confirmada":
      case "completada":
        return "bg-primary/10 text-primary border-primary/30";
      case "pendiente":
        return "bg-accent/20 text-accent-foreground border-accent/30";
      case "cancelada":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleClose = () => {
    setSearchQuery("");
    setEstadoFilter("todos");
    onClose();
  };

  // Obtener estados únicos para los filtros
  const estadosUnicos = Array.from(
    new Set(reservas.map((r) => r.estado_reserva))
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Todas las Reservas</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Cargando reservas..."
              : `Mostrando ${filteredReservas.length} de ${reservas.length} reservas totales`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Cargando todas las reservas...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, restaurante, teléfono o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={estadoFilter === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEstadoFilter("todos")}
                  className="whitespace-nowrap"
                >
                  Todos
                </Button>
                {estadosUnicos.map((estado) => (
                  <Button
                    key={estado}
                    variant={estadoFilter === estado ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter(estado)}
                    className="whitespace-nowrap"
                  >
                    {estado}
                  </Button>
                ))}
              </div>
            </div>

            {/* Lista de reservas con scroll */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {filteredReservas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery || estadoFilter !== "todos"
                      ? "No se encontraron reservas con los filtros aplicados"
                      : "No hay reservas disponibles"}
                  </p>
                </div>
              ) : (
                filteredReservas.map((reserva) => (
                  <div
                    key={reserva.id_reserva}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground truncate">
                            {reserva.nombre_restaurante}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            #{reserva.id_reserva}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{reserva.cliente_nombre}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.cliente_telefono}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{formatearFecha(reserva.fecha)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.horario}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.num_comensales} personas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {puedeActivar(reserva) && (
                        <Button
                          size="sm"
                          onClick={() => handleActivar(reserva)}
                          disabled={updatingId === reserva.id_reserva}
                        >
                          {updatingId === reserva.id_reserva ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Pasar a activa"
                          )}
                        </Button>
                      )}
                      {puedeCancelar(reserva) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelarClick(reserva)}
                          disabled={cancelando || updatingId === reserva.id_reserva}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Badge
                        variant="outline"
                        className={`${getEstadoBadge(reserva.estado_reserva)} flex-shrink-0`}
                      >
                        {reserva.estado_reserva}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Diálogo motivo cancelación */}
        {cancelReserva && (
          <Dialog open={!!cancelReserva} onOpenChange={(open) => !open && !cancelando && setCancelReserva(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Motivo de la cancelación</DialogTitle>
                <DialogDescription>
                  Indica el motivo de la cancelación (obligatorio, máx. 250 caracteres). Se guardará y se enviará por correo al cliente.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Ej: No hay disponibilidad por mantenimiento..."
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                rows={4}
                className="resize-none"
                maxLength={MAX_MOTIVO}
              />
              <p className="text-xs text-muted-foreground text-right">
                {motivoCancelacion.length}/{MAX_MOTIVO}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelReserva(null)}
                  disabled={cancelando}
                >
                  Volver
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelarConfirm}
                  disabled={!motivoCancelacion.trim() || cancelando || motivoCancelacion.length > MAX_MOTIVO}
                >
                  {cancelando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar cancelación"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

