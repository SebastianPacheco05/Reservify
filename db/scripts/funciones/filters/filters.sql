-- Búsqueda de restaurantes por nombre usando similarity()
-- Archivo original: db/scripts/funciones/filters.sql

CREATE OR REPLACE FUNCTION fn_filters_busqueda_restaurante(
    p_nombre_restaurante VARCHAR
)
RETURNS TABLE (
    nombre_restaurante VARCHAR
)
LANGUAGE sql
STABLE
AS $$
    SELECT nombre_restaurante
    FROM "Restaurante"
    WHERE similarity(nombre_restaurante, p_nombre_restaurante) > 0.2
    ORDER BY similarity(nombre_restaurante, p_nombre_restaurante) DESC;
$$;

