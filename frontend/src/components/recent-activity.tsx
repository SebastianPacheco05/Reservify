import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const activities = [
  {
    id: 1,
    type: "reservation",
    customer: "María García",
    action: "Nueva reserva confirmada",
    restaurant: "La Terraza",
    time: "Hace 5 minutos",
    avatar: "MG",
  },
  {
    id: 2,
    type: "cancellation",
    customer: "Carlos López",
    action: "Reserva cancelada",
    restaurant: "El Jardín",
    time: "Hace 15 minutos",
    avatar: "CL",
  },
  {
    id: 3,
    type: "modification",
    customer: "Ana Martínez",
    action: "Reserva modificada",
    restaurant: "Casa Pepe",
    time: "Hace 30 minutos",
    avatar: "AM",
  },
  {
    id: 4,
    type: "reservation",
    customer: "David Rodríguez",
    action: "Nueva reserva pendiente",
    restaurant: "La Terraza",
    time: "Hace 1 hora",
    avatar: "DR",
  },
];

const getActivityBadge = (type: string) => {
  switch (type) {
    case "reservation":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Nueva
        </Badge>
      );
    case "cancellation":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Cancelada
        </Badge>
      );
    case "modification":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Modificada
        </Badge>
      );
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt={activity.customer}
                />
                <AvatarFallback>{activity.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {activity.customer}
                  </p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} en {activity.restaurant}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
