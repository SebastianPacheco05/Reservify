/*
 * Migración: insertar_restaurante acepta url_imagen (imagen principal Cloudinary).
 * Función para insertar imágenes de referencia (máx. 15 por NIT).
 * Ejecutar después de imagenes_referencia_restaurante.sql
 */

-- Actualizar función insertar_restaurante para recibir url_imagen
CREATE OR REPLACE FUNCTION insertar_restaurante(
    p_nit DECIMAL(10, 0),
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(50),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento DECIMAL(10, 0),
    p_id_categoria INT,
    p_url_imagen VARCHAR DEFAULT ''
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Restaurante" (nit, direccion, nombre_restaurante, descripcion_restaurante, rating, reviews, availabletoday, horario_apertura, horario_cierre, documento, id_categoria, url_image)
    VALUES (
        p_nit, p_direccion, p_nombre_restaurante, p_descripcion_restaurante,
        0, 0, TRUE, p_horario_apertura, p_horario_cierre, p_documento, p_id_categoria,
        COALESCE(NULLIF(TRIM(p_url_imagen), ''), '')
    );
END;
$$ LANGUAGE plpgsql;

-- Función para insertar una imagen de referencia (orden 0..14; el trigger limita a 15)
CREATE OR REPLACE FUNCTION insertar_imagen_referencia_restaurante(
    p_nit DECIMAL(10, 0),
    p_url_imagen VARCHAR,
    p_orden INT DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Imagen_referencia_restaurante" (nit, url_imagen, orden)
    VALUES (p_nit, p_url_imagen, p_orden);
END;
$$ LANGUAGE plpgsql;
