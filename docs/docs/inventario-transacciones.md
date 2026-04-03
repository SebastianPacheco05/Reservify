# Inventario de transacciones (Backend + Base de Datos)

Repositorio: Reservify  
Fecha: 2026-03-18  
Alcance: **alto nivel** (por módulo/endpoint y flujos principales)

---

## Resumen ejecutivo

- **Backend**: FastAPI + SQLAlchemy (sesiones con `autocommit=False`). La mayoría de escrituras se hacen llamando **funciones SQL** (`SELECT funcion(:params)`) y luego `db.commit()`; en errores se usa `db.rollback()`.
- **Base de datos (PostgreSQL)**: hay muchas funciones PL/pgSQL en `db/scripts/funciones/**`. No se usan `COMMIT/ROLLBACK/SAVEPOINT` explícitos dentro de funciones; **las funciones se ejecutan dentro de la transacción del cliente** (la controla el backend).
- **Auditoría**: el backend setea el usuario de app con `SELECT set_config('app.usuario_id', :uid, true)` (ver `backend/config.py`) y los triggers de auditoría capturan inserts/updates/deletes.

---

## 1) Inventario de transacciones del backend (por router)

Notas:

- Cuando un endpoint llama un “CRUD” (en `backend/functions/cruds/*.py`), típicamente ese CRUD ejecuta 1..N llamadas SQL y finaliza con **`db.commit()`**, o hace **`db.rollback()`** en excepción.
- Los endpoints “listar / get” suelen ser **solo lectura** (`db.execute(...).fetch*`) y no requieren commit.

### 1.1 `routes/credenciales.py` (`/credenciales/*`)

- **POST `/credenciales/login`** → `functions/auth/login.py::login_usuario`
  - **Lee** credenciales: `fn_auth_get_credenciales_by_email(email)`
  - **Opcional escribe** (migración legacy): `fn_auth_update_password(id_credencial, password_hash)`
  - **Escribe** sesión JWT: `fn_auth_insert_jwt_session(...)`
  - **Lee** usuario y rol: `fn_auth_get_usuario_documento_y_rol(id_credencial)`
  - **Transacción**: commit al final del login; rollback en error.

- **POST `/credenciales/refresh`** → `functions/auth/login.py::renovar_token`
  - **Lee** sesión por refresh: `fn_auth_get_session_by_refresh_token(refresh_token)`
  - **Escribe** nuevo access token: `fn_auth_update_jwt_token(refresh_token, new_token, ...)`
  - **Transacción**: commit al actualizar; rollback en error.

- **GET `/credenciales/me/role`** → `functions/auth/get_user_role.py`
  - **Lee** rol: `fn_get_user_role(id_credencial)` (u otra función equivalente usada por el módulo)
  - **Transacción**: lectura.

- **PUT `/credenciales/editarcredencial`** → `functions/cruds/credenciales.py::editar_credenciales`
  - **Lee** password actual (si no se cambia): `SELECT password FROM "Credenciales" ...`
  - **Escribe**: `editar_credenciales(id, email, password)`
  - **Transacción**: commit/rollback en el CRUD.

- **DELETE `/credenciales/borrarcredencial`** → `functions/cruds/credenciales.py::borrar_credenciales`
  - **Escribe**: `borrar_credenciales(id)`
  - **Transacción**: commit/rollback en el CRUD.

### 1.2 `routes/register.py` (`/register/register`)

- **POST `/register/register`** → `functions/register/register.py::registrar_usuario`
  - **Lee** rol normalizado: `fn_register_get_rol_normalizado(...)`
  - **Valida existencia email**: `fn_register_email_existe(email)`
  - **Escribe** credenciales: `fn_register_insertar_credenciales(email, password_hash, ...)`
  - **Escribe** usuario/cliente: `fn_register_insertar_usuario_cliente(...)`
  - **Transacción**: commit/rollback dentro del flujo `registrar_usuario`.

