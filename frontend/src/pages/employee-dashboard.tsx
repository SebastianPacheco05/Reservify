"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/Sidebar_2";
import { Overview } from "../components/ui/Overview_2";
import { Tables } from "../components/ui/Tables";
import { Reservations } from "../components/ui/Reservations_2";
import { EmailConfigSection } from "../components/EmailConfigSection";
import { EmailsSection } from "../components/EmailsSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Loader2 } from "lucide-react";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { EmployeeRestaurantService } from "../services/EmployeeRestaurantService";
import { EmployeeBalanceService } from "../services/EmployeeBalanceService";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";
import type { MiRestauranteInfo, MiBalanceResponse } from "../types/dashboard";
import type { Table, Reservation } from "../types/employee";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getSectionTitle(tab: string): string {
  const titles: Record<string, string> = {
    overview: "Resumen",
    tables: "Mesas",
    reservations: "Reservas",
    correos: "Correos",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

function mapMesaToTable(m: { id_mesa: number; estado_de_disponibilidad: boolean; cant_personas: number }): Table {
  return {
    id: String(m.id_mesa),
    number: m.id_mesa,
    seats: m.cant_personas ?? 0,
    status: m.estado_de_disponibilidad ? "available" : "occupied",
    section: "Sala",
  };
}

const estadoMap: Record<string, string> = {
  pendiente: "pending",
  confirmada: "confirmed",
  "en curso": "arrived",
  finalizada: "completed",
  cancelada: "cancelled",
  "no presentada": "no_show",
};

function mapReservaToReservation(r: Reserva): Reservation {
  const status = estadoMap[r.estado_reserva?.toLowerCase() ?? ""] ?? "pending";
  return {
    id: String(r.id_reserva),
    customerName: r.cliente_nombre ?? "",
    customerPhone: r.cliente_telefono ?? "",
    date: r.fecha ?? "",
    time: r.horario ?? "",
    guests: r.num_comensales ?? 0,
    status: status as Reservation["status"],
    tableId: r.id_mesa ? String(r.id_mesa) : undefined,
    estimatedDuration: 90,
  };
}

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState<MiRestauranteInfo | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [miBalance, setMiBalance] = useState<MiBalanceResponse>({ total: 0, facturas: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [cancelReservaId, setCancelReservaId] = useState<string | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [cancelando, setCancelando] = useState(false);

  const MAX_MOTIVO = 250;
  const nit = restaurant?.nit;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [restInfo, balance] = await Promise.all([
        EmployeeRestaurantService.getMiRestauranteInfo(),
        EmployeeBalanceService.getMiBalance(),
      ]);
      setRestaurant(restInfo ?? null);
      setMiBalance(balance);
      if (restInfo?.nit) {
        const [mesasRes, reservasRes] = await Promise.all([
          authFetch(getApiEndpoint(`/data-owner/restaurantes/${restInfo.nit}/mesas`), { method: "GET", headers: { "Content-Type": "application/json" } }),
          OwnerReservationsService.getReservationsByRestaurant(restInfo.nit, todayISO()),
        ]);
        const mesasData = await mesasRes.json();
        setTables((mesasData.mesas ?? []).map(mapMesaToTable));
        setReservations((reservasRes.reservas ?? []).map(mapReservaToReservation));
      } else {
        setTables([]);
        setReservations([]);
      }
    } catch (e) {
      console.error("Error al cargar datos empleado:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshReservations = useCallback(async () => {
    if (!nit) return;
    const res = await OwnerReservationsService.getReservationsByRestaurant(nit, todayISO());
    setReservations((res.reservas ?? []).map(mapReservaToReservation));
  }, [nit]);

  const handleConfirmReservation = useCallback(async (id: string) => {
    try {
      await OwnerReservationsService.updateReservationStatus(parseInt(id, 10), "activa");
      await refreshReservations();
    } catch (e) {
      console.error("Error al confirmar reserva:", e);
    }
  }, [refreshReservations]);

  const handleCancelReservationClick = useCallback((id: string) => {
    setCancelReservaId(id);
    setMotivoCancelacion("");
  }, []);

  const handleCancelReservationConfirm = useCallback(async () => {
    if (!cancelReservaId || !motivoCancelacion.trim()) return;
    if (motivoCancelacion.length > MAX_MOTIVO) return;
    setCancelando(true);
    try {
      await OwnerReservationsService.updateReservationStatus(
        parseInt(cancelReservaId, 10),
        "cancelada",
        motivoCancelacion.trim()
      );
      await refreshReservations();
      setCancelReservaId(null);
      setMotivoCancelacion("");
    } catch (e) {
      console.error("Error al cancelar reserva:", e);
      alert((e as Error).message || "Error al cancelar la reserva");
    } finally {
      setCancelando(false);
    }
  }, [cancelReservaId, motivoCancelacion, refreshReservations]);

  const handleCloseCancelModal = useCallback(() => {
    if (!cancelando) {
      setCancelReservaId(null);
      setMotivoCancelacion("");
    }
  }, [cancelando]);

  const ventasDia = (miBalance?.facturas ?? [])
    .filter((f) => f.fecha === todayISO())
    .reduce((sum, f) => sum + (f.precio_total ?? 0), 0);

  const restaurantForOverview = restaurant
    ? {
        id: String(restaurant.nit),
        name: restaurant.nombre_restaurante,
        address: restaurant.direccion,
        phone: "",
        capacity: 0,
        openTime: restaurant.horario_apertura,
        closeTime: restaurant.horario_cierre,
        image: restaurant.url_image || "/placeholder.svg",
      }
    : null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            restaurant={restaurantForOverview}
            tables={tables}
            todayReservations={reservations}
            ventasDia={ventasDia}
            miBalance={miBalance}
            isLoading={isLoading}
          />
        );
      case "tables":
        return <Tables tables={tables} isLoading={isLoading} readOnly />;
      case "reservations":
        return (
          <Reservations
            reservations={reservations}
            tables={tables}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservationClick}
            isLoading={isLoading}
          />
        );
      case "correos":
        return <EmailsSection />;
      case "settings":
        return <EmailConfigSection />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/30 transition-colors duration-300 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto min-w-0">
        <motion.div
          className="pt-14 px-4 pb-6 sm:p-6 md:pt-8 md:p-8 lg:p-10 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <header className="mb-8">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {getSectionTitle(activeTab)}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-xl">
              Gestiona mesas, reservas y cuentas del día desde un solo lugar.
            </p>
          </header>

          {renderContent()}
        </motion.div>
      </main>

      {/* Modal motivo cancelación (empleado) */}
      <Dialog open={!!cancelReservaId} onOpenChange={(open) => !open && handleCloseCancelModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo de la cancelación</DialogTitle>
            <DialogDescription>
              Indica el motivo de la cancelación (obligatorio, máx. 250 caracteres). Se guardará en la reserva y se enviará por correo al cliente.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ej: Mesa no disponible, cambio de horario..."
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
            <Button variant="outline" onClick={handleCloseCancelModal} disabled={cancelando}>
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservationConfirm}
              disabled={!motivoCancelacion.trim() || cancelando || motivoCancelacion.length > MAX_MOTIVO}
            >
              {cancelando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar cancelación"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
