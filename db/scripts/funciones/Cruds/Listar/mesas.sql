CREATE OR REPLACE FUNCTION list_mesas()
RETURNS TABLE (
    id_mesa INTEGER,
    estado_de_disponibilidad VARCHAR,
    cant_personas INTEGER,
    nit NUMERIC,
    precio NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT id_mesa, estado_de_disponibilidad, cant_personas, nit, precio
    FROM "Mesas";
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

CREATE OR REPLACE FUNCTION get_mesa_by_id(p_id_mesa INTEGER)
RETURNS TABLE (
    estado_de_disponibilidad VARCHAR,
    cant_personas INTEGER,
    nit NUMERIC,
    precio NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT estado_de_disponibilidad, cant_personas, nit, precio
    FROM "Mesas"
    WHERE id_mesa = p_id_mesa;
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


