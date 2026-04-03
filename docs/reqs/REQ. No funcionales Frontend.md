### Requerimientos no funcionales (Frontend)

> Complementan el inventario **NF-xxx** del Excel (hoja *REQ. No funcionales*; ver sección al final). Los requisitos de **pantallas, textos y flujos de UI** están en [REQ. funcionales Frontend.md](REQ.%20funcionales%20Frontend.md) (incluye **NFF-xxx** y **NFF-VIG-***). Otros NF: [REQ. No funcionales backend.md](REQ.%20No%20funcionales%20backend.md), [REQ. No funcionales db.md](REQ.%20No%20funcionales%20db.md).
>
> **Convención de IDs:** aquí se usa el prefijo **NFE-** (*No funcionales — entrega SPA*) para la **capa técnica** (`frontend/`). No confundir con **NFF-001…** / **NFF-VIG-*** del otro archivo.

> **Nota:** Cada ítem describe el comportamiento **implementado o ausente** en el código actual (abril 2026).

---

#### Plataforma, build y configuración

- **NFE-001 – Stack de la SPA**
  - **Descripción:** Aplicación **React 19** con **Vite 6**, **TypeScript** y compilación con **@vitejs/plugin-react-swc** (`package.json`, `vite.config.ts`, `main.tsx`).
  - **Estado:** Hecho.

- **NFE-002 – Variables de entorno `VITE_*`**
  - **Descripción:** La URL del backend se toma de **`VITE_API_URL`** (obligatoria en build y arranque); `vite.config.ts` y `src/config/api.ts` validan su presencia y cargan `.env` desde la raíz del repo (`envDir`). Host/puerto del dev server pueden mapearse desde el `.env` raíz (`VITE_FRONTEND_HOST`, `VITE_FRONTEND_PORT`).
  - **Estado:** Hecho.

- **NFE-003 – Alias de importación**
  - **Descripción:** Resolución `@` → `src` en Vite (`vite.config.ts`).
  - **Estado:** Hecho.

---

#### Comunicación con el API y sesión

- **NFE-004 – Cliente HTTP y credenciales**
  - **Descripción:** Uso de **`fetch`** nativo; las peticiones autenticadas pasan por **`authFetch`** en `services/authService.ts` con **`credentials: "include"`** para enviar cookies (p. ej. refresh) y cabecera **Bearer** desde `localStorage` (`access_token`).
  - **Estado:** Hecho.

- **NFE-005 – Renovación proactiva de tokens**
  - **Descripción:** Tras login se llama **`startProactiveRefresh`** (`App.tsx`); la lógica de refresh y reintento en 401 está en `authService.ts`.
  - **Estado:** Hecho.

- **NFE-006 – Caché de datos con TanStack Query**
  - **Descripción:** `QueryClientProvider` en `main.tsx` con `queryClient` en `lib/queryClient.ts` (`staleTime`, `gcTime`, `refetchOnWindowFocus: false`, `retry: 1`).
  - **Estado:** Hecho.

---

#### Enrutado y shell de aplicación

- **NFE-007 – Enrutado del lado del cliente**
  - **Descripción:** **React Router DOM** con **`BrowserRouter`** y rutas definidas en `routes/config.tsx` / `paths.ts` (rutas públicas y protegidas por rol).
  - **Estado:** Hecho.

- **NFE-008 – Modo estricto de React**
  - **Descripción:** Árbol envuelto en **`StrictMode`** (`main.tsx`).
  - **Estado:** Hecho.

---

#### Estilos, tema y assets

- **NFE-009 – Tailwind CSS y componentes headless**
  - **Descripción:** **Tailwind CSS v4** con plugin Vite (`@tailwindcss/vite`); componentes **Radix UI** y utilidades tipo shadcn (`package.json`, `index.css`).
  - **Estado:** Hecho.

- **NFE-010 – Tema claro / oscuro / sistema**
  - **Descripción:** **`ThemeProvider`** con persistencia en `localStorage` (`storageKey="vite-ui-theme"`) y toggler en cabecera (`main.tsx`, `Header`).
  - **Estado:** Hecho.

- **NFE-011 – Idioma del documento**
  - **Descripción:** `index.html` declara **`lang="es"`**; no hay librería i18n para múltiples idiomas en runtime.
  - **Estado:** Hecho (español fijo en UI).

---

#### Rendimiento del bundle

- **NFE-012 – División de código en build**
  - **Descripción:** `manualChunks` separa **framer-motion** y **leaflet/react-leaflet** en chunks propios; **`cssCodeSplit: true`** (`vite.config.ts`).
  - **Estado:** Hecho.

---

#### Calidad de código y pruebas

- **NFE-013 – ESLint**
  - **Descripción:** Script **`npm run lint`** con ESLint 9 y plugins React (`package.json`).
  - **Estado:** Hecho.

- **NFE-014 – Pruebas automatizadas (unitarias / e2e)**
  - **Descripción:** No hay scripts **`test`**, Vitest, Cypress ni Playwright en el `package.json` del frontend.
  - **Estado:** No implementado.

---

#### Robustez y experiencia ante fallos

- **NFE-015 – Límite global de errores de render (Error Boundary)**
  - **Descripción:** No hay **React Error Boundary** genérico envolviendo la app; un fallo en un componente puede descuadrar la vista sin pantalla de recuperación dedicada.
  - **Estado:** No implementado.

- **NFE-016 – Notificaciones en pantalla**
  - **Descripción:** **`ToastProvider`** y toasts globales para feedback de acciones (`App.tsx`, hooks de toast).
  - **Estado:** Hecho.

---

#### Mapas, PDF y animación

