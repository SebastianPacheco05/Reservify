CREATE OR REPLACE FUNCTION list_restaurantes()
RETURNS TABLE (
    nit NUMERIC,
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    descripcion_restaurante VARCHAR,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT nit, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento
    FROM "Restaurante";
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

CREATE OR REPLACE FUNCTION get_restaurante_by_nit(p_nit NUMERIC)
RETURNS TABLE (
    nit NUMERIC,
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    descripcion_restaurante VARCHAR,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT nit, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento
    FROM "Restaurante"
    WHERE nit = p_nit;
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