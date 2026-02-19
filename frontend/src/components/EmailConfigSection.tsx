"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Loader2, Mail, Send } from "lucide-react";
import { EmailConfigService, type SMTPConfig, type IMAPConfig } from "../services/EmailConfigService";

const CONSENT_LABEL =
  "¿Autorizas el archivado y conservación de tus correos electrónicos dentro de nuestros sistemas?";

export function EmailConfigSection() {
  const [smtp, setSmtp] = useState<SMTPConfig | null>(null);
  const [imap, setImap] = useState<IMAPConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [savingImap, setSavingImap] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [pendingSave, setPendingSave] = useState<"smtp" | "imap" | null>(null);

  const [smtpForm, setSmtpForm] = useState({
    host: "",
    port: 587,
    usuario: "",
    password_encrypted: "",
    from_email: "",
  });
  const [imapForm, setImapForm] = useState({
    host: "",
    port: 993,
    usuario: "",
    password_encrypted: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, i] = await Promise.all([
          EmailConfigService.getSmtpConfig(),
          EmailConfigService.getImapConfig(),
        ]);
        setSmtp(s);
        setImap(i);
        if (s) {
          setSmtpForm((prev) => ({
            ...prev,
            host: s.host ?? "",
            port: s.port ?? 587,
            usuario: s.usuario ?? "",
            from_email: s.from_email ?? "",
          }));
        }
        if (i) {
          setImapForm((prev) => ({
            ...prev,
            host: i.host ?? "",
            port: i.port ?? 993,
            usuario: i.usuario ?? "",
          }));
        }
      } catch {
        setMessage({ type: "error", text: "No se pudo cargar la configuración" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const doSaveSmtp = async (withConsent: boolean) => {
    setMessage(null);
    setSavingSmtp(true);
    try {
      await EmailConfigService.putSmtpConfig({
        host: smtpForm.host,
        port: smtpForm.port,
        usuario: smtpForm.usuario,
        from_email: smtpForm.from_email,
        password_encrypted: smtpForm.password_encrypted || undefined,
        consentimiento_archivo: withConsent,
      });
      setMessage({ type: "ok", text: "Configuración SMTP guardada" });
      setSmtpForm((prev) => ({ ...prev, password_encrypted: "" }));
      const updated = await EmailConfigService.getSmtpConfig();
      setSmtp(updated);
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message });
    } finally {
      setSavingSmtp(false);
    }
  };

  const doSaveImap = async (withConsent: boolean) => {
    setMessage(null);
    setSavingImap(true);
    try {
      await EmailConfigService.putImapConfig({
        host: imapForm.host,
        port: imapForm.port,
        usuario: imapForm.usuario,
        password_encrypted: imapForm.password_encrypted || undefined,
        consentimiento_archivo: withConsent,
      });
      setMessage({ type: "ok", text: "Configuración IMAP guardada" });
      setImapForm((prev) => ({ ...prev, password_encrypted: "" }));
      const updated = await EmailConfigService.getImapConfig();
      setImap(updated);
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message });
    } finally {
      setSavingImap(false);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtp?.consentimiento_archivo) {
      setPendingSave("smtp");
      setConsentChecked(false);
      setConsentModalOpen(true);
      return;
    }
    await doSaveSmtp(true);
  };

  const handleSaveImap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imap?.consentimiento_archivo) {
      setPendingSave("imap");
      setConsentChecked(false);
      setConsentModalOpen(true);
      return;
    }
    await doSaveImap(true);
  };

  const handleConsentAccept = async () => {
    if (!consentChecked || !pendingSave) return;
    const which = pendingSave;
    setConsentModalOpen(false);
    setPendingSave(null);
    setConsentChecked(false);
    if (which === "smtp") await doSaveSmtp(true);
    else if (which === "imap") await doSaveImap(true);
  };

  const handleConsentClose = () => {
    setConsentModalOpen(false);
    setPendingSave(null);
    setConsentChecked(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.type === "ok"
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <Dialog open={consentModalOpen} onOpenChange={(open) => !open && handleConsentClose()}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Advertencia</DialogTitle>
            <DialogDescription>{CONSENT_LABEL}</DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 py-2">
            <Checkbox
              id="consent-archivo"
              checked={consentChecked}
              onCheckedChange={(v) => setConsentChecked(v === true)}
            />
            <label
              htmlFor="consent-archivo"
              className="text-sm leading-tight cursor-pointer select-none"
            >
              Sí, autorizo el archivado y conservación de mis correos electrónicos en los sistemas de Reservify.
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleConsentClose}>
              Cancelar
            </Button>
            <Button onClick={handleConsentAccept} disabled={!consentChecked}>
              Aceptar y guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            SMTP (envío de correos)
          </CardTitle>
          <CardDescription>
            Configuración para enviar correos (notificaciones, cancelaciones, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSmtp} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Host</Label>
              <Input
                id="smtp-host"
                value={smtpForm.host}
                onChange={(e) => setSmtpForm((p) => ({ ...p, host: e.target.value }))}
                placeholder="smtp.ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Puerto</Label>
              <Input
                id="smtp-port"
                type="number"
                value={smtpForm.port}
                onChange={(e) => setSmtpForm((p) => ({ ...p, port: Number(e.target.value) || 587 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-usuario">Usuario</Label>
              <Input
                id="smtp-usuario"
                type="email"
                value={smtpForm.usuario}
                onChange={(e) => setSmtpForm((p) => ({ ...p, usuario: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-from">Correo remitente (From)</Label>
              <Input
                id="smtp-from"
                type="email"
                value={smtpForm.from_email}
                onChange={(e) => setSmtpForm((p) => ({ ...p, from_email: e.target.value }))}
                placeholder="noreply@ejemplo.com"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="smtp-password">Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="smtp-password"
                type="password"
                value={smtpForm.password_encrypted}
                onChange={(e) => setSmtpForm((p) => ({ ...p, password_encrypted: e.target.value }))}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={savingSmtp}>
                {savingSmtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar SMTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            IMAP (recepción de correos)
          </CardTitle>
          <CardDescription>
            Configuración para recibir y ver los correos en el apartado &quot;Correos&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveImap} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="imap-host">Host</Label>
              <Input
                id="imap-host"
                value={imapForm.host}
                onChange={(e) => setImapForm((p) => ({ ...p, host: e.target.value }))}
                placeholder="imap.ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imap-port">Puerto</Label>
              <Input
                id="imap-port"
                type="number"
                value={imapForm.port}
                onChange={(e) => setImapForm((p) => ({ ...p, port: Number(e.target.value) || 993 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imap-usuario">Usuario</Label>
              <Input
                id="imap-usuario"
                type="email"
                value={imapForm.usuario}
                onChange={(e) => setImapForm((p) => ({ ...p, usuario: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imap-password">Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="imap-password"
                type="password"
                value={imapForm.password_encrypted}
                onChange={(e) => setImapForm((p) => ({ ...p, password_encrypted: e.target.value }))}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="secondary" disabled={savingImap}>
                {savingImap ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar IMAP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
