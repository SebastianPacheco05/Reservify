"use client"

import { useState } from "react"
import { Home, MenuIcon as Restaurant, Calendar, TrendingUp, FileText, Settings, Menu, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "overview", label: "Resumen", icon: Home },
  { id: "restaurants", label: "Restaurantes", icon: Restaurant },
  { id: "reservations", label: "Reservas", icon: Calendar },
  { id: "analytics", label: "Análisis", icon: TrendingUp },
  { id: "invoices", label: "Facturas", icon: FileText },
  { id: "settings", label: "Configuración", icon: Settings },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", isCollapsed ? "w-22" : "w-64")}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">RestaurantAdmin</h2>}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn("w-full justify-start", isCollapsed && "px-2")}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
