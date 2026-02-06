import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Building2, Calendar, DollarSign } from "lucide-react";

interface MetricCardsProps {
  totalRestaurants: number;
  totalReservations: number;
  monthlyRevenue: number;
}

const iconMap = {
  restaurants: { Icon: Building2, label: "Restaurantes", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  reservations: { Icon: Calendar, label: "Reservas activas", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  revenue: { Icon: DollarSign, label: "Ingresos del mes", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
};

export function MetricCards({
  totalRestaurants,
  totalReservations,
  monthlyRevenue,
}: MetricCardsProps) {
  const items = [
    { value: totalRestaurants, key: "restaurants" as const },
    { value: totalReservations, key: "reservations" as const },
    { value: monthlyRevenue, key: "revenue" as const, format: (n: number) => `$${n.toLocaleString()}` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ value, key, format }) => {
        const { Icon, label, color } = iconMap[key];
        const display = format ? format(value) : value.toLocaleString();
        return (
          <Card
            key={key}
            className="overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {display}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
