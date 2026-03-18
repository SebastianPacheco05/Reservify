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