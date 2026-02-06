"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/ui/Sidebar_2";
import { Overview } from "../components/ui/Overview_2";
import { Tables } from "../components/ui/Tables";
import { Reservations } from "../components/ui/Reservations_2";
import { DailyFlow } from "../components/ui/DailyFlow";
import { Bills } from "../components/ui/Bills";

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
    flow: "Flujo diario",
    bills: "Cuentas",
    settings: "Configuración",
  };
  return titles[tab] ?? "Panel";
}

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "tables":
        return <Tables />;
      case "reservations":
        return <Reservations />;
      case "flow":
        return <DailyFlow />;
      case "bills":
        return <Bills />;
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
    </div>
  );
}