### 1.3 `routes/password_reset.py` (`/password-reset/*`)

- **POST `/password-reset/request`**
  - **Lee** credencial por email: `fn_auth_get_credencial_id_by_email(email)` (con fallback SQL directo a `"Credenciales"`)
  - **Escribe** código reset: `fn_auth_insert_password_reset_code(...)` (con fallback `INSERT INTO "Password_Reset_Codes"`)
  - **Transacción**: commit explícito en el endpoint; rollback en fallback/errores intermedios.

- **POST `/password-reset/verify`**
  - **Lee** credencial por email: `fn_auth_get_credencial_id_by_email(email)` (con fallback)
  - **Lee** código válido: `SELECT ... FROM "Password_Reset_Codes" ...`
  - **Transacción**: lectura.

- **POST `/password-reset/reset`**
  - **Lee** estado de código: `SELECT used, expires_at FROM "Password_Reset_Codes" ...`
  - **Escribe** password: `fn_auth_update_password(id_credencial, password_hash)`
  - **Escribe** marca usado: `UPDATE "Password_Reset_Codes" SET used=TRUE ...`
  - **Transacción**: commit al final.

### 1.4 `routes/roles.py` (`/admin/*`)

- **POST `/admin/insertaroles`** → `functions/cruds/roles.py::insertar_roles`
  - **Escribe**: `insertar_roles(nombre_rol, descripcion)`
  - **Transacción**: commit/rollback en el CRUD.

- **PUT `/admin/editaroles`** → `editar_roles(...)` (commit/rollback)
- **DELETE `/admin/borraroles`** → `borrar_roles(id_rol)` (commit/rollback)
- **GET `/admin/listar_rol`, GET `/admin/listar_roles`** → `functions/cruds/list.py` (lectura)

### 1.5 `routes/usuario.py` (`/usuario/*`)

- **POST `/usuario/insertar`** → `functions/cruds/usuario.py::insertar_usuario`
  - **Escribe**: `insertar_usuario(...)`
  - **Transacción**: commit/rollback en el CRUD.

- **PUT `/usuario/editar`** → `editar_usuario(...)` (commit/rollback)
- **DELETE `/usuario/borrar`** → `borrar_usuario(documento)` (commit/rollback)
- **GET `/usuario/listar_*`** → `functions/cruds/list.py` (lecturas SQL directas)

### 1.6 `routes/cliente.py` (`/cliente/*`)

- **GET `/cliente/mi-perfil`** → `list.obtener_usuario_por_id_credencial` (lectura)
- **GET `/cliente/mis-reservas`** → `list.obtener_reservas_por_documento` (lectura)

- **PATCH `/cliente/mis-reservas/{id_reserva}/cancelar`** (flujo multi-escritura)
  - **Valida pertenencia**: `SELECT documento, estado_reserva FROM "Reserva" ...`
  - **Escribe estado**: `update_reservation_status(id_reserva, nuevo_estado)` (commit dentro de `functions/cruds/reservation_status.py`)
  - **Escribe motivo cancelación**: `fn_do_actualizar_motivo_cancelacion(id_reserva, motivo)` (commit dentro de `functions/data_owner/data_owner.py`)
  - **Transacción**: **potencialmente dos commits** (uno por cada llamada). Si se requiere atomicidad total, este es un punto a mejorar (unificar en una sola función SQL o un solo bloque transaccional).

- **PUT/DELETE `/cliente/editarcliente`, `/cliente/borrarcliente`** reutiliza CRUD de `Usuario` (commit/rollback en CRUD).

### 1.7 `routes/restaurante.py` (`/restaurante/*`)

- **GET `/restaurante/{nit}`** (público)
  - **Lectura** `"Restaurante"` + `"Categorias"` y lectura opcional de `"Imagen_referencia_restaurante"`.

