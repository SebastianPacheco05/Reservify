CREATE OR REPLACE FUNCTION insertar_usuario(
    p_id_credencial INT,
    p_nombre VARCHAR(50),
    p_apellido VARCHAR(50),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_nit DECIMAL(10,0) DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Usuario" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit)
    VALUES (p_id_credencial, p_nombre, p_apellido, p_tipo_documento, p_documento, NULLIF(TRIM(p_nacionalidad), ''), NULLIF(TRIM(p_telefono), ''), p_id_rol, p_nit);
END;
$$ LANGUAGE plpgsql;
