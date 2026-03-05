-- Funciones SQL para autenticación y gestión de tokens JWT
-- Este archivo centraliza la lógica de acceso a datos usada por
-- backend/functions/auth/*

-- Obtener credenciales por email (login)
CREATE OR REPLACE FUNCTION fn_auth_get_credenciales_by_email(p_email VARCHAR)
RETURNS TABLE (
    id_credencial INT,
    email VARCHAR,
    password VARCHAR
)
LANGUAGE sql
STABLE
AS $$
    SELECT c.id_credencial, c.email, c.password
    FROM "Credenciales" c
    WHERE LOWER(c.email) = LOWER(p_email);
$$;


-- Actualizar contraseña de una credencial
CREATE OR REPLACE FUNCTION fn_auth_update_password(
    p_id_credencial INT,
    p_password VARCHAR
)
RETURNS VOID
LANGUAGE sql
AS $$
    UPDATE "Credenciales"
    SET password = p_password
    WHERE id_credencial = p_id_credencial;
$$;


-- Insertar una nueva sesión JWT (access + refresh token)
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
LANGUAGE sql
AS $$
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
$$;


-- Obtener documento y rol de usuario a partir de id_credencial
CREATE OR REPLACE FUNCTION fn_auth_get_usuario_documento_y_rol(
    p_id_credencial INT
)
RETURNS TABLE (
    documento NUMERIC(10, 0),
    nombre_rol VARCHAR
)
LANGUAGE sql
STABLE
AS $$
    SELECT u.documento, r.nombre_rol
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
    WHERE u.id_credencial = p_id_credencial;
$$;


-- Obtener id_rol y nombre_rol de un usuario (usado por get_user_role.py)
CREATE OR REPLACE FUNCTION fn_auth_get_usuario_rol(
    p_id_credencial INT
)
RETURNS TABLE (
    id_rol INT,
    nombre_rol VARCHAR
)
LANGUAGE sql
STABLE
AS $$
    SELECT u.id_rol, r.nombre_rol
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
    WHERE u.id_credencial = p_id_credencial;
$$;


CREATE OR REPLACE FUNCTION fn_auth_get_jwt_token_status(
    p_token TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(
        (
            SELECT jt.revoked
            FROM "jwt_tokens" jt
            WHERE jt.token = p_token
        ),
        TRUE  -- Si no existe el token, se considera revocado
    );
$$;


-- Obtener sesión por refresh_token (renovación de token)
CREATE OR REPLACE FUNCTION fn_auth_get_session_by_refresh_token(
    p_refresh_token TEXT
)
RETURNS TABLE (
    id_credencial INT,
    revoked BOOLEAN,
    refresh_expires_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT id_credencial, revoked, refresh_expires_at
    FROM "jwt_tokens"
    WHERE refresh_token = p_refresh_token;
$$;


-- Actualizar access token asociado a un refresh_token
CREATE OR REPLACE FUNCTION fn_auth_update_jwt_token(
    p_refresh_token TEXT,
    p_new_token TEXT,
    p_expires_at TIMESTAMP,
    p_issued_at TIMESTAMP
)
RETURNS VOID
LANGUAGE sql
AS $$
    UPDATE "jwt_tokens"
    SET token = p_new_token,
        expires_at = p_expires_at,
        issued_at = p_issued_at,
        updated_at = NOW()
    WHERE refresh_token = p_refresh_token;
$$;