- **POST `/restaurante/insertarrestaurante`** → `functions/cruds/restaurante.py::insertar_restaurante`
  - **Escritura**: `insertar_restaurante(...)`
  - **Escritura** imágenes (si aplica): `insertar_imagen_referencia_restaurante(nit, url, orden)`
  - **Transacción**: commit/rollback en el CRUD.

- **PUT `/restaurante/editarrestaurante`** → `editar_restaurante(...)` (commit/rollback)
- **DELETE `/restaurante/borrarrestaurante`** → `borrar_restaurante(nit)` (commit/rollback)
- **GET `/restaurante/listar_*`** → `functions/cruds/list.py` (lectura)

### 1.8 `routes/mesas.py` (`/mesas/*`)

- **GET `/mesas/restaurante/{nit}`** (público): lectura de `"Mesas"`.
- **POST/PUT/DELETE** (`insertarmesas`, `editarmesas`, `borrarmesas`) → `functions/cruds/mesas.py`
  - **Escritura**: `insertar_mesas`, `editar_mesas`, `borrar_mesas`
  - **Transacción**: commit/rollback en el CRUD.
- **GET `/mesas/listar_*`** → `functions/cruds/list.py` (lectura)

### 1.9 `routes/categorias.py` (`/categorias/*`)

- **GET `/categorias/listar_categorias`**: lectura
- **GET `/categorias/top`**: lectura (agregaciones)
- **POST/PUT/DELETE** (`insertarcategoria`, `editarcategoria`, `borrar_categoria`) → `functions/cruds/categorias.py`
  - **Escritura**: `insertar_categoria`, `editar_categoria`, `borrar_categoria`
  - **Transacción**: commit/rollback en el CRUD.

### 1.10 `routes/comentarios.py` (`/comentarios/*`)

- **GET `/comentarios/restaurante/{nit}`** (público): lectura join `"Comentarios"` + `"Usuario"`.
- **GET `/comentarios/verificar/{nit}`**: lectura mediante `existe_comentario(documento, nit)` y/o validación previa.
- **POST `/comentarios/crear`** y **POST `/comentarios/insertarcomentario`** → `functions/cruds/comentarios.py::insertar_comentario`
  - **Escritura**: `insertar_comentario(...)` (posible lógica adicional en la función SQL, p.ej. actualizar rating/reviews).
  - **Transacción**: commit/rollback en el CRUD.
- **PUT/DELETE** (`editarcomentario`, `borrarcomentario`) → `editar_comentario`, `borrar_comentario` (commit/rollback).
- **GET `/comentarios/listar_*`**: lectura.

### 1.11 `routes/enc_fac.py` (`/encabezado_factura/*`) y `routes/det_fac.py` (`/detalle_factura/*`)

- **POST/PUT/DELETE**: usan CRUDs en `backend/functions/cruds/enc_fac.py` y `det_fac.py`
  - **Escritura**: `insertar_enc_fac`, `editar_enc_fac`, `borrar_enc_fac`
  - **Escritura**: `insertar_detalle_factura`, `editar_detalle_factura`, `borrar_detalle_factura`
  - **Transacción**: commit/rollback en los CRUDs.
- **GET listar**: lectura; en detalle se valida acceso con joins a `"Encabezado_Factura"`.

### 1.12 `routes/enc_fac_reserva.py` (`/facturas/reservar`)

- **POST `/facturas/reservar`** → `functions/reservar/enc_fac_reserva.py::registrar_factura_y_reserva`
  - **Valida** mínima antelación: `SELECT min_anticipacion_horas FROM "Restaurante" ...`
  - **Escritura principal**: `registrar_factura_y_reserva(...)`
  - **Transacción**: commit dentro de `registrar_factura_y_reserva` (backend). La atomicidad “factura+reserva” depende de la función SQL.

### 1.13 `routes/cal_mensuales.py` (`/calculos_mensuales/*`)

- CRUD de cálculos mensuales → `functions/cruds/cal_mensuales.py`
  - **Escritura**: `insertar_calculo_mensual`, `editar_calculo_mensual`, `borrar_calculo_mensual`
  - **Transacción**: commit/rollback en CRUD.
