"use client"

import { useState } from "react"
import { Sidebar } from "../components/ui/sidebar"
import { Overview } from "../components/ui/overview"
import { Restaurants } from "../components/ui/restaurants"
import { Reservations } from "../components/ui/reservations"
import { Analytics } from "../components/ui/analytics"
import { Invoices } from "../components/ui/invoices"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "restaurants":
        return <Restaurants />
      case "reservations":
        return <Reservations />
      case "analytics":
        return <Analytics />
      case "invoices":
        return <Invoices />
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
