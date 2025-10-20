CREATE OR REPLACE FUNCTION insertar_empleado(
    p_id_credencial INT,
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_nit INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Empleado" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit)
    VALUES (p_id_credencial, p_nombre, p_apellido, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol, p_nit);
END;
$$ LANGUAGE plpgsql;
