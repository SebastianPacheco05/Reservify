### Requerimientos no funcionales (Backend)

> Complementan el inventario **NF-xxx** del Excel (hoja *REQ. No funcionales*; ver sección al final). **Este archivo** cubre el servicio API en `backend/` y los ítems NF asignados a backend. Otros NF: [REQ. No funcionales db.md](REQ.%20No%20funcionales%20db.md), [REQ. No funcionales Frontend.md](REQ.%20No%20funcionales%20Frontend.md).

> **Nota:** Cada ítem describe el comportamiento **implementado o ausente** en el código actual (abril 2026).

---

#### Plataforma y configuración

- **NFB-001 – Framework y exposición HTTP**
  - **Descripción:** La API se implementa con **FastAPI** y se sirve con **Uvicorn** (`backend/main.py`, `backend/run.py`).
  - **Estado:** Hecho.

- **NFB-002 – Configuración externa (.env)**
  - **Descripción:** Host/puerto del backend, `DATABASE_URL`, orígenes CORS, claves JWT y variables de integración se cargan desde `.env` en la raíz del proyecto (`backend/config.py`).
  - **Estado:** Hecho.

- **NFB-003 – Respuesta JSON y manejo de errores**
  - **Descripción:** Respuestas en JSON; errores no capturados devuelven **500** con mensaje genérico al cliente y el detalle técnico solo en log del servidor (`main.py` exception handlers).
  - **Estado:** Hecho.

---

#### CORS y comunicación con el frontend

- **NFB-004 – CORS con credenciales**
  - **Descripción:** `CORSMiddleware` con `allow_credentials=True`; orígenes configurables por `CORS_ORIGINS` o derivados de `FRONTEND_HOST`/`FRONTEND_PORT` (`config.py`, `main.py`).
  - **Estado:** Hecho.

- **NFB-005 – Preflight OPTIONS**
  - **Descripción:** Middleware que responde **200** a peticiones `OPTIONS` con cabeceras CORS coherentes con el `Origin` de la petición (`OptionalPreflightMiddleware` en `main.py`).
  - **Estado:** Hecho.

- **NFB-006 – CORS en respuestas de error**
  - **Descripción:** Los handlers de `HTTPException` y excepciones genéricas añaden cabeceras CORS cuando aplica (`_cors_headers_for_request` en `main.py`).
  - **Estado:** Hecho.

---

#### Seguridad de autenticación y sesión

- **NFB-007 – JWT para rutas protegidas**
  - **Descripción:** Dependencia `verificar_token` con `OAuth2PasswordBearer`; validación con `python-jose` y comprobación de revocación vía función SQL `fn_auth_get_jwt_token_status` (`functions/auth/dependencies.py`).
  - **Estado:** Hecho.

- **NFB-008 – Refresh token solo en cookie HttpOnly**
  - **Descripción:** Tras login/refresh, la cookie `refresh_token` se envía con `httponly=True`, `secure=True`, `samesite="strict"` y `max_age` de 7 días (`routes/credenciales.py`).
  - **Estado:** Hecho.

- **NFB-009 – Hash de contraseñas**
  - **Descripción:** Contraseñas de usuario se almacenan con **bcrypt** en flujos de registro y actualización (`functions/register/register.py`, `functions/cruds/credenciales.py`). En login, contraseñas legacy en texto plano se migran a bcrypt de forma transparente (`functions/auth/login.py`).
  - **Estado:** Hecho.

- **NFB-010 – Recuperación de contraseña**
  - **Descripción:** Códigos de un solo uso almacenados como hash (pepper con `SECRET_KEY`); rutas bajo prefijo `/password-reset` (`routes/password_reset.py`).
  - **Estado:** Hecho.

- **NFB-011 – Edición de credenciales solo propias**
  - **Descripción:** `PUT /credenciales/editarcredencial` exige que `id_credencial` coincida con el usuario del token (`routes/credenciales.py`).
  - **Estado:** Hecho.

---

#### Base de datos y persistencia

- **NFB-012 – Motor PostgreSQL**
  - **Descripción:** Conexión mediante `DATABASE_URL` y pool SQLAlchemy (`create_engine`, `SessionLocal` en `config.py`).
  - **Estado:** Hecho.

- **NFB-013 – Consultas parametrizadas**
  - **Descripción:** Uso predominante de `text(...)` con parámetros nombrados para reducir riesgo de inyección SQL en rutas y CRUDs.
  - **Estado:** Hecho.

- **NFB-014 – Auditoría por usuario de aplicación**
  - **Descripción:** Existe `set_audit_user` en `config.py` para ejecutar `set_config('app.usuario_id', …)` y alimentar triggers de `Auditoria_Usuario` en BD.
  - **Estado:** Parcial (la función **no se invoca** desde rutas o middleware en el código actual; la auditoría por usuario final puede quedar sin contexto salvo otras vías).

