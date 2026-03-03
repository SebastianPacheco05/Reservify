"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/sidebar";
import { MetricCards } from "../components/ui/metric-cards";
import { RestaurantsGrid } from "../components/ui/restaurants-grid";
import { RestaurantReservationsModal } from "../components/RestaurantReservationsModal";
import { MonthlyChart } from "../components/ui/monthly-chart";
import { InvoicesTable } from "../components/ui/invoices-table";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import type { Restaurant, MonthlyFlow, Invoice, DailyFlow, ClienteGestor } from "../types/dashboard";
import { OwnerMetricsService, type OwnerMetrics } from "../services/OwnerMetricsService";
import { OwnerInvoicesService } from "../services/OwnerInvoicesService";
import { OwnerMonthlyFlowService } from "../services/OwnerMonthlyFlowService";
import { OwnerClientesService } from "../services/OwnerClientesService";
import { DailyFlow as DailyFlowChart } from "../components/ui/DailyFlow";
import { AllReservationsModal } from "../components/AllReservationsModal";
import { AddRestaurantModal } from "../components/AddRestaurantModal";
import { RestaurantConfigModal } from "../components/RestaurantConfigModal";
import { InvoiceDetailModal } from "../components/InvoiceDetailModal";
import { EmailConfigSection } from "../components/EmailConfigSection";
import { EmailsSection } from "../components/EmailsSection";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { useToastContext } from "../components/ToastProvider";
import { showErrorToast } from "../lib/toastHelpers";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

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

