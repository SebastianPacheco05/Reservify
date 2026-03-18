-- BÃºsqueda de restaurantes por nombre usando similarity()
-- Archivo original: db/scripts/funciones/filters.sql

CREATE OR REPLACE FUNCTION fn_filters_busqueda_restaurante(
    p_nombre_restaurante VARCHAR
)
RETURNS TABLE (
    nombre_restaurante VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT nombre_restaurante
    FROM "Restaurante"
    WHERE similarity(nombre_restaurante, p_nombre_restaurante) > 0.2
    ORDER BY similarity(nombre_restaurante, p_nombre_restaurante) DESC;
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

