"use client";

import { useState } from "react";
import { Sidebar } from "./ui/sidebar";

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />;
}
