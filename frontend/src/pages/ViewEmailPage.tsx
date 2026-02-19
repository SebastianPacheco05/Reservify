"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Loader2, ArrowLeft, Reply } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { EmailConfigService, type CorreoDetalle } from "../services/EmailConfigService";

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function extractEmail(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1].trim() : from.trim();
}

export default function ViewEmailPage() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState<CorreoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const loadCorreo = useCallback(async () => {
    const id = uid ? parseInt(uid, 10) : NaN;
    if (!uid || Number.isNaN(id)) {
      setError("Identificador de correo no válido");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await EmailConfigService.getCorreoByUid(id);
      setCorreo(d || null);
      if (!d) setError("Correo no encontrado");
    } catch {
      setCorreo(null);
      setError("No se pudo cargar el correo");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadCorreo();
  }, [loadCorreo]);

  const openReply = useCallback(() => {
    if (!correo) return;
    setReplyTo(extractEmail(correo.from));
    setReplySubject(correo.subject.startsWith("Re:") ? correo.subject : `Re: ${correo.subject}`);
    setReplyBody("");
    setReplyMessage(null);
    setReplyOpen(true);
  }, [correo]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyMessage(null);
    setSendingReply(true);
    try {
      await EmailConfigService.responderCorreo({
        to_email: replyTo,
        subject: replySubject,
        body: replyBody,
      });
      setReplyMessage({ type: "ok", text: "Respuesta enviada correctamente." });
      setTimeout(() => setReplyOpen(false), 1500);
    } catch (err) {
      setReplyMessage({ type: "error", text: (err as Error).message });
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !correo) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-2xl mx-auto rounded-xl border bg-card p-8 text-center">
          <p className="text-destructive font-medium">{error || "Correo no encontrado"}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="shrink-0 border-b bg-card px-4 py-3 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Correos
        </Button>
        <Button size="sm" onClick={openReply}>
          <Reply className="h-4 w-4 mr-2" />
          Responder
        </Button>
        <div className="flex-1 min-w-0 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">De:</span> {correo.from}
          {correo.to_email && (
            <>
              {" · "}
              <span className="font-medium text-foreground">Para:</span> {correo.to_email}
            </>
          )}
          {" · "}
          <span className="font-medium text-foreground">Asunto:</span> {correo.subject}
          {" · "}
          {formatDate(correo.date)}
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col p-4">
        <div className="flex-1 rounded-lg border bg-card overflow-hidden min-h-[400px] flex flex-col">
          {correo.body_html ? (
            <iframe
              title="Contenido del correo"
              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head><body style="padding:1.5rem;font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;">${correo.body_html}</body></html>`}
              className="w-full flex-1 min-h-[500px] border-0"
              sandbox="allow-same-origin"
            />
          ) : correo.body_text ? (
            <pre className="p-6 whitespace-pre-wrap text-sm overflow-auto flex-1 font-sans">
              {correo.body_text}
            </pre>
          ) : (
            <p className="p-6 text-muted-foreground">Sin contenido.</p>
          )}
        </div>
      </main>

      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-lg" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Responder</DialogTitle>
            <DialogDescription>
              Se enviará usando la configuración SMTP del panel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sendReply} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reply-to">Para</Label>
              <input
                id="reply-to"
                type="email"
                required
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-subject">Asunto</Label>
              <input
                id="reply-subject"
                type="text"
                required
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-body">Mensaje</Label>
              <textarea
                id="reply-body"
                required
                rows={6}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Escribe tu respuesta..."
              />
            </div>
            {replyMessage && (
              <div
                className={`rounded-lg border p-3 text-sm ${
                  replyMessage.type === "ok"
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}
              >
                {replyMessage.text}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReplyOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={sendingReply}>
                {sendingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar respuesta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
