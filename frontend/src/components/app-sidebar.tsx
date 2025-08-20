"use client";

import {
  Calendar,
  ChefHat,
  Home,
  Settings,
  Users,
  UtensilsCrossed,
  BarChart3,
  Clock,
  MapPin,
  Bell,
} from "lucide-react";

import { Sidebar } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

const data = {
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
    },
    {
      id: "reservas",
      title: "Reservas",
      icon: Calendar,
    },
    {
      id: "restaurantes",
      title: "Restaurantes",
      icon: UtensilsCrossed,
    },
    {
      id: "mesas",
      title: "Mesas",
      icon: ChefHat,
    },
    {
      id: "clientes",
      title: "Clientes",
      icon: Users,
    },
    {
      id: "horarios",
      title: "Horarios",
      icon: Clock,
    },
    {
      id: "ubicaciones",
      title: "Ubicaciones",
      icon: MapPin,
    },
    {
      id: "reportes",
      title: "Reportes",
      icon: BarChart3,
    },
    {
      id: "notificaciones",
      title: "Notificaciones",
      icon: Bell,
    },
    {
      id: "configuracion",
      title: "Configuración",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />;
}
