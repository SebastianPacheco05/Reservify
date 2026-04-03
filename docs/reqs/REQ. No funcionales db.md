### Requerimientos no funcionales (Base de datos)

> Complementan el inventario **NF-xxx** del Excel (hoja *REQ. No funcionales*; ver sección al final) y el detalle de esquema en [REQ. funcionales db.md](REQ.%20funcionales%20db.md). **Este archivo** cubre `db/` y los ítems NF asignados a base de datos. Otros NF: [REQ. No funcionales backend.md](REQ.%20No%20funcionales%20backend.md), [REQ. No funcionales Frontend.md](REQ.%20No%20funcionales%20Frontend.md).

> **Nota:** Cada ítem describe el comportamiento **implementado o ausente** en los scripts y despliegue típico (abril 2026).

---

#### Motor y entrega del esquema

- **NFD-001 – Motor PostgreSQL**
  - **Descripción:** El diseño asume **PostgreSQL** (tipos, sintaxis de comillas para identificadores, funciones). Alineado con **NF-012** en el índice Excel al final de este documento.
  - **Estado:** Hecho.

- **NFD-002 – Scripts SQL como fuente de verdad**
  - **Descripción:** Creación principal en `db/creacion_tablas.sql`; auditoría y triggers en `db/auditoria.sql`. Evoluciones puntuales en `db/scripts/migrations/` y funciones en `db/scripts/funciones/`. **No** hay migraciones automáticas tipo Alembic/Flyway integradas en la aplicación.
  - **Estado:** Hecho (gestión manual de versiones de esquema).

- **NFD-003 – Extensión criptográfica**
  - **Descripción:** Se habilita `pgcrypto` para `gen_random_uuid()` u otros usos (`creacion_tablas.sql`).
  - **Estado:** Hecho.

---

#### Integridad, rendimiento y seguridad en el diseño relacional

- **NFD-004 – Integridad referencial y reglas en columna**
  - **Descripción:** Claves foráneas, `ON DELETE`/`CASCADE` donde aplica, `CHECK` y `UNIQUE` definidos en SQL; el detalle por tabla está en REQ. funcionales db.
  - **Estado:** Hecho.

- **NFD-005 – Índices y unicidad para consultas frecuentes**
  - **Descripción:** Índices explícitos en el script (p. ej. correo, tokens, imágenes) para soportar búsquedas y unicidad operativa; listado en REQ. funcionales db.
  - **Estado:** Hecho (sin documento aparte de tuning para carga extrema).

- **NFD-006 – Aislamiento por filas (RLS)**
  - **Descripción:** No hay políticas **Row Level Security** en los scripts del repositorio; el control de acceso se delega a la aplicación y a funciones SQL invocadas con credenciales de servicio.
  - **Estado:** No implementado.

---

#### Auditoría y trazabilidad

- **NFD-007 – Doble registro de auditoría**
  - **Descripción:** Tabla `Auditoria` (usuario técnico de sesión BD) y `Auditoria_Usuario` (usuario final vía `app.usuario_id`); registro de filas en **JSONB** según triggers en `auditoria.sql`.
  - **Estado:** Hecho (a nivel de esquema y triggers).

- **NFD-008 – Contexto `app.usuario_id` para auditoría de usuario final**
  - **Descripción:** Los triggers de `Auditoria_Usuario` dependen de que la sesión establezca `set_config('app.usuario_id', …)`; la función equivalente en backend es `set_audit_user` (**NFB-014** en [REQ. No funcionales backend.md](REQ.%20No%20funcionales%20backend.md)).
  - **Estado:** Parcial (infraestructura en BD y helper en `config.py`; uso consistente desde la API no verificado en el código actual).

---

#### Operación, copias y alta disponibilidad

- **NFD-009 – Copias de seguridad y restauración automatizadas**
  - **Descripción:** No hay scripts ni política de backup versionada en el repositorio (pg_dump, WAL archiving, PITR, etc.).
  - **Estado:** No implementado (responsabilidad del entorno de despliegue).

- **NFD-010 – Réplicas, conmutación por error y particionamiento**
  - **Descripción:** No se define en el proyecto streaming, réplicas de lectura ni particionado de tablas por fecha/volumen.
  - **Estado:** No implementado.

---

#### Codificación y convenciones

- **NFD-011 – Codificación de caracteres**
  - **Descripción:** El proyecto no fija explícitamente `ENCODING`/locale en los scripts; en despliegue estándar de PostgreSQL se asume **UTF-8** para texto.
  - **Estado:** Hecho (por convención de motor/instalación; no forzado en cada `CREATE DATABASE` dentro del repo).

---

#### Índice Excel — hoja «REQ. No funcionales» (NF asignados a base de datos)

> Fuente: `docs/docs/files/reservifyreq.v.1.3.xls.xlsx` → hoja **REQ. No funcionales**. Cada **NF** aparece **una sola vez** en el conjunto de tres archivos (`backend`, `db`, `Frontend`).

- **NF-005 – Soporte multiusuario**
  - **Estado:** Hecho.
- **NF-006 – Mantenibilidad y administración de la base de datos**
  - **Estado:** Hecho.
- **NF-012 – Uso de PostgreSQL como motor de base de datos**
  - **Estado:** Hecho.
- **NF-017 – Auditoría de cambios en los registros de la base de datos**
  - **Estado:** Hecho.
- **NF-018 – Registro de usuario, dato original/final y fecha del cambio**
  - **Estado:** Hecho.
- **NF-023 – Soporte multiusuario (reiteración)**
  - **Estado:** Hecho.
- **NF-033 – Campos definidos por el usuario en archivos maestros y transacciones**
  - **Estado:** No hecho.
- **NF-038 – Base de datos única de terceros**
  - **Estado:** No hecho.
- **NF-039 – Restricciones de identificación para terceros (NIT, CC, RC, CE)**
  - **Estado:** No hecho.
- **NF-040 – Uso de procedimientos almacenados, triggers y vistas**
  - **Estado:** Hecho.
- **NF-041 – Independencia entre dispositivos de almacenamiento y controladores de software**
  - **Estado:** No hecho.
- **NF-060 – Triggers de auditoría sobre tablas críticas**
  - **Estado:** Hecho.
- **NF-061 – Índice idx_mails_credencial_uid en Mails**
  - **Estado:** Hecho.
- **NF-062 – Índice idx_mails_id_credencial_date en Mails**
  - **Estado:** Hecho.
- **NF-069 – Tabla jwt_tokens con refresh_token y expiración**
  - **Estado:** Hecho.
- **NF-072 – Tabla Auditoria con registro JSONB**
  - **Estado:** Hecho.
- **NF-073 – Función auditoria_insert_trigger para INSERT**
  - **Estado:** Hecho.
- **NF-074 – Función auditoria_update_trigger para UPDATE**
  - **Estado:** Hecho.
- **NF-075 – Función auditoria_delete_trigger para DELETE**
  - **Estado:** Hecho.
- **NF-084 – Trigger validar_admin_tiene_restaurante (nit NOT NULL para administrador)**
  - **Estado:** Hecho.
- **NF-085 – Scripts de migración en scripts/migraciones**
  - **Estado:** Hecho.
- **NF-087 – Consentimiento de archivo de correos (consentimiento_archivo en SMTP_config/IMAP_config)**
  - **Estado:** Hecho.
- **NF-088 – UNIQUE refresh_token en jwt_tokens**
  - **Estado:** Hecho.
- **NF-007A – Límite de imágenes por restaurante para evitar sobrecarga**
  - **Estado:** Hecho.
