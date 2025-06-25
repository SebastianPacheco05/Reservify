
-- Eliminar triggers existentes (si existen)
DROP TRIGGER IF EXISTS "auditoria_insert_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_update_credenciales" ON "Credenciales";
DROP TRIGGER IF EXISTS "auditoria_delete_credenciales" ON "Credenciales";

DROP TRIGGER IF EXISTS "auditoria_insert_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_update_roles" ON "Roles";
DROP TRIGGER IF EXISTS "auditoria_delete_roles" ON "Roles";

DROP TRIGGER IF EXISTS "auditoria_insert_dueno" ON "Dueno";
DROP TRIGGER IF EXISTS "auditoria_update_dueno" ON "Dueno";
DROP TRIGGER IF EXISTS "auditoria_delete_dueno" ON "Dueno";

DROP TRIGGER IF EXISTS "auditoria_insert_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_update_restaurante" ON "Restaurante";
DROP TRIGGER IF EXISTS "auditoria_delete_restaurante" ON "Restaurante";

DROP TRIGGER IF EXISTS "auditoria_insert_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_update_mesas" ON "Mesas";
DROP TRIGGER IF EXISTS "auditoria_delete_mesas" ON "Mesas";

DROP TRIGGER IF EXISTS "auditoria_insert_cliente" ON "Cliente";
DROP TRIGGER IF EXISTS "auditoria_update_cliente" ON "Cliente";
DROP TRIGGER IF EXISTS "auditoria_delete_cliente" ON "Cliente";

DROP TRIGGER IF EXISTS "auditoria_insert_empleado" ON "Empleado";
DROP TRIGGER IF EXISTS "auditoria_update_empleado" ON "Empleado";
DROP TRIGGER IF EXISTS "auditoria_delete_empleado" ON "Empleado";

DROP TRIGGER IF EXISTS "auditoria_insert_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_update_encabezado_factura" ON "Encabezado_Factura";
DROP TRIGGER IF EXISTS "auditoria_delete_encabezado_factura" ON "Encabezado_Factura";

DROP TRIGGER IF EXISTS "auditoria_insert_detalle_factura" ON "Detalle_Factura";
DROP TRIGGER IF EXISTS "auditoria_update_detalle_factura" ON "Detalle_Factura";
DROP TRIGGER IF EXISTS "auditoria_delete_detalle_factura" ON "Detalle_Factura";

DROP TRIGGER IF EXISTS "auditoria_insert_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_update_reserva" ON "Reserva";
DROP TRIGGER IF EXISTS "auditoria_delete_reserva" ON "Reserva";

DROP TRIGGER IF EXISTS "auditoria_insert_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_update_categoria" ON "Categorias";
DROP TRIGGER IF EXISTS "auditoria_delete_categoria" ON "Categorias";

DROP TRIGGER IF EXISTS "auditoria_insert_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_update_comentario" ON "Comentarios";
DROP TRIGGER IF EXISTS "auditoria_delete_comentario" ON "Comentarios";

-- Eliminar funciones de auditoría
DROP FUNCTION IF EXISTS "auditoria_insert_trigger"() CASCADE;
DROP FUNCTION IF EXISTS "auditoria_update_trigger"() CASCADE;
DROP FUNCTION IF EXISTS "auditoria_delete_trigger"() CASCADE;

-- Eliminar tabla de auditoría
DROP TABLE IF EXISTS "Auditoria" CASCADE;

CREATE TABLE "Auditoria" (
    "id_auditoria" SERIAL PRIMARY KEY,
    "fecha_hora" TIMESTAMP NOT NULL,
    "usuario" VARCHAR(255) NOT NULL,
    "accion" VARCHAR(255) NOT NULL,
    "tabla" VARCHAR(255) NOT NULL,
    "registro" JSONB NOT NULL
);

CREATE FUNCTION "auditoria_insert_trigger"() RETURNS TRIGGER AS $$
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

CREATE FUNCTION "auditoria_update_trigger"() RETURNS TRIGGER AS $$
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

CREATE FUNCTION "auditoria_delete_trigger"() RETURNS TRIGGER AS $$
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
AFTER DELETE ON "Credenciales"
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
AFTER DELETE ON "Roles"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_dueno"
AFTER INSERT ON "Dueno"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();    

CREATE TRIGGER "auditoria_update_dueno"
AFTER UPDATE ON "Dueno"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_dueno"
AFTER DELETE ON "Dueno"
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
AFTER DELETE ON "Restaurante"
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
AFTER DELETE ON "Mesas"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_cliente"
AFTER INSERT ON "Cliente"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_cliente"
AFTER UPDATE ON "Cliente"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_cliente"
AFTER DELETE ON "Cliente"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_empleado"
AFTER INSERT ON "Empleado"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_empleado"
AFTER UPDATE ON "Empleado"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_empleado"
AFTER DELETE ON "Empleado"
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
AFTER DELETE ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_detalle_factura"
AFTER INSERT ON "Detalle_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_detalle_factura"
AFTER UPDATE ON "Detalle_Factura"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_detalle_factura"
AFTER DELETE ON "Detalle_Factura"
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
AFTER DELETE ON "Reserva"
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
AFTER DELETE ON "Categorias"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_cal_mensual"
AFTER INSERT ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_cal_mensual"
AFTER INSERT ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_cal_mensual"
AFTER INSERT ON "Calculos_mensuales"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

CREATE TRIGGER "auditoria_insert_comentario"
AFTER INSERT ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_insert_trigger"();

CREATE TRIGGER "auditoria_update_comentario"
AFTER INSERT ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_update_trigger"();

CREATE TRIGGER "auditoria_delete_comentario"
AFTER INSERT ON "Comentarios"
FOR EACH ROW
EXECUTE PROCEDURE "auditoria_delete_trigger"();

