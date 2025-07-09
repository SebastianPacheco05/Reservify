CREATE OR REPLACE FUNCTION editar_clientes(
    p_id_cliente INT,
    p_id_credencial INT,
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Cliente"
    SET id_credencial = p_id_credencial,
        nombre = p_nombre,
        apellido = p_apellido,
        tipo_documento = p_tipo_documento,
        documento = p_documento,
        nacionalidad = p_nacionalidad,
        telefono = p_telefono,
        id_rol = p_id_rol
    WHERE id_cliente = p_id_cliente;
END;
$$ LANGUAGE plpgsql;
