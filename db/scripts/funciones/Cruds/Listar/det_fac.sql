CREATE OR REPLACE FUNCTION get_detalle_factura_by_id(p_id_det_fact INTEGER)
RETURNS TABLE (
    descripcion VARCHAR,
    unidades INTEGER,
    precio_unitario NUMERIC,
    precio_total NUMERIC,
    forma_pago VARCHAR,
    id_encab_fact INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        descripcion::VARCHAR,
        unidades::INTEGER,
        precio_unitario::NUMERIC,
        precio_total::NUMERIC,
        forma_pago::VARCHAR,
        id_encab_fact::INTEGER
    FROM "Detalle_Factura"
    WHERE id_det_fact = p_id_det_fact;
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


CREATE OR REPLACE FUNCTION list_detalles_factura()
RETURNS TABLE (
    id_det_fact INTEGER,
    descripcion VARCHAR,
    unidades INTEGER,
    precio_unitario NUMERIC,
    precio_total NUMERIC,
    forma_pago VARCHAR,
    id_encab_fact INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        id_det_fact::INTEGER,
        descripcion::VARCHAR,
        unidades::INTEGER,
        precio_unitario::NUMERIC,
        precio_total::NUMERIC,
        forma_pago::VARCHAR,
        id_encab_fact::INTEGER
    FROM "Detalle_Factura";
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
