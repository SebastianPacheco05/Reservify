"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  User,
  Phone,
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  Loader2,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";
import type { Restaurant } from "@/types/dashboard";

const SECCIONES = [
  { key: "activas", titulo: "Activas", estados: ["confirmada", "en curso"] },
  { key: "pendientes", titulo: "Pendientes", estados: ["pendiente", "no presentada"] },
  { key: "finalizadas", titulo: "Finalizadas", estados: ["finalizada"] },
  { key: "canceladas", titulo: "Canceladas", estados: ["cancelada"] },
] as const;

function agruparPorSeccion(reservas: Reserva[]) {
  const grupos: Record<string, Reserva[]> = {
    activas: [],
    pendientes: [],
    finalizadas: [],
    canceladas: [],
  };
  for (const r of reservas) {
    const estado = (r.estado_reserva || "").toLowerCase().trim();
    if ((SECCIONES[0].estados as readonly string[]).includes(estado)) grupos.activas.push(r);
    else if ((SECCIONES[1].estados as readonly string[]).includes(estado)) grupos.pendientes.push(r);
    else if ((SECCIONES[2].estados as readonly string[]).includes(estado)) grupos.finalizadas.push(r);
    else if ((SECCIONES[3].estados as readonly string[]).includes(estado)) grupos.canceladas.push(r);
  }
  return grupos;
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatearHora(horario: string) {
  if (!horario) return horario;
  const [h, m] = String(horario).split(":");
  return `${h}:${m || "00"}`;
}

interface RestaurantReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
}

export function RestaurantReservationsModal({
  isOpen,
  onClose,
  restaurant,
}: RestaurantReservationsModalProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && restaurant?.id) {
      setSelectedReserva(null);
      setMotivoCancelacion("");
      setShowCancelDialog(false);
      loadReservas();
    }
  }, [isOpen, restaurant?.id]);

  const loadReservas = async () => {
    if (!restaurant?.id) return;
    setLoading(true);
    try {
      const res = await OwnerReservationsService.getReservationsByRestaurant(Number(restaurant.id));
      setReservas(res.reservas || []);
    } catch (e) {
      console.error(e);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (r: Reserva) => {
    setUpdatingId(r.id_reserva);
    try {
      await OwnerReservationsService.updateReservationStatus(r.id_reserva, "activa");
      await loadReservas();
      setSelectedReserva(null);
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Error al confirmar");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelarClick = () => {
    setShowCancelDialog(true);
  };

  const MAX_MOTIVO = 250;

  const handleCancelarConfirm = async () => {
    if (!selectedReserva || !motivoCancelacion.trim()) {
      alert("Escribe el motivo de la cancelación.");
      return;
    }
    if (motivoCancelacion.length > MAX_MOTIVO) {
      alert(`El motivo no puede superar los ${MAX_MOTIVO} caracteres.`);
      return;
    }
    setCancelando(true);
    try {
      await OwnerReservationsService.updateReservationStatus(
        selectedReserva.id_reserva,
        "cancelada",
        motivoCancelacion.trim()
      );
      await loadReservas();
      setSelectedReserva(null);
      setShowCancelDialog(false);
      setMotivoCancelacion("");
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Error al cancelar");
    } finally {
      setCancelando(false);
    }
  };

  const grupos = agruparPorSeccion(reservas);
  const puedeConfirmar = (r: Reserva) =>
    ["pendiente", "no presentada"].includes((r.estado_reserva || "").toLowerCase().trim());
  const puedeCancelar = (r: Reserva) => {
    const e = (r.estado_reserva || "").toLowerCase().trim();
    return ["pendiente", "no presentada", "confirmada", "en curso"].includes(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[920px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle>Reservas — {restaurant?.name ?? "Restaurante"}</DialogTitle>
          <DialogDescription>
            Listado por secciones. Haz clic en una reserva para ver detalle y cambiar estado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Listado por secciones */}
          <div className="w-1/2 border-r overflow-y-auto p-4 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              SECCIONES.map(({ key, titulo }) => (
                <div key={key}>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    {titulo}
                    <Badge variant="secondary" className="font-normal">
                      {grupos[key].length}
                    </Badge>
                  </h3>
                  <ul className="space-y-1">
                    {grupos[key].map((r) => (
                      <li
                        key={r.id_reserva}
                        onClick={() => setSelectedReserva(r)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedReserva?.id_reserva === r.id_reserva
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <UtensilsCrossed className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate font-medium">#{r.id_reserva}</span>
                          <span className="text-sm text-muted-foreground truncate">
                            {r.cliente_nombre} · {formatearHora(r.horario)}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </li>
                    ))}
                    {grupos[key].length === 0 && (
                      <li className="text-sm text-muted-foreground py-2">Sin reservas</li>
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* Detalle de la reserva seleccionada */}
          <div className="w-1/2 overflow-y-auto p-4 bg-muted/20">
            {selectedReserva ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Detalle de la reserva #{selectedReserva.id_reserva}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedReserva(null)}
                    aria-label="Cerrar detalle"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selectedReserva.cliente_nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selectedReserva.cliente_telefono || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{formatearFecha(selectedReserva.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{formatearHora(selectedReserva.horario)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>Mesa {selectedReserva.id_mesa} (hasta {selectedReserva.cant_personas} personas)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selectedReserva.num_comensales} comensales</span>
                  </div>
                  {selectedReserva.ajuste && (
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Ajuste / Observaciones</p>
                      <p className="text-foreground">{selectedReserva.ajuste}</p>
                    </div>
                  )}
                  {selectedReserva.motivo_cancelacion && (
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Motivo de cancelación</p>
                      <p className="text-foreground">{selectedReserva.motivo_cancelacion}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {puedeConfirmar(selectedReserva) && (
                    <Button
                      size="sm"
                      onClick={() => handleConfirmar(selectedReserva)}
                      disabled={updatingId === selectedReserva.id_reserva}
                    >
                      {updatingId === selectedReserva.id_reserva ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pasar a activa
                        </>
                      )}
                    </Button>
                  )}
                  {puedeCancelar(selectedReserva) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleCancelarClick}
                      disabled={cancelando || updatingId === selectedReserva.id_reserva}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar reserva
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Selecciona una reserva para ver el detalle y gestionar el estado.
              </p>
            )}
          </div>
        </div>

        {/* Diálogo motivo cancelación */}
        {showCancelDialog && selectedReserva && (
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Motivo de la cancelación</DialogTitle>
                <DialogDescription>
                  Indica el motivo de la cancelación (obligatorio, máx. 250 caracteres). Se guardará y se enviará por correo al cliente.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Ej: Mesa no disponible por mantenimiento..."
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
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
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

        <div className="px-6 py-3 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
