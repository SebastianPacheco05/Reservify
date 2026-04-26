-- Funciones SQL para listados "top", rankings, etc.
-- Archivo original: db/scripts/funciones/top.sql

CREATE OR REPLACE FUNCTION fn_top_obtener_top_restaurantes(
    p_limit INT
)
RETURNS TABLE (
    restaurante_uid UUID,
    nit NUMERIC(20,0),
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    rating DECIMAL,
    reviews INT,
    availabletoday BOOLEAN,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC(20,0),
    url_image VARCHAR,
    nombre_categoria VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_url_expr TEXT;
    v_disp_expr TEXT;
    v_sql TEXT;
BEGIN
    -- Compatibilidad con motores donde el nombre de columnas puede variar.
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'url_image'
    ) THEN
        v_url_expr := 'COALESCE(r.url_image, '''')';
    ELSIF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'url_imagen'
    ) THEN
        v_url_expr := 'COALESCE(r.url_imagen, '''')';
    ELSE
        v_url_expr := '''''::VARCHAR';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'availabletoday'
    ) THEN
        v_disp_expr := 'r.availabletoday';
    ELSE
        v_disp_expr := 'TRUE';
    END IF;

    v_sql := format(
        'SELECT
            r.restaurante_uid::UUID AS restaurante_uid,
            r.nit::NUMERIC(20,0),
            r.direccion::VARCHAR,
            r.nombre_restaurante::VARCHAR,
            r.rating::DECIMAL,
            r.reviews::INT,
            (%s)::BOOLEAN AS availabletoday,
            r.horario_apertura::TIME,
            r.horario_cierre::TIME,
            r.documento::NUMERIC(20,0),
            (%s)::VARCHAR AS url_image,
            c.nombre_categoria::VARCHAR
        FROM "Restaurante" r
        LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
        ORDER BY r.rating DESC, r.reviews DESC
        LIMIT LEAST(GREATEST(COALESCE($1, 9), 1), 50)',
        v_disp_expr,
        v_url_expr
    );

    RETURN QUERY EXECUTE v_sql USING p_limit;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION 'fn_top_obtener_top_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION 'fn_top_obtener_top_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN data_exception THEN
        RAISE EXCEPTION 'fn_top_obtener_top_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'fn_top_obtener_top_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
END;
$$;


CREATE OR REPLACE FUNCTION fn_top_contar_restaurantes(
    p_query VARCHAR DEFAULT ''
)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_query VARCHAR := COALESCE(BTRIM(p_query), '');
BEGIN
    RETURN (
        SELECT COUNT(r.nit)::BIGINT
        FROM "Restaurante" r
        LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
        WHERE (
            v_query = ''
            OR LOWER(r.nombre_restaurante) LIKE LOWER('%' || v_query || '%')
            OR LOWER(COALESCE(c.nombre_categoria, '')) LIKE LOWER('%' || v_query || '%')
            OR LOWER(COALESCE(r.descripcion_restaurante, '')) LIKE LOWER('%' || v_query || '%')
        )
    );
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION 'fn_top_contar_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION 'fn_top_contar_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN data_exception THEN
        RAISE EXCEPTION 'fn_top_contar_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'fn_top_contar_restaurantes -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
END;
$$;


CREATE OR REPLACE FUNCTION fn_top_obtener_restaurantes_paginados(
    p_query VARCHAR DEFAULT '',
    p_limit INT DEFAULT 30,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    restaurante_uid UUID,
    nit NUMERIC(20,0),
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    rating DECIMAL,
    reviews INT,
    availabletoday BOOLEAN,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC(20,0),
    url_image VARCHAR,
    descripcion_restaurante TEXT,
    nombre_categoria VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_query VARCHAR := COALESCE(BTRIM(p_query), '');
    v_url_expr TEXT;
    v_disp_expr TEXT;
    v_desc_expr TEXT;
    v_sql TEXT;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'url_image'
    ) THEN
        v_url_expr := 'COALESCE(r.url_image, '''')';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'url_imagen'
    ) THEN
        v_url_expr := 'COALESCE(r.url_imagen, '''')';
    ELSE
        v_url_expr := '''''::VARCHAR';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'availabletoday'
    ) THEN
        v_disp_expr := 'r.availabletoday';
    ELSE
        v_disp_expr := 'TRUE';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Restaurante' AND column_name = 'descripcion_restaurante'
    ) THEN
        v_desc_expr := 'COALESCE(r.descripcion_restaurante, '''')';
    ELSE
        v_desc_expr := '''''::TEXT';
    END IF;

    v_sql := format(
        'SELECT
            r.restaurante_uid::UUID AS restaurante_uid,
            r.nit::NUMERIC(20,0),
            r.direccion::VARCHAR,
            r.nombre_restaurante::VARCHAR,
            r.rating::DECIMAL,
            r.reviews::INT,
            (%s)::BOOLEAN AS availabletoday,
            r.horario_apertura::TIME,
            r.horario_cierre::TIME,
            r.documento::NUMERIC(20,0),
            (%s)::VARCHAR AS url_image,
            (%s)::TEXT AS descripcion_restaurante,
            c.nombre_categoria::VARCHAR
        FROM "Restaurante" r
        LEFT JOIN "Categorias" c ON c.id_categoria = r.id_categoria
        WHERE (
            $1 = ''''
            OR LOWER(r.nombre_restaurante) LIKE LOWER(''%%'' || $1 || ''%%'')
            OR LOWER(COALESCE(c.nombre_categoria, '''')) LIKE LOWER(''%%'' || $1 || ''%%'')
            OR LOWER(%s) LIKE LOWER(''%%'' || $1 || ''%%'')
        )
        ORDER BY r.rating DESC, r.reviews DESC, r.nombre_restaurante ASC
        LIMIT LEAST(GREATEST(COALESCE($2, 30), 1), 50)
        OFFSET GREATEST(COALESCE($3, 0), 0)',
        v_disp_expr,
        v_url_expr,
        v_desc_expr,
        v_desc_expr
    );

    RETURN QUERY EXECUTE v_sql USING v_query, p_limit, p_offset;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION 'fn_top_obtener_restaurantes_paginados -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION 'fn_top_obtener_restaurantes_paginados -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN data_exception THEN
        RAISE EXCEPTION 'fn_top_obtener_restaurantes_paginados -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'fn_top_obtener_restaurantes_paginados -> % (SQLSTATE=%)', SQLERRM, SQLSTATE;
END;
$$;

