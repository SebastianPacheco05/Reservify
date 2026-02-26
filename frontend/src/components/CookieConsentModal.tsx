import React, { useEffect, useState } from "react";

const COOKIE_NAME = "reservify_cookie_consent";

type CookieConsentValue = "accepted" | "rejected";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export const CookieConsentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const existing = getCookie(COOKIE_NAME) as CookieConsentValue | null;
    if (!existing) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIE_NAME, "accepted", 365);
    setIsOpen(false);
  };

  const handleReject = () => {
    setCookie(COOKIE_NAME, "rejected", 365);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg border border-border text-foreground">
        <h2 className="text-lg font-semibold mb-2">Uso de cookies</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Utilizamos cookies para mejorar tu experiencia en Reservify. Puedes aceptar
          todas las cookies o rechazarlas. Siempre podrás cambiar tu elección más
          adelante desde la configuración de tu navegador.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

