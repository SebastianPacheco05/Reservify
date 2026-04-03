### Requerimientos no funcionales (Backend)

> Complementan los requisitos globales en [REQ. No funcionales.md](REQ.%20No%20funcionales.md) y se limitan al **servicio API** en `backend/`.

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
  - **Descripción:** Contraseñas de usuario se almacenan con **bcrypt** en flujos de registro y actualización (`functions/register/register.py`, `functions/cruds/credenciales.py`).
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
  - **Descripción:** Función `set_audit_user` establece `app.usuario_id` en la sesión para triggers de `Auditoria_Usuario` cuando aplica (`config.py`).
  - **Estado:** Hecho.

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
  - **Descripción:** No hay middleware de rate limiting en el backend; el endpoint público `POST /contactanos` no implementa throttling en código (alineado con **NF-086** en requisitos globales).
  - **Estado:** No implementado.

---

#### Observabilidad

- **NFB-020 – Logging de fallos no controlados**
  - **Descripción:** Excepciones no manejadas se registran con `logger.exception` antes de responder 500 (`main.py`).
  - **Estado:** Hecho.

- **NFB-021 – Métricas APM o tracing distribuido**
  - **Descripción:** No hay integración obligatoria con APM (OpenTelemetry, etc.) en el repositorio actual.
  - **Estado:** No implementado.
