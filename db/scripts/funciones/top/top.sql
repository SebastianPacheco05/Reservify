-- Funciones SQL para listados "top", rankings, etc.
-- Archivo original: db/scripts/funciones/top.sql

CREATE OR REPLACE FUNCTION fn_top_obtener_top_restaurantes(
    p_limit INT
)
RETURNS TABLE (
    nit DECIMAL(10,0),
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    rating DECIMAL,
    reviews INT,
    availabletoday BOOLEAN,
    horario_apertura TIME,
    horario_cierre TIME,
    documento DECIMAL(10,0),
    url_image VARCHAR,
    nombre_categoria VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.nit,
        r.direccion,
        r.nombre_restaurante,
        r.rating,
        r.reviews,
        r.availableToday,
        r.horario_apertura,
        r.horario_cierre,
        r.documento,
        r.url_image,
        c.nombre_categoria
    FROM "Restaurante" r
    INNER JOIN "Categorias" c ON c.id_categoria = r.id_categoria
    ORDER BY r.reviews DESC
    LIMIT p_limit;
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

