import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { MonthlyFlow } from "@/types/dashboard";

interface MonthlyChartProps {
  data: MonthlyFlow[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxVisitors = Math.max(...data.map((d) => d.visitors), 1);

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Flujo de visitantes</CardTitle>
        <p className="text-sm text-muted-foreground">Últimos meses</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {data.map((item, index) => (
            <div key={`${item.month}-${index}`} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">{item.month}</span>
                <span className="text-muted-foreground">
                  {item.visitors.toLocaleString()} visitantes · {item.reservations} reservas
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/80 transition-all duration-500 ease-out min-w-[4px]"
                  style={{ width: `${(item.visitors / maxVisitors) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
