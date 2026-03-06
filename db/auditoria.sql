/*
 * Dos auditorías en tablas distintas:
 * 1. Auditoria: usuario de la base de datos (current_user) que ejecutó la operación.
 * 2. Auditoria_Usuario: usuario final de la aplicación que realizó el cambio.
 *    La app debe establecer SET LOCAL app.usuario_id = 'documento' al inicio de cada transacción
 *    para que los triggers guarden el usuario final; si no se setea, queda NULL (ej. jobs/sistema).
 */

-- Eliminar triggers existentes (si existen)
DROP TRIGGER IF EXISTS "auditoria_insert_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_update_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_delete_credenciales" ON "Credenciales";

DROP TRIGGER IF EXISTS "auditoria_insert_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_update_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_delete_roles" ON "Roles";

DROP TRIGGER IF EXISTS "auditoria_insert_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_update_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_delete_restaurante" ON "Restaurante";

DROP TRIGGER IF EXISTS "auditoria_insert_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_update_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_delete_mesas" ON "Mesas";

DROP TRIGGER IF EXISTS "auditoria_insert_usuario" ON "Usuario";
DROP TRIGGER IF EXISTS "auditoria_update_usuario" ON "Usuario";
DROP TRIGGER IF EXISTS "auditoria_delete_usuario" ON "Usuario";

DROP TRIGGER IF EXISTS "auditoria_insert_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_update_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_delete_encabezado_factura" ON "Encabezado_Factura";

DROP TRIGGER IF EXISTS "auditoria_insert_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_update_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_delete_reserva" ON "Reserva";

DROP TRIGGER IF EXISTS "auditoria_insert_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_update_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_delete_categoria" ON "Categorias";

DROP TRIGGER IF EXISTS "auditoria_insert_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";
DROP TRIGGER IF EXISTS "auditoria_update_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";
DROP TRIGGER IF EXISTS "auditoria_delete_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";

DROP TRIGGER IF EXISTS "auditoria_insert_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_update_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_delete_comentario" ON "Comentarios";

DROP TRIGGER IF EXISTS "auditoria_insert_cal_mensual" ON "Calculos_mensuales";
DROP TRIGGER IF EXISTS "auditoria_update_cal_mensual" ON "Calculos_mensuales";
DROP TRIGGER IF EXISTS "auditoria_delete_cal_mensual" ON "Calculos_mensuales";

DROP TRIGGER IF EXISTS "auditoria_insert_jwt_tokens" ON "jwt_tokens";
DROP TRIGGER IF EXISTS "auditoria_update_jwt_tokens" ON "jwt_tokens";
DROP TRIGGER IF EXISTS "auditoria_delete_jwt_tokens" ON "jwt_tokens";

DROP TRIGGER IF EXISTS "auditoria_insert_password_reset_codes" ON "Password_Reset_Codes";
DROP TRIGGER IF EXISTS "auditoria_update_password_reset_codes" ON "Password_Reset_Codes";
DROP TRIGGER IF EXISTS "auditoria_delete_password_reset_codes" ON "Password_Reset_Codes";

DROP TRIGGER IF EXISTS "auditoria_insert_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_update_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_delete_smtp_config" ON "SMTP_config";

DROP TRIGGER IF EXISTS "auditoria_insert_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_update_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_delete_imap_config" ON "IMAP_config";

DROP TRIGGER IF EXISTS "auditoria_insert_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_update_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_delete_mails" ON "Mails";

-- Triggers de auditoría por usuario final (segunda auditoría)
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_usuario" ON "Usuario";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_usuario" ON "Usuario";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_usuario" ON "Usuario";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_imagen_ref_restaurante" ON "Imagen_referencia_restaurante";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_cal_mensual" ON "Calculos_mensuales";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_cal_mensual" ON "Calculos_mensuales";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_cal_mensual" ON "Calculos_mensuales";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_jwt_tokens" ON "jwt_tokens";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_jwt_tokens" ON "jwt_tokens";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_jwt_tokens" ON "jwt_tokens";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_password_reset_codes" ON "Password_Reset_Codes";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_password_reset_codes" ON "Password_Reset_Codes";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_password_reset_codes" ON "Password_Reset_Codes";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_usuario_insert_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_usuario_update_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_usuario_delete_mails" ON "Mails";

-- Eliminar tablas de auditoría
DROP TABLE IF EXISTS "Auditoria_Usuario";
DROP TABLE IF EXISTS "Auditoria";

CREATE TABLE "Auditoria" (
    "id_auditoria" SERIAL PRIMARY KEY,
    "fecha_hora" TIMESTAMP NOT NULL,
    "usuario" VARCHAR(255) NOT NULL,
    "accion" VARCHAR(255) NOT NULL,
    "tabla" VARCHAR(255) NOT NULL,
    "registro" JSONB NOT NULL
);

