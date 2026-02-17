"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { EmailConfigService, type CorreoItem } from "../services/EmailConfigService";

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

export function EmailsSection() {
  const navigate = useNavigate();
  const [correos, setCorreos] = useState<CorreoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCorreos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await EmailConfigService.getCorreos(50);
      setCorreos(list);
    } catch (e) {
      setError((e as Error).message);
      setCorreos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCorreos();
  }, [loadCorreos]);

  const openCorreo = useCallback((uid: number) => {
    navigate(`/ver-correo/${uid}`);
  }, [navigate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Correos no leídos
            </CardTitle>
            <CardDescription>
              Solo se muestran los correos no leídos (unseen) de la bandeja de entrada de la cuenta
              configurada en Configuración (IMAP). Haz clic en uno para abrirlo en una página aparte y ver el contenido completo o responder.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadCorreos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="ml-2">Actualizar</span>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
              <p className="font-medium">No se pudieron cargar los correos</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 text-muted-foreground">
                Configura la cuenta IMAP en Configuración para ver aquí los correos recibidos.
              </p>
            </div>
          ) : correos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">No hay correos no leídos</p>
              <p className="text-sm text-muted-foreground mt-1">
                Solo se listan los correos no leídos (unseen) de la cuenta configurada en Configuración (IMAP).
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-lg border bg-card overflow-hidden">
              {correos.map((c) => (
                <li
                  key={c.uid}
                  role="button"
                  tabIndex={0}
                  onClick={() => openCorreo(c.uid)}
                  onKeyDown={(e) => e.key === "Enter" && openCorreo(c.uid)}
                  className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-foreground truncate flex-1">
                        {c.subject || "(Sin asunto)"}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(c.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{c.from}</p>
                    {c.snippet && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{c.snippet}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
