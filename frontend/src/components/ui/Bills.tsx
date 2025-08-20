import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { bills } from "../../data/employeeData"

export function Bills() {
  const getStatusBadge = (status: string) => {
    const variants = {
      open: { variant: "secondary" as const, label: "Abierta", icon: Clock },
      pending: { variant: "default" as const, label: "Pendiente", icon: AlertCircle },
      paid: { variant: "outline" as const, label: "Pagada", icon: CheckCircle },
    }

    const config = variants[status as keyof typeof variants] || {
      variant: "outline" as const,
      label: status,
      icon: Receipt,
    }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getStatusActions = (bill: any) => {
    switch (bill.status) {
      case "open":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Cobrar
            </Button>
            <Button size="sm" variant="outline">
              Editar
            </Button>
          </div>
        )
      case "pending":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              Confirmar Pago
            </Button>
            <Button size="sm" variant="outline">
              Ver Detalles
            </Button>
          </div>
        )
      case "paid":
        return (
          <Button size="sm" variant="outline">
            Ver Recibo
          </Button>
        )
      default:
        return null
    }
  }

  const totalOpen = bills.filter((b) => b.status === "open").reduce((acc, bill) => acc + bill.total, 0)
  const totalPending = bills.filter((b) => b.status === "pending").reduce((acc, bill) => acc + bill.total, 0)
  const totalPaid = bills.filter((b) => b.status === "paid").reduce((acc, bill) => acc + bill.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cuentas</h1>
        <p className="text-gray-600">Gestión de cuentas y pagos</p>
      </div>

      {/* Resumen de cuentas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Abiertas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalOpen.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{bills.filter((b) => b.status === "open").length} cuentas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes de Pago</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {bills.filter((b) => b.status === "pending").length} cuentas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{bills.filter((b) => b.status === "paid").length} cuentas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de cuentas */}
      <div className="space-y-4">
        {bills.map((bill) => (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle className="text-lg">Cuenta #{bill.id}</CardTitle>
                  <p className="text-sm text-gray-600">Mesa {bill.tableNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(bill.status)}
                  <span className="text-lg font-bold">${bill.total.toFixed(2)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Detalles de la cuenta */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artículo</TableHead>
                      <TableHead className="text-center">Cant.</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bill.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (10%):</span>
                    <span>${bill.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${bill.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>Creada: {new Date(bill.createdAt).toLocaleString("es-ES")}</p>
                  {bill.paidAt && <p>Pagada: {new Date(bill.paidAt).toLocaleString("es-ES")}</p>}
                </div>

                <div className="flex gap-2">{getStatusActions(bill)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
