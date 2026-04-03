-- Migracion: ampliar direccion de Restaurante y alinear firmas de funciones CRUD
--
-- Objetivo:
-- 1) Evitar error "value too long for type character varying(50)" en direcciones
-- 2) Alinear funciones insertar_restaurante / editar_restaurante con los limites de tabla
--
-- Ejecucion:
--   psql "postgresql://USER:PASS@HOST:5432/db_reservify" -f db/scripts/migrations/migrar_restaurante_longitudes_y_funciones.sql

ALTER TABLE "Restaurante"
    ALTER COLUMN direccion TYPE VARCHAR(255);

CREATE OR REPLACE FUNCTION insertar_restaurante(
    p_nit DECIMAL(10, 0),
    p_direccion VARCHAR(255),
    p_nombre_restaurante VARCHAR(50),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento DECIMAL(10, 0),
    p_id_categoria INT,
    p_url_imagen VARCHAR DEFAULT ''
) RETURNS VOID AS $$
BEGIN
    IF p_horario_apertura = p_horario_cierre THEN
        RAISE EXCEPTION 'El horario de apertura no puede ser igual al horario de cierre.';
    END IF;

    IF p_horario_apertura > p_horario_cierre
       AND ((p_horario_cierre + INTERVAL '24 hours') - p_horario_apertura) > INTERVAL '8 hours' THEN
        RAISE EXCEPTION 'Cuando el horario cruza medianoche, la duracion maxima permitida es de 8 horas.';
    END IF;

    INSERT INTO "Restaurante" (
        nit, direccion, nombre_restaurante, descripcion_restaurante, rating, reviews,
        availabletoday, horario_apertura, horario_cierre, documento, id_categoria, url_image
    )
    VALUES (
        p_nit, p_direccion, p_nombre_restaurante, p_descripcion_restaurante,
        0, 0, TRUE, p_horario_apertura, p_horario_cierre, p_documento, p_id_categoria,
        COALESCE(NULLIF(TRIM(p_url_imagen), ''), '')
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION editar_restaurante(
    p_restaurante_uid UUID,
    p_nit INT,
    p_direccion VARCHAR(255),
    p_nombre_restaurante VARCHAR(50),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    IF p_horario_apertura = p_horario_cierre THEN
        RAISE EXCEPTION 'El horario de apertura no puede ser igual al horario de cierre.';
    END IF;

    IF p_horario_apertura > p_horario_cierre
       AND ((p_horario_cierre + INTERVAL '24 hours') - p_horario_apertura) > INTERVAL '8 hours' THEN
        RAISE EXCEPTION 'Cuando el horario cruza medianoche, la duracion maxima permitida es de 8 horas.';
    END IF;

    UPDATE "Restaurante"
    SET direccion = p_direccion,
        nombre_restaurante = p_nombre_restaurante,
        descripcion_restaurante = p_descripcion_restaurante,
        horario_apertura = p_horario_apertura,
        horario_cierre = p_horario_cierre,
        documento = p_documento,
        id_categoria = p_id_categoria
    WHERE restaurante_uid = p_restaurante_uid;
END;
$$ LANGUAGE plpgsql;
