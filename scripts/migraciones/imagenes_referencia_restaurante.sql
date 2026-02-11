/*
 * Migración: tabla de imágenes de referencia por restaurante (máximo 15 por NIT).
 * La imagen principal se guarda en Restaurante.url_image (ya existente).
 * Las URLs serán de Cloudinary (CLOUDINARY_URL).
 */

-- Tabla: hasta 15 imágenes de referencia por restaurante
CREATE TABLE IF NOT EXISTS "Imagen_referencia_restaurante" (
    id_imagen_referencia SERIAL PRIMARY KEY NOT NULL,
    nit DECIMAL(10, 0) NOT NULL,
    url_imagen VARCHAR NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_imagen_ref_nit FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_imagen_ref_nit ON "Imagen_referencia_restaurante" (nit);

-- Restricción: máximo 15 imágenes de referencia por restaurante (vía trigger)
CREATE OR REPLACE FUNCTION check_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total INT;
BEGIN
    SELECT COUNT(*) INTO total
    FROM "Imagen_referencia_restaurante"
    WHERE nit = NEW.nit;
    IF total >= 15 THEN
        RAISE EXCEPTION 'Máximo 15 imágenes de referencia por restaurante.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_max_imagenes_referencia ON "Imagen_referencia_restaurante";
CREATE TRIGGER trg_max_imagenes_referencia
    BEFORE INSERT ON "Imagen_referencia_restaurante"
    FOR EACH ROW EXECUTE PROCEDURE check_max_imagenes_referencia();

COMMENT ON TABLE "Imagen_referencia_restaurante" IS 'URLs de imágenes de referencia del restaurante (Cloudinary), máx. 15 por NIT.';
