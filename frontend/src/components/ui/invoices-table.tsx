import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Download, Eye, Send } from "lucide-react";
import type { Invoice } from "../../types/dashboard";

interface InvoicesTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
  onSend?: (invoice: Invoice) => void;
}

const statusConfig = {
  paid: { label: "Pagada", className: "bg-primary/10 text-primary border-0" },
  pending: { label: "Pendiente", className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0" },
  overdue: { label: "Vencida", className: "bg-destructive/10 text-destructive border-0" },
};

export function InvoicesTable({ invoices, onView, onDownload, onSend }: InvoicesTableProps) {
  return (
    <Card className="border-border/80 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Facturas recientes</CardTitle>
        <p className="text-sm text-muted-foreground">Gestiona y descarga tus facturas</p>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-0">
        <div className="overflow-x-auto">
          <Table className="[&_th]:px-3 [&_td]:px-3 sm:[&_th]:px-6 sm:[&_td]:px-6">
            <TableHeader>
              <TableRow className="border-border/80 hover:bg-transparent">
                <TableHead className="font-semibold text-muted-foreground">Número</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Restaurante</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Monto</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Fecha</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Vencimiento</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Estado</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                return (
                  <TableRow
                    key={invoice.id}
                    className="border-border/60 hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.restaurantName}</TableCell>
                    <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Ver"
                          onClick={() => onView?.(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Descargar"
                          onClick={() => onDownload?.(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            aria-label="Enviar"
                            onClick={() => onSend?.(invoice)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
