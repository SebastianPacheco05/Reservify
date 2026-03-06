### Requerimientos de base de datos de Reservify

#### Requerimientos de esquema implementados

- **DB-01 – Auditoría de tablas del sistema**
  - **Estado:** Hecho  
  - Existe la tabla `Auditoria` y triggers de inserción/actualización/eliminación para todas las tablas principales (`Credenciales`, `Roles`, `Usuario`, `Restaurante`, `Mesas`, `Encabezado_Factura`, `Reserva`, `Categorias`, `Imagen_referencia_restaurante`, `Comentarios`, `Calculos_mensuales`, `jwt_tokens`, `SMTP_config`, `IMAP_config`, `Mails`), registrando fecha/hora, usuario, acción, tabla y el registro en JSONB.

- **DB-17 – Tabla Auditoria_Usuario (auditoría por usuario final de la aplicación)**
  - **Estado:** Hecho  
  - Existe la tabla `Auditoria_Usuario` que registra quién realizó cada cambio desde la aplicación (usuario final), a diferencia de la tabla `Auditoria` que registra el usuario de la base de datos (`current_user`).
  - La tabla `Auditoria_Usuario` contiene:
    - `id_auditoria_usuario` SERIAL PRIMARY KEY.
    - `fecha_hora` TIMESTAMP NOT NULL.
    - `usuario_app` VARCHAR(255) NULL — identificador del usuario final (p. ej. documento); se establece con `SET LOCAL app.usuario_id = 'documento'` al inicio de cada transacción desde el backend; si no se setea, queda NULL (operaciones de sistema/cron).
    - `accion` VARCHAR(255) NOT NULL (INSERT, UPDATE, DELETE).
    - `tabla` VARCHAR(255) NOT NULL.
    - `registro` JSONB NOT NULL (snapshot del registro afectado).
  - Triggers paralelos (`auditoria_usuario_insert_trigger`, `auditoria_usuario_update_trigger`, `auditoria_usuario_delete_trigger`) escriben en `Auditoria_Usuario` para las mismas tablas que audita `Auditoria`, leyendo `current_setting('app.usuario_id', true)` para rellenar `usuario_app`.
  - Implementación en `db/auditoria.sql`; la aplicación debe invocar `config.set_audit_user(db, documento)` (o equivalente) al inicio del request para propagar el usuario final a la sesión.
