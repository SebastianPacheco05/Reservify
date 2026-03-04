CREATE OR REPLACE FUNCTION insertar_dueno(
    p_documento DECIMAL,
    p_tipo_documento VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_id_rol INTEGER,
    p_id_credencial INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Inserta un nuevo usuario con rol de dueño en la tabla unificada "Usuario"
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
        NULL,
        NULL,
        NULL
    );
END;
$$ LANGUAGE plpgsql;