- **NFE-017 – Mapas embebidos**
  - **Descripción:** **Leaflet** + **react-leaflet** para vistas de mapa (dependencias pesadas separadas en chunk, ver NFE-012).
  - **Estado:** Hecho.

- **NFE-018 – PDF en cliente**
  - **Descripción:** **jspdf** para exportaciones tipo factura desde dashboards (`package.json`).
  - **Estado:** Hecho.

- **NFE-019 – Animaciones de interfaz**
  - **Descripción:** **framer-motion** (y **motion**) para transiciones de página y componentes (`App.tsx`, varias páginas).
  - **Estado:** Hecho.

---

#### Privacidad, almacenamiento local y desarrollo

- **NFE-020 – Consentimiento de cookies y datos en `sessionStorage`**
  - **Descripción:** **`CookieConsentModal`** en `App.tsx`; flujo de reserva/pago usa **`sessionStorage`** para datos pendientes (p. ej. pasarela) según implementación de PaymentGateway.
  - **Estado:** Hecho.

- **NFE-021 – Servidor de desarrollo y hosts permitidos**
  - **Descripción:** `server.allowedHosts` incluye un dominio **ngrok** de ejemplo en `vite.config.ts` (útil para pruebas; revisar en despliegues reales).
  - **Estado:** Hecho (ajustar host según entorno).

---

#### Accesibilidad, SEO y PWA

- **NFE-022 – Accesibilidad**
  - **Descripción:** Radix aporta patrones accesibles; hay uso puntual de textos solo para lectores de pantalla (p. ej. en cabecera). No hay auditoría formal WCAG ni suite de pruebas a11y en el repo.
  - **Estado:** Parcial.

- **NFE-023 – Metadatos y viewport**
  - **Descripción:** `index.html` incluye viewport, meta description, theme-color y robots básicos.
  - **Estado:** Hecho.

- **NFE-024 – Aplicación web progresiva (PWA)**
  - **Descripción:** No hay **service worker** ni manifiesto PWA integrado en el build estándar.
  - **Estado:** No implementado.

---

#### Seguridad en el cliente

- **NFE-025 – Cabeceras de seguridad HTTP (CSP, etc.)**
  - **Descripción:** Las políticas **CSP**, **HSTS** u otras cabeceras dependen del servidor estático o proxy frente al build; no están definidas en el código del frontend.
  - **Estado:** No implementado (responsabilidad del despliegue).

---

#### Índice Excel — hoja «REQ. No funcionales» (NF asignados a interfaz / SPA)

> Fuente: `md/docs/files/reservifyreq.v.1.3.xls.xlsx` → hoja **REQ. No funcionales**. Cada **NF** aparece **una sola vez** en el conjunto de tres archivos (`backend`, `db`, `Frontend`).

- **NF-013 – Manuales de usuario estructurados**
  - **Estado:** No hecho.
- **NF-019 – Acceso rápido a menús, funciones y listas**
  - **Estado:** Hecho.
- **NF-021 – Parametrización en línea (reportes, tablas maestras, ayudas)**
  - **Estado:** Hecho.
- **NF-025 – Opción de acceso rápido a diferentes aplicaciones o módulos**
  - **Estado:** Hecho.
- **NF-026 – Definición de menús según perfiles de usuario**
  - **Estado:** Hecho.
- **NF-028 – Operación vía navegador web (intranet/internet)**
  - **Estado:** Hecho.
- **NF-030 – Herramientas para toma de decisiones y tableros de control**
  - **Estado:** Hecho.
- **NF-032 – Exportación de reportes en múltiples formatos**
  - **Estado:** Hecho.
- **NF-034 – Visualización de reportes en pantalla antes de imprimir**
  - **Estado:** Hecho.
- **NF-036 – Adaptabilidad avanzada y eliminación automática de código/campos no usados**
  - **Estado:** No hecho.
- **NF-037 – Reportes parametrizables con validación**
  - **Estado:** Hecho.
- **NF-043 – Ayuda en línea y tutoriales**
  - **Estado:** No hecho.
- **NF-044 – Módulo de parametrización de datos maestros y tipos de documentos**
  - **Estado:** Hecho.
- **NF-046 – Consultas tipo tabla dinámica y exportación de información**
  - **Estado:** Hecho.
- **NF-050 – Términos y condiciones del servicio**
  - **Estado:** Hecho.
- **NF-052 – Experiencia de usuario con transiciones y microinteracciones consistentes**
  - **Estado:** Hecho.
- **NF-053 – Sistema global de notificaciones en la interfaz**
  - **Estado:** Hecho.
- **NF-054 – Soporte de tema claro/oscuro coherente con el diseño**
  - **Estado:** Hecho.
- **NF-068 – Uso de Leaflet o similar para mapas**
  - **Estado:** Hecho.
- **NF-078 – Frontend React con enrutado (React Router)**
  - **Estado:** Hecho.
- **NF-080 – ToastProvider/ToastContainer como sistema global de notificaciones**
  - **Estado:** Hecho.
- **NF-081 – Variables CSS para tema claro y oscuro (.dark)**
  - **Estado:** Hecho.
- **NF-082 – ProtectedRoute con verificación de rol**
  - **Estado:** Hecho.
- **NF-083 – Almacenamiento de tokens en localStorage (frontend)**
  - **Estado:** Hecho.
- **NF-090 – Framer Motion para animaciones en frontend**
  - **Estado:** Hecho.
- **NF-032A – Exportación de información en formato CSV desde la interfaz**
  - **Estado:** Hecho.
- **NF-034A – Vista previa en pantalla de facturas y reportes antes de descarga**
  - **Estado:** Hecho.
