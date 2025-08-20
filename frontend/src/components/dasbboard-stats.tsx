import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Users, UtensilsCrossed, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Reservas Hoy",
    value: "127",
    description: "+12% desde ayer",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Clientes Activos",
    value: "2,847",
    description: "+5% desde el mes pasado",
    icon: Users,
    trend: "up",
  },
  {
    title: "Restaurantes",
    value: "24",
    description: "3 nuevos este mes",
    icon: UtensilsCrossed,
    trend: "up",
  },
  {
    title: "Ingresos Mensuales",
    value: "$45,231",
    description: "+18% desde el mes pasado",
    icon: TrendingUp,
    trend: "up",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
