-- Funciones SQL especÃ­ficas para el registro pÃºblico de usuarios (clientes)
-- Archivo original: db/scripts/funciones/register.sql

CREATE OR REPLACE FUNCTION fn_register_get_rol_normalizado(
    p_id_rol INT
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_rol TEXT;
BEGIN
    SELECT LOWER(TRIM(nombre_rol))
    INTO v_rol
    FROM "Roles"
    WHERE id_rol = p_id_rol;

    RETURN v_rol;
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


CREATE OR REPLACE FUNCTION fn_register_email_existe(
    p_email VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM "Credenciales"
        WHERE email = p_email
    )
    INTO v_existe;

    RETURN v_existe;
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


CREATE OR REPLACE FUNCTION fn_register_insertar_credenciales(
    p_email VARCHAR,
    p_password VARCHAR
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_credencial INT;
BEGIN
    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password)
    RETURNING id_credencial INTO v_id_credencial;

    RETURN v_id_credencial;
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Faltan datos obligatorios.';
    WHEN unique_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Ya existe un registro con esos datos.';
    WHEN check_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_register_insertar_usuario_cliente(
    p_id_credencial INT,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_tipo_documento VARCHAR,
    p_documento DECIMAL,
    p_nacionalidad VARCHAR,
    p_telefono VARCHAR,
    p_id_rol INT,
    p_nit DECIMAL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "Usuario" (
        id_credencial,
        nombre,
        apellido,
        tipo_documento,
        documento,
        nacionalidad,
        telefono,
        id_rol,
        nit
    ) VALUES (
        p_id_credencial,
        p_nombre,
        p_apellido,
        p_tipo_documento,
        p_documento,
        NULLIF(TRIM(p_nacionalidad), ''),
        NULLIF(TRIM(p_telefono), ''),
        p_id_rol,
        p_nit
    );
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Faltan datos obligatorios.';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN unique_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Ya existe un registro con esos datos.';
    WHEN check_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;

