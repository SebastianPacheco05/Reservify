import { getApiEndpoint } from "../config/api";
import { authFetch } from "./authService";

export interface SMTPConfig {
  host?: string;
  port?: number;
  usuario?: string;
  from_email?: string;
  tiene_password?: boolean;
  consentimiento_archivo?: boolean;
}

export interface IMAPConfig {
  host?: string;
  port?: number;
  usuario?: string;
  tiene_password?: boolean;
  consentimiento_archivo?: boolean;
}

export interface CorreoItem {
  uid: number;
  from: string;
  subject: string;
  date: string;
  snippet: string;
}

export interface CorreoDetalle extends CorreoItem {
  to_email?: string;
  body_text?: string;
  body_html?: string;
  created_at?: string;
}

export class EmailConfigService {
  static async getSmtpConfig(): Promise<SMTPConfig | null> {
    try {
      const res = await authFetch(getApiEndpoint("/data-owner/config/smtp"), { method: "GET" });
      if (!res.ok) return null;
      const data = await res.json();
      return Object.keys(data).length ? data : null;
    } catch {
      return null;
    }
  }

  static async putSmtpConfig(config: {
    host: string;
    port: number;
    usuario: string;
    from_email: string;
    password_encrypted?: string;
    consentimiento_archivo?: boolean;
  }): Promise<void> {
    const res = await authFetch(getApiEndpoint("/data-owner/config/smtp"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al guardar SMTP");
    }
  }

  static async getImapConfig(): Promise<IMAPConfig | null> {
    try {
      const res = await authFetch(getApiEndpoint("/data-owner/config/imap"), { method: "GET" });
      if (!res.ok) return null;
      const data = await res.json();
      return Object.keys(data).length ? data : null;
    } catch {
      return null;
    }
  }

  static async putImapConfig(config: {
    host: string;
    port: number;
    usuario: string;
    password_encrypted?: string;
    consentimiento_archivo?: boolean;
  }): Promise<void> {
    const res = await authFetch(getApiEndpoint("/data-owner/config/imap"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al guardar IMAP");
    }
  }

  static async getCorreos(limit = 50): Promise<CorreoItem[]> {
    const res = await authFetch(
      getApiEndpoint(`/data-owner/correos?limit=${limit}`),
      { method: "GET" }
    );
    if (!res.ok) {
      if (res.status === 503 || res.status === 502) return [];
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al cargar correos");
    }
    const data = await res.json();
    return data.correos || [];
  }

  static async getCorreoByUid(uid: number): Promise<CorreoDetalle | null> {
    const res = await authFetch(getApiEndpoint(`/data-owner/correos/${uid}`), { method: "GET" });
    if (!res.ok) return null;
    return res.json();
  }

  static async responderCorreo(payload: { to_email: string; subject: string; body: string }): Promise<void> {
    const res = await authFetch(getApiEndpoint("/data-owner/correos/responder"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al enviar la respuesta");
    }
  }
}
