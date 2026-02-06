"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/sidebar";
import { MetricCards } from "../components/ui/metric-cards";
import { RestaurantsGrid } from "../components/ui/restaurants-grid";
import { MonthlyChart } from "../components/ui/monthly-chart";
import { InvoicesTable } from "../components/ui/invoices-table";
import { Skeleton } from "../components/ui/skeleton";
import { restaurants, reservations, monthlyFlow, invoices } from "../data/mockData";
import { Button } from "../components/ui/button";
import { OwnerMetricsService, type OwnerMetrics } from "../services/OwnerMetricsService";

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
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

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
              <MonthlyChart data={monthlyFlow.slice(-6)} />
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-4">Acciones rápidas</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="default">Ver reservas de hoy</Button>
                  <Button size="sm" variant="outline">Exportar informe</Button>
                  <Button size="sm" variant="outline">Añadir restaurante</Button>
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
              <Button size="sm" variant="add">Agregar restaurante</Button>
            </div>
            <RestaurantsGrid restaurants={restaurants} />
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
            <MonthlyChart data={monthlyFlow} />
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
    </div>
  );
}