---

#### Integraciones externas

- **NFB-015 – Pasarela Wompi**
  - **Descripción:** Creación de pagos, webhook y consulta de transacción; validación de integridad con `WOMPI_INTEGRITY_SECRET` donde corresponde (`routes/wompi.py`, `functions/wompi/`).
  - **Estado:** Hecho.

- **NFB-016 – Correo SMTP y lectura IMAP**
  - **Descripción:** Envío y lectura según configuración por credencial; contraseñas de buzón cifradas con esquema Fernet/derivación desde `SECRET_KEY` o `ENCRYPTION_KEY_SMTP_IMAP` (`functions/email_sender/password_cipher.py`).
  - **Estado:** Hecho.

- **NFB-017 – Subida de imágenes (Cloudinary)**
  - **Descripción:** Endpoint de subida de imagen para restaurantes usando `CLOUDINARY_URL` / utilidad de subida (`routes/restaurante.py`, `functions/cloudinary_upload.py`).
  - **Estado:** Hecho.

---

#### Tareas en segundo plano y disponibilidad

- **NFB-018 – Tarea programada en el ciclo de vida**
  - **Descripción:** Al arrancar la app se programa `tarea_programada()` (recordatorios de reserva por correo) como tarea asyncio (`lifespan` en `main.py`).
  - **Estado:** Hecho.

- **NFB-019 – Límite de peticiones (rate limiting)**
  - **Descripción:** No hay middleware de rate limiting en el backend; el endpoint público `POST /contactanos` no implementa throttling en código (alineado con **NF-086** en el índice Excel al final de este documento).
  - **Estado:** No implementado.

---

#### Observabilidad

- **NFB-020 – Logging de fallos no controlados**
  - **Descripción:** Excepciones no manejadas se registran con `logger.exception` antes de responder 500 (`main.py`).
  - **Estado:** Hecho.

- **NFB-021 – Métricas APM o tracing distribuido**
  - **Descripción:** No hay integración obligatoria con APM (OpenTelemetry, etc.) en el repositorio actual.
  - **Estado:** No implementado.

---

#### Validación y contratos de API

- **NFB-022 – Validación de entrada con Pydantic**
  - **Descripción:** Los cuerpos y query params de las rutas usan modelos Pydantic en `models.py` y esquemas locales en routers; FastAPI valida tipos y devuelve **422** ante datos inválidos.
  - **Estado:** Hecho.

- **NFB-023 – Pool de conexiones SQLAlchemy**
  - **Descripción:** `create_engine(DATABASE_URL)` usa valores por defecto del motor (sin `pool_size`/`max_overflow` explícitos en `config.py`).
  - **Estado:** Hecho (sin afinación explícita para carga alta).

---

#### Seguridad adicional

- **NFB-024 – Cookie `secure=True` en refresh**
  - **Descripción:** Las cookies de refresh se marcan `secure=True`; en entorno **HTTP** local el navegador puede no enviar la cookie según política; conviene HTTPS en producción (`routes/credenciales.py`).
  - **Estado:** Hecho (con la salvedad de entorno).

---

#### Integraciones (matiz)

- **NFB-025 – Wompi y conectividad de red**
  - **Descripción:** Llamadas a la API de Wompi dependen de DNS y red del servidor; el código documenta diagnóstico si falla la resolución (`functions/wompi/wompi_service.py`, `functions/wompi/diagnostico_conectividad.py`).
  - **Estado:** Hecho (disponibilidad del servicio externa al propio API).

---

#### Índice Excel — hoja «REQ. No funcionales» (NF asignados a backend / API)

> Fuente: `md/docs/files/reservifyreq.v.1.3.xls.xlsx` → hoja **REQ. No funcionales**. Cada **NF** aparece **una sola vez** en el conjunto de tres archivos (`backend`, `db`, `Frontend`).

- **NF-001 – Seguridad de datos y control de acceso**
  - **Estado:** En observación (SI y NO marcados).
- **NF-002 – Verificación de documentos de soporte de proyecto**
  - **Estado:** No hecho.
- **NF-003 – Disponibilidad general del sistema**
  - **Estado:** No hecho.
- **NF-004 – Escalabilidad para gran cantidad de usuarios y datos**
  - **Estado:** No hecho.
- **NF-007 – Almacenamiento de registro fotográfico**
  - **Estado:** Hecho.
- **NF-008 – Capacidad de integrarse con otros sistemas**
  - **Estado:** Hecho.
