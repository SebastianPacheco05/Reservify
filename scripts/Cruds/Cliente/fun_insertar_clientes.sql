CREATE OR REPLACE FUNCTION insertar_clientes(
    p_id_cliente INT,
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_nombre2 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_apellido2 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Cliente" (id_cliente, id_credencial, nombre1, nombre2, apellido1, apellido2, tipo_documento, documento, nacionalidad, telefono, id_rol)
    VALUES (p_id_cliente, p_id_credencial, p_nombre1, p_nombre2, p_apellido1, p_apellido2, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol);
END;
$$ LANGUAGE plpgsql;
