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
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_credenciales"
AFTER UPDATE ON "Credenciales"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_credenciales"
AFTER DELETE ON "Credenciales"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_roles"
AFTER INSERT ON "Roles"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_roles"
AFTER UPDATE ON "Roles"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_roles"
AFTER DELETE ON "Roles"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_dueño"
AFTER INSERT ON "Dueño"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";    

CREATE TRIGGER "auditoria_update_dueño"
AFTER UPDATE ON "Dueño"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_dueño"
AFTER DELETE ON "Dueño"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_restaurante"
AFTER INSERT ON "Restaurante"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_restaurante"
AFTER UPDATE ON "Restaurante"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_restaurante"
AFTER DELETE ON "Restaurante"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_mesas"
AFTER INSERT ON "Mesas"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_mesas"
AFTER UPDATE ON "Mesas"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_mesas"
AFTER DELETE ON "Mesas"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_cliente"
AFTER INSERT ON "Cliente"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_cliente"
AFTER UPDATE ON "Cliente"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_cliente"
AFTER DELETE ON "Cliente"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_empleado"
AFTER INSERT ON "Empleado"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_empleado"
AFTER UPDATE ON "Empleado"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_empleado"
AFTER DELETE ON "Empleado"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_encabezado_factura"
AFTER INSERT ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_encabezado_factura"
AFTER UPDATE ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_encabezado_factura"
AFTER DELETE ON "Encabezado_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_detalle_factura"
AFTER INSERT ON "Detalle_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_detalle_factura"
AFTER UPDATE ON "Detalle_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_detalle_factura"
AFTER DELETE ON "Detalle_Factura"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";

CREATE TRIGGER "auditoria_insert_reserva"
AFTER INSERT ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_insert_trigger";

CREATE TRIGGER "auditoria_update_reserva"
AFTER UPDATE ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_update_trigger";

CREATE TRIGGER "auditoria_delete_reserva"
AFTER DELETE ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION "auditoria_delete_trigger";



























