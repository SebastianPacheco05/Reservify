-- Incluye url_imagen (imagen principal, p. ej. Cloudinary). Para imÃ¡genes de referencia usar tabla Imagen_referencia_restaurante.
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
        RAISE EXCEPTION 'Cuando el horario cruza medianoche, la duración máxima permitida es de 8 horas.';
    END IF;

    INSERT INTO "Restaurante" (nit, direccion, nombre_restaurante, descripcion_restaurante, rating, reviews, availabletoday, horario_apertura, horario_cierre, documento, id_categoria, url_image)
    VALUES (p_nit, p_direccion, p_nombre_restaurante, p_descripcion_restaurante, 0, 0, TRUE, p_horario_apertura, p_horario_cierre, p_documento, p_id_categoria, COALESCE(NULLIF(TRIM(p_url_imagen), ''), ''));
END;
$$ LANGUAGE plpgsql;
