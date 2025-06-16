import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Download, Eye } from "lucide-react"
import { invoices } from "../../data/mockData"

export function Invoices() {
  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "default",
      pending: "secondary",
      overdue: "destructive",
    } as const

    const labels = {
      paid: "Pagada",
      pending: "Pendiente",
      overdue: "Vencida",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600">Gestiona las facturas de tus restaurantes</p>
        </div>
        <Button>Nueva Factura</Button>
      </div>

      {/* Resumen de facturas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              €{invoices.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facturas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{invoices.filter((inv) => inv.status === "pending").length}</div>
            <p className="text-sm text-gray-600">Por cobrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facturas Pagadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{invoices.filter((inv) => inv.status === "paid").length}</div>
            <p className="text-sm text-gray-600">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Restaurante</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.restaurantName}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell className="font-medium">€{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
