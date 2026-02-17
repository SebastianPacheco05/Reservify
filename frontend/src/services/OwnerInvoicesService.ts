import { API_BASE_URL } from "../config/api";
import type { Invoice } from "../types/dashboard";

export interface FacturaApi {
  id_encab_fact: number;
  nit: number;
  nombre_restaurante: string;
  precio_total: number;
  fecha: string;
  forma_pago: string;
  documento: number;
}

export interface FacturaDetalleApi {
  encabezado: {
    id_encab_fact: number;
    nit: number;
    nombre_restaurante: string;
    direccion: string;
    ciudad: string;
    fecha: string;
    documento: number;
    forma_pago: string;
    precio_total: number;
  };
  detalles: Array<{
    id_det_fact: number;
    descripcion: string;
    unidades: number;
    precio_unitario: number;
    precio_total: number;
    forma_pago: string;
  }>;
}

function mapFacturaToInvoice(f: FacturaApi): Invoice {
  const isPending = (f.forma_pago || "").trim().toLowerCase() === "pendiente";
  const fechaStr = f.fecha || "";
  const fechaDate = fechaStr ? new Date(fechaStr) : new Date();
  const isOverdue = isPending && fechaDate < new Date() && fechaDate.getTime() < new Date().setHours(0, 0, 0, 0);
  return {
    id: String(f.id_encab_fact),
    restaurantId: String(f.nit),
    restaurantName: f.nombre_restaurante || "",
    amount: f.precio_total ?? 0,
    date: fechaStr,
    status: isOverdue ? "overdue" : isPending ? "pending" : "paid",
    dueDate: fechaStr,
    invoiceNumber: `FAC-${f.id_encab_fact}`,
  };
}

export class OwnerInvoicesService {
  /**
   * Obtiene las facturas del gestor (dueño o administrador)
   */
  public static async getInvoices(): Promise<Invoice[]> {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/data-owner/facturas?limit=100`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener facturas: ${response.status}`);
      }

      const data: { facturas: FacturaApi[] } = await response.json();
      const facturas = data.facturas || [];
      return facturas.map(mapFacturaToInvoice);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      return [];
    }
  }

  /**
   * Obtiene el detalle de una factura (encabezado + líneas)
   */
  public static async getInvoiceDetail(idEncabFact: number): Promise<FacturaDetalleApi | null> {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/data-owner/facturas/${idEncabFact}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error al obtener detalle: ${response.status}`);
      }

      return (await response.json()) as FacturaDetalleApi;
    } catch (error) {
      console.error("Error al obtener detalle de factura:", error);
      return null;
    }
  }

  /**
   * Descarga la factura como PDF. Obtiene el detalle, genera el PDF en el cliente y dispara la descarga.
   */
  public static async downloadInvoicePdf(idEncabFact: number): Promise<void> {
    const data = await OwnerInvoicesService.getInvoiceDetail(idEncabFact);
    if (!data?.encabezado) {
      throw new Error("No se pudo obtener el detalle de la factura");
    }
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const enc = data.encabezado;
    let y = 20;

    doc.setFontSize(18);
    doc.text(`Factura FAC-${enc.id_encab_fact}`, 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`${enc.nombre_restaurante}`, 14, y);
    y += 6;
    doc.text(`NIT: ${enc.nit}`, 14, y);
    y += 6;
    doc.text(`${enc.direccion}, ${enc.ciudad}`, 14, y);
    y += 6;
    doc.text(`Fecha: ${enc.fecha}`, 14, y);
    y += 6;
    doc.text(`Forma de pago: ${enc.forma_pago}`, 14, y);
    y += 12;

    if (data.detalles && data.detalles.length > 0) {
      doc.setFontSize(12);
      doc.text("Detalle", 14, y);
      y += 8;
      doc.setFontSize(10);
      data.detalles.forEach((d) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${d.descripcion}`, 14, y);
        doc.text(String(d.unidades), 120, y);
        doc.text(`$${(d.precio_unitario ?? 0).toLocaleString()}`, 140, y);
        doc.text(`$${(d.precio_total ?? 0).toLocaleString()}`, 170, y);
        y += 7;
      });
      y += 5;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${(enc.precio_total ?? 0).toLocaleString()}`, 14, y);

    doc.save(`Factura-FAC-${enc.id_encab_fact}.pdf`);
  }

  /**
   * Envía la factura por email al cliente. Requiere SMTP configurado en el dashboard.
   */
  public static async sendInvoiceEmail(idEncabFact: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/data-owner/facturas/${idEncabFact}/enviar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const msg = (data as { detail?: string })?.detail || `Error ${response.status}`;
      throw new Error(msg);
    }
  }
}
