"use client"

import { useState } from "react"
import { Sidebar } from "../components/ui/sidebar_2"  
import { Overview } from "../components/ui/Overview_2"
import { Tables } from "../components/ui/Tables"  
import { Reservations } from "../components/ui/Reservations_2"    
import { DailyFlow } from "../components/ui/DailyFlow"
import { Bills } from "../components/ui/Bills" 

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "tables":
        return <Tables />
      case "reservations":
        return <Reservations />
      case "flow":
        return <DailyFlow />
      case "bills":
        return <Bills />
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">{renderContent()}</div>
      </main>
    </div>
  )
}
