"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/sidebar";
import { MetricCards } from "../components/ui/metric-cards";
import { RestaurantsGrid } from "../components/ui/restaurants-grid";
import { MonthlyChart } from "../components/ui/monthly-chart";
import { InvoicesTable } from "../components/ui/invoices-table";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import type { Restaurant, Reservation, MonthlyFlow, Invoice } from "../types/dashboard";
import { OwnerMetricsService, type OwnerMetrics } from "../services/OwnerMetricsService";
import { AddRestaurantModal } from "../components/AddRestaurantModal";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getSectionTitle(tab: string): string {
  const titles: Record<string, string> = {
    overview: "Resumen",
    restaurants: "Mis Restaurantes",
    reservations: "Reservas",
    analytics: "Análisis y Métricas",
    invoices: "Facturación",
    customers: "Clientes",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<OwnerMetrics>({
    total_restaurantes: 0,
    reservas_activas: 0,
    revenue_mes: 0,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [monthlyFlow, setMonthlyFlow] = useState<MonthlyFlow[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  const loadRestaurants = useCallback(async () => {
    setIsLoadingRestaurants(true);
    try {
      const res = await authFetch(getApiEndpoint("/data-owner/restaurantes"), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const list = data.restaurantes || [];
      setRestaurants(
        list.map((r: { nit: number; nombre_restaurante: string; url_image?: string; rating?: number }) => ({
          id: String(r.nit),
          name: r.nombre_restaurante,
          location: "",
          cuisine: "",
          rating: r.rating ?? 0,
          totalTables: 0,
          status: "active" as const,
          image: r.url_image?.trim() || "/vite.svg",
        }))
      );
    } catch (error) {
      console.error("Error al cargar restaurantes:", error);
    } finally {
      setIsLoadingRestaurants(false);
    }
  }, []);

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
    loadRestaurants();
  }, [loadRestaurants]);

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
                  <Button size="sm" variant="default">Ver reservas de hoy</Button>
                  <Button size="sm" variant="outline">Exportar informe</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddRestaurantOpen(true)}>
                    Añadir restaurante
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "restaurants":
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {restaurants.length} restaurante{restaurants.length !== 1 ? "s" : ""} administrado{restaurants.length !== 1 ? "s" : ""}
              </p>
              <Button size="sm" variant="add" onClick={() => setIsAddRestaurantOpen(true)}>
                Agregar restaurante
              </Button>
            </div>
            {isLoadingRestaurants ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[240px] rounded-xl" />
                ))}
              </div>
            ) : (
              <RestaurantsGrid restaurants={restaurants} />
            )}
          </div>
        );

      case "reservations":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} en total
            </p>
            <div className="rounded-xl border bg-card p-8 text-center">
              <p className="text-muted-foreground">Vista de reservas próximamente.</p>
            </div>
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
            <p className="text-sm text-muted-foreground">{invoices.length} facturas</p>
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
              Gestiona tus restaurantes, reservas y facturación desde un solo lugar.
            </p>
          </header>

          {renderContent()}
        </motion.div>
      </main>

      <AddRestaurantModal
        isOpen={isAddRestaurantOpen}
        onClose={() => setIsAddRestaurantOpen(false)}
        onSuccess={loadRestaurants}
      />
    </div>
  );
}
