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
    INSERT INTO "Dueno" (documento, tipo_documento, nombre, apellido, id_rol, id_credencial)
    VALUES (p_documento, p_tipo_documento, p_nombre, p_apellido, p_id_rol, p_id_credencial);
END;
$$ LANGUAGE plpgsql;
