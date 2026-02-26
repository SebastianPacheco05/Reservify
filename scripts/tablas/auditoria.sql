
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

DROP TRIGGER IF EXISTS "auditoria_insert_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_update_smtp_config" ON "SMTP_config";
DROP TRIGGER IF EXISTS "auditoria_delete_smtp_config" ON "SMTP_config";

DROP TRIGGER IF EXISTS "auditoria_insert_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_update_imap_config" ON "IMAP_config";
DROP TRIGGER IF EXISTS "auditoria_delete_imap_config" ON "IMAP_config";

DROP TRIGGER IF EXISTS "auditoria_insert_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_update_mails" ON "Mails";
DROP TRIGGER IF EXISTS "auditoria_delete_mails" ON "Mails";

-- Eliminar tabla de auditoría
DROP TABLE IF EXISTS "Auditoria" ;

CREATE TABLE "Auditoria" (
    "id_auditoria" SERIAL PRIMARY KEY,
    "fecha_hora" TIMESTAMP NOT NULL,
    "usuario" VARCHAR(255) NOT NULL,
    "accion" VARCHAR(255) NOT NULL,
    "tabla" VARCHAR(255) NOT NULL,
    "registro" JSONB NOT NULL
);

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