-- Tabla auditoría por usuario final (documento o identificador que setea la app)
CREATE TABLE "Auditoria_Usuario" (
    "id_auditoria_usuario" SERIAL PRIMARY KEY,
    "fecha_hora" TIMESTAMP NOT NULL,
    "usuario_app" VARCHAR(255) NULL,
    "accion" VARCHAR(255) NOT NULL,
    "tabla" VARCHAR(255) NOT NULL,
    "registro" JSONB NOT NULL
);
COMMENT ON TABLE "Auditoria_Usuario" IS 'Auditoría por usuario final; usuario_app se setea con set_config(''app.usuario_id'', ...) en la transacción. En el backend: config.set_audit_user(db, documento) al inicio del request. NULL = operación de sistema/cron.';

CREATE OR REPLACE FUNCTION "auditoria_insert_trigger"() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria" (
        "fecha_hora",
        "usuario",
        "accion",
        "tabla",
        "registro"
    ) VALUES (
        now(),
        current_user,
        'INSERT', 
        TG_TABLE_NAME,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "auditoria_update_trigger"() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria" (
        "fecha_hora",
        "usuario",
        "accion",
        "tabla",
        "registro"
    ) VALUES (
        now(),
        current_user,
        'UPDATE',
        TG_TABLE_NAME,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "auditoria_delete_trigger"() RETURNS TRIGGER AS $$
BEGIN   
    INSERT INTO "Auditoria" (
        "fecha_hora",
        "usuario",
        "accion",
        "tabla",
        "registro"
    ) VALUES (
        now(),
        current_user,
        'DELETE',
        TG_TABLE_NAME,
        row_to_json(OLD)::jsonb
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Funciones para auditoría por usuario final (leen app.usuario_id de la sesión)
CREATE OR REPLACE FUNCTION "auditoria_usuario_insert_trigger"() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria_Usuario" (
        "fecha_hora", "usuario_app", "accion", "tabla", "registro"
    ) VALUES (
        now(),
        NULLIF(TRIM(current_setting('app.usuario_id', true)), ''),
        'INSERT',
        TG_TABLE_NAME,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "auditoria_usuario_update_trigger"() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria_Usuario" (
        "fecha_hora", "usuario_app", "accion", "tabla", "registro"
    ) VALUES (
        now(),
        NULLIF(TRIM(current_setting('app.usuario_id', true)), ''),
        'UPDATE',
        TG_TABLE_NAME,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "auditoria_usuario_delete_trigger"() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria_Usuario" (
        "fecha_hora", "usuario_app", "accion", "tabla", "registro"
    ) VALUES (
        now(),
        NULLIF(TRIM(current_setting('app.usuario_id', true)), ''),
        'DELETE',
        TG_TABLE_NAME,
        row_to_json(OLD)::jsonb
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER "auditoria_insert_credenciales"
AFTER INSERT ON "Credenciales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_credenciales"
AFTER UPDATE ON "Credenciales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_credenciales"
BEFORE DELETE ON "Credenciales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_credenciales" AFTER INSERT ON "Credenciales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_credenciales" AFTER UPDATE ON "Credenciales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_credenciales" BEFORE DELETE ON "Credenciales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_roles"
AFTER INSERT ON "Roles"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_roles"
AFTER UPDATE ON "Roles"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_roles"
BEFORE DELETE ON "Roles"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_roles" AFTER INSERT ON "Roles" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_roles" AFTER UPDATE ON "Roles" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_roles" BEFORE DELETE ON "Roles" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_restaurante"
AFTER INSERT ON "Restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_restaurante"
AFTER UPDATE ON "Restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_restaurante"
BEFORE DELETE ON "Restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_restaurante" AFTER INSERT ON "Restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_restaurante" AFTER UPDATE ON "Restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_restaurante" BEFORE DELETE ON "Restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_mesas"
AFTER INSERT ON "Mesas"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_mesas"
AFTER UPDATE ON "Mesas"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_mesas"
BEFORE DELETE ON "Mesas"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_mesas" AFTER INSERT ON "Mesas" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_mesas" AFTER UPDATE ON "Mesas" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_mesas" BEFORE DELETE ON "Mesas" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_usuario"
AFTER INSERT ON "Usuario"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_usuario"
AFTER UPDATE ON "Usuario"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_usuario"
BEFORE DELETE ON "Usuario"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_usuario" AFTER INSERT ON "Usuario" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_usuario" AFTER UPDATE ON "Usuario" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_usuario" BEFORE DELETE ON "Usuario" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_encabezado_factura"
AFTER INSERT ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_encabezado_factura"
AFTER UPDATE ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_encabezado_factura"
BEFORE DELETE ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_encabezado_factura" AFTER INSERT ON "Encabezado_Factura" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_encabezado_factura" AFTER UPDATE ON "Encabezado_Factura" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_encabezado_factura" BEFORE DELETE ON "Encabezado_Factura" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_reserva"
AFTER INSERT ON "Reserva"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_reserva"
AFTER UPDATE ON "Reserva"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_reserva"
BEFORE DELETE ON "Reserva"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_reserva" AFTER INSERT ON "Reserva" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_reserva" AFTER UPDATE ON "Reserva" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_reserva" BEFORE DELETE ON "Reserva" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

CREATE TRIGGER "auditoria_insert_categoria"
AFTER INSERT ON "Categorias"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_categoria"
AFTER UPDATE ON "Categorias"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_categoria"
BEFORE DELETE ON "Categorias"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_categoria" AFTER INSERT ON "Categorias" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_categoria" AFTER UPDATE ON "Categorias" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_categoria" BEFORE DELETE ON "Categorias" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- Imagen_referencia_restaurante
CREATE TRIGGER "auditoria_insert_imagen_ref_restaurante"
AFTER INSERT ON "Imagen_referencia_restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_imagen_ref_restaurante"
AFTER UPDATE ON "Imagen_referencia_restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_imagen_ref_restaurante"
BEFORE DELETE ON "Imagen_referencia_restaurante"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_imagen_ref_restaurante" AFTER INSERT ON "Imagen_referencia_restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_imagen_ref_restaurante" AFTER UPDATE ON "Imagen_referencia_restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_imagen_ref_restaurante" BEFORE DELETE ON "Imagen_referencia_restaurante" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- Comentarios
CREATE TRIGGER "auditoria_insert_comentario"
AFTER INSERT ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_comentario"
AFTER UPDATE ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_comentario"
BEFORE DELETE ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_comentario" AFTER INSERT ON "Comentarios" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_comentario" AFTER UPDATE ON "Comentarios" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_comentario" BEFORE DELETE ON "Comentarios" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- Calculos_mensuales
CREATE TRIGGER "auditoria_insert_cal_mensual"
AFTER INSERT ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_cal_mensual"
AFTER UPDATE ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_cal_mensual"
BEFORE DELETE ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_cal_mensual" AFTER INSERT ON "Calculos_mensuales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_cal_mensual" AFTER UPDATE ON "Calculos_mensuales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_cal_mensual" BEFORE DELETE ON "Calculos_mensuales" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- jwt_tokens
CREATE TRIGGER "auditoria_insert_jwt_tokens"
AFTER INSERT ON "jwt_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_jwt_tokens"
AFTER UPDATE ON "jwt_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_jwt_tokens"
BEFORE DELETE ON "jwt_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_jwt_tokens" AFTER INSERT ON "jwt_tokens" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_jwt_tokens" AFTER UPDATE ON "jwt_tokens" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_jwt_tokens" BEFORE DELETE ON "jwt_tokens" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- Password_Reset_Codes
CREATE TRIGGER "auditoria_insert_password_reset_codes"
AFTER INSERT ON "Password_Reset_Codes"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_password_reset_codes"
AFTER UPDATE ON "Password_Reset_Codes"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_password_reset_codes"
BEFORE DELETE ON "Password_Reset_Codes"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_password_reset_codes" AFTER INSERT ON "Password_Reset_Codes" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_password_reset_codes" AFTER UPDATE ON "Password_Reset_Codes" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_password_reset_codes" BEFORE DELETE ON "Password_Reset_Codes" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- SMTP_config
CREATE TRIGGER "auditoria_insert_smtp_config"
AFTER INSERT ON "SMTP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_smtp_config"
AFTER UPDATE ON "SMTP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_smtp_config"
BEFORE DELETE ON "SMTP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_smtp_config" AFTER INSERT ON "SMTP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_smtp_config" AFTER UPDATE ON "SMTP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_smtp_config" BEFORE DELETE ON "SMTP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- IMAP_config
CREATE TRIGGER "auditoria_insert_imap_config"
AFTER INSERT ON "IMAP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_imap_config"
AFTER UPDATE ON "IMAP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_imap_config"
BEFORE DELETE ON "IMAP_config"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_imap_config" AFTER INSERT ON "IMAP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_imap_config" AFTER UPDATE ON "IMAP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_imap_config" BEFORE DELETE ON "IMAP_config" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

-- Mails
CREATE TRIGGER "auditoria_insert_mails"
AFTER INSERT ON "Mails"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_mails"
AFTER UPDATE ON "Mails"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_mails"
BEFORE DELETE ON "Mails"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_usuario_insert_mails" AFTER INSERT ON "Mails" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_insert_trigger"();
CREATE TRIGGER "auditoria_usuario_update_mails" AFTER UPDATE ON "Mails" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_update_trigger"();
CREATE TRIGGER "auditoria_usuario_delete_mails" BEFORE DELETE ON "Mails" FOR EACH ROW EXECUTE PROCEDURE "auditoria_usuario_delete_trigger"();