- **NF-009 – Tiempo máximo de respuesta de 5 segundos para consultas**
  - **Estado:** No hecho.
- **NF-010 – Cambio de permisos solo por usuarios autorizados**
  - **Estado:** Hecho.
- **NF-011 – Disponibilidad del 99,99 %**
  - **Estado:** No hecho.
- **NF-014 – Capacidad de procesar N transacciones por segundo**
  - **Estado:** No hecho.
- **NF-015 – Integración con Active Directory y Single Sign-On (SSO)**
  - **Estado:** No hecho.
- **NF-016 – Integración con servidores de correo para notificaciones**
  - **Estado:** Hecho.
- **NF-020 – Integración con servicio de factura electrónica**
  - **Estado:** No hecho.
- **NF-022 – Interacción con el portal corporativo de la Empresa**
  - **Estado:** No hecho.
- **NF-024 – Sistema multicompañía y multisede**
  - **Estado:** No hecho.
- **NF-027 – Integración total entre módulos sin redundancia de información**
  - **Estado:** Hecho.
- **NF-029 – Acceso web para proveedores, órdenes de compra, nómina, etc.**
  - **Estado:** No hecho.
- **NF-031 – Parametrización de cantidad, frecuencia y fechas de reportes automáticos**
  - **Estado:** No hecho.
- **NF-035 – Soporte de estándares de webservices (WSDL, XSLT, SOAP, WS-BPEL, XML)**
  - **Estado:** No hecho.
- **NF-042 – Herramienta de integración nativa tipo ESB/colas/batch para ERP corporativo**
  - **Estado:** No hecho.
- **NF-045 – Logs consolidados de transacciones por perfil y periodo**
  - **Estado:** No hecho.
- **NF-047 – Datos personales de usuarios (contacto, email, cargo, etc.)**
  - **Estado:** Hecho.
- **NF-048 – Restricción de acceso a rutas de backend según rol**
  - **Estado:** Hecho.
- **NF-049 – Validación de disponibilidad antes de confirmar una reserva**
  - **Estado:** Hecho.
- **NF-051 – Flujo transaccional integrado entre reserva, factura y pago**
  - **Estado:** Hecho.
- **NF-055 – Gestión programada de recordatorios de reservas**
  - **Estado:** Hecho.
- **NF-056 – Almacenamiento y consulta eficiente de correos de negocio**
  - **Estado:** Hecho.
- **NF-001A – Uso de hashing fuerte para contraseñas de usuarios**
  - **Estado:** Hecho.
- **NF-001B – Protección de rutas críticas mediante JWT y roles**
  - **Estado:** Hecho.
- **NF-057 – Uso de bcrypt para hashing de contraseñas**
  - **Estado:** Hecho.
- **NF-058 – Emisión y validación de JWT (access_token y refresh_token)**
  - **Estado:** Hecho.
- **NF-059 – Dependencia verificar_token en rutas protegidas**
  - **Estado:** Hecho.
- **NF-063 – Integración con pasarela Wompi (crear transacción, webhook, consultar estado)**
  - **Estado:** Hecho.
- **NF-064 – Validación de integridad de webhooks Wompi (checksum)**
  - **Estado:** Hecho.
- **NF-065 – Integración SMTP para envío de correos**
  - **Estado:** Hecho.
- **NF-066 – Integración IMAP para lectura de bandeja**
  - **Estado:** Hecho.
- **NF-067 – Integración con Cloudinary para subida de imágenes**
  - **Estado:** Hecho.
- **NF-070 – Cifrado de contraseñas de correo (SMTP/IMAP) en BD**
  - **Estado:** Hecho.
- **NF-071 – Tarea programada de recordatorios (timer_reserv)**
  - **Estado:** Hecho.
- **NF-076 – CORS configurado en backend**
  - **Estado:** Hecho.
- **NF-077 – Conexión a base de datos PostgreSQL (DATABASE_URL)**
  - **Estado:** Hecho.
- **NF-079 – Backend FastAPI con enrutado por módulos**
  - **Estado:** Hecho.
- **NF-086 – Rate limit o control en endpoint /contactanos**
  - **Estado:** No implementado.
- **NF-089 – Password_Reset_Codes para recuperación de contraseña (tabla y lógica si existe)**
  - **Estado:** Hecho.
- **NF-091 – Cookie HttpOnly para refresh token (no accesible desde JavaScript)**
  - **Estado:** Hecho.
- **NF-092 – Cookie SameSite=strict para refresh token**
  - **Estado:** Hecho.
- **NF-093 – Rechazo de tokens revocados en verificar_token**
  - **Estado:** Hecho.
- **NF-094 – Autorización por recurso: solo editar propias credenciales**
  - **Estado:** Hecho.
