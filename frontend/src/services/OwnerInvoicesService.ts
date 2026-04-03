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
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const enc = data.encabezado;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentW = pageW - margin * 2;
    const lineH = 4.2;

    const formatCOP = (n: number) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(Math.round(Number(n) || 0));

    const displayName = (enc.nombre_restaurante || "Restaurante")
      .replace(/\s*__TEST_FACTURA_KEEP__\s*/g, "")
      .trim();

    const addressBlock = [enc.direccion, enc.ciudad].filter(Boolean).join(", ");

    // —— Cabecera con marca ——
    const headerH = 38;
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageW, headerH, "F");
    doc.setFillColor(249, 115, 22);
    doc.rect(0, headerH - 2, pageW, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("RESERVIFY", margin, 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text("Facturación electrónica", margin, 19);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`FAC-${enc.id_encab_fact}`, pageW - margin, 16, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Emisión: ${enc.fecha}`, pageW - margin, 24, { align: "right" });

    let y = headerH + 10;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(displayName, margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`NIT ${enc.nit}`, margin, y);
    y += 5;

    const addrLines = doc.splitTextToSize(addressBlock || "—", contentW);
    doc.text(addrLines, margin, y);
    y += addrLines.length * lineH + 6;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("DATOS DEL CLIENTE", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`Documento: ${enc.documento}`, margin, y);
    y += 5;
    doc.text(`Forma de pago: ${enc.forma_pago}`, margin, y);
    y += 10;

    // Columnas tabla (mm desde borde izquierdo)
    const colDesc = margin;
    const colQty = pageW - margin - 62;
    const colUnit = pageW - margin - 40;
    const colSub = pageW - margin;
    const maxDescW = colQty - colDesc - 4;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y - 4, contentW, 9, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("DESCRIPCIÓN", colDesc + 2, y);
    doc.text("CANT.", colQty, y, { align: "right" });
    doc.text("P. UNIT.", colUnit, y, { align: "right" });
    doc.text("SUBTOTAL", colSub, y, { align: "right" });
    y += 7;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    const detalles = data.detalles?.length ? data.detalles : [];
    if (detalles.length === 0) {
      doc.setTextColor(148, 163, 184);
      doc.text("Sin líneas de detalle.", colDesc + 2, y);
      y += 8;
    } else {
      detalles.forEach((d) => {
        if (y > pageH - 45) {
          doc.addPage();
          y = 20;
        }
        const desc = d.descripcion || "—";
        const descLines = doc.splitTextToSize(desc, maxDescW);
        const blockH = Math.max(descLines.length * lineH, lineH + 1);
        let lineY = y;
        descLines.forEach((line: string) => {
          doc.text(line, colDesc + 2, lineY);
          lineY += lineH;
        });
        doc.text(String(d.unidades), colQty, y, { align: "right" });
        doc.text(formatCOP(d.precio_unitario ?? 0), colUnit, y, { align: "right" });
        doc.text(formatCOP(d.precio_total ?? 0), colSub, y, { align: "right" });
        y += blockH + 2;
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y, pageW - margin, y);
        y += 3;
      });
    }

    if (y > pageH - 35) {
      doc.addPage();
      y = 20;
    }
    y += 4;
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(pageW - margin - 78, y - 5, 78, 12, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(194, 65, 12);
    doc.text("TOTAL", pageW - margin - 74, y + 1);
    doc.text(formatCOP(enc.precio_total ?? 0), colSub, y + 1, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Este documento fue generado en Reservify. Conserve una copia para sus registros.",
      pageW / 2,
      pageH - 12,
      { align: "center" },
    );

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
