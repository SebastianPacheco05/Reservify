"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/sidebar";
import { MetricCards } from "../components/ui/metric-cards";
import { MonthlyChart } from "../components/ui/monthly-chart";
import { InvoicesTable } from "../components/ui/invoices-table";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import type { MonthlyFlow, Invoice, DailyFlow, ClienteGestor } from "../types/dashboard";
import { OwnerMetricsService, type OwnerMetrics } from "../services/OwnerMetricsService";
import { OwnerMonthlyFlowService } from "../services/OwnerMonthlyFlowService";
import { OwnerClientesService } from "../services/OwnerClientesService";
import { DailyFlow as DailyFlowChart } from "../components/ui/DailyFlow";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { AllReservationsModal } from "../components/AllReservationsModal";
import { EmailConfigSection } from "../components/EmailConfigSection";
import { EmailsSection } from "../components/EmailsSection";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";
import { OwnerInvoicesService } from "../services/OwnerInvoicesService";
import { RestaurantConfigModal } from "../components/RestaurantConfigModal";
import type { Restaurant } from "../types/dashboard";
import { InvoiceDetailModal } from "../components/InvoiceDetailModal";
import { useToastContext } from "../components/ToastProvider";
import { showErrorToast } from "../lib/toastHelpers";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function exportInvoicesCSV(): Promise<void> {
  const invs = await OwnerInvoicesService.getInvoices();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const delMes = invs.filter((inv) => {
    const d = new Date(inv.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  if (delMes.length === 0) {
    throw new Error("No hay facturas del mes actual para exportar.");
  }
  const headers = "Factura,Restaurante,Fecha,Monto,Estado";
  const rows = delMes.map(
    (i) => `${i.invoiceNumber},"${(i.restaurantName || "").replace(/"/g, '""')}",${i.date},${i.amount},${i.status}`
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `facturas_${year}-${String(month + 1).padStart(2, "0")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
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
    restaurants: "Mis Restaurantes",
    reservations: "Reservas",
    invoices: "Facturación",
    flow: "Flujo diario",
    customers: "Clientes",
    correos: "Correos",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

interface RestauranteGestor {
  restaurante_uid: string;
  nit: number;
  nombre_restaurante: string;
}

export default function AdminDashboard() {
  const { toast } = useToastContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<OwnerMetrics>({
    total_restaurantes: 0,
    reservas_activas: 0,
    revenue_mes: 0,
  });
  const [restaurantes, setRestaurantes] = useState<RestauranteGestor[]>([]);
  const [selectedRestauranteUid, setSelectedRestauranteUid] = useState<string>("");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingRestaurante, setIsLoadingRestaurante] = useState(true);
  const [isAllReservationsOpen, setIsAllReservationsOpen] = useState(false);
  const [allReservationsFechaInicial, setAllReservationsFechaInicial] = useState<string | undefined>();
  const [monthlyFlow, setMonthlyFlow] = useState<MonthlyFlow[]>([]);
  const [flujoDiario, setFlujoDiario] = useState<DailyFlow[]>([]);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [clientes, setClientes] = useState<ClienteGestor[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceDetailId, setInvoiceDetailId] = useState<string | null>(null);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [configModalRestaurant, setConfigModalRestaurant] = useState<Restaurant | null>(null);

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
        const list = Array.isArray(data.restaurantes) ? data.restaurantes : [];
        setRestaurantes(list);
        if (list.length > 0) {
          setSelectedRestauranteUid((prev) => prev || list[0].restaurante_uid);
        }
      } catch (error) {
        console.error("Error al cargar restaurante:", error);
      } finally {
        setIsLoadingRestaurante(false);
      }
    };
    loadRestaurante();
  }, []);

  const restauranteSeleccionado =
    restaurantes.find((r) => r.restaurante_uid === selectedRestauranteUid) ??
    restaurantes[0] ??
    null;

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await OwnerMonthlyFlowService.getMetricasMensuales();
        setMonthlyFlow(data || []);
      } catch (err) {
        console.error("Error al cargar métricas mensuales:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab === "flow") {
      setIsLoadingFlow(true);
      OwnerMonthlyFlowService.getFlujoDiario()
        .then(setFlujoDiario)
        .catch((err) => {
          console.error("Error al cargar flujo diario:", err);
          setFlujoDiario([]);
        })
        .finally(() => setIsLoadingFlow(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "customers") {
      setIsLoadingClientes(true);
      OwnerClientesService.getClientes()
        .then(setClientes)
        .catch((err) => {
          console.error("Error al cargar clientes:", err);
          setClientes([]);
        })
        .finally(() => setIsLoadingClientes(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "invoices") {
      const loadInvoices = async () => {
        setIsLoadingInvoices(true);
        try {
          const data = await OwnerInvoicesService.getInvoices();
          setInvoices(data);
        } catch (error) {
          console.error("Error al cargar facturas:", error);
          setInvoices([]);
        } finally {
          setIsLoadingInvoices(false);
        }
      };
      loadInvoices();
    }
  }, [activeTab]);

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
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setAllReservationsFechaInicial(todayISO());
                      setIsAllReservationsOpen(true);
                    }}
                  >
                    Ver reservas de hoy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAllReservationsFechaInicial(undefined);
                      setIsAllReservationsOpen(true);
                    }}
                  >
                    Ver todas las reservas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await exportInvoicesCSV();
                        toast({ title: "Exportado", description: "Informe CSV descargado correctamente." });
                      } catch (e) {
                        showErrorToast(toast, e, "Error al exportar informe.");
                      }
                    }}
                  >
                    Exportar informe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "restaurants":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Administra varios restaurantes desde este panel.
            </p>
            {isLoadingRestaurante ? (
              <Skeleton className="h-[140px] rounded-xl" />
            ) : restaurantes.length > 0 ? (
              <>
                <div className="max-w-md">
                  <label className="text-xs font-medium text-muted-foreground">Restaurante activo</label>
                  <select
                    value={restauranteSeleccionado?.restaurante_uid ?? ""}
                    onChange={(e) => setSelectedRestauranteUid(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  >
                    {restaurantes.map((r) => (
                      <option key={r.restaurante_uid} value={r.restaurante_uid}>
                        {r.nombre_restaurante} (NIT: {r.nit})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {restaurantes.map((r) => (
                    <div
                      key={r.restaurante_uid}
                      className={`rounded-xl border bg-card p-6 shadow-sm ${
                        restauranteSeleccionado?.restaurante_uid === r.restaurante_uid
                          ? "border-primary/60 ring-1 ring-primary/30"
                          : ""
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-foreground">{r.nombre_restaurante}</h3>
                      <p className="text-sm text-muted-foreground mt-1">NIT: {r.nit}</p>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setConfigModalRestaurant({
                              id: r.restaurante_uid,
                              nit: r.nit,
                              name: r.nombre_restaurante,
                              location: "",
                              cuisine: "",
                              rating: 0,
                              totalTables: 0,
                              status: "active",
                              image: "/vite.svg",
                            })
                          }
                        >
                          Configurar restaurante
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-muted-foreground">No tienes restaurantes asignados.</p>
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

      case "flow":
        return (
          <div className="space-y-6">
            {isLoadingFlow ? (
              <Skeleton className="h-[400px] rounded-xl" />
            ) : (
              <DailyFlowChart data={flujoDiario} />
            )}
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {isLoadingClientes ? "Cargando..." : `${clientes.length} cliente${clientes.length !== 1 ? "s" : ""}`}
            </p>
            {isLoadingClientes ? (
              <Skeleton className="h-[320px] rounded-xl" />
            ) : clientes.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-muted-foreground">No hay clientes con reservas aún.</p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Cliente</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Reservas</th>
                        <th className="text-left p-3 font-medium">Última visita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((c) => (
                        <tr key={c.documento} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3 font-medium">{c.nombre}</td>
                          <td className="p-3">{c.email || "—"}</td>
                          <td className="p-3">{c.total_reservas}</td>
                          <td className="p-3">{c.ultima_visita || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case "invoices":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {isLoadingInvoices ? "Cargando..." : `${invoices.length} factura${invoices.length !== 1 ? "s" : ""}`}
            </p>
            {isLoadingInvoices ? (
              <Skeleton className="h-[320px] rounded-xl" />
            ) : (
              <InvoicesTable
                invoices={invoices}
                onView={(inv) => {
                  setInvoiceDetailId(inv.id);
                  setIsInvoiceDetailOpen(true);
                }}
                onDownload={async (inv) => {
                  try {
                    await OwnerInvoicesService.downloadInvoicePdf(parseInt(inv.id, 10));
                  } catch (err) {
                    console.error("Error al descargar PDF:", err);
                  }
                }}
                onSend={async (inv) => {
                  try {
                    await OwnerInvoicesService.sendInvoiceEmail(parseInt(inv.id, 10));
                    toast({ title: "Enviado", description: "Factura enviada por email al cliente." });
                  } catch (err) {
                    showErrorToast(toast, err, "Error al enviar la factura.");
                  }
                }}
              />
            )}
          </div>
        );

      case "correos":
        return <EmailsSection />;

      case "settings":
        return <EmailConfigSection />;

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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="administrador" />

      <main className="flex-1 overflow-auto min-w-0">
        <motion.div
          className="pt-14 px-4 pb-6 sm:p-6 md:pt-8 md:p-8 lg:p-10 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {getSectionTitle(activeTab)}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {getGreeting()}
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Gestiona tus restaurantes, reservas y facturación desde un solo lugar.
              </p>
            </div>
            <AnimatedThemeToggler className="shrink-0" />
          </header>

          {renderContent()}
        </motion.div>
      </main>

      <AllReservationsModal
        isOpen={isAllReservationsOpen}
        onClose={() => {
          setIsAllReservationsOpen(false);
          setAllReservationsFechaInicial(undefined);
        }}
        fechaInicial={allReservationsFechaInicial}
      />

      <InvoiceDetailModal
        invoiceId={invoiceDetailId}
        isOpen={isInvoiceDetailOpen}
        onClose={() => {
          setIsInvoiceDetailOpen(false);
          setInvoiceDetailId(null);
        }}
      />

      <RestaurantConfigModal
        isOpen={configModalRestaurant !== null}
        onClose={() => setConfigModalRestaurant(null)}
        onSuccess={() => {
          // Volver a cargar el restaurante por si se cambia algún dato relevante
          // (se mantiene simple porque el admin solo tiene un restaurante)
        }}
        restaurant={configModalRestaurant}
      />
    </div>
  );
}
