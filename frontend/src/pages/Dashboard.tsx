"use client"

import { useState } from "react"
import { Sidebar } from "../components/ui/sidebar"
import { MetricCards } from "../components/ui/metric-cards"
import { RestaurantsGrid } from "../components/ui/restaurants-grid"
import { ReservationsTable } from "../components/ui/reservations-table"
import { MonthlyChart } from "../components/ui/monthly-chart"
import { InvoicesTable } from "../components/ui/invoices-table"
import { restaurants, reservations, monthlyFlow, invoices } from "../data/mockData"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <MetricCards
              totalRestaurants={restaurants.length}
              totalReservations={reservations.filter((r) => r.status === "confirmed").length}
              monthlyVisitors={monthlyFlow[monthlyFlow.length - 1]?.visitors || 0}
              monthlyRevenue={monthlyFlow[monthlyFlow.length - 1]?.revenue || 0}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ReservationsTable reservations={reservations.slice(0, 5)} />
              <MonthlyChart data={monthlyFlow.slice(-6)} />
            </div>
          </div>
        )

      case "restaurants":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Restaurantes</h2>
              <span className="text-muted-foreground">{restaurants.length} restaurantes administrados</span>
            </div>
            <RestaurantsGrid restaurants={restaurants} />
          </div>
        )

      case "reservations":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reservas</h2>
              <span className="text-muted-foreground">{reservations.length} reservas totales</span>
            </div>
            <ReservationsTable reservations={reservations} />
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Análisis y Métricas</h2>
            <MetricCards
              totalRestaurants={restaurants.length}
              totalReservations={reservations.filter((r) => r.status === "confirmed").length}
              monthlyVisitors={monthlyFlow[monthlyFlow.length - 1]?.visitors || 0}
              monthlyRevenue={monthlyFlow[monthlyFlow.length - 1]?.revenue || 0}
            />
            <MonthlyChart data={monthlyFlow} />
          </div>
        )

      case "invoices":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Facturas</h2>
              <span className="text-muted-foreground">{invoices.length} facturas</span>
            </div>
            <InvoicesTable invoices={invoices} />
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Sección en desarrollo</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 md:ml-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
            <p className="text-muted-foreground">Gestiona tus restaurantes y reservas desde un solo lugar</p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  )
}