function getSectionTitle(tab: string): string {
  const titles: Record<string, string> = {
    overview: "Resumen",
    restaurants: "Mis Restaurantes",
    reservations: "Reservas",
    invoices: "Facturación",
    flow: "Flujo diario",
    empleados: "Empleados",
    customers: "Clientes",
    correos: "Correos",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

export default function Dashboard() {
  const { toast } = useToastContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<OwnerMetrics>({
    total_restaurantes: 0,
    reservas_activas: 0,
    revenue_mes: 0,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [monthlyFlow, setMonthlyFlow] = useState<MonthlyFlow[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [reservationsModalRestaurant, setReservationsModalRestaurant] = useState<Restaurant | null>(null);
  const [configModalRestaurant, setConfigModalRestaurant] = useState<Restaurant | null>(null);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceDetailId, setInvoiceDetailId] = useState<string | null>(null);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [flujoDiario, setFlujoDiario] = useState<DailyFlow[]>([]);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [clientes, setClientes] = useState<ClienteGestor[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [allReservationsOpen, setAllReservationsOpen] = useState(false);
  const [allReservationsFechaInicial, setAllReservationsFechaInicial] = useState<string | undefined>();

  type EmpleadoConRestaurante = {
    id_credencial: number;
    nombre: string;
    apellido: string;
    email: string;
    nombre_rol: string;
    nit: number;
    nombre_restaurante: string;
  };
  type ReservaConfirmada = {
    id_reserva: number;
    horario: string;
    fecha: string;
    estado_reserva: string;
    nombre_restaurante: string;
    nit: number;
    num_comensales: number;
    cliente_nombre: string;
    cliente_telefono: string;
  };
  const [empleadosData, setEmpleadosData] = useState<{
    empleados: EmpleadoConRestaurante[];
    reservas_confirmadas: ReservaConfirmada[];
  }>({ empleados: [], reservas_confirmadas: [] });
  const [isLoadingEmpleados, setIsLoadingEmpleados] = useState(false);

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

  const loadEmpleadosConReservas = useCallback(async () => {
    setIsLoadingEmpleados(true);
    try {
      const res = await authFetch(getApiEndpoint("/data-owner/empleados-con-reservas"), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Error al cargar empleados");
      const data = await res.json();
      setEmpleadosData({
        empleados: data.empleados || [],
        reservas_confirmadas: data.reservas_confirmadas || [],
      });
    } catch (error) {
      console.error("Error al cargar empleados y reservas:", error);
      setEmpleadosData({ empleados: [], reservas_confirmadas: [] });
    } finally {
      setIsLoadingEmpleados(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "empleados") loadEmpleadosConReservas();
  }, [activeTab, loadEmpleadosConReservas]);

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
                      setAllReservationsOpen(true);
                    }}
                  >
                    Ver reservas de hoy
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
              <RestaurantsGrid
                restaurants={restaurants}
                onVerReservas={(restaurant) => setReservationsModalRestaurant(restaurant)}
                onConfigRestaurant={(restaurant) => setConfigModalRestaurant(restaurant)}
              />
            )}
          </div>
        );

      case "reservations":
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {restaurants.length} restaurante{restaurants.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  setAllReservationsFechaInicial(undefined);
                  setAllReservationsOpen(true);
                }}
              >
                Ver todas las reservas
              </Button>
            </div>
            {isLoadingRestaurants ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[240px] rounded-xl" />
                ))}
              </div>
            ) : (
              <RestaurantsGrid
                restaurants={restaurants}
                onVerReservas={(r) => setReservationsModalRestaurant(r)}
                onConfigRestaurant={(r) => setConfigModalRestaurant(r)}
              />
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

      case "empleados":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Empleados</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Personas asignadas a tus restaurantes (administradores y empleados).
              </p>
              {isLoadingEmpleados ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                  ))}
                </div>
              ) : empleadosData.empleados.length === 0 ? (
                <div className="rounded-xl border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No hay empleados asignados todavía.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configura un restaurante y asigna o crea empleados desde su configuración.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {empleadosData.empleados.map((emp) => (
                    <div
                      key={emp.id_credencial}
                      className="rounded-xl border bg-card p-4 shadow-sm"
                    >
                      <p className="font-medium text-foreground">
                        {emp.nombre} {emp.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{emp.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {emp.nombre_restaurante || `NIT ${emp.nit}`}
                      </p>
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {emp.nombre_rol || "empleado"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Reservas aceptadas</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Todas las reservas confirmadas de tus restaurantes.
              </p>
              {isLoadingEmpleados ? (
                <Skeleton className="h-64 rounded-xl w-full" />
              ) : empleadosData.reservas_confirmadas.length === 0 ? (
                <div className="rounded-xl border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No hay reservas aceptadas aún.</p>
                </div>
              ) : (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium">Fecha</th>
                          <th className="text-left p-3 font-medium">Hora</th>
                          <th className="text-left p-3 font-medium">Restaurante</th>
                          <th className="text-left p-3 font-medium">Cliente</th>
                          <th className="text-left p-3 font-medium">Comensales</th>
                          <th className="text-left p-3 font-medium">Teléfono</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empleadosData.reservas_confirmadas.map((r) => (
                          <tr key={r.id_reserva} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3">{r.fecha}</td>
                            <td className="p-3">{r.horario}</td>
                            <td className="p-3">{r.nombre_restaurante}</td>
                            <td className="p-3">{r.cliente_nombre}</td>
                            <td className="p-3">{r.num_comensales ?? "—"}</td>
                            <td className="p-3">{r.cliente_telefono || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="dueño" />

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

      <RestaurantReservationsModal
        isOpen={reservationsModalRestaurant !== null}
        onClose={() => setReservationsModalRestaurant(null)}
        restaurant={reservationsModalRestaurant}
      />

      <RestaurantConfigModal
        isOpen={configModalRestaurant !== null}
        onClose={() => setConfigModalRestaurant(null)}
        onSuccess={loadRestaurants}
        restaurant={configModalRestaurant}
      />

      <InvoiceDetailModal
        invoiceId={invoiceDetailId}
        isOpen={isInvoiceDetailOpen}
        onClose={() => {
          setIsInvoiceDetailOpen(false);
          setInvoiceDetailId(null);
        }}
      />

      <AllReservationsModal
        isOpen={allReservationsOpen}
        onClose={() => {
          setAllReservationsOpen(false);
          setAllReservationsFechaInicial(undefined);
        }}
        fechaInicial={allReservationsFechaInicial}
      />
    </div>
  );
}
