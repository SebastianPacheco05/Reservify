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
    -- Inserta un nuevo usuario con rol de empleado en la tabla unificada "Usuario"
    INSERT INTO "Usuario" (
        documento,
        tipo_documento,
        nombre,
        apellido,
        id_rol,
        id_credencial,
        nacionalidad,
        telefono,
        nit
    )
    VALUES (
        p_documento,
        p_tipo_documento,
        p_nombre,
        p_apellido,
        p_id_rol,
        p_id_credencial,
        NULLIF(TRIM(p_nacionalidad), ''),
        NULLIF(TRIM(p_telefono), ''),
        p_nit
    );
END;
$$ LANGUAGE plpgsql;
