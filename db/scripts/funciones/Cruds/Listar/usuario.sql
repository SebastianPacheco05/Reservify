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
    SELECT
        id_credencial::INTEGER,
        nombre::VARCHAR,
        apellido::VARCHAR,
        tipo_documento::VARCHAR,
        documento::NUMERIC,
        nacionalidad::VARCHAR,
        telefono::VARCHAR,
        id_rol::INTEGER,
        nit::NUMERIC
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
    SELECT
        id_credencial::INTEGER,
        nombre::VARCHAR,
        apellido::VARCHAR,
        tipo_documento::VARCHAR,
        documento::NUMERIC,
        nacionalidad::VARCHAR,
        telefono::VARCHAR,
        id_rol::INTEGER,
        nit::NUMERIC
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


CREATE OR REPLACE FUNCTION get_usuario_by_id_credencial(p_id_credencial INTEGER)
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER,
    nit NUMERIC,
    email VARCHAR
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id_credencial::INTEGER,
        u.nombre::VARCHAR,
        u.apellido::VARCHAR,
        u.tipo_documento::VARCHAR,
        u.documento::NUMERIC,
        u.nacionalidad::VARCHAR,
        u.telefono::VARCHAR,
        u.id_rol::INTEGER,
        u.nit::NUMERIC,
        c.email::VARCHAR
    FROM "Usuario" u
    JOIN "Credenciales" c ON u.id_credencial = c.id_credencial
    WHERE u.id_credencial = p_id_credencial;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION list_usuarios_por_rol(p_nombre_rol VARCHAR)
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
DECLARE
    v_nombre_rol VARCHAR := REPLACE(LOWER(TRIM(COALESCE(p_nombre_rol, ''))), 'ñ', 'n');
BEGIN
    RETURN QUERY
    SELECT
        u.id_credencial::INTEGER,
        u.nombre::VARCHAR,
        u.apellido::VARCHAR,
        u.tipo_documento::VARCHAR,
        u.documento::NUMERIC,
        u.nacionalidad::VARCHAR,
        u.telefono::VARCHAR,
        u.id_rol::INTEGER,
        u.nit::NUMERIC
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
    WHERE REPLACE(LOWER(TRIM(r.nombre_rol)), 'ñ', 'n') = v_nombre_rol;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;
