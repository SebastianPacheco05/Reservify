"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { OwnerInvoicesService, type FacturaDetalleApi } from "../services/OwnerInvoicesService";

interface InvoiceDetailModalProps {
  invoiceId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceDetailModal({ invoiceId, isOpen, onClose }: InvoiceDetailModalProps) {
  const [data, setData] = useState<FacturaDetalleApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      const id = parseInt(invoiceId, 10);
      if (!isNaN(id)) {
        setIsLoading(true);
        setData(null);
        OwnerInvoicesService.getInvoiceDetail(id)
          .then(setData)
          .catch(() => setData(null))
          .finally(() => setIsLoading(false));
      }
    }
  }, [isOpen, invoiceId]);

  if (!isOpen) return null;

  const enc = data?.encabezado;
  const detalles = data?.detalles ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Detalle de factura {enc ? `FAC-${enc.id_encab_fact}` : ""}</DialogTitle>
          <DialogDescription>
            {enc ? `${enc.nombre_restaurante} - ${enc.fecha}` : "Información de la factura"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : enc ? (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-x-6 gap-y-2">
                <span className="text-muted-foreground">Restaurante</span>
                <span className="font-medium sm:text-right wrap-break-word">{enc.nombre_restaurante}</span>

                <span className="text-muted-foreground">NIT</span>
                <span className="sm:text-right wrap-break-word">{enc.nit}</span>

                <span className="text-muted-foreground">Dirección</span>
                <span className="sm:text-right wrap-break-word leading-relaxed">
                  {enc.direccion}, {enc.ciudad}
                </span>

                <span className="text-muted-foreground">Fecha</span>
                <span className="sm:text-right wrap-break-word">{enc.fecha}</span>

                <span className="text-muted-foreground">Forma de pago</span>
                <span className="sm:text-right wrap-break-word">{enc.forma_pago}</span>
              </div>

              <div className="mt-3 pt-2 border-t grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-x-6 font-semibold">
                <span>Total</span>
                <span className="sm:text-right">${enc.precio_total.toLocaleString()}</span>
              </div>
            </div>

            {detalles.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Líneas de detalle</h4>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Unid.</TableHead>
                        <TableHead className="text-right">P. unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalles.map((d) => (
                        <TableRow key={d.id_det_fact}>
                          <TableCell>{d.descripcion}</TableCell>
                          <TableCell className="text-right">{d.unidades}</TableCell>
                          <TableCell className="text-right">${(d.precio_unitario ?? 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">${(d.precio_total ?? 0).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {detalles.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin líneas de detalle.</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No se pudo cargar el detalle de la factura.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
