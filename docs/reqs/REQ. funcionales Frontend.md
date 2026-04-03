### Requerimientos funcionales de interfaz (Frontend) — vista de usuario

> **Aclaración:** La hoja Excel se llama *REQ. no funcionales Frontend*, pero el contenido describe **lo que el usuario ve e interactúa** (pantallas, flujos, estilos). En documentación se tratan como **requisitos funcionales de UI/UX**.

> **Revisión:** Cada ítem conserva el ID histórico **NFF-xxx** y se añade **Implementación actual** según el código en `frontend/src` (abril 2026).

> Fuente original: Excel *REQ. no funcionales Frontend* (libro `docs/docs/files/reservifyreq.v.1.3.xls.xlsx`).

- **NFF-000 – COLOR DE FONDO DE LA PAGINA WEB**
  - **Concepto:** Mediante el uso de CSS, se aplica la propiedad ‘background’ con valores específicos para crear un efecto de degradado. Se inicia con un color azul oscuro (rgb 3, 64, 138) en la parte superior. Luego, se utiliza rgba 189,206, 234, 0.817 para suavizar la tonalidad azul oscuro y obtener un tono más claro, creando así un degradado entre estas dos tonalidades. Finalmente, se añade rgba 255, 255, 255, 0.946 para obtener una tonalidad blanca, logrando así una transición armoniosa entre los tres colores.
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** El fondo global usa variables en `index.css` (`--background` #F9F7F2, `--primary` #FF6A00, `--secondary` #FF2D55). El hero (`HeroSection.tsx`) aplica `bg-gradient-to-b from-primary/10 via-background to-accent/20`, no el degradado RGB del texto legacy.

### Bloque vigente (abril 2026)

> Este bloque reemplaza funcionalmente los requerimientos legacy de Home, Login, Registro, `/buscar`, `/Restaurant?uid` y Pasarela.  
> **Derogados por cambios de frontend:** `NFF-001..NFF-104` y `NFF-684..NFF-791`.  
> **Cambio 2026:** no existe `ClientDashboard`; el rol **cliente** usa Home + `ProfileModal` (ver **NFF-VIG-CLIENT**).

- **NFF-VIG-HOME-01 – Estructura de Home**
  - **Estado:** Vigente.
  - **Implementación actual:** La home compone `Header`, `HeroSection`, mapa por ubicación opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection` y `Footer` en `Home.tsx`.
- **NFF-VIG-HOME-02 – Header fijo y navegación**
  - **Estado:** Vigente.
  - **Implementación actual:** Header sticky con marca, enlace a restaurantes, toggler de tema y acciones de sesión en `Header.tsx`; búsqueda en header condicionada a rol cliente autenticado (`canSearch`).
- **NFF-VIG-HOME-03 – Búsqueda principal por cocina/restaurante**
  - **Estado:** Vigente con ajustes pendientes.
  - **Implementación actual:** Barra principal en `HeroSection` usa `SearchBar.tsx` con sugerencias consultando `/buscar_restaurante` (debounce y abort de request). El contenedor de chips rápidos existe, pero su contenido visible aún está incompleto.
- **NFF-VIG-HOME-04 – Ubicación opcional**
  - **Estado:** Vigente.
  - **Implementación actual:** Al pulsar "Usar mi ubicación actual" se habilita sección con `RestaurantMap` y scroll automático a `#mapa-ubicacion`.
- **NFF-VIG-HOME-05 – Carga diferida y rendimiento percibido**
  - **Estado:** Vigente.
  - **Implementación actual:** Secciones pesadas en `Home.tsx` se cargan con `lazy` + `Suspense`; grid de destacados consulta `/top`.
- **NFF-VIG-HOME-06 – Tema claro/oscuro por tokens**
  - **Estado:** Vigente.
  - **Implementación actual:** Toggling por clase `.dark`, variables CSS en `index.css` y utilidades Tailwind; no se exigen hex fijos del Excel legacy.

- **NFF-VIG-SEARCH-01 – Ruta pública `/buscar` (`ROUTES.SEARCH`)**
  - **Estado:** Vigente.
  - **Implementación actual:** Página `Search.tsx`; entrada típica desde el header del cliente con `?q=...` o enlaces internos.
- **NFF-VIG-SEARCH-02 – Parámetros de URL y estado**
  - **Estado:** Vigente.
  - **Implementación actual:** `useSearchParams`: `q` (texto buscado), `page` (≥1), `per_page` (acotado 1–50, default 30). Sincronización del input con la query.
- **NFF-VIG-SEARCH-03 – Resultados paginados vía API**
  - **Estado:** Vigente.
  - **Implementación actual:** `GET /top/paginado?q=&page=&per_page=` (`getApiEndpoint`); `AbortController` para cancelar peticiones al cambiar filtros; estados carga, error y lista vacía.
- **NFF-VIG-SEARCH-04 – Cáscara de página**
  - **Estado:** Vigente.
  - **Implementación actual:** Misma cabecera/pie que el resto del sitio (`Header`, `Footer`), tarjetas de restaurante y paginación numérica en la misma vista.

- **NFF-VIG-LOGIN-01 – Inicio de sesión con correo y contraseña**
  - **Estado:** Vigente.
  - **Implementación actual:** `Login.tsx` envía `POST /credenciales/login`, persiste tokens/rol/email en `localStorage`, ejecuta `startProactiveRefresh()` y redirige por `redirect_to` o home.
- **NFF-VIG-LOGIN-02 – Recuperación de contraseña en 3 pasos**
  - **Estado:** Vigente.
  - **Implementación actual:** Flujo `email -> code -> reset` con endpoints `/password-reset/request`, `/password-reset/verify`, `/password-reset/reset` y validaciones de OTP/longitud.
- **NFF-VIG-LOGIN-03 – UX de feedback**
  - **Estado:** Vigente.
  - **Implementación actual:** Cargas, bloqueos y mensajes con `ToastProvider` para éxito/error/advertencia en login y recuperación.
- **NFF-VIG-LOGIN-04 – Integración de términos y privacidad**
  - **Estado:** Vigente.
  - **Implementación actual:** Enlaces a `ROUTES.TERMINOS` y `ROUTES.PRIVACIDAD` visibles en vista de acceso y recuperación.
- **NFF-VIG-LOGIN-05 – OAuth social**
  - **Estado:** No implementado.
  - **Implementación actual:** No existe inicio con Google u otros proveedores en el frontend actual.

- **NFF-VIG-REG-01 – Registro en 2 pasos**
  - **Estado:** Vigente.
  - **Implementación actual:** `registrar.tsx` divide el flujo en `Credenciales` y `Datos personales` con navegación entre pasos y focus contextual.
- **NFF-VIG-REG-02 – Validaciones de credenciales**
  - **Estado:** Vigente.
  - **Implementación actual:** Validación de email, coincidencia de contraseñas y mensajes de error antes de avanzar.
- **NFF-VIG-REG-03 – Datos de identidad obligatorios**
  - **Estado:** Vigente.
  - **Implementación actual:** Tipo y número de documento, teléfono, nombre, apellido y nacionalidad.
- **NFF-VIG-REG-04 – Registro backend y sanitización de errores**
  - **Estado:** Vigente.
  - **Implementación actual:** `POST /register/register` con normalización de errores técnicos para no exponer trazas internas al usuario.
- **NFF-VIG-REG-05 – OAuth social en registro**
  - **Estado:** No implementado.
  - **Implementación actual:** No hay registro social (Google, etc.) en el frontend actual.

- **NFF-VIG-REST-01 – Entrada por query param**
  - **Estado:** Vigente.
  - **Implementación actual:** `Restaurant.tsx` consume `uid` vía `useSearchParams` en la ruta `/Restaurant?uid=...`.
- **NFF-VIG-REST-02 – Carga de datos y estados**
  - **Estado:** Vigente.
  - **Implementación actual:** `useRestaurantData(uid)` carga info, mesas y comentarios con skeleton inicial y estado "restaurante no encontrado" si aplica.
- **NFF-VIG-REST-03 – Navegación superior contextual**
  - **Estado:** Vigente.
  - **Implementación actual:** Botón volver, marca, toggler de tema y búsqueda rápida (solo cliente autenticado).
- **NFF-VIG-REST-04 – Pestañas de detalle**
  - **Estado:** Vigente.
  - **Implementación actual:** Tabs `resumen`, `fotos`, `mapa`, `reseñas` con comportamiento sticky y contenido segmentado.
- **NFF-VIG-REST-05 – Reserva guiada y validada**
  - **Estado:** Vigente.
  - **Implementación actual:** Flujo fecha -> slots (debounce), mesa -> capacidad máxima de comensales -> confirmación en modal.
- **NFF-VIG-REST-06 – Creación de reserva previa al pago**
  - **Estado:** Vigente.
  - **Implementación actual:** `authFetch` a `/facturas/reservar`; guarda `pendingReservation` en `sessionStorage` y redirige a `/Pasarela_pagos`.

- **NFF-VIG-PAY-01 – Guard de pasarela**
  - **Estado:** Vigente.
  - **Implementación actual:** `PaymentGateway.tsx` exige `pendingReservation`; si no existe, redirige a home.
- **NFF-VIG-PAY-02 – Checkout canónico**
  - **Estado:** Vigente.
  - **Implementación actual:** Vista activa en `components/CheckoutPage.tsx` (tarjeta, resumen, total y confirmación). El archivo `components/checkout-page.tsx` no es el flujo principal actual.
- **NFF-VIG-PAY-03 – Validación de tarjeta**
  - **Estado:** Vigente.
  - **Implementación actual:** Número 16 dígitos, CVC 3, expiración `MM/YY` vigente y titular mínimo en cliente.
- **NFF-VIG-PAY-04 – Integración Wompi**
  - **Estado:** Vigente.
  - **Implementación actual:** `POST /wompi/crear_pago`; soporta `async_payment_url`, aprobación inmediata o estado pendiente.
- **NFF-VIG-PAY-05 – Polling de transacción**
  - **Estado:** Vigente.
  - **Implementación actual:** Consulta `GET /wompi/transaccion/:id` cada 5s, hasta 60 intentos, con estados `APPROVED`, `DECLINED`, `ERROR`, `VOIDED`.
- **NFF-VIG-PAY-06 – Limpieza y cierre de flujo**
  - **Estado:** Vigente.
  - **Implementación actual:** En pago aprobado se elimina `pendingReservation`, se notifica y se redirige a home.
- **NFF-VIG-PAY-07 – Pantalla de pago exitoso (Wompi async / retorno)**
  - **Estado:** Vigente.
  - **Implementación actual:** Ruta `/pago-exitoso` (`PagoExitoso.tsx`), lectura opcional de `transaction_id` / `reference` en query, cuenta regresiva y limpieza de `sessionStorage` antes de volver a `/`.

- **NFF-VIG-CLIENT-01 – Sin dashboard dedicado para cliente; Home como hub**
  - **Estado:** Vigente.
  - **Implementación actual:** Tras login, el backend envía `redirect_to: "/"` para rol cliente; `getRoleRedirectPath('cliente')` → `ROUTES.HOME` en `routes/paths.ts`. No hay ruta `/ClienteDashboard` ni `ProtectedRoute` solo-cliente.
- **NFF-VIG-CLIENT-02 – Perfil, reservas y cancelación vía modal**
  - **Estado:** Vigente.
  - **Implementación actual:** `ProfileModal.tsx`: pestañas perfil/reservas, `GET /cliente/mi-perfil`, `GET /cliente/mis-reservas`, `PUT /cliente/editarcliente`, `PUT /credenciales/editarcredencial`, cancelación con `PATCH /cliente/mis-reservas/{id}/cancelar`. Acceso desde cabecera (`Header`, `AuthPageShell`, `Home`).
- **NFF-VIG-CLIENT-03 – Página `/Datos_personales`**
  - **Estado:** Parcial (placeholder).
  - **Implementación actual:** `PersonalData.tsx` en ruta `ROUTES.PERSONAL_DATA`; UI mínima. La edición principal del cliente está en `ProfileModal`, no aquí.
- **NFF-VIG-APP-01 – Cookies, CORS-friendly y enforcer de rol**
  - **Estado:** Vigente.
  - **Implementación actual:** `CookieConsentModal` montado en `App.tsx`; `RoleEnforcer` redirige dueño/admin/empleado desde `/` hacia su dashboard (`paths.ts`, `isPrivilegedRole`).

> **Nota de vigencia:** los ítems `NFF-001..NFF-104` quedan como histórico y están reemplazados por el bloque **NFF-VIG-HOME / NFF-VIG-SEARCH / NFF-VIG-LOGIN / NFF-VIG-REG** de esta sección.

- **NFF-001 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – En la parte superior izquierda contiene el logo**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-002 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Color primario Naranja degradado usado en :Título principal “Reserva en tu restaurante favorito”,Botón “Buscar”,Botón “Ver disponibilidad”,**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** El titular visible en el hero es «Reserva tu mesa sin complicaciones» con gradiente primary→accent (`HeroSection.tsx`), no el texto citado en el requisito legacy.

- **NFF-003 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Color secundario: Azul oscuro / gris azulado usado en :Botón “Iniciar Sesión”,Títulos secundarios**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Botón «Iniciar Sesión»: `bg-foreground` con hover a primary (`Header.tsx`), no azul/gris azulado fijo del Excel.

- **NFF-004 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Color de acción secundaria: Verde suave usado en:Botón “Registrarse”**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Botón «Registrarse» usa el token `secondary` (#FF2D55) con hover a primary, no verde (`Header.tsx`).

- **NFF-005 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Fondo general:Degradado beige / crema claro**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Fondo de página: gradientes `from-muted/60 via-background` y hero con `from-primary/10` (`Home.tsx`, `HeroSection.tsx`), no el degradado beige fijo del texto legacy.

- **NFF-006 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Footer:Azul oscuro**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Footer en `Footer.tsx`: grid 4 columnas en md+, enlaces a Buscar, Restaurantes, Acerca de, Contacto, Ayuda, Términos, Privacidad. Fondo `bg-background` (no azul oscuro uniforme). Nota: un bloque aún muestra el texto «Reservify» junto a la marca.

- **NFF-007 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Fuente sans-serif moderna (ej. Inter, Poppins o similar):Título principal: mínimo 48px,Subtítulo: 20–24px, Texto normal: 14–16px,Botones: 14–16px, semibold**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tipografía global **Google Sans** (`index.css`, `--font-sans`); títulos/subtítulos con escalas responsive (`HeroSection.tsx`), no Inter/Poppins obligatorios.

- **NFF-008 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – header debe incluir al lado izquierdo el logo de "RESERVIFY"**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-009 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – header debe incluir al lado centralel enlace "RESTAURANTES"**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** En escritorio: ancla a `/#restaurantes` con texto «Restaurantes». La barra de búsqueda en header solo aparece si el usuario es cliente autenticado (`canSearch`).

- **NFF-010 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – header debe incluir al lado derecho: Botón modo oscuro (icono sol/luna), Botón “Iniciar Sesión” (color azul oscuro),Botón “Registrarse” (color verde suave)**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Cabecera pública: `Brand`, enlace Restaurantes, `AnimatedThemeToggler`, botones Iniciar sesión / Registrarse con tokens (`Header.tsx`); no coinciden los colores «azul/verde» del texto legacy.

- **NFF-011 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Altura máxima del header: 80px**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** El header fijo usa `h-14 sm:h-16` (56–64px), no 80px (`Header.tsx`).

- **NFF-012 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe permanecer fijo al hacer scroll (sticky navbar).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-013 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe contener Título centrado horizontalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-014 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe contener Subtítulo centrado debajo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-015 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe contener Barra de búsqueda centrada:Ancho: 60% del contenedor en escritorio, Altura mínima: 50px, Bordes redondeados (border-radius: 30px), Ícono de lupa a la izquierda,Botón “Buscar” alineado a la derecha dentro del input.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Búsqueda principal en `SearchBar.tsx` dentro del hero; layout responsive con Tailwind, no ancho 60% fijo obligatorio.

- **NFF-016 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe contener Chips de categorías:Italiana,Japonesa,Mexicana, Mediterránea, Deben estar alineadas horizontalmente.,Border-radius: 20px, Fondo azul claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Categorías de cocina: carrusel en `CuisineCarousel.tsx` y lista amplia en `Home.tsx`; estilos con tokens Tailwind, no «fondo azul claro» fijo del Excel.

- **NFF-017 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe contener Opción “Usar mi ubicación actual” debajo centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-018 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe incluir Tarjetas horizontales con: Icono centrado, Nombre de cocina debajo, Sombra suave (box-shadow),Border-radius: 15px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-020 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe incluir:Indicadores inferiores (dots activos).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-021 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Cada tarjeta debe contener: Imagen en la parte superior(opcional),Etiqueta naranja “Disponible hoy” en esquina superior derecha., Nombre del restaurante en negrita, Precio (ej. $$) alineado a la derecha, Descripción corta, Calificación con estrella, Horario, Dirección, Botón “Ver disponibilidad” ancho completo en parte inferior.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales.

- **NFF-022 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Cada tarjeta debe contener: Ancho tarjeta: 300–350px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-023 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Cada tarjeta debe contener: Altura proporcional fija.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-024 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Cada tarjeta debe contener efecto hover:Elevación (transform: translateY(-5px)),Cambio de borde a naranja.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-025 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Debe incluir 3 columnas:Reserva Instantánea, Para Todos, Los Mejores**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Sección de beneficios en `FeaturesSection.tsx`: grid responsive con **6** tarjetas (3 columnas desde `md`), titulares distintos a «Reserva Instantánea / Para Todos / Los Mejores».

- **NFF-026 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Cada columna:Icono dentro de contenedor cuadrado con fondo suave, Título debajo, Texto descriptivo centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-027 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – “¿Listo para tu próxima experiencia culinaria?” debe tener:Fondo degradado naranja → verde, Texto blanco.
Botón blanco centrado:Border-radius: 12px, Hover: fondo gris claro.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** CTA en `CTASection.tsx`: titular «Tu próxima mesa está a un toque», fondo oscuro con halos primary/accent, no el texto ni el degradado naranja→verde del Excel.

- **NFF-028 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Footer Debe contener 4 columnas:, Logo + descripción, Restaurantes (Buscar / Cocinas), Empresa (Acerca de / Contacto), Soporte (Ayuda / Términos / Privacidad)**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Footer en `Footer.tsx`: grid 4 columnas en md+, enlaces a Buscar, Restaurantes, Acerca de, Contacto, Ayuda, Términos, Privacidad. Fondo `bg-background` (no azul oscuro uniforme). Nota: un bloque aún muestra el texto «Reservify» junto a la marca.

- **NFF-029 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – El footer de tener como requisitos:Fondo azul oscuro, Texto blanco, Separador horizontal superior, Copyright centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Footer en `Footer.tsx`: grid 4 columnas en md+, enlaces a Buscar, Restaurantes, Acerca de, Contacto, Ayuda, Términos, Privacidad. Fondo `bg-background` (no azul oscuro uniforme). Nota: un bloque aún muestra el texto «Reservify» junto a la marca.

- **NFF-030 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Responsive Design
Móvil:Navbar colapsable (hamburguesa), Tarjetas en columna,Botones full width.
Tablet:2 tarjetas por fila.
Escritorio:3 tarjetas por fila.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`).

- **NFF-031 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Accesibilidad:Contraste mínimo 4.5:1, Botones navegables con teclado,Labels accesibles en inputs,Uso correcto de etiquetas semánticas HTML5.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Componentes shadcn/Radix aportan patrones accesibles; no hay auditoría WCAG formal en el repo.

- **NFF-032 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Rendimiento: Lazy loading en imágenes, Compresión WebP,Minificación de CSS y JS,Tiempo de carga < 3 segundos.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** `Home.tsx` usa `lazy`/`Suspense` para secciones; build Vite minifica JS/CSS. Cumplimiento de <3s depende de red y hosting.

- **NFF-033 – PÁGINA PRINCIPAL O PÁGINA DE BIENVENIDA modo claro – Seguridad:HTTPS obligatorio, Sanitización de inputs, Tokens JWT seguros,Protección contra(SQL Injection ,XSS, CSRF).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** HTTPS y protecciones de capa servidor/despliegue; el cliente usa `fetch` al backend y JWT en `localStorage` (`authService`, `Login.tsx`).

- **NFF-034 – INICIO SESIÓN - modo claro – Utilizando JavaScript, se realiza una validación de los campos del formulario. Si algún campo obligatorio está vacío al momento de presionar el botón de enviar mensaje, se mostrará un texto en color rojo indicando que el campo debe ser llenado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Validación de envío y errores vía estado/React y toasts (`Login.tsx`, `ToastProvider`).

- **NFF-035 – INICIO SESIÓN - modo claro – Fondo general: Degradado vertical en tonos beige/crema claro. Desde #e8dfd3 (parte superior) hasta #d8cfc2 (parte inferior). Debe ocupar 100% del alto y ancho de la pantalla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-036 – INICIO SESIÓN - modo claro – Contenedor del formulario: Ancho máximo 420px, ancho relativo 90% en móviles. Padding interno mínimo 32px. Fondo blanco (#ffffff). Bordes redondeados 16px. Sombra suave: 0 10px 25px rgba(0,0,0,0.08).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-037 – INICIO SESIÓN - modo claro – Icono superior de seguridad: Contenedor 56px x 56px. Border-radius 12px. Degradado diagonal 135° desde #ff7a3d hasta #f4b942. Icono interno en color blanco, centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-038 – INICIO SESIÓN - modo claro – Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color #2b2b2b. Alineación centrada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-039 – INICIO SESIÓN - modo claro – Subtítulo “Inicia sesión en tu cuenta”: Tamaño 14px–16px. Color #6b6b6b. Centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-040 – INICIO SESIÓN - modo claro – Subtítulo interno “Iniciar Sesión”: Tamaño 18px–20px. Color #333333.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-041 – INICIO SESIÓN - modo claro – Texto descriptivo interno: Tamaño 13px–14px. Color #777777.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-042 – INICIO SESIÓN - modo claro – Campo “Correo electrónico”: Altura 48px. Fondo #f1ece6. Borde 1px sólido #d6d1c9. Border-radius 10px. Texto ingresado color #333333. Placeholder color #9a9a9a. Icono izquierdo 16px–18px color gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-043 – INICIO SESIÓN - modo claro – Campo “Contraseña”: Misma altura y estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (visualización) en color gris medio. En focus: borde color #ff7a3d y sombra 0 0 0 3px rgba(255,122,61,0.15).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-044 – INICIO SESIÓN - modo claro – Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color #ff7a3d. Sin fondo. Hover: #e5672f.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Flujo «¿Olvidaste tu contraseña?» con vistas email/código/reset en `Login.tsx` (no solo enlace estático).

- **NFF-045 – INICIO SESIÓN - modo claro – Botón principal “Iniciar Sesión”: Altura 50px. Ancho 100%. Fondo #ff6b35. Texto blanco #ffffff. Border-radius 10px. Hover: #e85c2a. Transición 0.3s.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-046 – INICIO SESIÓN - modo claro – Separador “O continúa con”: Texto centrado 12px–13px color #8a8a8a. Líneas laterales 1px color #dddddd.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-047 – INICIO SESIÓN - modo claro – Botón “Google”: Altura 48px. Fondo #f2f2f2. Borde 1px sólido #dcdcdc. Border-radius 10px. Texto #333333. Icono oficial Google alineado a la izquierda. Hover: #e6e6e6.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay OAuth con Google en `Login.tsx` ni en `registrar.tsx` (solo email/contraseña y recuperación de contraseña en login).

- **NFF-048 – INICIO SESIÓN - modo claro – Texto “¿No tienes una cuenta?”: Tamaño 13px–14px. Color #777777**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-049 – INICIO SESIÓN - modo claro – Enlace “Regístrate aquí”: Color #ff6b35. Sin fondo. Hover: #e85c2a.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-050 – INICIO SESIÓN - modo claro – Texto legal inferior: Tamaño 12px. Color #9a9a9a. Alineación centrada. Espaciado horizontal uniforme entre enlaces.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-051 – INICIO SESIÓN - modo claro – Botón modo claro/oscuro (icono sol): Tamaño aproximado 36px x 36px. Fondo neutro claro #f0ebe4. Border-radius 8px. Icono color #ff7a3d.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-052 – INICIO SESIÓN - modo claro – Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Sin fondo. Hover con ligera variación de tono.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-053 – INICIO SESIÓN - modo claro – Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Sin fondo. Hover con ligera variación de tono.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`).

- **NFF-054 – INICIO SESIÓN - modo oscuro – Fondo general: Degradado radial oscuro centrado en el formulario. Desde negro profundo (#0f0f0f) en los bordes hacia un gris muy oscuro (#1a1a1a – #222222) en la zona central. Debe cubrir 100% del alto y ancho de la pantalla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-055 – INICIO SESIÓN - modo oscuro – Contenedor del formulario: Ancho máximo 420px. Ancho relativo 90% en dispositivos móviles. Padding interno mínimo 32px. Fondo gris muy oscuro (#1c1c1c). Borde 1px sólido rgba(255,255,255,0.05). Border-radius 16px. Sombra exterior 0 10px 30px rgba(0,0,0,0.6).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-056 – INICIO SESIÓN - modo oscuro – Icono superior de seguridad: Contenedor 56px x 56px. Border-radius 12px. Degradado diagonal 135° desde #ff7a3d hasta #f4b942. Icono interno en color blanco (#ffffff), centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-057 – INICIO SESIÓN - modo oscuro – Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color blanco (#ffffff). Alineación centrada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-058 – INICIO SESIÓN - modo oscuro – Subtítulo “Inicia sesión en tu cuenta”: Tamaño 14px–16px. Color gris claro (#b3b3b3). Centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-059 – INICIO SESIÓN - modo oscuro – Subtítulo interno “Iniciar Sesión”: Tamaño 18px–20px.Color blanco (#f5f5f5).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-060 – INICIO SESIÓN - modo oscuro – Texto descriptivo interno: Tamaño 13px–14px. Color gris medio (#9a9a9a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-061 – INICIO SESIÓN - modo oscuro – Campo “Correo electrónico”: Altura 48px. Fondo negro suave (#111111). Borde 1px sólido rgba(255,255,255,0.08). Border-radius 10px. Texto ingresado color blanco (#ffffff). Placeholder color #8a8a8a. Icono izquierdo 16px–18px en color gris claro (#b0b0b0).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-062 – INICIO SESIÓN - modo oscuro – Campo “Contraseña”: Misma altura y estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (ojo) en color gris claro (#b0b0b0). En focus: borde color rojo corporativo (#b91c1c) y sombra 0 0 0 3px rgba(185,28,28,0.25).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-063 – INICIO SESIÓN - modo oscuro – Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color rojo corporativo (#b91c1c). Sin fondo. Hover: #991b1b.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Flujo «¿Olvidaste tu contraseña?» con vistas email/código/reset en `Login.tsx` (no solo enlace estático).

- **NFF-064 – INICIO SESIÓN - modo oscuro – Botón principal “Iniciar Sesión”: Altura 50px. Ancho 100%. Fondo rojo intenso (#b91c1c). Texto blanco (#ffffff). Border-radius 10px. Hover: #991b1b. Transición 0.3s.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-065 – INICIO SESIÓN - modo oscuro – Separador “O continúa con”: Texto centrado 12px–13px color #8a8a8a. Líneas laterales 1px color rgba(255,255,255,0.1).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-066 – INICIO SESIÓN - modo oscuro – Botón “Google”: Altura 48px. Fondo negro sólido (#0d0d0d). Borde 1px sólido rgba(255,255,255,0.08). Border-radius 10px. Texto blanco (#ffffff). Icono oficial Google alineado a la izquierda. Hover: #1a1a1a.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay OAuth con Google en `Login.tsx` ni en `registrar.tsx` (solo email/contraseña y recuperación de contraseña en login).

- **NFF-067 – INICIO SESIÓN - modo oscuro – Texto “¿No tienes una cuenta?”: Tamaño 13px–14px. Color gris medio (#9a9a9a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-068 – INICIO SESIÓN - modo oscuro – Enlace “Regístrate aquí”: Color rojo corporativo (#b91c1c). Hover: #991b1b.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-069 – INICIO SESIÓN - modo oscuro – Texto legal inferior: Tamaño 12px. Color gris tenue (#7a7a7a). Alineación centrada. Separación uniforme entre enlaces.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-070 – INICIO SESIÓN - modo oscuro – Botón modo oscuro (icono luna): Tamaño aproximado 36px x 36px. Fondo negro suave (#111111). Border-radius 8px. Icono color rojo (#b91c1c) o blanco según contraste.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-071 – INICIO SESIÓN - modo oscuro – Enlace superior “Volver al inicio”: Tamaño 14px. Color rojo corporativo (#b91c1c). Sin fondo. Hover con ligera variación a #991b1b.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS.

- **NFF-072 – REGISTRO - modo claro – Fondo general: Degradado claro y cálido, transición suave desde beige muy claro (#f5f1ea) en los bordes hacia crema ligeramente más profundo (#ebe4d8 – #e6dccb). Debe cubrir el 100% del alto y ancho de la pantalla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-073 – REGISTRO - modo claro – Contenedor del formulario: Ancho máximo 420px y 90% en móviles. Padding interno 32px. Fondo blanco (#ffffff). Borde 1px rgba. Border-radius 16px. Sombra 0 10px 30px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-074 – REGISTRO - modo claro – Icono superior de seguridad: 56px x 56px. Border-radius 14px. Degradado desde #ff7a3d hasta #7cbf9e. Icono blanco (#ffffff) centrado. Sombra sutil 0 8px 20px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-075 – REGISTRO - modo claro – Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color gris muy oscuro (#222222). Centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-076 – REGISTRO - modo claro – Subtítulo “Registra tu cuenta de Reservify”: Tamaño 14px–16px. Color gris medio (#6b7280). Centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-077 – REGISTRO - modo claro – Subtítulo interno “Crea tu cuenta”: Tamaño 18px–20px. Color gris oscuro (#2b2b2b).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-078 – REGISTRO - modo claro – Texto descriptivo “Ingresa tus datos para crear tu cuenta”: Tamaño 13px–14px. Color gris medio (#8a8a8a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-079 – REGISTRO - modo claro – Campo “Correo electrónico”: Altura 48px. Fondo gris claro (#f3f4f6). Borde 1px rgba. Border-radius 10px. Texto #222222. Placeholder #9ca3af. Icono izquierdo gris (#9a9a9a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-080 – REGISTRO - modo claro – Campo “Contraseña”: Mismos estilos que correo. Icono izquierdo candado y derecho ojo en gris (#9a9a9a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-081 – REGISTRO - modo claro – Campo “Confirmar contraseña”: Mismos estilos. Validación en tiempo real.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-082 – REGISTRO - modo claro – Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color #ff7a3d. Hover #e5672f.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Flujo «¿Olvidaste tu contraseña?» con vistas email/código/reset en `Login.tsx` (no solo enlace estático).

- **NFF-083 – REGISTRO - modo claro – Botón principal “Continuar”: Altura 50px. Ancho 100%. Degradado horizontal #ff7a3d a #7cbf9e. Texto blanco (#ffffff). Border-radius 12px. Sombra 0 8px 20px. Hover con ligera elevación y transición 0.3s. fondo #d1d5db y texto #6b7280.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-084 – REGISTRO - modo claro – Separador “O continúa con”: Texto centrado 12px–13px color #9ca3af. Líneas laterales 1px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-085 – REGISTRO - modo claro – Botón “Google”: Altura 48px. Fondo blanco (#ffffff). Borde 1px. Border-radius 10px. Texto #222222. Hover #f3f4f6.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay OAuth con Google en `Login.tsx` ni en `registrar.tsx` (solo email/contraseña y recuperación de contraseña en login).

- **NFF-086 – REGISTRO - modo claro – Texto inferior y enlaces secundarios: Tamaño 12px–14px. Color gris medio (#9ca3af). Enlaces en #ff7a3d con hover #e5672f.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-087 – REGISTRO - modo claro – Botón modo oscuro (icono luna): 36px x 36px. Fondo blanco (#ffffff). Borde 1px rgba. Border-radius 8px. Icono gris oscuro (#444444).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-088 – REGISTRO - modo claro – Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Hover #e5672f.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-089 – REGISTRO - modo oscuro – Fondo general: Fondo oscuro uniforme con ligera variación hacia el centro. Predomina negro profundo (#0f0f0f – #121212) cubriendo el 100% del alto y ancho de la pantalla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-090 – REGISTRO - modo oscuro – Contenedor del formulario: Ancho aproximado 420px, centrado. Fondo gris muy oscuro (#1a1a1a – #1c1c1c). Bordes redondeados (aprox. 16px). Sombra exterior suave que lo separa del fondo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-091 – REGISTRO - modo oscuro – Icono superior de seguridad: Contenedor cuadrado con bordes redondeados (aprox. 12px–14px). Degradado diagonal en tonos naranja. Icono de candado blanco centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-092 – REGISTRO - modo oscuro – Título principal “Bienvenido a Reservify”: Tamaño grande (aprox. 36px–42px). Color blanco (#ffffff). Alineación centrada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-093 – REGISTRO - modo oscuro – Subtítulo “Registra tu cuenta de Reservify”: Tamaño pequeño (aprox. 14px–16px). Color gris claro (#b3b3b3). Centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-094 – REGISTRO - modo oscuro – Subtítulo interno “Crea tu cuenta”: Tamaño medio (aprox. 18px–20px). Color blanco o gris muy claro. Centrado dentro del formulario.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-095 – REGISTRO - modo oscuro – Texto descriptivo “Ingresa tus datos para crear tu cuenta”: Tamaño pequeño (aprox. 13px–14px). Color gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-096 – REGISTRO - modo oscuro – Campo “Correo electrónico”: Altura aproximada 48px. Fondo negro/gris muy oscuro (#111111). Borde sutil más claro que el fondo. Border-radius cercano a 10px. Texto blanco. Placeholder en gris. Icono izquierdo en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-097 – REGISTRO - modo oscuro – Campo “Contraseña”: Mismos estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (ojo) en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-098 – REGISTRO - modo oscuro – Campo “Confirmar contraseña”: Mismos estilos que contraseña. Incluye iconos izquierdo y derecho en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-099 – REGISTRO - modo oscuro – Enlace “¿Olvidaste tu contraseña?”: Tamaño pequeño. Color rojo (#b91c1c). Centrado debajo de los campos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Flujo «¿Olvidaste tu contraseña?» con vistas email/código/reset en `Login.tsx` (no solo enlace estático).

- **NFF-100 – REGISTRO - modo oscuro – Botón principal “Continuar”: Altura aproximada 50px. Ancho 100%. Fondo con degradado horizontal en tonos rojo a naranja. Texto blanco. Bordes redondeados (aprox. 10px–12px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-101 – REGISTRO - modo oscuro – Separador “O continúa con”: Texto pequeño en gris claro, centrado. Líneas horizontales finas a ambos lados en tono gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-102 – REGISTRO - modo oscuro – Botón “Google”: Altura aproximada 48px. Fondo negro muy oscuro. Borde fino gris. Border-radius cercano a 10px. Texto blanco. Icono oficial de Google alineado a la izquierda.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay OAuth con Google en `Login.tsx` ni en `registrar.tsx` (solo email/contraseña y recuperación de contraseña en login).

- **NFF-103 – REGISTRO - modo oscuro – Enlace superior “Volver al inicio”: Ubicado en la parte superior izquierda. Tamaño pequeño. Color rojo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-104 – REGISTRO - modo oscuro – Botón modo oscuro (icono luna): Ubicado en la parte superior derecha. Forma cuadrada pequeña con bordes redondeados. Fondo oscuro. Icono en tono rojizo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-105 – EMPLEADO (resumen) - modo claro – Fondo general: Área principal en beige claro uniforme. Barra lateral izquierda en gris claro sólido. Cobertura completa del alto visible.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-106 – EMPLEADO (resumen) - modo claro – Barra lateral: Fondo gris claro. Separación visual mediante contraste con el fondo principal. Tipografía en color oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-107 – EMPLEADO (resumen) - modo claro – Ítem activo “Resumen”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-108 – EMPLEADO (resumen) - modo claro – Ítems inactivos (“Mesas”, “Reservas”, “Correos”, “Configuración”): Fondo gris claro o transparente. Texto oscuro. Sin resaltado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-109 – EMPLEADO (resumen) - modo claro – Título “Buenas tardes”: Tamaño grande (aprox. 32px–40px). Color gris muy oscuro o negro suave. Alineación izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-110 – EMPLEADO (resumen) - modo claro – Texto descriptivo: Tamaño menor (14px–16px). Color gris medio para jerarquía visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-111 – EMPLEADO (resumen) - modo claro – Tarjeta informativa superior: Fondo gris claro. Border-radius 12px–16px. Texto principal en color oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-112 – EMPLEADO (resumen) - modo claro – Etiqueta “Hora actual”: Fondo naranja sólido. Texto blanco. Forma tipo píldora. Tamaño reducido (12px–13px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-113 – EMPLEADO (resumen) - modo claro – Tarjetas de métricas: Fondo gris claro uniforme. Bordes redondeados consistentes (12px–16px). Sombra suave y discreta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-114 – EMPLEADO (resumen) - modo claro – Valores numéricos (0 / $0): Tamaño destacado (20px–24px). Color oscuro de alto contraste.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-115 – EMPLEADO (resumen) - modo claro – Textos secundarios (“de 0 totales”, “actualmente”, “para hoy”, “hasta ahora”): Tamaño pequeño (12px–14px). Color gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-116 – EMPLEADO (resumen) - modo claro – Tarjeta “Mi balance”: Fondo gris claro consistente con las demás tarjetas. Monto “$0” en tamaño destacado y color oscuro. Texto “total facturado” en gris medio y tamaño reducido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-117 – EMPLEADO (resumen) - modo claro – Sección “Próximas reservas”: Contenedor ancho en gris claro. Bordes redondeados uniformes.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-118 – EMPLEADO (resumen) - modo claro – Título en color oscuro. Texto descriptivo en gris medio. Mensaje “No hay reservas próximas.” en color gris estándar sin resaltado adicional.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-119 – EMPLEADO (resumen) - modo claro – Bloque de usuario inferior: Integrado en la barra lateral con fondo gris claro. Nombre en color oscuro. Correo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-120 – EMPLEADO (resumen) - modo claro – Opción “Cerrar sesión”: Texto oscuro sin fondo. Cambio leve de tono en estado hover.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-121 – EMPLEADO (mesas) - modo claro – Ítem activo “Mesas”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados. Debe diferenciarse claramente del resto del menú lateral.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-122 – EMPLEADO (mesas) - modo claro – Encabezado superior “Mesas”: Texto pequeño superior en color gris medio, alineado a la izquierda, funcionando como etiqueta de sección.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-123 – EMPLEADO (mesas) - modo claro – Título “Buenas tardes”: Se mantiene el mismo estilo tipográfico y color definido en los lineamientos generales del panel.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-124 – EMPLEADO (mesas) - modo claro – Sección “Estado de mesas”: Título en color oscuro de alto contraste. Texto descriptivo “Estado actual de todas las mesas” en gris medio para jerarquía visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-125 – EMPLEADO (mesas) - modo claro – Indicadores de estado (Disponible, Ocupada, Reservada, Limpieza): Presentación en etiquetas tipo píldora (border-radius completo). Fondo en tonos suaves diferenciados por estado. Texto en color oscuro o ligeramente contrastado según el fondo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-126 – EMPLEADO (mesas) - modo claro – Contenedor principal de mesas: Tarjeta amplia con fondo gris claro uniforme. Bordes redondeados consistentes con el resto del panel. Sin elementos decorativos adicionales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-127 – EMPLEADO (mesas) - modo claro – Mensaje “No hay mesas cargadas.”: Texto centrado dentro del contenedor. Color gris medio. Sin resaltado ni fondo adicional.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-128 – EMPLEADO (reservas) - modo claro – Ítem activo “Reservas”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados para indicar sección activa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-129 – EMPLEADO (reservas) - modo claro – Encabezado superior “Reservas”: Texto pequeño en gris medio, alineado a la izquierda como etiqueta de sección.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-130 – EMPLEADO (reservas) - modo claro – Sección “Reservas de hoy”: Título en color oscuro de alto contraste. Texto descriptivo “Gestiona todas las reservas del día” en gris medio para jerarquía visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-131 – EMPLEADO (reservas) - modo claro – Tarjetas de estado (Pendientes, Confirmadas, En proceso, Completadas): Fondo gris claro uniforme. Border-radius consistente (12px–16px). Sombra suave y discreta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-132 – EMPLEADO (reservas) - modo claro – Valores numéricos (0): Tamaño destacado (20px–24px). Color oscuro de alto contraste.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-133 – EMPLEADO (reservas) - modo claro – Texto inferior de cada estado: Tamaño reducido (12px–14px). Color gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-134 – EMPLEADO (reservas) - modo claro – Contenedor principal de reservas: Tarjeta amplia con fondo gris claro uniforme. Bordes redondeados consistentes con el sistema visual del panel.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-135 – EMPLEADO (reservas) - modo claro – Mensaje “No hay reservas de hoy.”: Texto centrado dentro del contenedor. Color gris medio. Sin resaltado adicional.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-136 – EMPLEADO (correos) - modo claro – Ítem activo “Correos”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados para indicar sección activa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-137 – EMPLEADO (correos) - modo claro – Encabezado superior “Correos”: Texto pequeño en gris medio, alineado a la izquierda como etiqueta de sección.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-138 – EMPLEADO (correos) - modo claro – Sección “Correos no leídos”: Título en color oscuro de alto contraste acompañado de icono de sobre en tono gris oscuro. Texto descriptivo inferior en gris medio con tamaño reducido para jerarquía visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-139 – EMPLEADO (correos) - modo claro – Botón “Actualizar”: Fondo gris muy claro. Texto oscuro. Bordes redondeados tipo píldora o suavizados. Icono de recarga en color oscuro alineado a la izquierda del texto.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-140 – EMPLEADO (correos) - modo claro – Contenedor principal de correos: Tarjeta amplia con fondo gris claro uniforme. Border-radius consistente (12px–16px). Sombra suave y discreta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-141 – EMPLEADO (correos) - modo claro – Área interna de listado vacío: Fondo ligeramente diferenciado mediante tono gris muy claro y borde punteado o discontinuo en gris tenue. Bordes redondeados uniformes.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-142 – EMPLEADO (correos) - modo claro – Icono central (sobre): Tamaño grande. Color gris medio. Centrado dentro del contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-143 – EMPLEADO (correos) - modo claro – Mensaje “No hay correos no leídos”: Texto centrado en color oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-144 – EMPLEADO (correos) - modo claro – Texto secundario explicativo: Tamaño menor (12px–14px). Color gris medio. Sin resaltado adicional.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-145 – EMPLEADO (configuracion) - modo claro – Ítem activo “Configuración”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados para indicar sección activa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-146 – EMPLEADO (configuracion) - modo claro – Encabezado superior “Configuración”: Texto pequeño en gris medio, alineado a la izquierda como etiqueta de sección.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-147 – EMPLEADO (configuracion) - modo claro – Sección “SMTP (envío de correos)”: Tarjeta con fondo gris claro uniforme. Border-radius consistente (12px–16px). Sombra suave y discreta. Título en color oscuro acompañado de icono en tono gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-148 – EMPLEADO (configuracion) - modo claro – Campos de entrada (Host, Puerto, Usuario, Correo remitente, Contraseña): Fondo blanco o gris muy claro. Borde fino en gris tenue. Bordes ligeramente redondeados (8px–10px). Texto ingresado en color oscuro. Placeholder en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-149 – EMPLEADO (configuracion) - modo claro – Botón “Guardar SMTP”: Fondo naranja sólido. Texto blanco (#ffffff). Bordes redondeados. Alto uniforme respecto al sistema de botones. Sin degradado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-150 – EMPLEADO (configuracion) - modo claro – Sección “IMAP (recepción de correos)”: Tarjeta independiente con el mismo fondo gris claro y bordes redondeados que SMTP para mantener consistencia visual. Título en color oscuro con icono en gris oscuro. Texto descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-151 – EMPLEADO (configuracion) - modo claro – Campos IMAP (Host, Puerto, Usuario, Contraseña): Mismo tratamiento visual que los campos SMTP (fondo claro, borde gris tenue, bordes redondeados).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-152 – EMPLEADO (configuracion) - modo claro – Botón “Guardar IMAP”: Fondo verde suave (tono similar a verde medio). Texto blanco (#ffffff). Bordes redondeados. Diferenciación cromática respecto al botón SMTP.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-153 – EMPLEADO (resumen) - modo oscuro – Fondo general del sitio: Color negro/gris muy oscuro (#0a0a0a aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-154 – EMPLEADO (resumen) - modo oscuro – Barra lateral (Sidebar): Fondo negro sólido. Borde derecho sutil en gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-155 – EMPLEADO (resumen) - modo oscuro – Logo "Reservify": Icono rojo redondeado con letra blanca. Texto en negrita, color blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-156 – EMPLEADO (resumen) - modo oscuro – Ítem de menú activo (Resumen): Fondo rojo oscuro (#7f1d1d). Texto blanco. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-157 – EMPLEADO (resumen) - modo oscuro – Ítems de menú inactivos: Texto gris claro. Iconos lineales sencillos. Hover: fondo gris muy oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-158 – EMPLEADO (resumen) - modo oscuro – Perfil de usuario (inferior): Contenedor con borde superior gris. Avatar circular rojo con inicial blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-159 – EMPLEADO (resumen) - modo oscuro – Encabezado principal: Texto "Buenas tardes" en blanco, fuente sans-serif, peso bold, tamaño aprox. 32px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-160 – EMPLEADO (resumen) - modo oscuro – Subtítulo descriptivo: Texto gris medio. Tamaño de fuente reducido (aprox. 14px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-161 – EMPLEADO (resumen) - modo oscuro – Subtítulo descriptivo: Texto gris medio. Tamaño de fuente reducido (aprox. 14px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-162 – EMPLEADO (resumen) - modo oscuro – Contenedor de tarjeta: Fondo gris oscuro translúcido. Borde delgado gris. Border-radius 12px.-**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-163 – EMPLEADO (resumen) - modo oscuro – Títulos de tarjetas: Texto gris claro, alineado a la izquierda, tamaño pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-164 – EMPLEADO (resumen) - modo oscuro – Valores numéricos: Texto blanco, tamaño grande (aprox. 24px), peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-165 – EMPLEADO (resumen) - modo oscuro – Iconos de tarjetas: Ubicados en la esquina superior derecha. Contenedor cuadrado pequeño con bordes redondeados y colores temáticos (rojo, naranja, morado, dorado) con baja opacidad.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-166 – EMPLEADO (resumen) - modo oscuro – Etiquetas de estado (subtexto): Texto gris oscuro/medio debajo del valor principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-167 – EMPLEADO (resumen) - modo oscuro – Contenedor de "Próximas reservas": Tarjeta de ancho completo. Fondo igual a las métricas. Borde gris suave.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-168 – EMPLEADO (resumen) - modo oscuro – Títulos de sección interna: Texto blanco, peso bold. Margen inferior consistente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-169 – EMPLEADO (resumen) - modo oscuro – Mensaje de estado vacío: Texto gris medio, centrado en el contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-170 – EMPLEADO (mesas) - modo oscuro – Ítem de menú activo (Mesas): Fondo rojo oscuro (#7f1d1d). Texto blanco puro. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-171 – EMPLEADO (mesas) - modo oscuro – Ítem de menú previo (Resumen): Texto gris claro. Sin fondo. Icono lineal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-172 – EMPLEADO (mesas) - modo oscuro – Separadores de categoría: Texto en mayúsculas, color gris oscuro, tamaño de fuente pequeño (aprox. 10px-12px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-173 – EMPLEADO (mesas) - modo oscuro – Breadcrumb (Mesas): Texto gris medio ubicado sobre el título principal. Tamaño pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-174 – EMPLEADO (mesas) - modo oscuro – Título principal: Texto "Buenas tardes" en blanco. Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-175 – EMPLEADO (mesas) - modo oscuro – Descripción de sección: Texto gris suave. Interlineado estándar.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-176 – EMPLEADO (mesas) - modo oscuro – Título de sección: "Estado de mesas" en blanco. Peso semi-bold. Tamaño inferior al título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-177 – EMPLEADO (mesas) - modo oscuro – Leyendas de estado (Badges): Etiquetas con fondo de color con baja opacidad y texto en color sólido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-178 – EMPLEADO (mesas) - modo oscuro – Contenedor de visualización: Tarjeta de ancho completo. Fondo gris muy oscuro/negro. Borde delgado gris oscuro. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-179 – EMPLEADO (mesas) - modo oscuro – Mensaje de estado vacío: Texto gris medio ("No hay mesas cargadas"). Centrado horizontal y verticalmente dentro del contenedor. Altura mínima del contenedor aprox. 150px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-180 – EMPLEADO (reservas) - modo oscuro – Indicador de ubicación (Breadcrumb): Texto "Reservas" en gris claro, tamaño pequeño, situado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-181 – EMPLEADO (reservas) - modo oscuro – Título de vista: "Reservas de hoy" en blanco, peso semi-bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-182 – EMPLEADO (reservas) - modo oscuro – Descripción de vista: Texto gris medio ("Gestiona todas las reservas del día").**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-183 – EMPLEADO (reservas) - modo oscuro – Distribución: Cuatro tarjetas horizontales de igual tamaño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-184 – EMPLEADO (reservas) - modo oscuro – Fondo de tarjetas: Gris muy oscuro con borde sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-185 – EMPLEADO (reservas) - modo oscuro – Border-radius: 10px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-186 – EMPLEADO (reservas) - modo oscuro – Cifras de estado: Número "0" en blanco, tamaño grande (aprox. 30px), alineado arriba a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-187 – EMPLEADO (reservas) - modo oscuro – Etiquetas de estado: Texto gris claro (Pendientes, Confirmadas, En proceso, Completadas) debajo de la cifra.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-188 – EMPLEADO (reservas) - modo oscuro – Tipo de contenedor: Tarjeta rectangular de ancho completo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-189 – EMPLEADO (reservas) - modo oscuro – Fondo: Consistente con las tarjetas de métricas.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-190 – EMPLEADO (reservas) - modo oscuro – Bordes: Redondeados (12px) con contorno gris tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-191 – EMPLEADO (reservas) - modo oscuro – Mensaje de estado vacío: Texto "No hay reservas de hoy." en color gris medio, centrado en el cuerpo del contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-192 – EMPLEADO (reservas) - modo oscuro – Botón "Reservas": Fondo rojo oscuro (#7f1d1d), texto blanco, borde izquierdo rojo brillante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-193 – EMPLEADO (reservas) - modo oscuro – Border-radius del botón: 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-194 – EMPLEADO (correos) - modo oscuro – Tarjeta de bandeja de entrada: Fondo gris muy oscuro con borde sutil. Border-radius 12px. Padding interno generoso.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-195 – EMPLEADO (correos) - modo oscuro – Encabezado de sección: Icono de sobre lineal seguido del texto "Correos no leídos" en blanco y negrita.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-196 – EMPLEADO (correos) - modo oscuro – Texto informativo: Color gris medio, tamaño de fuente reducido, ubicado bajo el título de la tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-197 – EMPLEADO (correos) - modo oscuro – Botón "Actualizar": Fondo transparente con borde gris. Texto blanco. Icono de rotación a la izquierda. Border-radius 8px. Hover: fondo gris oscuro suave.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-198 – EMPLEADO (correos) - modo oscuro – Ítem de correo: Contenedor con borde inferior gris oscuro para separación. Espaciado vertical consistente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-199 – EMPLEADO (correos) - modo oscuro – Asunto del correo: Texto en blanco, peso semi-bold, tamaño ligeramente mayor al cuerpo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-200 – EMPLEADO (correos) - modo oscuro – Remitente y dirección: Texto gris claro en formato "Nombre email@ejemplo.com".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-201 – EMPLEADO (correos) - modo oscuro – Previsualización del contenido: Texto gris medio, limitado a dos líneas de texto máximo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-202 – EMPLEADO (correos) - modo oscuro – Marca de tiempo (Fecha/Hora): Ubicada en la esquina superior derecha de cada ítem. Texto gris oscuro, tamaño pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-203 – EMPLEADO (correos) - modo oscuro – Botón "Correos": Fondo rojo oscuro (#7f1d1d). Texto blanco puro. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-204 – EMPLEADO (correos) - modo oscuro – Indicador de perfil (inferior): Avatar circular rojo con letra "D" blanca. Nombre de usuario "Dueño" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-205 – EMPLEADO (correos) - modo oscuro – Esquema de color: Mantiene el modo oscuro con contrastes en blanco para legibilidad y rojo para estados activos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-206 – EMPLEADO (correos) - modo oscuro – Tipografía: Sans-serif uniforme en toda la interfaz con jerarquía clara mediante pesos (bold/regular) y variaciones de gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-207 – EMPLEADO (configuracion) - modo oscuro – Tarjetas de configuración (SMTP/IMAP): Fondo gris muy oscuro con borde fino color gris medio. Border-radius 12px. Espaciado interno (padding) amplio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-208 – EMPLEADO (configuracion) - modo oscuro – Títulos de sección: Texto en blanco con peso bold. Acompañados de iconos lineales (avión de papel para SMTP, sobre para IMAP).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-209 – EMPLEADO (configuracion) - modo oscuro – Descripción de sección: Texto gris medio, tamaño pequeño, ubicado inmediatamente debajo del título.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-210 – EMPLEADO (configuracion) - modo oscuro – Etiquetas (Labels): Texto gris claro, tamaño pequeño, peso regular.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-211 – EMPLEADO (configuracion) - modo oscuro – Cajas de texto: Fondo negro sólido. Borde gris oscuro. Border-radius 8px. Altura aprox. 40px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-212 – EMPLEADO (configuracion) - modo oscuro – Texto ingresado: Color blanco/gris muy claro para alta legibilidad sobre fondo oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-213 – EMPLEADO (configuracion) - modo oscuro – Distribución: Diseño de dos columnas para Host/Puerto y Usuario/Correo, con campo de contraseña de ancho completo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-214 – EMPLEADO (configuracion) - modo oscuro – Botón "Guardar SMTP": Fondo rojo intenso (#b91c1c). Texto blanco. Border-radius 8px. Peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-215 – EMPLEADO (configuracion) - modo oscuro – Botón "Guardar IMAP": Fondo dorado/ocre suave (#d4af37 aprox.). Texto negro/oscuro. Border-radius 8px. Peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-216 – EMPLEADO (configuracion) - modo oscuro – Efecto Hover (general): Oscurecimiento del color de fondo original en un 10-15%.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-217 – EMPLEADO (configuracion) - modo oscuro – Ítem "Configuración": Fondo rojo oscuro (#7f1d1d). Texto blanco puro. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-218 – ADMINISTRADOR (resumen) - modo claro – Fondo general del sitio: Color crema muy claro o blanco roto (#f4f4f5 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-219 – ADMINISTRADOR (resumen) - modo claro – Barra lateral (Sidebar): Fondo blanco puro. Borde derecho sutil en gris muy claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-220 – ADMINISTRADOR (resumen) - modo claro – Logo "Reservify": Icono naranja redondeado con letra blanca. Texto "Reservify" en negrita, color gris oscuro (#1f2937).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-221 – ADMINISTRADOR (resumen) - modo claro – Ítem de menú activo (Resumen): Fondo naranja vibrante (#f97316). Texto blanco. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-222 – ADMINISTRADOR (resumen) - modo claro – Ítems de menú inactivos: Texto gris medio (#6b7280). Iconos lineales en gris. Hover: fondo gris muy suave.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-223 – ADMINISTRADOR (resumen) - modo claro – Perfil de usuario (inferior): Contenedor con fondo gris muy tenue. Avatar circular naranja con inicial blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-224 – ADMINISTRADOR (resumen) - modo claro – Encabezado principal: Texto "Buenas tardes" en azul oscuro/gris profundo. Fuente sans-serif, peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-225 – ADMINISTRADOR (resumen) - modo claro – Subtítulo descriptivo: Texto gris medio. Tamaño de fuente reducido (aprox. 14px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-226 – ADMINISTRADOR (resumen) - modo claro – Indicador de sección (Resumen): Texto gris oscuro sobre el título principal, tamaño pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-227 – ADMINISTRADOR (resumen) - modo claro – Contenedor de tarjeta: Fondo blanco puro. Border-radius 12px. Sombra (box-shadow) muy tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-228 – ADMINISTRADOR (resumen) - modo claro – Títulos de tarjetas: Texto gris oscuro, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-229 – ADMINISTRADOR (resumen) - modo claro – Valores numéricos: Texto negro/gris muy oscuro, tamaño grande (aprox. 24px-28px), peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-230 – ADMINISTRADOR (resumen) - modo claro – Iconos de tarjetas: Ubicados en la esquina superior derecha. Contenedores cuadrados con bordes redondeados en colores pastel (azul, verde, morado) con iconos en colores sólidos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-231 – ADMINISTRADOR (resumen) - modo claro – Tarjeta de "Flujo de visitantes": Fondo blanco. Título en gris oscuro. Subtítulo en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-232 – ADMINISTRADOR (resumen) - modo claro – Barras de progreso: Color naranja sólido (#f97316) con fondo de barra en gris muy claro. Bordes redondeados.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-233 – ADMINISTRADOR (resumen) - modo claro – Botón de acción principal (Ver reservas de hoy): Fondo naranja sólido. Texto blanco. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-234 – ADMINISTRADOR (resumen) - modo claro – Botones secundarios (Exportar informe): Fondo gris muy claro. Texto gris oscuro. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-235 – ADMINISTRADOR (mi restaurante) - modo claro – Breadcrumb (Mi Restaurante): Texto en gris oscuro ubicado sobre el título principal, fuente de tamaño reducido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-236 – ADMINISTRADOR (mi restaurante) - modo claro – Título principal: "Buenas tardes" en azul oscuro casi negro, peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-237 – ADMINISTRADOR (mi restaurante) - modo claro – Descripción de sección: Texto gris medio ("Administras un solo restaurante") alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-238 – ADMINISTRADOR (mi restaurante) - modo claro – Ítem de menú activo (Mi Restaurante): Fondo naranja vibrante (#f97316), texto blanco puro, border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-239 – ADMINISTRADOR (mi restaurante) - modo claro – Contenedor de tarjeta: Fondo blanco puro, borde gris muy claro y sutil, border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-240 – ADMINISTRADOR (mi restaurante) - modo claro – Sombra de la tarjeta: Box-shadow suave que le da profundidad sobre el fondo crema.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-241 – ADMINISTRADOR (mi restaurante) - modo claro – Nombre del restaurante: Texto "restaurante de prueba" en negro/gris profundo, peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-242 – ADMINISTRADOR (mi restaurante) - modo claro – Identificación (NIT): Texto gris oscuro precedido por el prefijo "NIT:".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-243 – ADMINISTRADOR (mi restaurante) - modo claro – Botón "Configurar restaurante": Fondo gris muy claro/blanco, borde gris fino, texto gris oscuro, border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-244 – ADMINISTRADOR (mi restaurante) - modo claro – Fondo de Sidebar: Blanco sólido con borde divisorio derecho en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-245 – ADMINISTRADOR (mi restaurante) - modo claro – Sección de usuario: Fondo gris muy tenue con avatar circular naranja e inicial "A" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-246 – ADMINISTRADOR (mi restaurante) - modo claro – Botón "Cerrar sesión": Texto gris medio al final de la barra lateral con icono lineal de salida.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-247 – ADMINISTRADOR (factutas) - modo claro – Fondo de Sidebar: Blanco sólido con un borde derecho gris muy tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-248 – ADMINISTRADOR (factutas) - modo claro – Ítem activo (Facturas): Fondo naranja sólido (#f97316). Texto blanco. Icono de documento lineal. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-249 – ADMINISTRADOR (factutas) - modo claro – Ítems inactivos: Texto gris medio. Iconos lineales sencillos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-250 – ADMINISTRADOR (factutas) - modo claro – Sección de usuario (inferior): Bloque con fondo gris muy suave (#f3f4f6 aprox.). Avatar naranja con inicial blanca. Nombre en gris oscuro y correo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-251 – ADMINISTRADOR (factutas) - modo claro – Indicador de sección: Texto "Facturación" en gris oscuro sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-252 – ADMINISTRADOR (factutas) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo (#1e293b). Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-253 – ADMINISTRADOR (factutas) - modo claro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-254 – ADMINISTRADOR (factutas) - modo claro – Contador de elementos: Texto "0 facturas" en gris, tamaño de fuente pequeño, ubicado sobre la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-255 – ADMINISTRADOR (factutas) - modo claro – Contenedor principal (Card): Fondo blanco. Borde gris claro sutil. Border-radius 12px. Sombra suave para dar relieve.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-256 – ADMINISTRADOR (factutas) - modo claro – Encabezado interno: Título "Facturas recientes" en gris. Subtítulo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-257 – ADMINISTRADOR (factutas) - modo claro – Fila de etiquetas (Header): Texto en gris medio, peso semi-bold. Columnas: Número, Restaurante, Monto, Fecha, Vencimiento, Estado, Acciones.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-258 – ADMINISTRADOR (factutas) - modo claro – Cuerpo de tabla: Espacio vacío con fondo blanco. Borde inferior tenue separando la cabecera del contenido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-259 – ADMINISTRADOR (factutas) - modo claro – Fondo de la aplicación: Color crema/beige muy claro (#f5f5f4 aprox.) que contrasta con el blanco de la sidebar y las tarjetas.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-260 – ADMINISTRADOR (flujo diario) - modo claro – Ítem activo "Flujo diario": Fondo naranja sólido (#f97316). Texto blanco puro. Icono de gráfico lineal en blanco. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-261 – ADMINISTRADOR (flujo diario) - modo claro – Ítems inactivos: Texto gris medio. Sin fondo. Iconos lineales sencillos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-262 – ADMINISTRADOR (flujo diario) - modo claro – Sección de usuario: Fondo gris muy tenue. Avatar circular naranja con inicial blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-263 – ADMINISTRADOR (flujo diario) - modo claro – Indicador de sección (Breadcrumb): Texto "Flujo diario" en gris oscuro, tamaño pequeño, sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-264 – ADMINISTRADOR (flujo diario) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo (#1e293b). Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-265 – ADMINISTRADOR (flujo diario) - modo claro – Título de vista: "Flujo diario" en negro/gris oscuro. Peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-266 – ADMINISTRADOR (flujo diario) - modo claro – Subtítulo descriptivo: Texto gris medio ("Análisis de clientes por hora").**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-267 – ADMINISTRADOR (flujo diario) - modo claro – Distribución: Fila de tres tarjetas iguales (Total clientes, Con reserva, Sin reserva).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-268 – ADMINISTRADOR (flujo diario) - modo claro – Contenedor: Fondo blanco puro. Border-radius 12px. Sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-269 – ADMINISTRADOR (flujo diario) - modo claro – Etiquetas superiores: Texto gris oscuro, tamaño pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-270 – ADMINISTRADOR (flujo diario) - modo claro – Cifras principales: Número "0" en negro/gris oscuro, tamaño grande (aprox. 28px), peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-271 – ADMINISTRADOR (flujo diario) - modo claro – Etiquetas inferiores (Subtexto): Texto gris medio ("Hasta ahora", "0% del total").**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-272 – ADMINISTRADOR (flujo diario) - modo claro – Tarjeta principal: Fondo blanco puro. Border-radius 12px. Borde gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-273 – ADMINISTRADOR (flujo diario) - modo claro – Encabezado de tarjeta: Título "Flujo por horas" en negro. Subtítulo "Clientes y reservas por franja" en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-274 – ADMINISTRADOR (flujo diario) - modo claro – Estado vacío: Texto "No hay datos de flujo diario." en gris medio, centrado horizontal y verticalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-275 – ADMINISTRADOR (flujo diario) - modo claro – Fondo general: Color crema/beige muy claro (#f5f5f4 aprox.) para resaltar los contenedores blancos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-276 – ADMINISTRADOR (clientes) - modo claro – Ítem activo "Clientes": Fondo naranja sólido (#f97316). Texto blanco puro. Icono de personas lineal. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-277 – ADMINISTRADOR (clientes) - modo claro – Ítems inactivos: Texto gris medio. Sin fondo. Iconos lineales sencillos en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-278 – ADMINISTRADOR (clientes) - modo claro – Sección de perfil (inferior): Contenedor con fondo gris muy tenue (#f3f4f6). Avatar circular naranja con letra "A" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-279 – ADMINISTRADOR (clientes) - modo claro – Botón "Cerrar sesión": Texto gris medio con icono de salida, ubicado al pie de la sidebar.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-280 – ADMINISTRADOR (clientes) - modo claro – Breadcrumb: Texto "Clientes" en gris oscuro, tamaño pequeño, posicionado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-281 – ADMINISTRADOR (clientes) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo (#1e293b). Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-282 – ADMINISTRADOR (clientes) - modo claro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio. Alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-283 – ADMINISTRADOR (clientes) - modo claro – Contador de registros: Texto "1 cliente" en gris, fuente pequeña, ubicado sobre el margen superior de la tabla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-284 – ADMINISTRADOR (clientes) - modo claro – Contenedor principal (Card): Fondo blanco puro. Borde gris muy claro. Border-radius 12px. Sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-285 – ADMINISTRADOR (clientes) - modo claro – Encabezado de tabla: Fondo gris muy claro. Texto gris oscuro, peso semi-bold. Columnas: Cliente, Email, Reservas, Última visita.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-286 – ADMINISTRADOR (clientes) - modo claro – Fila de datos: Fondo blanco. Texto en negro/gris oscuro. Borde inferior sutil para separación de registros.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-287 – ADMINISTRADOR (clientes) - modo claro – Alineación de datos: Texto alineado a la izquierda para nombres y correos; centrado o justificado para métricas numéricas y fechas.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-288 – ADMINISTRADOR (clientes) - modo claro – Fondo de la aplicación: Color crema/beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-289 – ADMINISTRADOR (clientes) - modo claro – Consistencia: El diseño mantiene la misma paleta cromática y radios de curvatura que el resto del panel administrativo en modo claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-290 – ADMINISTRADOR (correos) - modo claro – Ítem activo "Correos": Fondo naranja sólido (#f97316). Texto blanco puro. Icono de sobre lineal. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-291 – ADMINISTRADOR (correos) - modo claro – Ítems inactivos: Texto gris medio. Sin fondo. Iconos lineales sencillos en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-292 – ADMINISTRADOR (correos) - modo claro – Sección de perfil (inferior): Contenedor con fondo gris muy tenue (#f3f4f6). Avatar circular naranja con letra "A" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-293 – ADMINISTRADOR (correos) - modo claro – Breadcrumb: Texto "Correos" en gris oscuro, tamaño pequeño, posicionado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-294 – ADMINISTRADOR (correos) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo (#1e293b). Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-295 – ADMINISTRADOR (correos) - modo claro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-296 – ADMINISTRADOR (correos) - modo claro – Contenedor principal (Card): Fondo blanco puro. Borde gris muy claro. Border-radius 12px. Sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-297 – ADMINISTRADOR (correos) - modo claro – Encabezado de tarjeta: Icono de sobre lineal seguido de "Correos no leídos" en azul oscuro. Peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-298 – ADMINISTRADOR (correos) - modo claro – Texto informativo: Color gris medio, tamaño de fuente reducido, ubicado bajo el título de la tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-299 – ADMINISTRADOR (correos) - modo claro – Botón "Actualizar": Fondo gris muy claro. Texto gris oscuro. Icono de rotación a la izquierda. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-300 – ADMINISTRADOR (correos) - modo claro – Contenedor interno: Rectángulo con borde punteado (dashed) en gris muy tenue. Centrado dentro de la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-301 – ADMINISTRADOR (correos) - modo claro – Icono central: Icono de sobre lineal en gris medio, tamaño grande, centrado vertical y horizontalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-302 – ADMINISTRADOR (correos) - modo claro – Mensaje principal: "No hay correos no leídos" en negro/gris oscuro. Peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-303 – ADMINISTRADOR (correos) - modo claro – Subtexto informativo: Frase descriptiva en gris medio ubicada debajo del mensaje principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-304 – ADMINISTRADOR (correos) - modo claro – Fondo de la aplicación: Color crema/beige muy claro (#f5f5f4 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-305 – ADMINISTRADOR (configuracion) - modo claro – Ítem activo "Configuración": Fondo naranja sólido (#ff7a3e aprox.), texto blanco puro, icono lineal blanco, border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-306 – ADMINISTRADOR (configuracion) - modo claro – Barra lateral: Fondo blanco sólido (#ffffff), borde derecho gris muy claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-307 – ADMINISTRADOR (configuracion) - modo claro – Sección de perfil: Bloque inferior con fondo gris muy tenue, avatar naranja circular con inicial blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-308 – ADMINISTRADOR (configuracion) - modo claro – Fondo de aplicación: Color beige/crema muy claro (#f5f5f4 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-309 – ADMINISTRADOR (configuracion) - modo claro – Breadcrumb: Texto "Configuración" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-310 – ADMINISTRADOR (configuracion) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo (#1e293b), peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-311 – ADMINISTRADOR (configuracion) - modo claro – Contenedor de tarjeta: Fondo blanco puro, borde gris claro, border-radius 12px, sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-312 – ADMINISTRADOR (configuracion) - modo claro – Encabezado de tarjeta: Título en azul oscuro con icono lineal (avión de papel para SMTP, sobre para IMAP) y descripción en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-313 – ADMINISTRADOR (configuracion) - modo claro – Etiquetas de campo (Labels): Texto gris medio, tamaño de fuente pequeño (12px aprox.), peso regular.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-314 – ADMINISTRADOR (configuracion) - modo claro – Cajas de texto (Inputs): Fondo blanco, borde gris claro, border-radius 8px, altura aprox. 40px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-315 – ADMINISTRADOR (configuracion) - modo claro – Botón "Guardar SMTP": Fondo naranja sólido (#ff7a3e aprox.), texto blanco, border-radius 8px, peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-316 – ADMINISTRADOR (configuracion) - modo claro – Botón "Guardar IMAP": Fondo verde grisáceo (#7a9e88 aprox.), texto blanco, border-radius 8px, peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-317 – ADMINISTRADOR (configuracion) - modo claro – Espaciado: Margen consistente entre tarjetas y relleno interno generoso (padding) en todos los formularios.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-318 – ADMINISTRADOR (configuracion) - modo claro – Tipografía: Jerarquía clara mediante el uso de azul oscuro para títulos y gris para elementos secundarios.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-319 – ADMINISTRADOR (resumen) - modo oscuro – Fondo de Sidebar: Negro sólido con un borde derecho gris oscuro muy sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-320 – ADMINISTRADOR (resumen) - modo oscuro – Ítem activo "Resumen": Fondo rojo oscuro (#991b1b). Texto blanco puro (#ffffff). Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-321 – ADMINISTRADOR (resumen) - modo oscuro – Ítems inactivos: Texto gris medio. Iconos lineales sencillos en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-322 – ADMINISTRADOR (resumen) - modo oscuro – Sección de perfil (inferior): Contenedor con fondo gris muy oscuro. Avatar circular naranja con letra "A" blanca. Nombre en blanco y correo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-323 – ADMINISTRADOR (resumen) - modo oscuro – Fondo general: Color negro/gris muy oscuro (#0a0a0a aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-324 – ADMINISTRADOR (resumen) - modo oscuro – Indicador de sección: Texto "Resumen" en gris claro sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-325 – ADMINISTRADOR (resumen) - modo oscuro – Título principal: "Buenas tardes" en blanco. Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-326 – ADMINISTRADOR (resumen) - modo oscuro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio. Alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-327 – ADMINISTRADOR (resumen) - modo oscuro – Contenedor de tarjeta: Fondo gris oscuro translúcido. Borde gris tenue. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-328 – ADMINISTRADOR (resumen) - modo oscuro – Valores numéricos: Texto blanco. Tamaño de fuente grande (aprox. 28px). Peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-329 – ADMINISTRADOR (resumen) - modo oscuro – Etiquetas de métrica: Texto gris claro ubicado sobre el valor numérico.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-330 – ADMINISTRADOR (resumen) - modo oscuro – Iconos decorativos: Esquina superior derecha. Contenedores cuadrados redondeados con fondos de baja opacidad (azul, verde, morado).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-331 – ADMINISTRADOR (resumen) - modo oscuro – Contenedor "Flujo de visitantes": Fondo gris oscuro con borde sutil. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-332 – ADMINISTRADOR (resumen) - modo oscuro – Barras de datos: Color rojo sólido. Altura delgada. Border-radius 4px. Texto de datos en gris claro a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-333 – ADMINISTRADOR (resumen) - modo oscuro – Contenedor "Acciones rápidas": Misma estética que la tarjeta de flujo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-334 – ADMINISTRADOR (resumen) - modo oscuro – Botón principal "Ver reservas de hoy": Fondo rojo intenso. Texto blanco. Border-radius 8px. Peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-335 – ADMINISTRADOR (resumen) - modo oscuro – Botones secundarios: Fondo gris muy oscuro (casi negro). Texto blanco. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-336 – ADMINISTRADOR (mi restaurante) - modo oscuro – Ítem de menú activo "Mi Restaurante": Fondo rojo intenso (#b91c1c). Texto blanco. Border-radius 8px. Icono lineal blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-337 – ADMINISTRADOR (mi restaurante) - modo oscuro – Indicador de perfil (inferior): Contenedor con fondo gris muy oscuro. Avatar circular naranja con inicial "A" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-338 – ADMINISTRADOR (mi restaurante) - modo oscuro – Acción "Cerrar sesión": Texto gris claro al pie de la sidebar con icono de salida.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-339 – ADMINISTRADOR (mi restaurante) - modo oscuro – Breadcrumb: Texto "Mi Restaurante" en gris claro, tamaño reducido, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-340 – ADMINISTRADOR (mi restaurante) - modo oscuro – Título principal: "Buenas tardes" en blanco. Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-341 – ADMINISTRADOR (mi restaurante) - modo oscuro – Textos descriptivos: Color gris medio. Alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-342 – ADMINISTRADOR (mi restaurante) - modo oscuro – Contenedor principal: Tarjeta con fondo negro/gris muy oscuro. Borde gris fino y sutil. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-343 – ADMINISTRADOR (mi restaurante) - modo oscuro – Nombre del restaurante: Texto "restaurante de prueba" en blanco. Peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-344 – ADMINISTRADOR (mi restaurante) - modo oscuro – Dato de identificación (NIT): Texto en gris medio debajo del nombre.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-345 – ADMINISTRADOR (mi restaurante) - modo oscuro – Botón "Configurar restaurante": Fondo gris muy oscuro/negro. Borde delgado gris claro. Texto blanco. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-346 – ADMINISTRADOR (mi restaurante) - modo oscuro – Fondo de la aplicación: Color negro/gris carbón muy oscuro (#0a0a0a aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-347 – ADMINISTRADOR (mi restaurante) - modo oscuro – Consistencia: Mantiene el uso de rojo intenso para estados activos y gris para elementos secundarios sobre fondo oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-348 – ADMINISTRADOR (facturas) - modo oscuro – Ítem de menú activo (Facturas): Fondo rojo oscuro (#991b1b). Texto blanco puro. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-349 – ADMINISTRADOR (facturas) - modo oscuro – Iconos de menú: Estilo lineal en color gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-350 – ADMINISTRADOR (facturas) - modo oscuro – Sección de perfil: Contenedor inferior con fondo gris muy oscuro. Avatar naranja con inicial "A" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-351 – ADMINISTRADOR (facturas) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Facturación" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-352 – ADMINISTRADOR (facturas) - modo oscuro – Título principal: "Buenas tardes" en blanco. Peso bold. Fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-353 – ADMINISTRADOR (facturas) - modo oscuro – Contador de elementos: Texto "0 facturas" en gris medio posicionado sobre el margen de la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-354 – ADMINISTRADOR (facturas) - modo oscuro – Contenedor de tarjeta: Fondo negro/gris carbón. Borde delgado gris oscuro. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-355 – ADMINISTRADOR (facturas) - modo oscuro – Encabezado de tarjeta: Título "Facturas recientes" en blanco (semi-bold) y descripción en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-356 – ADMINISTRADOR (facturas) - modo oscuro – Fila de etiquetas (Header): Texto en gris claro/medio. Peso semi-bold. Columnas: Número, Restaurante, Monto, Fecha, Vencimiento, Estado, Acciones.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-357 – ADMINISTRADOR (facturas) - modo oscuro – Cuerpo de tabla: Área de contenido vacía con fondo negro uniforme.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-358 – ADMINISTRADOR (facturas) - modo oscuro – Fondo de aplicación: Color negro sólido (#0a0a0a aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-359 – ADMINISTRADOR (facturas) - modo oscuro – Jerarquía visual: Uso de blanco para títulos principales, gris para descripciones y rojo para estados de navegación activa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-360 – ADMINISTRADOR (flujo diario) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Flujo diario" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-361 – ADMINISTRADOR (flujo diario) - modo oscuro – Título principal: "Buenas tardes" en blanco puro, peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-362 – ADMINISTRADOR (flujo diario) - modo oscuro – Subtítulo de vista: "Flujo diario / Análisis de clientes por hora" en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-363 – ADMINISTRADOR (flujo diario) - modo oscuro – Contenedor de tarjeta: Fondo gris carbón muy oscuro. Borde delgado gris. Border-radius 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-364 – ADMINISTRADOR (flujo diario) - modo oscuro – Títulos de métricas: Texto "Total clientes", "Con reserva" y "Sin reserva" en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-365 – ADMINISTRADOR (flujo diario) - modo oscuro – Cifras principales: Número "0" en blanco, tamaño de fuente grande (aprox. 28px), peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-366 – ADMINISTRADOR (flujo diario) - modo oscuro – Etiquetas inferiores: Texto "Hasta ahora" y "0% del total" en gris medio, debajo de las cifras.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-367 – ADMINISTRADOR (flujo diario) - modo oscuro – Subtítulo de vista: "Flujo diario / Análisis de clientes por hora" en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-368 – ADMINISTRADOR (flujo diario) - modo oscuro – Tarjeta de detalle de flujo (gráfico): Fondo gris muy oscuro. Border-radius 12px. Borde perimetral sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-369 – ADMINISTRADOR (flujo diario) - modo oscuro – Títulos de contenedor de detalle: "Flujo por horas" en blanco y subtítulo descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-370 – ADMINISTRADOR (flujo diario) - modo oscuro – Aviso de datos vacíos: Texto "No hay datos de flujo diario." en gris medio, centrado horizontal y verticalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-371 – ADMINISTRADOR (flujo diario) - modo oscuro – Ítem activo "Flujo diario" (Sidebar): Fondo rojo oscuro (#991b1b). Texto blanco. Borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-372 – ADMINISTRADOR (flujo diario) - modo oscuro – Bloque de perfil de usuario: Fondo gris muy oscuro. Avatar naranja circular con inicial "A" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-373 – ADMINISTRADOR (flujo diario) - modo oscuro – Fondo general de la interfaz: Color negro sólido (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-374 – ADMINISTRADOR (clientes) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Clientes" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-375 – ADMINISTRADOR (clientes) - modo oscuro – Título principal: "Buenas tardes" en blanco puro, peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-376 – ADMINISTRADOR (clientes) - modo oscuro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-377 – ADMINISTRADOR (clientes) - modo oscuro – Contador de registros: Texto "1 cliente" en gris, fuente pequeña, ubicado sobre el margen superior de la tabla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-378 – ADMINISTRADOR (clientes) - modo oscuro – Contenedor de tabla principal: Fondo gris carbón muy oscuro, borde delgado gris y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-379 – ADMINISTRADOR (clientes) - modo oscuro – Encabezado de tabla: Fondo gris muy oscuro con texto gris claro en peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-380 – ADMINISTRADOR (clientes) - modo oscuro – Definición de columnas: Cliente, Email, Reservas y Última visita con alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-381 – ADMINISTRADOR (clientes) - modo oscuro – Fila de datos: Fondo negro/gris oscuro sólido con texto en blanco puro para los registros.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-382 – ADMINISTRADOR (clientes) - modo oscuro – Ítem activo "Clientes" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco y borde izquierdo rojo brillante. Border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-383 – ADMINISTRADOR (clientes) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro con avatar naranja circular e inicial "A" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-384 – ADMINISTRADOR (clientes) - modo oscuro – Fondo general de la interfaz: Color negro sólido (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-385 – ADMINISTRADOR (correos) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Correos" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-386 – ADMINISTRADOR (correos) - modo oscuro – Título principal: "Buenas tardes" en blanco puro, peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-387 – ADMINISTRADOR (correos) - modo oscuro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-388 – ADMINISTRADOR (correos) - modo oscuro – Tarjeta principal de correos: Fondo gris carbón muy oscuro, borde delgado gris y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-389 – ADMINISTRADOR (correos) - modo oscuro – Encabezado de tarjeta: Icono de sobre seguido del texto "Correos no leídos" en blanco bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-390 – ADMINISTRADOR (correos) - modo oscuro – Botón "Actualizar": Fondo transparente con borde gris fino, texto blanco e icono de rotación a la izquierda; border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-391 – ADMINISTRADOR (correos) - modo oscuro – Contenedor de estado vacío: Borde punteado (dashed) en gris medio, centrado dentro de la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-392 – ADMINISTRADOR (correos) - modo oscuro – Icono de estado vacío: Sobre lineal en gris medio, tamaño grande, centrado vertical y horizontalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-393 – ADMINISTRADOR (correos) - modo oscuro – Mensaje de estado vacío: "No hay correos no leídos" en blanco bold, seguido de subtexto descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-394 – ADMINISTRADOR (correos) - modo oscuro – Ítem activo "Correos" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco y borde izquierdo rojo brillante; border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-395 – ADMINISTRADOR (correos) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro con avatar naranja circular e inicial "A" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-396 – ADMINISTRADOR (correos) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-397 – ADMINISTRADOR (configuracion) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Configuración" en gris claro, tamaño pequeño, posicionado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-398 – ADMINISTRADOR (configuracion) - modo oscuro – Título principal: "Buenas tardes" en blanco puro, peso bold, fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-399 – ADMINISTRADOR (configuracion) - modo oscuro – Texto descriptivo: "Gestiona tu restaurante..." en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-400 – ADMINISTRADOR (configuracion) - modo oscuro – Tarjetas de configuración (SMTP e IMAP): Fondo gris carbón muy oscuro, borde delgado gris y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-401 – ADMINISTRADOR (configuracion) - modo oscuro – Títulos de sección: Texto en blanco con peso bold, acompañados de iconos lineales (avión de papel para SMTP y sobre para IMAP).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-402 – ADMINISTRADOR (configuracion) - modo oscuro – Subtítulos de sección: Texto gris medio, tamaño de fuente reducido, ubicado bajo el título de cada tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-403 – ADMINISTRADOR (configuracion) - modo oscuro – Etiquetas de campos (Labels): Texto gris claro, tamaño pequeño, peso regular.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-404 – ADMINISTRADOR (configuracion) - modo oscuro – Cajas de entrada (Inputs): Fondo negro sólido, borde gris oscuro y border-radius de 8px; altura aproximada de 40px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-405 – ADMINISTRADOR (configuracion) - modo oscuro – Botón "Guardar SMTP": Fondo rojo intenso (#b91c1c), texto blanco y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-406 – ADMINISTRADOR (configuracion) - modo oscuro – Botón "Guardar IMAP": Fondo dorado (#d4af37), texto negro y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-407 – ADMINISTRADOR (configuracion) - modo oscuro – Ítem activo "Configuración" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco y borde izquierdo rojo brillante; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-408 – ADMINISTRADOR (configuracion) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro con avatar naranja circular e inicial "A" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-409 – ADMINISTRADOR (configuracion) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-410 – DUEÑO (resumen) - modo claro – Fondo general de la interfaz: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-411 – DUEÑO (resumen) - modo claro – Barra lateral (Sidebar): Fondo blanco puro con un borde derecho gris muy tenue para separación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-412 – DUEÑO (resumen) - modo claro – Ítem activo "Resumen" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-413 – DUEÑO (resumen) - modo claro – Ítems inactivos (Sidebar): Texto gris medio con iconos lineales sencillos en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-414 – DUEÑO (resumen) - modo claro – Sección de perfil de usuario (inferior): Bloque con fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-415 – DUEÑO (resumen) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-416 – DUEÑO (resumen) - modo claro – Subtítulo descriptivo: Texto gris medio ubicado bajo el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-417 – DUEÑO (resumen) - modo claro – Tarjetas de métricas superiores (Restaurantes, Reservas, Ingresos): Fondo blanco puro, border-radius de 12px y sombra (box-shadow) suave.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-418 – DUEÑO (resumen) - modo claro – Valores numéricos de métricas: Texto en negro/gris oscuro, tamaño de fuente grande y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-419 – DUEÑO (resumen) - modo claro – Iconos de métricas: Ubicados en la esquina superior derecha en contenedores cuadrados redondeados de colores pastel (azul, verde, morado).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-420 – DUEÑO (resumen) - modo claro – Tarjeta "Flujo de visitantes": Fondo blanco puro con border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-421 – DUEÑO (resumen) - modo claro – Barras de flujo: Color naranja sólido (#f97316) con fondo de barra en gris muy claro y bordes redondeados.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-422 – DUEÑO (resumen) - modo claro – Tarjeta "Acciones rápidas": Fondo blanco puro con border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-423 – DUEÑO (resumen) - modo claro – Botón principal "Ver reservas de hoy": Fondo naranja sólido, texto blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-424 – DUEÑO (resumen) - modo claro – Botones secundarios ("Exportar informe", "Añadir restaurante"): Fondo gris muy claro (#f3f4f6), texto gris oscuro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-425 – DUEÑO (restaurantes) - modo claro – Indicador de sección (Breadcrumb): Texto "Mis Restaurantes" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-426 – DUEÑO (restaurantes) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-427 – DUEÑO (restaurantes) - modo claro – Subtítulo descriptivo: Texto gris medio debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-428 – DUEÑO (restaurantes) - modo claro – Contador de elementos: Texto "4 restaurantes administrados" en gris, fuente pequeña, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-429 – DUEÑO (restaurantes) - modo claro – Botón "Agregar restaurante": Fondo naranja sólido, texto blanco, border-radius de 8px, ubicado en la parte superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-430 – DUEÑO (restaurantes) - modo claro – Contenedor de tarjeta de restaurante: Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-431 – DUEÑO (restaurantes) - modo claro – Imagen de cabecera de tarjeta: Imagen rectangular con bordes superiores redondeados que coinciden con el contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-432 – DUEÑO (restaurantes) - modo claro – Etiqueta de estado (Activo): Fondo naranja sólido, texto blanco, forma de píldora (pill style), superpuesta en la esquina superior derecha de la imagen.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-433 – DUEÑO (restaurantes) - modo claro – Título de restaurante: Texto en negro/gris oscuro, peso semi-bold, ubicado debajo de la imagen.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-434 – DUEÑO (restaurantes) - modo claro – Indicador de calificación: Icono de estrella y número "0" en color naranja/dorado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-435 – DUEÑO (restaurantes) - modo claro – Iconos de detalle (Ubicación y Mesas): Iconos lineales en gris con texto descriptivo en gris medio al lado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-436 – DUEÑO (restaurantes) - modo claro – Barra de progreso/estado: Línea horizontal pequeña en color verde ubicada sobre los botones de acción.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-437 – DUEÑO (restaurantes) - modo claro – Botón "Ver reservas": Fondo naranja sólido, texto blanco, border-radius de 8px, ancho parcial de la tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-438 – DUEÑO (restaurantes) - modo claro – Botón de configuración (Icono): Fondo gris muy claro, icono de engranaje oscuro, border-radius de 8px, forma cuadrada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-439 – DUEÑO (restaurantes) - modo claro – Ítem activo "Restaurantes" (Sidebar): Fondo naranja sólido, texto blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-440 – DUEÑO (restaurantes) - modo claro – Fondo general de la aplicación: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-441 – DUEÑO (facturas) - modo claro – Indicador de sección (Breadcrumb): Texto "Facturación" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-442 – DUEÑO (facturas) - modo claro – Título principal: "Buenas tardes" en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-443 – DUEÑO (facturas) - modo claro – Subtítulo descriptivo: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-444 – DUEÑO (facturas) - modo claro – Contador de elementos: Texto "0 facturas" en gris, fuente pequeña, ubicado sobre el margen superior de la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-445 – DUEÑO (facturas) - modo claro – Contenedor de tarjeta principal (Facturas): Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-446 – DUEÑO (facturas) - modo claro – Encabezado de la tarjeta: Título "Facturas recientes" en azul oscuro y subtítulo descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-447 – DUEÑO (facturas) - modo claro – Fila de encabezado de tabla: Fondo gris muy claro con etiquetas en gris medio y peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-448 – DUEÑO (facturas) - modo claro – Columnas de la tabla: "Número", "Restaurante", "Monto", "Fecha", "Vencimiento", "Estado" y "Acciones".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-449 – DUEÑO (facturas) - modo claro – Cuerpo de la tabla: Espacio vacío con fondo blanco uniforme debajo del encabezado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-450 – DUEÑO (facturas) - modo claro – Ítem activo "Facturas" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-451 – DUEÑO (facturas) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-452 – DUEÑO (facturas) - modo claro – Fondo general de la aplicación: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-453 – DUEÑO (flujo diario) - modo claro – Fondo general de la interfaz: Color crema o beige muy claro (#f5f5f4 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-454 – DUEÑO (flujo diario) - modo claro – Barra lateral (Sidebar): Fondo blanco puro con un borde derecho gris muy tenue para separación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-455 – DUEÑO (flujo diario) - modo claro – Ítem activo "Flujo diario" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-456 – DUEÑO (flujo diario) - modo claro – Ítems inactivos (Sidebar): Texto gris medio con iconos lineales sencillos en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-457 – DUEÑO (flujo diario) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-458 – DUEÑO (flujo diario) - modo claro – Indicador de sección (Breadcrumb): Texto "Flujo diario" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-459 – DUEÑO (flujo diario) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-460 – DUEÑO (flujo diario) - modo claro – Subtítulo de vista: "Flujo diario / Análisis de clientes por hora" en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-461 – DUEÑO (flujo diario) - modo claro – Tarjetas de métricas (Total clientes, Con reserva, Sin reserva): Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-462 – DUEÑO (flujo diario) - modo claro – Títulos de métricas en tarjetas: Texto en gris oscuro, peso regular y tamaño de fuente pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-463 – DUEÑO (flujo diario) - modo claro – Valores numéricos de métricas: Número "0" en negro/azul oscuro, tamaño de fuente grande y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-464 – DUEÑO (flujo diario) - modo claro – Etiquetas de subtexto en métricas: Texto gris medio ("Hasta ahora", "0% del total") debajo de los valores numéricos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-465 – DUEÑO (flujo diario) - modo claro – Tarjeta de detalle "Flujo por horas": Fondo blanco puro, border-radius de 12px y borde gris claro perimetral.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-466 – DUEÑO (flujo diario) - modo claro – Encabezado de tarjeta de detalle: Título "Flujo por horas" en negro y subtítulo descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-467 – DUEÑO (flujo diario) - modo claro – Aviso de datos vacíos en gráfico: Texto "No hay datos de flujo diario." en gris medio, centrado horizontal y verticalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-468 – DUEÑO (empleados) - modo claro – Indicador de sección (Breadcrumb): Texto "Empleados" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-469 – DUEÑO (empleados) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-470 – DUEÑO (empleados) - modo claro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-471 – DUEÑO (empleados) - modo claro – Título de sección "Empleados": Texto en negro/gris oscuro con subtexto "Personas asignadas a tus restaurantes..." en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-472 – DUEÑO (empleados) - modo claro – Tarjetas de perfil de empleado: Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-473 – DUEÑO (empleados) - modo claro – Información en tarjeta de empleado: Nombre en negro (bold), correo electrónico y restaurante asignado en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-474 – DUEÑO (empleados) - modo claro – Etiquetas de rol (Badges): Fondo de color tenue (naranja/rojo claro) con texto descriptivo ("administrador" o "empleado"), estilo píldora.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-475 – DUEÑO (empleados) - modo claro – Título de sección "Reservas aceptadas": Texto en negro con subtexto "Todas las reservas confirmadas..." en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-476 – DUEÑO (empleados) - modo claro – Contenedor de tabla de reservas: Fondo blanco puro, border-radius de 12px y sombra suave perimetral.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-477 – DUEÑO (empleados) - modo claro – Encabezado de tabla de reservas: Fondo gris muy claro con etiquetas de columna en gris medio y peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-478 – DUEÑO (empleados) - modo claro – Columnas de la tabla: "Fecha", "Hora", "Restaurante", "Cliente", "Comensales" y "Teléfono".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-479 – DUEÑO (empleados) - modo claro – Ítem activo "Empleados" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-480 – DUEÑO (empleados) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-481 – DUEÑO (empleados) - modo claro – Fondo general de la aplicación: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-482 – DUEÑO (clientes) - modo claro – Indicador de sección (Breadcrumb): Texto "Clientes" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-483 – DUEÑO (clientes) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-484 – DUEÑO (clientes) - modo claro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-485 – DUEÑO (clientes) - modo claro – Contador de registros: Texto "1 cliente" en gris, fuente pequeña, ubicado sobre el margen superior de la tabla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-486 – DUEÑO (clientes) - modo claro – Contenedor de tabla de clientes: Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-487 – DUEÑO (clientes) - modo claro – Encabezado de tabla: Fondo gris muy claro con etiquetas de columna en gris oscuro y peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-488 – DUEÑO (clientes) - modo claro – Definición de columnas: "Cliente", "Email", "Reservas" y "Última visita" con alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-489 – DUEÑO (clientes) - modo claro – Fila de datos: Fondo blanco sólido con texto en negro/gris oscuro para los registros individuales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-490 – DUEÑO (clientes) - modo claro – Ítem activo "Clientes" (Sidebar): Fondo naranja sólido, texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-491 – DUEÑO (clientes) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-492 – DUEÑO (clientes) - modo claro – Fondo general de la aplicación: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-493 – DUEÑO (correos) - modo claro – Indicador de sección (Breadcrumb): Texto "Correos" en gris oscuro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-494 – DUEÑO (correos) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-495 – DUEÑO (correos) - modo claro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-496 – DUEÑO (correos) - modo claro – Contenedor principal de correos (Card): Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-497 – DUEÑO (correos) - modo claro – Encabezado de la tarjeta: Icono de sobre seguido del título "Correos no leídos" en azul oscuro y descripción en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-498 – DUEÑO (correos) - modo claro – Botón "Actualizar": Fondo gris muy claro (#f3f4f6), texto gris oscuro, icono de rotación y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-499 – DUEÑO (correos) - modo claro – Fila de correo individual: Separación mediante borde inferior gris muy tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-500 – DUEÑO (correos) - modo claro – Título del correo (Asunto): Texto en negro/gris oscuro con peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-501 – DUEÑO (correos) - modo claro – Remitente y vista previa: Texto en gris medio ubicado debajo del asunto del correo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-502 – DUEÑO (correos) - modo claro – Marca de tiempo: Texto gris oscuro con la fecha y hora, ubicado en el extremo derecho de cada fila de correo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-503 – DUEÑO (correos) - modo claro – Ítem activo "Correos" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-504 – DUEÑO (correos) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-505 – DUEÑO (correos) - modo claro – Fondo general de la aplicación: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-506 – DUEÑO (configuracion) - modo claro – Indicador de sección (Breadcrumb): Texto "Configuración" en gris oscuro, tamaño pequeño, posicionado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-507 – DUEÑO (configuracion) - modo claro – Título principal "Buenas tardes": Texto en azul oscuro profundo, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-508 – DUEÑO (configuracion) - modo claro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-509 – DUEÑO (configuracion) - modo claro – Tarjetas de configuración (SMTP e IMAP): Fondo blanco puro, border-radius de 12px y sombra suave (box-shadow).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-510 – DUEÑO (configuracion) - modo claro – Título de sección SMTP: Texto en azul oscuro con icono lineal de avión de papel y descripción técnica en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-511 – DUEÑO (configuracion) - modo claro – Título de sección IMAP: Texto en azul oscuro con icono lineal de sobre y descripción técnica en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-512 – DUEÑO (configuracion) - modo claro – Etiquetas de campos (Labels): Texto gris medio, tamaño de fuente pequeño y peso regular.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-513 – DUEÑO (configuracion) - modo claro – Cajas de entrada (Inputs): Fondo blanco sólido, borde gris claro y border-radius de 8px; altura aproximada de 40px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-514 – DUEÑO (configuracion) - modo claro – Botón "Guardar SMTP": Fondo naranja sólido, texto blanco y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-515 – DUEÑO (configuracion) - modo claro – Botón "Guardar IMAP": Fondo verde grisáceo/tenue, texto blanco y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-516 – DUEÑO (configuracion) - modo claro – Ítem activo "Configuración" (Sidebar): Fondo naranja sólido (#f97316), texto blanco puro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-517 – DUEÑO (configuracion) - modo claro – Bloque de perfil de usuario (Sidebar): Fondo gris muy suave (#f3f4f6), avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-518 – DUEÑO (configuracion) - modo claro – Fondo general de la interfaz: Color crema o beige muy claro (#f5f5f4).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-519 – DUEÑO (resumen) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-520 – DUEÑO (resumen) - modo oscuro – Barra lateral (Sidebar): Fondo negro con un borde derecho gris oscuro muy sutil para separación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-521 – DUEÑO (resumen) - modo oscuro – Ítem activo "Resumen" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-522 – DUEÑO (resumen) - modo oscuro – Ítems inactivos (Sidebar): Texto gris medio con iconos lineales sencillos en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-523 – DUEÑO (resumen) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-524 – DUEÑO (resumen) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Resumen" en gris claro, tamaño reducido, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-525 – DUEÑO (resumen) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-526 – DUEÑO (resumen) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-527 – DUEÑO (resumen) - modo oscuro – Tarjetas de métricas superiores (Restaurantes, Reservas, Ingresos): Fondo gris oscuro translúcido, border-radius de 12px y borde gris tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-528 – DUEÑO (resumen) - modo oscuro – Valores numéricos de métricas: Texto en blanco puro, tamaño de fuente grande y peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-529 – DUEÑO (resumen) - modo oscuro – Iconos decorativos en métricas: Ubicados en la esquina superior derecha en contenedores cuadrados de baja opacidad (azul, verde, morado).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-530 – DUEÑO (resumen) - modo oscuro – Tarjeta "Flujo de visitantes": Fondo gris oscuro con borde sutil y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-531 – DUEÑO (resumen) - modo oscuro – Barras de datos en gráfico de flujo: Color rojo sólido intenso con texto de datos en gris claro a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-532 – DUEÑO (resumen) - modo oscuro – Tarjeta "Acciones rápidas": Fondo gris oscuro con border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-533 – DUEÑO (resumen) - modo oscuro – Botón principal "Ver reservas de hoy": Fondo rojo intenso (#991b1b), texto blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-534 – DUEÑO (resumen) - modo oscuro – Botones secundarios ("Exportar informe", "Añadir restaurante"): Fondo gris muy oscuro (casi negro), texto blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-535 – DUEÑO (restaurantes) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-536 – DUEÑO (restaurantes) - modo oscuro – Barra lateral (Sidebar): Fondo negro con un borde derecho gris oscuro muy sutil para separación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-537 – DUEÑO (restaurantes) - modo oscuro – Ítem activo "Restaurantes" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-538 – DUEÑO (restaurantes) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-539 – DUEÑO (restaurantes) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Mis Restaurantes" en gris claro, tamaño reducido, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-540 – DUEÑO (restaurantes) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-541 – DUEÑO (restaurantes) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-542 – DUEÑO (restaurantes) - modo oscuro – Contador de elementos: Texto "X restaurantes administrados" en gris claro, fuente pequeña, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-543 – DUEÑO (restaurantes) - modo oscuro – Botón "Agregar restaurante": Fondo rojo intenso, texto blanco, border-radius de 8px, ubicado en la parte superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-544 – DUEÑO (restaurantes) - modo oscuro – Contenedor de tarjeta de restaurante: Fondo negro/gris carbón, border-radius de 12px y borde gris oscuro sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-545 – DUEÑO (restaurantes) - modo oscuro – Imagen de cabecera de tarjeta: Imagen rectangular con bordes superiores redondeados que siguen la forma del contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-546 – DUEÑO (restaurantes) - modo oscuro – Etiqueta de estado (Activo): Fondo rojo sólido, texto blanco, estilo píldora, superpuesta en la esquina superior derecha de la imagen.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-547 – DUEÑO (restaurantes) - modo oscuro – Título de restaurante: Texto en blanco puro con peso semi-bold, ubicado debajo de la imagen.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-548 – DUEÑO (restaurantes) - modo oscuro – Indicador de calificación: Icono de estrella y número "0" en color naranja/dorado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-549 – DUEÑO (restaurantes) - modo oscuro – Iconos de detalle (Ubicación y Mesas): Iconos lineales en gris claro con texto descriptivo en gris medio al lado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-550 – DUEÑO (restaurantes) - modo oscuro – Barra de progreso/estado: Línea horizontal pequeña en color verde ubicada sobre los botones de acción de la tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-551 – DUEÑO (restaurantes) - modo oscuro – Botón "Ver reservas": Fondo rojo intenso (#991b1b), texto blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-552 – DUEÑO (restaurantes) - modo oscuro – Botón de configuración (Icono): Fondo gris muy oscuro (casi negro), icono de engranaje blanco, border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-553 – DUEÑO (restaurantes) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-554 – DUEÑO (restaurantes) - modo oscuro – Ítem activo "Facturas" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-555 – DUEÑO (restaurantes) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Facturación" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-556 – DUEÑO (restaurantes) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-557 – DUEÑO (restaurantes) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-558 – DUEÑO (restaurantes) - modo oscuro – Contador de elementos: Texto "0 facturas" en gris claro, fuente pequeña, ubicado sobre el margen superior de la tarjeta principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-559 – DUEÑO (restaurantes) - modo oscuro – Contenedor de tarjeta principal (Facturas): Fondo negro/gris carbón, border-radius de 12px y borde gris oscuro sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-560 – DUEÑO (restaurantes) - modo oscuro – Encabezado de la tarjeta: Título "Facturas recientes" en blanco con peso semi-bold y subtítulo descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-561 – DUEÑO (restaurantes) - modo oscuro – Fila de encabezado de tabla: Texto en gris claro/medio con peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-562 – DUEÑO (restaurantes) - modo oscuro – Columnas de la tabla: "Número", "Restaurante", "Monto", "Fecha", "Vencimiento", "Estado" y "Acciones".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-563 – DUEÑO (restaurantes) - modo oscuro – Cuerpo de la tabla: Área de contenido vacía con fondo negro uniforme debajo del encabezado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-564 – DUEÑO (restaurantes) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-565 – DUEÑO (flujo diario) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-566 – DUEÑO (flujo diario) - modo oscuro – Ítem activo "Flujo diario" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-567 – DUEÑO (flujo diario) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro con avatar circular naranja e inicial "D" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-568 – DUEÑO (flujo diario) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Flujo diario" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-569 – DUEÑO (flujo diario) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-570 – DUEÑO (flujo diario) - modo oscuro – Subtítulo de vista: "Flujo diario / Análisis de clientes por hora" en gris medio, alineado a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-571 – DUEÑO (flujo diario) - modo oscuro – Tarjetas de métricas (Total clientes, Con reserva, Sin reserva): Fondo gris carbón muy oscuro, border-radius de 12px y borde delgado gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-572 – DUEÑO (flujo diario) - modo oscuro – Títulos de métricas en tarjetas: Texto en gris claro, peso regular y tamaño de fuente reducido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-573 – DUEÑO (flujo diario) - modo oscuro – Valores numéricos de métricas: Número "0" en blanco, tamaño de fuente grande y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-574 – DUEÑO (flujo diario) - modo oscuro – Etiquetas de subtexto en métricas: Texto gris medio ("Hasta ahora", "0% del total") debajo de los valores numéricos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-575 – DUEÑO (flujo diario) - modo oscuro – Tarjeta de detalle "Flujo por horas": Contenedor con fondo gris muy oscuro, border-radius de 12px y borde sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-576 – DUEÑO (flujo diario) - modo oscuro – Encabezado de tarjeta de detalle: Título "Flujo por horas" en blanco y subtítulo descriptivo en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-577 – DUEÑO (flujo diario) - modo oscuro – Aviso de datos vacíos en gráfico: Texto "No hay datos de flujo diario." en gris medio, centrado horizontal y verticalmente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-578 – DUEÑO (empleados) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Empleados" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-579 – DUEÑO (empleados) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-580 – DUEÑO (empleados) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tus restaurantes, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-581 – DUEÑO (empleados) - modo oscuro – Título de sección "Empleados": Texto en blanco con subtexto "Personas asignadas a tus restaurantes..." en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-582 – DUEÑO (empleados) - modo oscuro – Tarjetas de perfil de empleado: Fondo gris carbón muy oscuro, border-radius de 12px y borde delgado gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-583 – DUEÑO (empleados) - modo oscuro – Información en tarjeta de empleado: Nombre en blanco (bold), correo electrónico y restaurante asignado en gris claro/medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-584 – DUEÑO (empleados) - modo oscuro – Etiquetas de rol (Badges): Fondo de color rojo oscuro apagado con texto descriptivo ("administrador" o "empleado") en rojo más claro, estilo píldora.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-585 – DUEÑO (empleados) - modo oscuro – Título de sección "Reservas aceptadas": Texto en blanco con subtexto "Todas las reservas confirmadas..." en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-586 – DUEÑO (empleados) - modo oscuro – Contenedor de tabla de reservas: Fondo negro/gris carbón, border-radius de 12px y borde gris oscuro sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-587 – DUEÑO (empleados) - modo oscuro – Encabezado de tabla de reservas: Texto en gris claro con etiquetas de columna en peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-588 – DUEÑO (empleados) - modo oscuro – Columnas de la tabla: "Fecha", "Hora", "Restaurante", "Cliente", "Comensales" y "Teléfono".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-589 – DUEÑO (empleados) - modo oscuro – Ítem activo "Empleados" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-590 – DUEÑO (empleados) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-591 – DUEÑO (empleados) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-592 – DUEÑO (clientes) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Clientes" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-593 – DUEÑO (clientes) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-594 – DUEÑO (clientes) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-595 – DUEÑO (clientes) - modo oscuro – Contador de registros: Texto "1 cliente" en gris claro, fuente pequeña, ubicado sobre el margen superior de la tabla.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-596 – DUEÑO (clientes) - modo oscuro – Contenedor de tabla principal: Fondo gris carbón muy oscuro, borde delgado gris y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-597 – DUEÑO (clientes) - modo oscuro – Encabezado de tabla: Fondo gris muy oscuro con texto gris claro en peso semi-bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-598 – DUEÑO (clientes) - modo oscuro – Definición de columnas: "Cliente", "Email", "Reservas" y "Última visita" con alineación a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-599 – DUEÑO (clientes) - modo oscuro – Fila de datos: Fondo negro/gris oscuro sólido con texto en blanco puro para los registros individuales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Registro en `registrar.tsx` con el mismo shell de autenticación que login.

- **NFF-600 – DUEÑO (clientes) - modo oscuro – Ítem activo "Clientes" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante; border-radius 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-601 – DUEÑO (clientes) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-602 – DUEÑO (clientes) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-603 – DUEÑO (correos) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-604 – DUEÑO (correos) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Correos" en gris claro, tamaño pequeño, ubicado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-605 – DUEÑO (correos) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-606 – DUEÑO (correos) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-607 – DUEÑO (correos) - modo oscuro – Tarjeta principal de correos: Fondo gris carbón muy oscuro, borde delgado gris y border-radius de aproximadamente 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-608 – DUEÑO (correos) - modo oscuro – Encabezado de la tarjeta: Icono lineal de sobre seguido del texto "Correos no leídos" en blanco bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-609 – DUEÑO (correos) - modo oscuro – Botón "Actualizar": Fondo transparente con borde gris fino, texto blanco e icono de rotación; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-610 – DUEÑO (correos) - modo oscuro – Fila de correo individual: Separación visual mediante un borde inferior gris oscuro muy tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-611 – DUEÑO (correos) - modo oscuro – Título del correo (Asunto): Texto en blanco con peso bold para destacar el contenido.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-612 – DUEÑO (correos) - modo oscuro – Remitente y vista previa del mensaje: Texto en gris claro/medio ubicado inmediatamente debajo del asunto.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-613 – DUEÑO (correos) - modo oscuro – Marca de tiempo: Texto gris claro con la fecha y hora, posicionado en el extremo superior derecho de cada fila de correo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-614 – DUEÑO (correos) - modo oscuro – Ítem activo "Correos" (Sidebar): Fondo rojo oscuro (#991b1b), texto blanco puro y borde izquierdo rojo brillante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-615 – DUEÑO (correos) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro con avatar circular naranja e inicial "D" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-616 – DUEÑO (configuracion) - modo oscuro – Indicador de sección (Breadcrumb): Texto "Configuración" en gris claro, tamaño pequeño, posicionado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-617 – DUEÑO (configuracion) - modo oscuro – Título principal "Buenas tardes": Texto en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-618 – DUEÑO (configuracion) - modo oscuro – Subtítulo descriptivo de cabecera: Texto gris medio ("Gestiona tu restaurante, reservas y facturación...") debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-619 – DUEÑO (configuracion) - modo oscuro – Tarjetas de configuración (SMTP e IMAP): Fondo gris carbón muy oscuro, borde delgado gris y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-620 – DUEÑO (configuracion) - modo oscuro – Título de sección SMTP: Texto en blanco con icono lineal de avión de papel y descripción técnica en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-621 – DUEÑO (configuracion) - modo oscuro – Título de sección IMAP: Texto en blanco con icono lineal de sobre y descripción técnica en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-622 – DUEÑO (configuracion) - modo oscuro – Etiquetas de campos (Labels): Texto gris claro, tamaño de fuente pequeño y peso regular (Host, Puerto, Usuario, etc.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-623 – DUEÑO (configuracion) - modo oscuro – Cajas de entrada (Inputs): Fondo negro sólido, borde gris oscuro y border-radius de 8px; altura aproximada de 40px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-624 – DUEÑO (configuracion) - modo oscuro – Botón "Guardar SMTP": Fondo rojo intenso (#991b1b), texto blanco y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-625 – DUEÑO (configuracion) - modo oscuro – Botón "Guardar IMAP": Fondo dorado/mostaza (#d4af37), texto negro y peso bold; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-626 – DUEÑO (configuracion) - modo oscuro – Ítem activo "Configuración" (Sidebar): Fondo rojo oscuro, texto blanco puro y borde izquierdo rojo brillante; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-627 – DUEÑO (configuracion) - modo oscuro – Bloque de perfil de usuario (Sidebar): Fondo gris muy oscuro, avatar circular naranja con letra "D" blanca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-628 – DUEÑO (configuracion) - modo oscuro – Fondo general de la interfaz: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-629 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Cabecera del modal: Título "Configuración: [Nombre]" en blanco bold y subtexto descriptivo en gris claro sobre el borde superior.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-630 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Sistema de pestañas (Tabs): Contenedor con fondo negro sólido e iconos lineales acompañando al texto de cada pestaña.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-631 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Pestaña activa: Fondo color crema/dorado (#d6b77e aprox.), texto en negro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-632 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Etiquetas de campos (Labels): Texto en blanco con peso bold, ubicado directamente sobre cada input.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-633 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Cajas de entrada (Inputs): Fondo gris muy oscuro, borde gris tenue y texto en blanco; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-634 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Selectores de hora: Inputs con icono de reloj en el extremo derecho y formato de texto "12:00 a. m.".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-635 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Botón de acción principal ("Guardar datos", "Agregar empleado"): Fondo rojo intenso (#991b1b), texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-636 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Botón "Agregar mesa": Fondo rojo oscuro con icono "+" blanco a la izquierda del texto.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-637 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Listado de elementos (Mesas/Empleados): Filas con fondo gris oscuro, bordes redondeados y alineación horizontal de datos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-638 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Indicadores de estado en mesas: Texto descriptivo (Mesa, personas, precio y estado) separado por puntos medios o guiones.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-639 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Iconos de gestión en filas: Icono de lápiz (editar) en gris claro y papelera (eliminar) en rojo intenso.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-640 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Selector de administrador: Menú desplegable (Dropdown) con fondo negro y flecha de apertura hacia abajo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-641 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Botón "Cerrar": Texto simple en blanco ubicado en la esquina inferior derecha del modal, fuera de los contenedores principales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-642 – DUEÑO (Modales de gestion de restaurante) - modo oscuro – Estructura del modal: Fondo gris carbón muy oscuro con bordes redondeados, sobre un overlay negro semi-transparente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-643 – DUEÑO (Modales de gestion de restaurante) - modo claro – Cabecera del modal: Título "Configuración: [Nombre]" en azul oscuro bold con un icono de cierre "x" en la esquina superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-644 – DUEÑO (Modales de gestion de restaurante) - modo claro – Estructura del modal: Fondo beige muy claro con bordes redondeados, posicionado sobre un overlay semi-transparente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-645 – DUEÑO (Modales de gestion de restaurante) - modo claro – Sistema de pestañas (Tabs): Contenedor con fondo blanco y borde gris fino; iconos y texto en gris oscuro para estados inactivos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-646 – DUEÑO (Modales de gestion de restaurante) - modo claro – Pestaña activa: Fondo verde suave con texto en verde oscuro y bordes redondeados de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-647 – DUEÑO (Modales de gestion de restaurante) - modo claro – Etiquetas de campos (Labels): Texto en azul oscuro profundo con peso bold, ubicado directamente sobre los campos de entrada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-648 – DUEÑO (Modales de gestion de restaurante) - modo claro – Cajas de entrada (Inputs): Fondo blanco puro, borde gris claro y texto en negro; border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-649 – DUEÑO (Modales de gestion de restaurante) - modo claro – Selectores de horario: Campos con icono de reloj tenue en el extremo derecho y formato de texto de 12 horas.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-650 – DUEÑO (Modales de gestion de restaurante) - modo claro – Botón de acción principal ("Guardar datos", "Agregar empleado"): Fondo naranja vibrante, texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-651 – DUEÑO (Modales de gestion de restaurante) - modo claro – Botón "Agregar mesa": Fondo naranja vibrante con icono "+" blanco a la izquierda del texto.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-652 – DUEÑO (Modales de gestion de restaurante) - modo claro – Filas de listado (Mesas/Empleados): Contenedores con fondo blanco, borde gris tenue y esquinas redondeadas.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-653 – DUEÑO (Modales de gestion de restaurante) - modo claro – Detalles de mesa en lista: Texto descriptivo en gris oscuro que incluye capacidad de personas, precio y estado actual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-654 – DUEÑO (Modales de gestion de restaurante) - modo claro – Iconos de gestión en filas: Lápiz gris para editar y papelera naranja/roja para eliminar, ubicados en el extremo derecho.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-655 – DUEÑO (Modales de gestion de restaurante) - modo claro – Selector de administrador: Menú desplegable con fondo blanco, borde gris y flecha indicadora hacia abajo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-656 – DUEÑO (Modales de gestion de restaurante) - modo claro – Botón "Eliminar empleado": Fondo blanco con borde y texto en naranja suave; incluye icono de usuario con signo de resta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-657 – DUEÑO (Modales de gestion de restaurante) - modo claro – Enlace "Cerrar": Texto simple en gris oscuro/negro ubicado en la esquina inferior derecha del modal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-658 – DUEÑO (Modal Agregar Restaurante) - modo claro – Cabecera del modal: Título "Agregar restaurante" en azul oscuro bold con un icono de cierre "x" en la esquina superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-659 – DUEÑO (Modal Agregar Restaurante) - modo claro – Subtítulo instructivo: Texto "Completa todos los campos. Todos son obligatorios." en gris medio debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-660 – DUEÑO (Modal Agregar Restaurante) - modo claro – Campos de identificación (NIT y D.V.): Etiquetas en azul oscuro; campo NIT con borde naranja resaltado y placeholder descriptivo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-661 – DUEÑO (Modal Agregar Restaurante) - modo claro – Texto de ayuda de formato: "Formato Colombia: 800.000.000 – 9..." en gris, tamaño de fuente pequeño bajo los campos de NIT.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-662 – DUEÑO (Modal Agregar Restaurante) - modo claro – Nombre y Descripción: Inputs con fondo blanco puro, borde gris claro y placeholders en gris suave; el campo descripción es multilínea.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-663 – DUEÑO (Modal Agregar Restaurante) - modo claro – Campo de Dirección: Input con icono de pin de mapa en el extremo derecho y texto de ayuda inferior indicando el uso del mapa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-664 – DUEÑO (Modal Agregar Restaurante) - modo claro – Selectores de horario: Campos para "Hora de apertura" y "Hora de cierre" con iconos de reloj tenues y formato de hora vacío.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-665 – DUEÑO (Modal Agregar Restaurante) - modo claro – Selector de Categoría: Menú desplegable (Dropdown) con flecha hacia abajo y placeholder "Selecciona una categoría".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-666 – DUEÑO (Modal Agregar Restaurante) - modo claro – Gestión de Imagen Principal: Botón con icono de imagen y texto "Subir imagen principal" sobre fondo gris muy claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-667 – DUEÑO (Modal Agregar Restaurante) - modo claro – Imágenes de referencia: Bloque con botones para "Agregar imagen (0/15)" y "Ver imágenes (0)" con aviso de guardado temporal inferior.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-668 – DUEÑO (Modal Agregar Restaurante) - modo claro – Botón "Cancelar": Fondo gris muy claro/blanco, texto en gris oscuro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-669 – DUEÑO (Modal Agregar Restaurante) - modo claro – Botón "Crear restaurante": Fondo naranja vibrante, texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-670 – DUEÑO (Modal Agregar Restaurante) - modo claro – Estructura general: Fondo beige muy claro, bordes redondeados y sombra perimetral sutil sobre el overlay.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-671 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Cabecera del modal: Título "Agregar restaurante" en blanco puro con peso bold y un icono de cierre "x" en la esquina superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-672 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Subtítulo instructivo: Texto "Completa todos los campos. Todos son obligatorios." en gris medio, ubicado bajo el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-673 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Campos de identificación (NIT y D.V.): Etiquetas en blanco; inputs con fondo negro sólido, borde gris oscuro y placeholders descriptivos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-674 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Texto de ayuda de formato: "Formato Colombia: 800.000.000 – 9..." en gris claro, tamaño de fuente pequeño bajo los campos de NIT.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-675 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Nombre y Descripción: Inputs con fondo negro sólido, borde gris oscuro y placeholders en gris; el campo descripción es un área de texto multilínea.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-676 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Campo de Dirección: Input con icono de pin de mapa en el extremo derecho y texto instructivo inferior en gris sobre el uso del mapa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-677 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Selectores de horario: Campos para "Hora de apertura" y "Hora de cierre" con iconos de reloj y formato de texto de hora vacío.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-678 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Selector de Categoría: Menú desplegable (Dropdown) con fondo negro, flecha hacia abajo y placeholder "Selecciona una categoría".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-679 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Gestión de Imagen Principal: Botón con icono de imagen y texto "Subir imagen principal" sobre un fondo gris muy oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-680 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Imágenes de referencia: Bloque con botones "Agregar imagen (0/15)" y "Ver imágenes (0)" con aviso de guardado temporal en gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-681 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Botón "Cancelar": Texto simple en blanco con peso semi-bold, ubicado al lado del botón de acción principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-682 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Botón "Crear restaurante": Fondo rojo intenso (#991b1b), texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

- **NFF-683 – DUEÑO (Modal Agregar Restaurante) - modo oscuro – Estructura general: Fondo gris carbón muy oscuro con bordes redondeados, sobre un overlay negro semi-transparente.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens.

> **Nota de vigencia:** los ítems `NFF-684..NFF-791` quedan como histórico y están reemplazados por el bloque **NFF-VIG-HOME / NFF-VIG-SEARCH / NFF-VIG-REST / NFF-VIG-PAY / NFF-VIG-CLIENT / NFF-VIG-APP** del inicio del documento.

- **NFF-684 – Cliente (Home Page Principal) - modo oscuro – Barra de navegación (Navbar): Fondo negro sólido con logo "Reservify" a la izquierda; enlaces a "Restaurantes", selector de modo oscuro (icono luna) y botón de perfil a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-685 – Cliente (Home Page Principal) - modo oscuro – Sección Hero - Título principal: Texto "¿Reserva en tu restaurante favorito?" con degradado de naranja a amarillo y peso extra-bold.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** El titular visible en el hero es «Reserva tu mesa sin complicaciones» con gradiente primary→accent (`HeroSection.tsx`), no el texto citado en el requisito legacy.

- **NFF-686 – Cliente (Home Page Principal) - modo oscuro – Sección Hero - Subtítulo: Texto en gris claro centrado que describe la variedad gastronómica de la plataforma.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-687 – Cliente (Home Page Principal) - modo oscuro – Barra de búsqueda: Contenedor oscuro con borde rojo sutil, placeholder "¿Qué tipo de cocina te apetece hoy?" y botón "Buscar" en color café/dorado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-688 – Cliente (Home Page Principal) - modo oscuro – Etiquetas de categorías rápidas: Botones rectangulares con fondo azul oscuro y texto en azul claro (Italiana, Japonesa, Mexicana, Mediterránea).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-689 – Cliente (Home Page Principal) - modo oscuro – Botón de ubicación: Texto "Usar mi ubicación actual" acompañado de un icono de pin de mapa en color gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-690 – Cliente (Home Page Principal) - modo oscuro – Fondo de cabecera: Fondo oscuro con efecto de partículas/estrellas en tonos dorados difuminados.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-691 – Cliente (Home Page Principal) - modo oscuro – Sección "Tipos de Cocina": Título blanco bold y carrusel de tarjetas con iconos lineales de colores (Azul para Italiana, Verde para Asiática, Amarillo para Japonesa).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-692 – Cliente (Home Page Principal) - modo oscuro – Navegación de carrusel: Flechas laterales (izquierda/derecha) sobre fondos oscuros y puntos de paginación (pagination dots) azules inferiores.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-693 – Cliente (Home Page Principal) - modo oscuro – Sección "Restaurantes Destacados": Título principal y subtítulo en gris medio; tarjetas con imagen superior y badge rojo "Disponible hoy".**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales.

- **NFF-694 – Cliente (Home Page Principal) - modo oscuro – Tarjeta de restaurante: Fondo negro, nombre en blanco bold, descripción en gris, icono de estrella roja para calificación y dirección con icono de pin.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-695 – Cliente (Home Page Principal) - modo oscuro – Botón "Ver disponibilidad": Fondo rojo intenso (#991b1b), texto blanco y border-radius de 8px dentro de la tarjeta de restaurante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-696 – Cliente (Home Page Principal) - modo oscuro – Sección de beneficios "¿Por qué elegir Reservify?": Tres bloques centrados con iconos dorados/rojos y títulos: "Reserva Instantánea", "Para Todos" y "Los Mejores".**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Sección de beneficios en `FeaturesSection.tsx`: grid responsive con **6** tarjetas (3 columnas desde `md`), titulares distintos a «Reserva Instantánea / Para Todos / Los Mejores».

- **NFF-697 – Cliente (Home Page Principal) - modo oscuro – Banner de descarga (CTA): Degradado horizontal de rojo a amarillo con texto "¿Listo para tu próxima experiencia culinaria?" en blanco bold.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** CTA en `CTASection.tsx`: titular «Tu próxima mesa está a un toque», fondo oscuro con halos primary/accent, no el texto ni el degradado naranja→verde del Excel.

- **NFF-698 – Cliente (Home Page Principal) - modo oscuro – Botón "Descargar app": Botón negro sólido con texto blanco, ubicado de forma central en el banner de cierre.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay CTA de descarga de aplicación móvil en el frontend actual.

- **NFF-699 – Cliente (Home Page Principal) - modo oscuro – Pie de página (Footer): Fondo negro con columnas para "Restaurantes", "Empresa" y "Soporte"; texto legal de copyright en la base.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-700 – Cliente (Home Page Principal) - modo claro – Barra de navegación (Navbar): Fondo beige muy claro con logo "Reservify"; enlaces a "Restaurantes", icono de sol (selector de modo) y botón de perfil a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-701 – Cliente (Home Page Principal) - modo claro – Sección Hero - Título principal: "Reserva en tu restaurante favorito" con degradado de naranja a dorado y peso extra-bold.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** El titular visible en el hero es «Reserva tu mesa sin complicaciones» con gradiente primary→accent (`HeroSection.tsx`), no el texto citado en el requisito legacy.

- **NFF-702 – Cliente (Home Page Principal) - modo claro – Sección Hero - Subtítulo: Texto en gris medio centrado, describiendo la facilidad para encontrar lugares ideales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-703 – Cliente (Home Page Principal) - modo claro – Barra de búsqueda: Contenedor claro con borde naranja suave, placeholder descriptivo y botón "Buscar" en color naranja vibrante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-704 – Cliente (Home Page Principal) - modo claro – Etiquetas de categorías rápidas: Botones con fondo azul muy claro y texto en azul sólido (Italiana, Japonesa, Mexicana, Mediterránea).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-705 – Cliente (Home Page Principal) - modo claro – Botón de ubicación: Texto "Usar mi ubicación actual" con icono de pin de mapa en gris, centrado bajo la búsqueda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-706 – Cliente (Home Page Principal) - modo claro – Sección "Tipos de Cocina": Título en azul oscuro y carrusel de tarjetas con fondos de colores pastel e iconos lineales de colores (Azul, Verde, Amarillo).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-707 – Cliente (Home Page Principal) - modo claro – Navegación de carrusel: Botones laterales blancos con flechas azules y puntos de paginación (dots) azules en la base.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-708 – Cliente (Home Page Principal) - modo claro – Sección "Restaurantes Destacados": Título principal y subtítulo en gris oscuro; tarjetas con imagen y badge naranja "Disponible hoy".**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales.

- **NFF-709 – Cliente (Home Page Principal) - modo claro – Tarjeta de restaurante: Fondo blanco, nombre en negro bold, descripción en gris, icono de estrella naranja para calificación y dirección con pin gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-710 – Cliente (Home Page Principal) - modo claro – Botón "Ver disponibilidad": Fondo naranja sólido, texto blanco y border-radius de 8px dentro de la tarjeta de restaurante.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-711 – Cliente (Home Page Principal) - modo claro – Sección de beneficios "¿Por qué elegir Reservify?": Bloques con iconos en cajas de colores suaves (rojo, amarillo, verde) y títulos en azul oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel.

- **NFF-712 – Cliente (Home Page Principal) - modo claro – Banner de descarga (CTA): Degradado de naranja a verde oliva/dorado con texto "¿Listo para tu próxima experiencia culinaria?" en blanco bold.**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** CTA en `CTASection.tsx`: titular «Tu próxima mesa está a un toque», fondo oscuro con halos primary/accent, no el texto ni el degradado naranja→verde del Excel.

- **NFF-713 – Cliente (Home Page Principal) - modo claro – Botón "Descargar app": Botón blanco sólido con texto negro y border-radius de 8px, centrado en el banner inferior.**
  - **Estado:** No implementado / no aplica en el frontend actual.
  - **Implementación actual:** **No implementado:** no hay CTA de descarga de aplicación móvil en el frontend actual.

- **NFF-714 – Cliente (Home Page Principal) - modo claro – Pie de página (Footer): Fondo azul oscuro profundo con logo y columnas de navegación; texto de copyright blanco en la base.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Footer en `Footer.tsx`: grid 4 columnas en md+, enlaces a Buscar, Restaurantes, Acerca de, Contacto, Ayuda, Términos, Privacidad. Fondo `bg-background` (no azul oscuro uniforme). Nota: un bloque aún muestra el texto «Reservify» junto a la marca.

- **NFF-715 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Banner principal (Hero): Imagen a sangre con el nombre del restaurante "prueba" en blanco bold, calificación de estrellas (0.0), categoría y badge rojo "Disponible hoy".**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales.

- **NFF-716 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Barra superior de navegación: Enlace "Volver al inicio" con flecha a la izquierda y logo "Reservify" con selector de modo a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-717 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Contenedor de descripción: Recuadro con fondo gris muy oscuro y texto descriptivo en blanco/gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-718 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Sección "Galería de Imágenes": Título en blanco y grid de imágenes de referencia con bordes redondeados (border-radius 8px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-719 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Card de Reserva (Sidebar): Fondo gris oscuro con título "Hacer Reserva" e icono de calendario; incluye campos de selección para fecha, hora, comensales y mesa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-720 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Botón "Hacer Pago de Reserva": Fondo rojo intenso (#991b1b), texto blanco bold e icono de billetera/tarjeta a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-721 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Card de "Información Importante": Fondo gris oscuro con lista de viñetas sobre políticas de pago, cancelación (2 horas) y tiempo de reserva.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-722 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Bloques de Información del Restaurante: Contenedores con iconos rojos para "Dirección" y "Horarios", con texto detallado en blanco y gris.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-723 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Sección de Mapa: Título "Ubicación en el mapa" e instrucciones en gris; mapa interactivo con pin azul y botones de ubicación ("Usar mi ubicación" en blanco).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-724 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Sección "Mesas Disponibles": Título blanco y tarjetas individuales con nombre de mesa, badge amarillo "Disponible", capacidad y precio destacado en rojo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-725 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Sección "Deja tu Reseña": Selector de 5 estrellas lineales, área de texto (textarea) con fondo negro y botón "Enviar Reseña" en rojo oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-726 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Aviso de Reseñas Vacías: Icono de estrella grande y texto "Aún no hay reseñas" centrado en color gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-727 – Cliente (Aparto descripcion y reserva de restaurante) - modo oscuro – Fondo general de la página: Color negro sólido (#0a0a0a) con espaciado amplio entre secciones (gap).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-728 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Fondo general de la página: Color crema o beige muy claro (#f5f5f4 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-729 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Banner principal (Hero): Imagen con bordes redondeados, nombre del restaurante "prueba" en blanco, calificación de estrellas (0.0), categoría y badge naranja "Disponible hoy".**
  - **Estado:** Parcial — ver nota.
  - **Implementación actual:** Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales.

- **NFF-730 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Barra superior de navegación: Enlace "Volver al inicio" con flecha gris, logo "Reservify" central e icono de sol (selector de modo) a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-731 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Contenedor de descripción: Recuadro con fondo blanco, bordes redondeados y texto descriptivo en gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-732 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Sección "Galería de Imágenes": Título en azul oscuro y grid de imágenes de referencia con bordes redondeados (border-radius 8px) en contenedor blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-733 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Card de Reserva (Sidebar): Fondo blanco con sombra suave, título "Hacer Reserva" e icono de calendario naranja; incluye selectores para fecha, hora y comensales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-734 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Botón "Hacer Pago de Reserva": Fondo naranja vibrante, texto blanco bold e icono de billetera a la izquierda.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-735 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Card de "Información Importante": Fondo blanco con viñetas en gris oscuro detallando políticas de pago, cancelación y tiempo de estancia.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-736 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Bloques de Información del Restaurante: Contenedores con fondo crema suave e iconos naranjas para "Dirección" y "Horarios".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-737 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Sección de Mapa: Título "Ubicación en el mapa"; incluye botón naranja "Usar mi ubicación" y mapa interactivo con pin azul.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-738 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Sección "Mesas Disponibles": Tarjetas blancas individuales con badge verde "Disponible", capacidad de personas y precio destacado en color naranja.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-739 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Sección "Deja tu Reseña": Selector de 5 estrellas lineales, área de texto blanca con borde gris y botón naranja suave "Enviar Reseña".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-740 – Cliente (Aparto descripcion y reserva de restaurante) - modo claro – Aviso de Reseñas Vacías: Icono de estrella gris y texto "Aún no hay reseñas" centrado en color gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-741 – Cliente (Modal de confirmacionde reserva) - modo claro – Cabecera del modal: Título "Confirmar Pago de Reserva" en azul oscuro bold con un icono de cierre "x" en la esquina superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-742 – Cliente (Modal de confirmacionde reserva) - modo claro – Subtítulo instructivo: Texto "Revise los detalles de su reserva antes de proceder al pago" en gris medio bajo el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-743 – Cliente (Modal de confirmacionde reserva) - modo claro – Tarjeta de resumen (Resumen de Reserva): Contenedor interno con fondo beige suave, borde gris tenue y border-radius de 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-744 – Cliente (Modal de confirmacionde reserva) - modo claro – Título del resumen: Texto "Resumen de Reserva" en azul oscuro con peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-745 – Cliente (Modal de confirmacionde reserva) - modo claro – Listado de detalles: Etiquetas a la izquierda ("Restaurante:", "Fecha:", etc.) en gris oscuro y valores a la derecha en negro bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-746 – Cliente (Modal de confirmacionde reserva) - modo claro – Campos incluidos en resumen: Restaurante, Fecha, Hora, Comensales y Mesa específica.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-747 – Cliente (Modal de confirmacionde reserva) - modo claro – Separador visual: Línea horizontal delgada de color gris que divide los detalles del monto total.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-748 – Cliente (Modal de confirmacionde reserva) - modo claro – Sección de Total: Etiqueta "Total a Pagar:" en azul oscuro bold y monto "$100000.00" en color naranja vibrante con tamaño de fuente grande.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-749 – Cliente (Modal de confirmacionde reserva) - modo claro – Nota al pie: Texto "* El pago se procesará en la siguiente pantalla" en gris medio y tamaño de fuente pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-750 – Cliente (Modal de confirmacionde reserva) - modo claro – Botón "Cancelar": Fondo blanco, borde gris oscuro, texto en gris oscuro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-751 – Cliente (Modal de confirmacionde reserva) - modo claro – Botón "Proceder al Pago": Fondo naranja vibrante, texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-752 – Cliente (Modal de confirmacionde reserva) - modo claro – Estructura general: Fondo beige muy claro con bordes redondeados y sombra sutil sobre el overlay.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-753 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Cabecera del modal: Título "Confirmar Pago de Reserva" en blanco puro con peso bold y un icono de cierre "x" en la esquina superior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-754 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Subtítulo instructivo: Texto "Revise los detalles de su reserva antes de proceder al pago" en gris claro bajo el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-755 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Tarjeta de resumen (Resumen de Reserva): Contenedor interno con fondo negro, borde gris oscuro muy tenue y border-radius de aproximadamente 12px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-756 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Título del resumen: Texto "Resumen de Reserva" en blanco con peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-757 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Listado de detalles: Etiquetas a la izquierda ("Restaurante:", "Fecha:", etc.) en gris claro y valores a la derecha en blanco puro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-758 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Campos incluidos en resumen: Restaurante, Fecha, Hora, Comensales y Mesa específica (incluyendo capacidad).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-759 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Separador visual: Línea horizontal delgada de color gris oscuro que divide los detalles del monto total.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-760 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Sección de Total: Etiqueta "Total a Pagar:" en blanco y monto "$100000.00" en color rojo intenso.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-761 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Nota al pie: Texto "* El pago se procesará en la siguiente pantalla" en gris claro y tamaño de fuente pequeño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-762 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Botón "Cancelar": Fondo negro, borde blanco fino, texto en blanco y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-763 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Botón "Proceder al Pago": Fondo rojo oscuro sólido (#991b1b), texto blanco bold y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-764 – Cliente (Modal de confirmacionde reserva) - modo oscuro – Estructura general: Fondo gris carbón muy oscuro con bordes redondeados sobre un overlay negro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-765 – Cliente (Pasarela de pagos) - modo claro – Fondo general de la página: Color crema o beige muy claro (#f5f5f4 aprox.).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-766 – Cliente (Pasarela de pagos) - modo claro – Título principal "Completa tu reserva": Texto en azul oscuro profundo, peso bold y fuente sans-serif de gran tamaño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-767 – Cliente (Pasarela de pagos) - modo claro – Subtítulo instructivo: Texto "Revisa los detalles y elige tu método de pago" en gris oscuro debajo del título.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-768 – Cliente (Pasarela de pagos) - modo claro – Tarjeta "Resumen de tu reserva": Fondo blanco, border-radius de 12px y encabezado con un ligero degradado naranja/crema.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-769 – Cliente (Pasarela de pagos) - modo claro – Detalles del resumen (Restaurante, Mesa, Fecha, Hora, Comensales): Etiquetas en gris y valores en negro con peso bold, organizados en grid.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-770 – Cliente (Pasarela de pagos) - modo claro – Valor total en resumen: Texto "$X COP" en naranja vibrante y peso bold en la parte inferior de la tarjeta.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-771 – Cliente (Pasarela de pagos) - modo claro – Tarjeta "Método de pago": Fondo blanco con opciones de selección radial (Radio buttons).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-772 – Cliente (Pasarela de pagos) - modo claro – Opción seleccionada (Tarjeta): Fondo naranja muy tenue, borde naranja suave y check de color naranja.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-773 – Cliente (Pasarela de pagos) - modo claro – Tarjeta "Información de la tarjeta": Fondo blanco con campos de entrada (Inputs) para Número, Nombre, Mes, Año y CVC.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-774 – Cliente (Pasarela de pagos) - modo claro – Cajas de entrada (Inputs): Fondo gris muy claro, bordes redondeados y placeholders en gris tenue.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-775 – Cliente (Pasarela de pagos) - modo claro – Aviso de seguridad inferior: Bloque con fondo naranja claro, icono de candado y texto "Tu información de pago está encriptada...".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-776 – Cliente (Pasarela de pagos) - modo claro – Sidebar de pago (Derecha): Bloque flotante con fondo degradado naranja/verde que muestra el monto total "$100.000 COP" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-777 – Cliente (Pasarela de pagos) - modo claro – Botón "Confirmar pago": Fondo beige/gris claro con icono de flecha, texto en gris oscuro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-778 – Cliente (Pasarela de pagos) - modo claro – Checklist de estado del formulario: Lista de puntos en gris con etiquetas ("Número de tarjeta", "Titular", etc.) debajo del botón de confirmación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-779 – Cliente (Pasarela de pagos) - modo oscuro – Fondo general de la página: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-780 – Cliente (Pasarela de pagos) - modo oscuro – Título principal "Completa tu reserva": Texto en blanco puro, peso bold y fuente sans-serif de gran tamaño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-781 – Cliente (Pasarela de pagos) - modo oscuro – Subtítulo instructivo: Texto en gris claro debajo del título ("Revisa los detalles y elige tu método de pago").**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-782 – Cliente (Pasarela de pagos) - modo oscuro – Tarjeta "Resumen de tu reserva": Fondo gris muy oscuro, border-radius de 12px y un degradado sutil en la parte superior (tonos ocres/rojos).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-783 – Cliente (Pasarela de pagos) - modo oscuro – Detalles del resumen (Restaurante, Mesa, Fecha, Hora, Comensales): Etiquetas en gris claro y valores en blanco con peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-784 – Cliente (Pasarela de pagos) - modo oscuro – Valor total en resumen: Texto "$100.000 COP" en color rojo intenso y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-785 – Cliente (Pasarela de pagos) - modo oscuro – Tarjeta "Método de pago": Fondo gris oscuro con opciones de selección radial; la opción seleccionada tiene un borde y check rojo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-786 – Cliente (Pasarela de pagos) - modo oscuro – Tarjeta "Información de la tarjeta": Fondo gris muy oscuro con campos de entrada (Inputs) integrados.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-787 – Cliente (Pasarela de pagos) - modo oscuro – Cajas de entrada (Inputs): Fondo negro sólido, bordes gris oscuro sutiles y texto/placeholders en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-788 – Cliente (Pasarela de pagos) - modo oscuro – Aviso de seguridad inferior: Bloque con fondo rojo muy oscuro, icono de candado y texto de encriptación en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-789 – Cliente (Pasarela de pagos) - modo oscuro – Sidebar de pago (Derecha): Bloque con degradado de rojo oscuro a granate que destaca el monto total "$100.000 COP" en blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-790 – Cliente (Pasarela de pagos) - modo oscuro – Botón "Confirmar pago": Fondo gris oscuro con icono de flecha, texto en gris claro y border-radius de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-791 – Cliente (Pasarela de pagos) - modo oscuro – Checklist de estado del formulario: Lista de puntos grises con etiquetas ("Número de tarjeta", "Titular", etc.) debajo del botón de confirmación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-792 – Cliente (Centro de ayuda) - modo oscuro – Fondo general de la página: Color negro sólido o gris carbón muy oscuro (#0a0a0a).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-793 – Cliente (Centro de ayuda) - modo oscuro – Títulos principales: Texto en blanco puro, peso bold y fuente sans-serif de gran tamaño.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-794 – Cliente (Centro de ayuda) - modo oscuro – Subtítulos e instrucciones: Texto en gris claro debajo de los títulos principales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-795 – Cliente (Centro de ayuda) - modo oscuro – Contenedores de información: Fondo gris muy oscuro, border-radius de 12px y degradados sutiles en tonos ocres/rojos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-796 – Cliente (Centro de ayuda) - modo oscuro – Detalles y etiquetas: Etiquetas en gris claro y valores en blanco con peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-797 – Cliente (Centro de ayuda) - modo oscuro – Resaltado de valores críticos: Texto de montos o totales en color rojo intenso y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-798 – Cliente (Centro de ayuda) - modo oscuro – Elementos de selección: Fondo gris oscuro con bordes y checks en color rojo para la opción seleccionada.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-799 – Cliente (Centro de ayuda) - modo oscuro – Campos de entrada (Inputs): Fondo negro sólido, bordes gris oscuro sutiles y texto/placeholders en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-800 – Cliente (Centro de ayuda) - modo oscuro – Bloques de seguridad: Fondo rojo muy oscuro con iconos de candado y texto en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-801 – Cliente (Centro de ayuda) - modo oscuro – Barras laterales de acción: Bloques con degradado de rojo oscuro a granate para destacar acciones finales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-802 – Cliente (Centro de ayuda) - modo oscuro – Botones de acción: Fondo gris oscuro, bordes redondeados de 8px e iconos de dirección/flecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-803 – Cliente (Centro de ayuda) - modo oscuro – Indicadores de estado: Listas de puntos grises con etiquetas descriptivas bajo los botones principales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-804 – Cliente (Centro de ayuda) - modo claro – Fondo general de la página: Degradado radial suave en tonos crema/beige claro hacia blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-805 – Cliente (Centro de ayuda) - modo claro – Títulos principales: Texto en color azul marino oscuro (#2d3748) para alto contraste.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-806 – Cliente (Centro de ayuda) - modo claro – Subtítulos e instrucciones: Texto en gris medio para diferenciar la jerarquía informativa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-807 – Cliente (Centro de ayuda) - modo claro – Contenedores de información: Fondo blanco sólido, border-radius de 12px y sombra paralela (drop shadow) sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-808 – Cliente (Centro de ayuda) - modo claro – Cuerpo de texto: Texto en gris oscuro con interlineado amplio (aprox. 1.5) para legibilidad.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-809 – Cliente (Centro de ayuda) - modo claro – Barra de navegación (Navbar): Fondo blanco/transparente con elementos alineados a los extremos (Logo e Interacciones).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-810 – Cliente (Centro de ayuda) - modo claro – Botones de sesión: Botón "Iniciar Sesión" con borde sólido; botón "Registrarse" con fondo verde pastel (#a8c2b1 aprox).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Botón «Registrarse» usa el token `secondary` (#FF2D55) con hover a primary, no verde (`Header.tsx`).

- **NFF-811 – Cliente (Centro de ayuda) - modo claro – Selector de tema: Icono de sol/brillo centrado para control de alternancia entre modos (Light/Dark).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-812 – Cliente (Centro de ayuda) - modo claro – Botón de retorno: Botón "Volver al inicio" con fondo gris muy claro y bordes redondeados (8px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-813 – Cliente (Centro de ayuda) - modo claro – Efectos decorativos: Partículas mínimas dispersas en el fondo para añadir profundidad visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-814 – Cliente (Contáctanos) - modo claro – Fondo de la página: Degradado radial suave en tonos beige/crema claro hacia blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-815 – Cliente (Contáctanos) - modo claro – Contenedor del Formulario: Fondo blanco sólido, border-radius de 12px y sombra sutil (drop shadow) para efecto de elevación.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-816 – Cliente (Contáctanos) - modo claro – Campos de Entrada (Inputs/Textarea): Fondo gris muy claro, bordes finos en gris suave y texto de ejemplo (placeholder) en gris medio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-817 – Cliente (Contáctanos) - modo claro – Tipografía de Etiquetas: Texto en color azul marino oscuro (#2d3748), peso bold y alineación superior a los campos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-818 – Cliente (Contáctanos) - modo claro – Botón de Acción Principal: Fondo naranja vibrante (#ff7043 aprox.) con texto en blanco y bordes redondeados (8px).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-819 – Cliente (Contáctanos) - modo claro – Iconografía en Inputs: Uso de iconos lineales (ej. sobre de correo) en color verde esmeralda suave dentro de los campos específicos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-820 – Cliente (Contáctanos) - modo claro – Área de Mensaje: Campo de texto multilínea (textarea) con tirador de redimensionamiento sutil en la esquina inferior derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-821 – Cliente (Contáctanos) - modo claro – Distribución de Campos: Diseño de dos columnas para datos personales (Nombre/Correo) y una columna completa para Asunto y Mensaje.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-822 – Cliente (Contáctanos) - modo claro – Botón de Navegación Superior: Botón "Volver al inicio" con fondo gris claro, centrado sobre el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-823 – Cliente (Contáctanos) - modo claro – Estilo de Texto de Cabecera: Título "Contáctanos" en azul oscuro profundo, seguido de un párrafo descriptivo en gris oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-824 – Cliente (Contáctanos) - modo oscuro – Fondo general de la página: Color negro sólido o gris carbón muy oscuro (#0a0a0a) con partículas decorativas tenues.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-825 – Cliente (Contáctanos) - modo oscuro – Contenedor del Formulario: Fondo gris muy oscuro, border-radius de 12px y borde perimetral sutil en gris oscuro para definición.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-826 – Cliente (Contáctanos) - modo oscuro – Campos de Entrada (Inputs/Textarea): Fondo negro sólido, bordes finos en gris oscuro y texto/placeholders en gris claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-827 – Cliente (Contáctanos) - modo oscuro – Tipografía de Etiquetas: Texto en blanco puro o gris muy claro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-828 – Cliente (Contáctanos) - modo oscuro – Botón de Acción Principal: Fondo rojo granate/oscuro (#b71c1c aprox.) con texto en blanco y bordes redondeados de 8px.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-829 – Cliente (Contáctanos) - modo oscuro – Iconografía en Inputs: Icono de correo en color verde esmeralda brillante dentro del campo "Correo electrónico".**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-830 – Cliente (Contáctanos) - modo oscuro – Área de Mensaje: Campo de texto multilínea con altura expandida y tirador de redimensionamiento sutil.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-831 – Cliente (Contáctanos) - modo oscuro – Efecto de Fondo: Degradado radial tenue en tonos tierra/ocre que emana desde la parte inferior para dar profundidad.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-832 – Cliente (Contáctanos) - modo oscuro – Botones de Sesión (Navbar): Botón "Registrarse" con fondo ocre/dorado y botón "Iniciar Sesión" en blanco puro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-833 – Cliente (Contáctanos) - modo oscuro – Cabecera de Página: Título "Contáctanos" en blanco bold de gran tamaño y párrafo descriptivo en gris claro centrado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-834 – Cliente (Terminos y condiciones de uso) - modo oscuro – Fondo de la página: Color negro sólido o gris carbón muy oscuro (#0a0a0a) con degradado ocre inferior.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-835 – Cliente (Terminos y condiciones de uso) - modo oscuro – Contenedor Legal: Fondo gris muy oscuro, border-radius de 12px y padding interno amplio para facilitar la lectura extensa.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-836 – Cliente (Terminos y condiciones de uso) - modo oscuro – Título Principal: Texto "Términos y Condiciones de Uso" en blanco puro, peso bold y tamaño de fuente destacado.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-837 – Cliente (Terminos y condiciones de uso) - modo oscuro – Indicador de Versión: Texto de "Última actualización" en gris claro, centrado y con tamaño de fuente reducido debajo del título.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-838 – Cliente (Terminos y condiciones de uso) - modo oscuro – Numeración de Secciones: Títulos de sección (1 al 10) en blanco puro, peso bold para facilitar la navegación visual.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-839 – Cliente (Terminos y condiciones de uso) - modo oscuro – Cuerpo del Texto: Texto en gris claro con interlineado (line-height) optimizado para lectura de documentos legales largos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-840 – Cliente (Terminos y condiciones de uso) - modo oscuro – Acentos de Color: Botón "Registrarse" en ocre/dorado y botón "Iniciar Sesión" en blanco para mantener la consistencia de marca.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-841 – Cliente (Terminos y condiciones de uso) - modo oscuro – Barra de Navegación: Fondo transparente con logotipo "Reservify" y controles de tema (luna) visibles en la parte superior.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-842 – Cliente (Terminos y condiciones de uso) - modo oscuro – Botón de Navegación Secundaria: Botón "Volver al inicio" con fondo gris oscuro y bordes redondeados, ubicado sobre el título.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-843 – Cliente (Terminos y condiciones de uso) - modo oscuro – Efectos Visuales: Partículas mínimas en el fondo para mantener la estética "espacial" o de profundidad de la plataforma.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-844 – Cliente (Terminos y condiciones de uso) - modo claro – Fondo de la página: Degradado radial suave en tonos beige/crema claro hacia blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-845 – Cliente (Terminos y condiciones de uso) - modo claro – Contenedor Legal: Fondo blanco sólido, border-radius de 12px y sombra sutil (drop shadow) para separación del fondo.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-846 – Cliente (Terminos y condiciones de uso) - modo claro – Título Principal: Texto "Términos y Condiciones de Uso" en azul marino oscuro (#2d3748) y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-847 – Cliente (Terminos y condiciones de uso) - modo claro – Indicador de Versión: Texto de "Última actualización" en gris medio, centrado bajo el título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-848 – Cliente (Terminos y condiciones de uso) - modo claro – Numeración de Secciones: Títulos de sección (1 al 10) en color oscuro y peso bold para resaltar la estructura del documento.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-849 – Cliente (Terminos y condiciones de uso) - modo claro – Cuerpo del Texto: Texto en gris oxford oscuro con interlineado amplio para mejorar la lectura de cláusulas legales.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-850 – Cliente (Terminos y condiciones de uso) - modo claro – Barra de Navegación (Navbar): Fondo blanco/transparente con logotipo "Reservify" y controles alineados a los extremos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-851 – Cliente (Terminos y condiciones de uso) - modo claro – Botones de Sesión: Botón "Iniciar Sesión" con borde definido; botón "Registrarse" con fondo verde pastel (#a8c2b1).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Botón «Registrarse» usa el token `secondary` (#FF2D55) con hover a primary, no verde (`Header.tsx`).

- **NFF-852 – Cliente (Terminos y condiciones de uso) - modo claro – Selector de Tema: Icono de sol/brillo centrado indicando el estado activo del modo claro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-853 – Cliente (Terminos y condiciones de uso) - modo claro – Espaciado Táctil: Margen interno (padding) amplio para evitar que el texto toque los bordes del contenedor blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-854 – Cliente (Politica y privacidad) - modo claro – Fondo de la página: Degradado radial suave en tonos beige/crema claro hacia blanco.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-855 – Cliente (Politica y privacidad) - modo claro – Contenedor Principal: Fondo blanco sólido, border-radius de 12px y sombra sutil para profundidad.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-856 – Cliente (Politica y privacidad) - modo claro – Título de Sección: Texto "Política de Privacidad" en color azul marino oscuro (#2d3748) y peso bold.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-857 – Cliente (Politica y privacidad) - modo claro – Bajada de Título: Texto descriptivo breve en gris medio centrado debajo del título principal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-858 – Cliente (Politica y privacidad) - modo claro – Estructura de Puntos: Numeración (1 al 10) en color oscuro y peso bold para facilitar la navegación rápida.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-859 – Cliente (Politica y privacidad) - modo claro – Cuerpo de Texto: Texto en gris oxford con interlineado (line-height) generoso para mejorar la legibilidad.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-860 – Cliente (Politica y privacidad) - modo claro – Barra de Navegación (Navbar): Logotipo "Reservify" a la izquierda; botones "Iniciar Sesión" (oscuro) y "Registrarse" (verde pastel) a la derecha.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Botón «Registrarse» usa el token `secondary` (#FF2D55) con hover a primary, no verde (`Header.tsx`).

- **NFF-861 – Cliente (Politica y privacidad) - modo claro – Selector de Tema: Icono de sol/brillo centrado en el Navbar para control de alternancia lumínica.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-862 – Cliente (Politica y privacidad) - modo claro – Márgenes Internos: Padding amplio dentro del contenedor para evitar que el texto se acerque a los bordes curvos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-863 – Cliente (Politica y privacidad) - modo claro – Consistencia Visual: Uso de la misma paleta de colores crema y blanco empleada en la página de Términos y Condiciones.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-874 – Cliente (Politica y privacidad) - modo oscuro – Fondo de la página: Color negro sólido (#0a0a0a) con degradado ocre/tierra en la parte inferior.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-875 – Cliente (Politica y privacidad) - modo oscuro – Contenedor Principal: Fondo gris muy oscuro, border-radius de 12px y borde sutil para definición sobre el fondo negro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-876 – Cliente (Politica y privacidad) - modo oscuro – Título de Sección: Texto "Política de Privacidad" en blanco puro, peso bold y fuente sans-serif.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-877 – Cliente (Politica y privacidad) - modo oscuro – Bajada de Título: Texto descriptivo en gris claro centrado debajo del título principal para contexto inmediato.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-878 – Cliente (Politica y privacidad) - modo oscuro – Estructura de Puntos: Títulos numerados (1 al 10) en blanco puro y peso bold para resaltar la jerarquía legal.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-879 – Cliente (Politica y privacidad) - modo oscuro – Cuerpo de Texto: Texto en gris claro con interlineado (line-height) amplio para facilitar la lectura de párrafos densos.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-880 – Cliente (Politica y privacidad) - modo oscuro – Barra de Navegación (Navbar): Logotipo "Reservify" (blanco); botones de acción "Iniciar Sesión" (blanco) y "Registrarse" (ocre/dorado).**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-881 – Cliente (Politica y privacidad) - modo oscuro – Selector de Tema: Icono de luna en el Navbar indicando el estado activo del modo oscuro.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-882 – Cliente (Politica y privacidad) - modo oscuro – Márgenes Internos: Espaciado (padding) generoso para evitar que el texto toque los bordes del contenedor.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

- **NFF-883 – Cliente (Politica y privacidad) - modo oscuro – Elementos Decorativos: Partículas mínimas dispersas en el fondo para mantener la coherencia estética del sitio.**
  - **Estado:** Cubierto en la medida del diseño actual (ver implementación).
  - **Implementación actual:** Revisado frente a `frontend/src` (abril 2026). Los valores pixel-perfect del Excel pueden diferir; la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind.

---

## Anexo – Inventario código vs requisitos (revisión exhaustiva, abril 2026)

Este anexo contrasta **todo el árbol relevante de `frontend/src`** (rutas, páginas, modales/diálogos, shell de app) con el documento. Los miles de ítems **NFF-xxx** legacy siguen siendo trazabilidad frente al Excel; la **verdad operativa** del producto está en el **bloque NFF-VIG-*** y en esta tabla.

### 1. Rutas (`routes/config.tsx` + `routes/paths.ts`)

| Ruta | Página / componente | Protección |
|------|---------------------|------------|
| `/` | `Home.tsx` | Pública |
| `/buscar` | `Search.tsx` | Pública |
| `/Login` | `Login.tsx` | Pública |
| `/Registrar` | `registrar.tsx` | Pública |
| `/contacto`, `/ayuda`, `/terminos`, `/privacidad` | `Contacto`, `Ayuda`, `Terminos`, `Privacidad` | Públicas |
| `/Restaurant` | `Restaurant.tsx` | Pública |
| `/Datos_personales` | `PersonalData.tsx` | Pública (placeholder) |
| `/Pasarela_pagos` | `PaymentGateway.tsx` | Pública (guard interno) |
| `/pago-exitoso` | `PagoExitoso.tsx` | Pública |
| `/duenodashboard` | `Dashboard.tsx` | `ProtectedRoute` rol dueño |
| `/admindashboard` | `AdminDashboard.tsx` | `ProtectedRoute` administrador |
| `/EmpleadoDashboard` | `employee-dashboard.tsx` | `ProtectedRoute` empleado |
| `/ver-correo/:uid` | `ViewEmailPage.tsx` | Dueño / admin / empleado |
| `*` | `NotFound.tsx` | Pública |

**App global:** `App.tsx` — `ToastProvider`, `CookieConsentModal`, `RoleEnforcer`, rutas públicas y protegidas con `PageWrapper` (animación).

### 2. Modales, diálogos y overlays (inventario por archivo)

| Componente / ubicación | Función principal |
|-------------------------|-------------------|
| `ProfileModal.tsx` | Perfil cliente, reservas, cancelación con motivo; usado en `Home.tsx`, `AuthPageShell`, flujos con cabecera. |
| `CookieConsentModal.tsx` | Consentimiento de cookies. |
| `AddRestaurantModal.tsx` | Alta de restaurante (mapa/dirección, categoría, imágenes, NIT). **Solo montado en `Dashboard.tsx` (dueño).** |
| `RestaurantConfigModal.tsx` | Configuración avanzada del restaurante (mesas, empleados, admin, imágenes, borrado, etc.); múltiples `Dialog` anidados (asignar empleado, crear usuario, credenciales, eliminar restaurante). **`Dashboard.tsx` y `AdminDashboard.tsx`.** |
| `RestaurantReservationsModal.tsx` | Reservas del restaurante en contexto dueño. **`Dashboard.tsx`.** |
| `AllReservationsModal.tsx` | Vista amplia de reservas. **`Dashboard.tsx` y `AdminDashboard.tsx`.** |
| `InvoiceDetailModal.tsx` | Detalle de factura. **`Dashboard.tsx` y `AdminDashboard.tsx`.** |
| `AddressMapPicker.tsx` | Selector de dirección con mapa (`Dialog`). Usado desde modales de restaurante. |
| `Restaurant.tsx` | `Dialog` inline: detalle rápido de mesa/slot y flujo **Confirmar pago de reserva** antes de pasarela. |
| `EmailConfigSection.tsx` | Diálogo de **consentimiento/advertencia** al guardar SMTP/IMAP. **`Dashboard`, `AdminDashboard`, `employee-dashboard`** (sección correo). |
| `employee-dashboard.tsx` | `Dialog` para **motivo de cancelación** de reserva. |
| `Login.tsx` | No usa `Dialog` de shadcn para recovery; UI propia por pasos (email / código / reset). |
| `components/ui/dialog.tsx` | Primitiva Radix/shadcn; base del resto. |

**No hay** `ClientDashboard` ni ruta dedicada cliente: cubierto en **NFF-VIG-CLIENT**.

### 3. Paneles de gestión (tabs y módulos reales)

- **Dueño (`Dashboard.tsx`):** sidebar `app-sidebar.tsx`, pestañas típicas: resumen, restaurantes, reservas, clientes, facturación, correos, configuración; métricas `OwnerMetricsService`, `OwnerMonthlyFlowService`, tablas reservas/facturas, export CSV, PDF cliente (`OwnerInvoicesService`). Modales: **AddRestaurant**, **RestaurantConfig**, **RestaurantReservations**, **AllReservations**, **InvoiceDetail**.
- **Administrador (`AdminDashboard.tsx`):** mismo patrón visual con **un restaurante**; **no** incluye `AddRestaurantModal` ni `RestaurantReservationsModal` (solo gestión sobre el local asignado: config, reservas globales modal, facturas, correos).
- **Empleado (`employee-dashboard.tsx`):** `Sidebar_2`, `Overview_2`, mesas, reservas del día, correos, configuración; balance `EmployeeBalanceService`; cancelación con modal de motivo.

### 4. Cobertura del bloque **NFF-VIG-*** frente al código

| Bloque documentado | Estado frente al repo |
|--------------------|------------------------|
| NFF-VIG-HOME | Coherente con `Home.tsx` + lazy sections + `HeroSection`/`SearchBar` (chips incompletos — ya marcado). |
| NFF-VIG-SEARCH | Coherente con `Search.tsx` + `/top/paginado`. |
| NFF-VIG-LOGIN / REG | Coherente; OAuth explícitamente no implementado. |
| NFF-VIG-REST | Coherente; modales de confirmación en `Restaurant.tsx` no estaban desglosados en un NFF-VIG aparte — **detalle en §2**. |
| NFF-VIG-PAY | Coherente; `checkout-page.tsx` legacy ya citado. |
| NFF-VIG-CLIENT / APP | Coherente con `ProfileModal`, `paths.ts`, `CookieConsentModal`, `RoleEnforcer`. |
| **Dashboards dueño/admin/empleado** | **No** tienen sub-bloque NFF-VIG-DASH propio; la funcionalidad aparece dispersa en **NFF legacy dueño (NFF-5xx–6xx)** con texto genérico “AdminDashboard, Dashboard, employee-dashboard”. El **anexo §2–3** es la referencia fina. |
| **ViewEmailPage** | Ruta protegida; **no** hay ítem NFF-VIG dedicado; flujo de correo está en tabs dashboard + página `/ver-correo/:uid`. |
| **Contacto / Ayuda** | Páginas existentes; muchos NFF legacy describen marketing/legal con plantilla repetida (“Google Sans…”). |

### 5. Requisitos legacy (NFF-001 … NFF-883)

- Son sobre todo **especificaciones visuales** (colores hex, tamaños, modos claro/oscuro por pantalla).
- El documento ya marca **Cubierto en la medida del diseño actual** o **Parcial** y repite la línea de **tokens** (`index.css`, Tailwind).
- **No** se pretende igualdad pixel-perfect con el Excel; la comparación útil es **rol + pantalla + flujo**, no cada RGB.

### 6. Brechas o riesgos detectados (producto)

1. **`PersonalData.tsx`:** ruta pública registrada; UI casi vacía — alineado con **NFF-VIG-CLIENT-03 Parcial**.
2. **Chips de búsqueda rápida en hero:** aún incompletos (**NFF-VIG-HOME-03**).
3. **OAuth:** explícitamente fuera de alcance (**NFF-VIG-LOGIN-05 / REG-05**).
4. **Dos piezas de checkout:** `CheckoutPage.tsx` vs `checkout-page.tsx` — ya documentado en NFF-VIG-PAY-02.
5. **Admin sin alta de restaurante:** coherente con rol; no es bug si el negocio lo define así.

### 7. Mantenimiento recomendado del documento

- Tratar el **bloque NFF-VIG-*** + este **anexo** como **fuente de verdad** para SENA/evidencias de implementación.
- Usar los **NFF-xxx** legacy solo como **histórico** o exportar a `REQ. funcionales Frontend.legacy.md` si se quiere acortar el archivo principal.

*Generado por contraste directo con el código en `frontend/src` (abril 2026).*
