// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
// import { Badge } from "../ui/badge"
// import { Button } from "../ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
// import { Eye, Edit, Trash2 } from "lucide-react"
// import type { Reservation } from "../../types/dashboard"

// interface ReservationsTableProps {
//   reservations: Reservation[]
// }

// const statusColors = {
//   confirmed: "bg-green-500 hover:bg-green-600",
//   pending: "bg-yellow-500 hover:bg-yellow-600",
//   cancelled: "bg-red-500 hover:bg-red-600",
//   completed: "bg-blue-500 hover:bg-blue-600",
// }

// const statusLabels = {
//   confirmed: "Confirmada",
//   pending: "Pendiente",
//   cancelled: "Cancelada",
//   completed: "Completada",
// }

// export function ReservationsTable({ reservations }: ReservationsTableProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Reservas Recientes</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Cliente</TableHead>
//                 <TableHead>Restaurante</TableHead>
//                 <TableHead>Fecha</TableHead>
//                 <TableHead>Hora</TableHead>
//                 <TableHead>Personas</TableHead>
//                 <TableHead>Mesa</TableHead>
//                 <TableHead>Estado</TableHead>
//                 <TableHead>Acciones</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {reservations.map((reservation) => (
//                 <TableRow key={reservation.id}>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{reservation.customerName}</div>
//                       <div className="text-sm text-muted-foreground">{reservation.customerEmail}</div>
//                     </div>
//                   </TableCell>
//                   <TableCell>{reservation.restaurantName}</TableCell>
//                   <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
//                   <TableCell>{reservation.time}</TableCell>
//                   <TableCell>{reservation.guests}</TableCell>
//                   <TableCell>{reservation.tableNumber ? `Mesa ${reservation.tableNumber}` : "-"}</TableCell>
//                   <TableCell>
//                     <Badge className={statusColors[reservation.status]}>{statusLabels[reservation.status]}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button size="sm" variant="outline">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
