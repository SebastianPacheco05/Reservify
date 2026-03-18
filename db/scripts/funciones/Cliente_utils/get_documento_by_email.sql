-- Archivo original: db/scripts/funciones/get_documento_by_email.sql

CREATE OR REPLACE FUNCTION get_documento_by_email(p_email VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    v_documento DECIMAL;
BEGIN
    SELECT u.documento INTO v_documento
    FROM "Usuario" u
    INNER JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
    WHERE cred.email = p_email;

    IF v_documento IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN v_documento;
EXCEPTION
    -- Evita filtrar errores técnicos al frontend (toast).
    WHEN SQLSTATE '42P01' THEN -- undefined_table
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN -- undefined_column
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
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
$$ LANGUAGE plpgsql;

