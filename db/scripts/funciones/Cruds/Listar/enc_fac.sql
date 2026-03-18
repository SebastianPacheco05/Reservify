CREATE OR REPLACE FUNCTION get_encabezado_factura_by_id(p_id_encab_fact INTEGER)
RETURNS TABLE (
    nit NUMERIC,
    nombre_restaurante VARCHAR,
    direccion VARCHAR,
    ciudad VARCHAR,
    fecha DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT nit, nombre_restaurante, direccion, ciudad, fecha
    FROM "Encabezado_Factura"
    WHERE id_encab_fact = p_id_encab_fact;
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

CREATE OR REPLACE FUNCTION list_encabezado_factura()
RETURNS TABLE (
    id_encab_fact INTEGER,
    nit NUMERIC,
    nombre_restaurante VARCHAR,
    direccion VARCHAR,
    ciudad VARCHAR,
    fecha DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id_encab_fact, nit, nombre_restaurante, direccion, ciudad, fecha
    FROM "Encabezado_Factura";
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