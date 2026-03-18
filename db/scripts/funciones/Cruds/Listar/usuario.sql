CREATE OR REPLACE FUNCTION list_usuarios()
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER,
    nit NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit
    FROM "Usuario";
EXCEPTION
    WHEN SQLSTATE '42P01' THEN -- undefined_table
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN -- undefined_column
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;

CREATE OR REPLACE FUNCTION get_usuario_by_documento(p_documento NUMERIC)
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER,
    nit NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit
    FROM "Usuario"
    WHERE documento = p_documento;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN -- undefined_table
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN -- undefined_column
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;