- Listar: lectura.

### 1.14 `routes/restaurantes_map.py` (`/restaurantes`, `/mapa`)

- **GET `/restaurantes`** → `list.obtener_restaurantes_para_mapa` (lectura)
- **PUT `/mapa`** → `list.actualizar_coordenadas_restaurante`
  - **Escritura**: `actualizar_coordenadas_restaurante(nit, lat, lng)` (función SQL)
  - **Transacción**: commit/rollback dentro del método de list/CRUD correspondiente (según implementación).

### 1.15 `routes/wompi.py` (`/wompi/*`)

- **POST `/wompi/webhook`** y/o **POST `/wompi/crear_pago`**
  - **Escritura en BD** (cuando se aprueba pago): `confirmar_reserva_por_pago(id_encab_fact)`
  - **Transacción**: commit/rollback dentro de `functions/wompi/wompi_service.py::confirmar_reserva_por_pago` (cuando se ejecuta la actualización en BD).

### 1.16 `routes/data_owner.py` (incluido con prefijo `/data-owner` en `backend/main.py`)

Este router es un “dashboard” con lecturas y escrituras sobre reservas/restaurante/mesas/admin/emails.

- **Lecturas principales** (sin commit):
  - `fn_do_obtener_contexto_gestor(id_credencial)`
  - `obtener_estadisticas_restaurante(...)`, `obtener_estadisticas_dueno(...)`
  - queries raw sobre `"Reserva"`, `"Mesas"`, `"Restaurante"`, `"Credenciales"`, etc.

- **Escrituras frecuentes** (con commit):
  - Actualizar motivo cancelación: `fn_do_actualizar_motivo_cancelacion(id_reserva, motivo)` (commit)
  - Asignar admin: `fn_do_asignar_administrador_restaurante(nit, id_credencial_admin)` (commit)
  - Cambiar rol a cliente: `fn_do_cambiar_rol_a_cliente(id_credencial)` (commit)
  - Asignar empleado: `fn_do_asignar_empleado_existente(id_credencial, nit)` (commit)
  - Crear empleado invitado: `fn_do_crear_empleado_invitado(...)` (commit)
  - Editar restaurante + update directo de `min_anticipacion_horas` (commit explícito en endpoint)
  - CRUD de mesas/restaurante reutilizando `functions/cruds/*` (commit/rollback en CRUD)
  - Config SMTP/IMAP y persistencia de mails (`fn_es_*`) (commit/rollback en `smtp_config_db.py`)

---

## 2) Inventario de transacciones en la base de datos (alto nivel)

Ubicación: `db/scripts/funciones/**`

### 2.1 CRUDs (escritura)

Carpeta: `db/scripts/funciones/Cruds/*/fun_*.sql`

- **Patrón**: funciones tipo `insertar_*`, `editar_*`, `borrar_*` por entidad.
- **Entidades**: Usuario, Cliente, Empleado, Dueño, Restaurante, Mesas, Categorías, Comentarios, Encabezado_Factura, Detalle_Factura, Reserva, Roles, Credenciales, Calculos_mensuales.
- **Transacción**: sin `COMMIT/ROLLBACK` explícitos; se ejecutan bajo la transacción del backend.

### 2.2 Listar / Get (lectura)

Carpeta: `db/scripts/funciones/Cruds/Listar/*.sql`

- Funciones tipo `list_*`, `get_*_by_*`.
- **Transacción**: lectura.

### 2.3 Auth / JWT / Password reset

Archivo: `db/scripts/funciones/auth/auth.sql` y `db/scripts/funciones/get_credencial.sql`

- Funciones `fn_auth_*` (credenciales, sesiones JWT, estado token, reset password).
- **Transacción**: el backend agrupa varias llamadas en una misma sesión y hace commit.

### 2.4 Registro de usuario/cliente

