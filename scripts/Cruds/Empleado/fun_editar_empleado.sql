CREATE OR REPLACE FUNCTION editar_empleado(
    p_documento INT,
    p_id_credencial INT,
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_nit INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Empleado"
    SET id_credencial = p_id_credencial,
        nombre = p_nombre,
        apellido = p_apellido,
        tipo_documento = p_tipo_documento,
        documento = p_documento,
        nacionalidad = p_nacionalidad,
        telefono = p_telefono,
        id_rol = p_id_rol,
        nit = p_nit
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
