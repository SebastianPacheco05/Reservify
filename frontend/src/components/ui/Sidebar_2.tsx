"use client"

import { useState } from "react"
import { Home, Calendar, BarChart3, Receipt, Grid3X3, Settings, Menu, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "overview", label: "Resumen", icon: Home },
  { id: "tables", label: "Mesas", icon: Grid3X3 },
  { id: "reservations", label: "Reservas", icon: Calendar },
  { id: "flow", label: "Flujo Diario", icon: BarChart3 },
  { id: "bills", label: "Cuentas", icon: Receipt },
  { id: "settings", label: "Configuración", icon: Settings },
]

function SidebarContent({ activeTab, onTabChange, onClose }: SidebarProps & { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">RestaurantePOS</h2>
        <p className="text-sm text-gray-600">Panel de Empleado</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onTabChange(item.id)
                    onClose?.()
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Turno: 12:00 - 23:00</span>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent activeTab={activeTab} onTabChange={onTabChange} onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <SidebarContent activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </>
  )
}
