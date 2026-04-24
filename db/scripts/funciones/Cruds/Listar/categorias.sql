CREATE OR REPLACE FUNCTION get_categoria_by_id(p_id_categoria INTEGER)
RETURNS TABLE (
    nombre_categoria VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT c.nombre_categoria::VARCHAR
    FROM "Categorias" c
    WHERE c.id_categoria = p_id_categoria;
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

CREATE OR REPLACE FUNCTION list_categorias()
RETURNS TABLE (
    id_categoria INTEGER,
    nombre_categoria VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id_categoria::INTEGER, c.nombre_categoria::VARCHAR
    FROM "Categorias" c;
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


CREATE OR REPLACE FUNCTION list_categorias_mas_usadas(p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id_categoria INTEGER,
    nombre_categoria VARCHAR,
    usos BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id_categoria::INTEGER,
        c.nombre_categoria::VARCHAR,
        COUNT(r.nit)::BIGINT AS usos
    FROM "Categorias" c
    LEFT JOIN "Restaurante" r ON r.id_categoria = c.id_categoria
    GROUP BY c.id_categoria, c.nombre_categoria
    ORDER BY usos DESC, c.nombre_categoria
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 20), 1), 100);
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