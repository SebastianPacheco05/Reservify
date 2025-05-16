CREATE OR REPLACE FUNCTION editar_empleado(
    p_id_empleado INT,
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_nombre2 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_apellido2 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_NIT INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Empleado"
    SET id_credencial = p_id_credencial,
        nombre1 = p_nombre1,
        nombre2 = p_nombre2,
        apellido1 = p_apellido1,
        apellido2 = p_apellido2,
        tipo_documento = p_tipo_documento,
        documento = p_documento,
        nacionalidad = p_nacionalidad,
        telefono = p_telefono,
        id_rol = p_id_rol,
        NIT = p_NIT
    WHERE id_empleado = p_id_empleado;
END;
$$ LANGUAGE plpgsql;
