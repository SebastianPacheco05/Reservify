"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Grid3X3,
  Home,
  LogOut,
  Menu,
  Receipt,
  Settings,
  X,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navGroups = [
  {
    title: "Principal",
    items: [{ id: "overview", label: "Resumen", icon: Home }],
  },
  {
    title: "Operaciones",
    items: [
      { id: "tables", label: "Mesas", icon: Grid3X3 },
      { id: "reservations", label: "Reservas", icon: Calendar },
    ],
  },
  {
    title: "Sala",
    items: [
      { id: "flow", label: "Flujo diario", icon: BarChart3 },
      { id: "bills", label: "Cuentas", icon: Receipt },
    ],
  },
  {
    title: "Administración",
    items: [{ id: "settings", label: "Configuración", icon: Settings }],
  },
];

function getUserDisplay() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return { name: "Usuario", email: "" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub ?? payload.email ?? "";
    const name = payload.nombre ?? payload.name ?? email?.split("@")[0] ?? "Usuario";
    return { name: name.charAt(0).toUpperCase() + name.slice(1), email };
  } catch {
    return { name: "Usuario", email: "" };
  }
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = getUserDisplay();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden border border-border bg-card shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-[85vw] max-w-72 flex flex-col",
          "bg-card border-r border-border shadow-sm",
          "transform transition-transform duration-200 ease-out md:translate-x-0 md:static md:h-screen md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow-sm">
              R
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Reservify</h2>
              <p className="text-xs text-muted-foreground">Panel de empleado</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onTabChange(item.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-muted/50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
