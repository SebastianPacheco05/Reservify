"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/sidebar";
import { MetricCards } from "../components/ui/metric-cards";
import { MonthlyChart } from "../components/ui/monthly-chart";
import { InvoicesTable } from "../components/ui/invoices-table";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import type { MonthlyFlow, Invoice } from "../types/dashboard";
import { OwnerMetricsService, type OwnerMetrics } from "../services/OwnerMetricsService";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { AllReservationsModal } from "../components/AllReservationsModal";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getSectionTitle(tab: string): string {
  const titles: Record<string, string> = {
    overview: "Resumen",
    restaurants: "Mi Restaurante",
    reservations: "Reservas",
    analytics: "Análisis y Métricas",
    invoices: "Facturación",
    customers: "Clientes",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

interface RestauranteGestor {
  nit: number;
  nombre_restaurante: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<OwnerMetrics>({
    total_restaurantes: 0,
    reservas_activas: 0,
    revenue_mes: 0,
  });
  const [restaurante, setRestaurante] = useState<RestauranteGestor | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingRestaurante, setIsLoadingRestaurante] = useState(true);
  const [isAllReservationsOpen, setIsAllReservationsOpen] = useState(false);
  const [monthlyFlow, setMonthlyFlow] = useState<MonthlyFlow[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const data = await OwnerMetricsService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };
    loadMetrics();
  }, []);

  useEffect(() => {
    const loadRestaurante = async () => {
      setIsLoadingRestaurante(true);
      try {
        const res = await authFetch(getApiEndpoint("/data-owner/restaurantes"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const list = data.restaurantes || [];
        if (list.length > 0) setRestaurante(list[0]);
      } catch (error) {
        console.error("Error al cargar restaurante:", error);
      } finally {
        setIsLoadingRestaurante(false);
      }
    };
    loadRestaurante();
  }, []);

  useEffect(() => {
    const loadReservas = async () => {
      try {
        const data = await OwnerReservationsService.getRecentReservations();
        setReservas(data);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };
    loadReservas();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {isLoadingMetrics ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
              </div>
            ) : (
              <MetricCards
                totalRestaurants={metrics.total_restaurantes}
                totalReservations={metrics.reservas_activas}
                monthlyRevenue={metrics.revenue_mes}
              />
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              <MonthlyChart data={monthlyFlow.length ? monthlyFlow.slice(-6) : []} />
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-4">Acciones rápidas</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="default" onClick={() => setIsAllReservationsOpen(true)}>
                    Ver todas las reservas
                  </Button>
                  <Button size="sm" variant="outline">Exportar informe</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "restaurants":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Administras un solo restaurante
            </p>
            {isLoadingRestaurante ? (
              <Skeleton className="h-[140px] rounded-xl" />
            ) : restaurante ? (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">{restaurante.nombre_restaurante}</h3>
                <p className="text-sm text-muted-foreground mt-1">NIT: {restaurante.nit}</p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-muted-foreground">No tienes un restaurante asignado.</p>
              </div>
            )}
          </div>
        );

      case "reservations":
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {reservas.length} reserva{reservas.length !== 1 ? "s" : ""} recientes
              </p>
              <Button size="sm" variant="default" onClick={() => setIsAllReservationsOpen(true)}>
                Ver todas las reservas
              </Button>
            </div>
            {reservas.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-muted-foreground">No hay reservas recientes.</p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card overflow-hidden">
                <ul className="divide-y divide-border">
                  {reservas.slice(0, 10).map((r) => (
                    <li key={r.id_reserva} className="px-4 py-3 flex justify-between items-center">
                      <span className="font-medium">{r.nombre_restaurante}</span>
                      <span className="text-sm text-muted-foreground">{r.fecha} {r.horario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            {isLoadingMetrics ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
              </div>
            ) : (
              <MetricCards
                totalRestaurants={metrics.total_restaurantes}
                totalReservations={metrics.reservas_activas}
                monthlyRevenue={metrics.revenue_mes}
              />
            )}
            <MonthlyChart data={monthlyFlow.length ? monthlyFlow : []} />
          </div>
        );

      case "invoices":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{invoices.length} factura{invoices.length !== 1 ? "s" : ""}</p>
            <InvoicesTable invoices={invoices} />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-[320px] rounded-xl border bg-card">
            <p className="text-muted-foreground">Sección en desarrollo</p>
          </div>
        );
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
              Gestiona tu restaurante, reservas y facturación desde un solo lugar.
            </p>
          </header>

          {renderContent()}
        </motion.div>
      </main>

      <AllReservationsModal
        isOpen={isAllReservationsOpen}
        onClose={() => setIsAllReservationsOpen(false)}
      />
    </div>
  );
}
