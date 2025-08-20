import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

const reservations = [
  {
    id: "RSV001",
    customer: "María García",
    restaurant: "La Terraza",
    date: "2024-01-15",
    time: "19:30",
    guests: 4,
    status: "confirmada",
    phone: "+34 666 123 456",
  },
  {
    id: "RSV002",
    customer: "Carlos López",
    restaurant: "El Jardín",
    date: "2024-01-15",
    time: "20:00",
    guests: 2,
    status: "pendiente",
    phone: "+34 677 234 567",
  },
  {
    id: "RSV003",
    customer: "Ana Martínez",
    restaurant: "Casa Pepe",
    date: "2024-01-15",
    time: "21:00",
    guests: 6,
    status: "cancelada",
    phone: "+34 688 345 678",
  },
  {
    id: "RSV004",
    customer: "David Rodríguez",
    restaurant: "La Terraza",
    date: "2024-01-16",
    time: "19:00",
    guests: 3,
    status: "confirmada",
    phone: "+34 699 456 789",
  },
  {
    id: "RSV005",
    customer: "Laura Sánchez",
    restaurant: "El Jardín",
    date: "2024-01-16",
    time: "20:30",
    guests: 5,
    status: "pendiente",
    phone: "+34 611 567 890",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmada":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Confirmada
        </Badge>
      );
    case "pendiente":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pendiente
        </Badge>
      );
    case "cancelada":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Cancelada
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function ReservationsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Restaurante</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Comensales</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reservation.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    {reservation.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>{reservation.restaurant}</TableCell>
              <TableCell>{reservation.date}</TableCell>
              <TableCell>{reservation.time}</TableCell>
              <TableCell>{reservation.guests}</TableCell>
              <TableCell>{getStatusBadge(reservation.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
