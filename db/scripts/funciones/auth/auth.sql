-- Funciones SQL para autenticaciÃ³n y gestiÃ³n de tokens JWT
-- Este archivo centraliza la lÃ³gica de acceso a datos usada por
-- backend/functions/auth/*

-- Obtener credenciales por email (login)
CREATE OR REPLACE FUNCTION fn_auth_get_credenciales_by_email(p_email VARCHAR)
RETURNS TABLE (
    id_credencial INT,
    email VARCHAR,
    password VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id_credencial, c.email, c.password
    FROM "Credenciales" c
    WHERE LOWER(c.email) = LOWER(p_email);
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


-- Actualizar contraseÃ±a de una credencial
CREATE OR REPLACE FUNCTION fn_auth_update_password(
    p_id_credencial INT,
    p_password VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Credenciales"
    SET password = p_password
    WHERE id_credencial = p_id_credencial;
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


-- Insertar una nueva sesiÃ³n JWT (access + refresh token)
CREATE OR REPLACE FUNCTION fn_auth_insert_jwt_session(
    p_id_credencial INT,
    p_token TEXT,
    p_refresh_token TEXT,
    p_issued_at TIMESTAMP,
    p_expires_at TIMESTAMP,
    p_refresh_expires_at TIMESTAMP,
    p_user_agent TEXT,
    p_ip_address TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "jwt_tokens" (
        id_credencial,
        token,
        refresh_token,
        issued_at,
        expires_at,
        refresh_expires_at,
        revoked,
        user_agent,
        ip_address,
        created_at,
        updated_at
    ) VALUES (
        p_id_credencial,
        p_token,
        p_refresh_token,
        p_issued_at,
        p_expires_at,
        p_refresh_expires_at,
        FALSE,
        COALESCE(p_user_agent, 'sin dato'),
        COALESCE(p_ip_address, 'sin dato'),
        NOW(),
        NOW()
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


-- Obtener documento y rol de usuario a partir de id_credencial
CREATE OR REPLACE FUNCTION fn_auth_get_usuario_documento_y_rol(
    p_id_credencial INT
)
RETURNS TABLE (
    documento NUMERIC(10, 0),
    nombre_rol VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT u.documento, r.nombre_rol
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
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


-- Obtener id_rol y nombre_rol de un usuario (usado por get_user_role.py)
CREATE OR REPLACE FUNCTION fn_auth_get_usuario_rol(
    p_id_credencial INT
)
RETURNS TABLE (
    id_rol INT,
    nombre_rol VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id_rol, r.nombre_rol
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
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


CREATE OR REPLACE FUNCTION fn_auth_get_jwt_token_status(
    p_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_revoked BOOLEAN;
BEGIN
    SELECT COALESCE(
        (
            SELECT jt.revoked
            FROM "jwt_tokens" jt
            WHERE jt.token = p_token
        ),
        TRUE
    )
    INTO v_revoked;

    RETURN v_revoked;
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


-- Obtener sesiÃ³n por refresh_token (renovaciÃ³n de token)
CREATE OR REPLACE FUNCTION fn_auth_get_session_by_refresh_token(
    p_refresh_token TEXT
)
RETURNS TABLE (
    id_credencial INT,
    revoked BOOLEAN,
    refresh_expires_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT id_credencial, revoked, refresh_expires_at
    FROM "jwt_tokens"
    WHERE refresh_token = p_refresh_token;
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


-- Actualizar access token asociado a un refresh_token
CREATE OR REPLACE FUNCTION fn_auth_update_jwt_token(
    p_refresh_token TEXT,
    p_new_token TEXT,
    p_expires_at TIMESTAMP,
    p_issued_at TIMESTAMP
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "jwt_tokens"
    SET token = p_new_token,
        expires_at = p_expires_at,
        issued_at = p_issued_at,
        updated_at = NOW()
    WHERE refresh_token = p_refresh_token;
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


-- Obtener id_credencial por email (util para recuperaciÃ³n de contraseÃ±a)
CREATE OR REPLACE FUNCTION fn_auth_get_credencial_id_by_email(p_email VARCHAR)
RETURNS INT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_id INT;
BEGIN
    SELECT c.id_credencial
    INTO v_id
    FROM "Credenciales" c
    WHERE LOWER(c.email) = LOWER(p_email)
    LIMIT 1;

    RETURN v_id;
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


-- Insertar cÃ³digo de recuperaciÃ³n y devolver el id generado
CREATE OR REPLACE FUNCTION fn_auth_insert_password_reset_code(
    p_id_credencial INT,
    p_code_hash VARCHAR,
    p_expires_at TIMESTAMP
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO "Password_Reset_Codes"(id_credencial, code_hash, expires_at, used)
    VALUES (p_id_credencial, p_code_hash, p_expires_at, FALSE)
    RETURNING id INTO v_id;

    RETURN v_id;
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

