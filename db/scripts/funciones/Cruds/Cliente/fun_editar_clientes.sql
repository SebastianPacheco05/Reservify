CREATE OR REPLACE FUNCTION editar_clientes(
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
    -- Actualiza datos de un cliente en la tabla unificada "Usuario"
    UPDATE "Usuario"
    SET id_credencial   = p_id_credencial,
        documento       = p_documento,
        nombre          = p_nombre,
        apellido        = p_apellido,
        tipo_documento  = p_tipo_documento,
        nacionalidad    = NULLIF(TRIM(p_nacionalidad), ''),
        telefono        = NULLIF(TRIM(p_telefono), ''),
        id_rol          = p_id_rol,
        nit             = NULL
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