Archivo: `db/scripts/funciones/register/register.sql`

- Funciones `fn_register_*` para alta de credenciales y usuario cliente.
- **Transacción**: controlada por el backend.

### 2.5 Reservas y facturación (flujo)

Archivos: `db/scripts/funciones/reservar/reservar.sql`, `db/scripts/funciones/facturacion_y_reservas.sql`

- Función clave: `registrar_factura_y_reserva(...)` (crea encabezado factura + reserva; potencialmente actualiza mesa/estado).
- **Transacción**: debe ser atómica desde el backend (1 commit).

### 2.6 Data owner (gestión)

Carpeta: `db/scripts/funciones/data_owner/*.sql`

- Funciones `fn_do_*` para asignaciones y cambios administrativos y para reportes (estadísticas).
- **Transacción**: controlada por el backend.

### 2.7 Wompi (confirmación)

Archivo: `db/scripts/funciones/wompi/confirmar_reserva_por_pago.sql`

- `confirmar_reserva_por_pago(id_encab_fact)` (cambia estados al confirmarse un pago).
- **Transacción**: controlada por el backend.

### 2.8 Email sender (SMTP/IMAP)

Archivos: `db/scripts/funciones/email_sender/email_sender.sql`, `db/scripts/funciones/email_sender/smtp_imap_triggers.sql`

- Funciones `fn_es_*` para upsert/get de configuraciones SMTP/IMAP y persistencia de `Mails`.
- Triggers de `updated_at` para config.

### 2.9 Auditoría (triggers)

Archivo: `db/auditoria.sql`

- Triggers `auditoria_*` y `auditoria_usuario_*` para múltiples tablas.
- **Transacción**: los triggers se disparan en la misma transacción que el DML originado por el backend.

---

## 3) Matriz rápida Backend ↔ BD (llamadas clave)

- **Login**: `POST /credenciales/login` → `fn_auth_get_credenciales_by_email`, `fn_auth_update_password` (si legacy), `fn_auth_insert_jwt_session`, `fn_auth_get_usuario_documento_y_rol` → **1 commit**
- **Refresh**: `POST /credenciales/refresh` → `fn_auth_get_session_by_refresh_token`, `fn_auth_update_jwt_token` → **1 commit**
- **Register**: `POST /register/register` → `fn_register_*` → **1 commit**
- **Reservar**: `POST /facturas/reservar` → `registrar_factura_y_reserva` → **1 commit**
- **Confirmación pago**: `POST /wompi/webhook` / `POST /wompi/crear_pago` (APPROVED) → `confirmar_reserva_por_pago` → **1 commit**
- **Cancelar reserva cliente**: `PATCH /cliente/mis-reservas/{id}/cancelar` → `update_reservation_status` + `fn_do_actualizar_motivo_cancelacion` → **2 commits potenciales**

---

## 4) Patrón transaccional (cómo funciona hoy)

### Backend (SQLAlchemy)

- Sesión por request: `backend/config.py` define `SessionLocal(autocommit=False, autoflush=False, ...)`.
- Escrituras: `db.execute(text("SELECT ..."))` + `db.commit()` en éxito.
- Errores: `db.rollback()` en `except`.

### PostgreSQL (funciones)

- Las funciones PL/pgSQL no comitean; se ejecutan dentro de la transacción del cliente.
- La atomicidad de flujos multi-operación se logra si el backend hace **un solo commit** después de todas las llamadas relacionadas, o si la lógica se encapsula en **una sola función SQL**.

---

## 5) Archivos fuente (para trazabilidad)

### Backend

- Routers: `backend/routes/*.py`
- CRUDs y lógica: `backend/functions/**`
- Conexión / sesión BD / auditoría: `backend/config.py`
- Enrutamiento general: `backend/main.py`

### Base de datos

- Funciones: `db/scripts/funciones/**/*.sql`
- Auditoría: `db/auditoria.sql`

