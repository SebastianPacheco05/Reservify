# Exposición: Funcionalidad del Frontend (Reservify)

Fecha: 2026-03-18  
Alcance: **solo Frontend** (pantallas, rutas, flujos de usuario y componentes)

---

## 1) ¿Qué ve y qué hace el usuario? (1–2 min)

Reservify en el frontend es una SPA en React que permite:

- **Explorar restaurantes** (grid, categorías, mapa).
- **Ver un restaurante** (detalle, mesas, disponibilidad, reseñas).
- **Reservar** y pasar a **pasarela de pago**.
- **Iniciar sesión / registrarse** y entrar a su **dashboard** según rol.
- Acceder a **páginas informativas** (contacto, ayuda, términos, privacidad).

---

## 2) Navegación y rutas del frontend (2–3 min)

Las rutas están centralizadas en `frontend/src/routes/paths.ts` y se montan en `frontend/src/routes/config.tsx` desde `frontend/src/App.tsx`.

### 2.1 Rutas públicas (cualquier usuario)

- **Home**: `/` → `pages/Home.tsx`
- **Login**: `/Login` → `pages/Login.tsx`
- **Registrar**: `/Registrar` → `pages/registrar.tsx`
- **Recuperar contraseña**: `/lost` → `pages/Lost.tsx`
- **Contacto**: `/contacto` → `pages/Contacto.tsx`
- **Ayuda**: `/ayuda` → `pages/Ayuda.tsx`
- **Términos**: `/terminos` → `pages/Terminos.tsx`
- **Privacidad**: `/privacidad` → `pages/Privacidad.tsx`
- **Restaurante (vista)**: `/Restaurant?nit=...` → `pages/Restaurant.tsx`
- **Datos personales**: `/Datos_personales` → `pages/PersonalData.tsx`
- **Pasarela de pagos**: `/Pasarela_pagos` → `pages/PaymentGateway.tsx`
- **Pago exitoso**: `/pago-exitoso` → `pages/PagoExitoso.tsx`
- **NotFound**: `*` → `pages/NotFound.tsx`

### 2.2 Rutas protegidas (requieren login y rol)

Se protegen con `components/ProtectedRoute.tsx` (valida sesión y rol) y además existe `components/RoleEnforcer.tsx` (redirige al dashboard correcto).

- **Dashboard Dueño**: `/duenodashboard` → `pages/Dashboard.tsx`
- **Dashboard Administrador**: `/admindashboard` → `pages/AdminDashboard.tsx`
- **Dashboard Empleado**: `/EmpleadoDashboard` → `pages/employee-dashboard.tsx`
- **Dashboard Cliente**: `/ClienteDashboard` → `pages/ClientDashboard.tsx`
- **Ver correo**: `/ver-correo/:uid` → `pages/ViewEmailPage.tsx` (roles: dueño/admin/empleado)

---

## 3) Flujos funcionales principales (4–6 min)

### Flujo A — Explorar restaurantes (Home)

Archivo principal: `pages/Home.tsx`

Qué incluye:

- **Header** (menú, login/logout, perfil) + **Hero** con búsqueda.
- **Búsqueda por tipo de cocina** con sugerencias.
- **Secciones lazy-loaded** (mejor rendimiento):
  - Carrusel de cocinas (`components/CuisineCarousel`)
  - Grid de restaurantes (`components/RestaurantGrid`)
  - Mapa de restaurantes (`components/RestaurantMap`) cuando el usuario elige “usar mi ubicación”
  - Secciones informativas (`FeaturesSection`, `CTASection`, `Footer`)

Interacción clave:

- El usuario filtra por cocina → el grid se actualiza y se hace scroll a “restaurantes”.

### Flujo B — Login y redirección por rol

Archivo principal: `pages/Login.tsx`

Qué pasa al iniciar sesión:

- El formulario valida credenciales y guarda en `localStorage`:
  - `access_token`, `token_type`, `tipo_usuario`, `email` y `documento` (si llega)
- Luego navega según `redirect_to` (dashboard correspondiente).

En la navegación general:

- `RoleEnforcer` puede redirigir automáticamente al dashboard correcto si el usuario ya está autenticado.

