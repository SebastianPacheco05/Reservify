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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
    },
    {
      title: "Reservas",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Restaurantes",
      url: "#",
      icon: UtensilsCrossed,
    },
    {
      title: "Mesas",
      url: "#",
      icon: ChefHat,
    },
    {
      title: "Clientes",
      url: "#",
      icon: Users,
    },
    {
      title: "Horarios",
      url: "#",
      icon: Clock,
    },
    {
      title: "Ubicaciones",
      url: "#",
      icon: MapPin,
    },
    {
      title: "Reportes",
      url: "#",
      icon: BarChart3,
    },
    {
      title: "Notificaciones",
      url: "#",
      icon: Bell,
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Reservify</span>
                  <span className="text-xs text-muted-foreground">
                    Panel de Control
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin</span>
                  <span className="text-xs text-muted-foreground">
                    admin@restaurant.com
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
