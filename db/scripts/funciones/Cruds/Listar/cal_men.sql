CREATE OR REPLACE FUNCTION get_calculo_mensual_by_id(p_id_calculo INTEGER)
RETURNS TABLE (
    nit NUMERIC,
    mes INTEGER,
    anio INTEGER,
    total_reservas INTEGER,
    revenue NUMERIC,
    total_clientes INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT nit, mes, anio, total_reservas, revenue, total_clientes
    FROM "Calculos_mensuales"
    WHERE id_calculo = p_id_calculo;
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

CREATE OR REPLACE FUNCTION list_calculos_mensuales()
RETURNS TABLE (
    id_calculo INTEGER,
    nit NUMERIC,
    mes INTEGER,
    anio INTEGER,
    total_reservas INTEGER,
    revenue NUMERIC,
    total_clientes INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id_calculo, nit, mes, anio, total_reservas, revenue, total_clientes
    FROM "Calculos_mensuales";
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
