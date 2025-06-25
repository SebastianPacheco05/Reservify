import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Download, Eye, Send } from "lucide-react"
import type { Invoice } from "../../types/dashboard"

interface InvoicesTableProps {
  invoices: Invoice[]
}

const statusColors = {
  paid: "bg-green-500 hover:bg-green-600",
  pending: "bg-yellow-500 hover:bg-yellow-600",
  overdue: "bg-red-500 hover:bg-red-600",
}

const statusLabels = {
  paid: "Pagada",
  pending: "Pendiente",
  overdue: "Vencida",
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Restaurante</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.restaurantName}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === "pending" && (
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