### Flujo C — Ver detalle del restaurante y preparar reserva

Archivo principal: `pages/Restaurant.tsx`

Qué muestra:

- Info del restaurante (nombre, dirección, rating, horario, mapa).
- **Mesas disponibles** (selección de mesa).
- **Selector de fecha/hora** y cálculo de **slots disponibles**.
- Reseñas + formulario de reseña (`components/ReviewForm`).

Acción principal:

- El usuario selecciona **fecha, hora, comensales y mesa** → confirma para ir al pago.

### Flujo D — Reservar y enviar datos a la pasarela

En `pages/Restaurant.tsx`:

- Al confirmar, se construye una “reserva pendiente” con:
  - restaurante, mesa, comensales, fecha, horario, `id_encab_fact`
- Se guarda en `sessionStorage` con la key:
  - `pendingReservation`
- Se redirige a:
  - `/Pasarela_pagos`

Por qué `sessionStorage`:

- Mantiene datos solo en la sesión actual del navegador y se limpia al cerrar la pestaña.

### Flujo E — Pasarela de pagos

Archivo principal: `pages/PaymentGateway.tsx`

- Lee `pendingReservation` desde `sessionStorage`.
- Si no existe, vuelve a `/` (evita que el usuario entre a la pasarela “sin reserva”).
- Renderiza la UI de checkout:
  - `components/CheckoutPage` (recibe `reservationData`)

---

## 4) Dashboards por rol (3–5 min)

La UX del sistema cambia según el rol del usuario:

- **Cliente** (`pages/ClientDashboard.tsx`):
  - foco en reservas del usuario, perfil y acciones de cliente.
- **Dueño** (`pages/Dashboard.tsx`):
  - foco en métricas, gestión de restaurantes, mesas, empleados, facturación.
- **Administrador** (`pages/AdminDashboard.tsx`):
  - foco en operación del restaurante asignado.
- **Empleado** (`pages/employee-dashboard.tsx`):
  - foco en tareas operativas, reservas y facturas del restaurante.

Nota: la protección de acceso en frontend se hace por ruta (no “oculta” el backend), pero **sí organiza la experiencia** para que cada rol vea “su módulo”.

---

## 5) Componentes reutilizables (para explicar UI/UX) (2–3 min)

Algunos componentes importantes para la exposición:

- **Navegación y layout**
  - `components/Header`
  - `components/Footer`
  - `components/app-sidebar` / `components/ui/sidebar` (estructura de dashboard)
- **Restaurantes**
  - `components/RestaurantGrid` y `components/ui/restaurants-grid`
  - `components/RestaurantMap`
  - `components/SearchBar`
  - `components/CuisineCarousel`
- **Reserva y pago**
  - `components/CheckoutPage`
  - `components/reservation-summary`
  - `components/payment-section`
- **Perfil y utilidades**
  - `components/ProfileModal`
  - `components/edit_profile_modal`
  - `components/ToastProvider` + `components/ToastContainer`
  - `components/CookieConsentModal`
- **Modo/tema**
  - `components/theme-provider`
  - `components/mode-toggle` / `components/theme-toggle`

---

## 6) Guion rápido (8–12 min) enfocado 100% en frontend

1. **Mapa de rutas**: qué pantallas existen y cómo se navega.
2. **Home**: búsqueda, carrusel, grid, mapa por ubicación.
3. **Restaurante**: detalle, mesas, selección de fecha/hora, reseñas.
4. **Reserva → Pasarela**: `sessionStorage` con `pendingReservation` y checkout.
5. **Login y roles**: redirección automática a dashboards.
6. **Dashboards**: qué ofrece cada rol y cómo se presenta en UI.
7. **Componentización**: piezas reutilizables y consistencia visual (UI components + toasts + tema).

---

## 7) Referencias internas (solo frontend)

- Rutas: `frontend/src/routes/paths.ts`, `frontend/src/routes/config.tsx`
- Montaje de la app: `frontend/src/App.tsx`, `frontend/src/main.tsx`
- Páginas: `frontend/src/pages/*`
- Componentes: `frontend/src/components/*`, `frontend/src/components/ui/*`

