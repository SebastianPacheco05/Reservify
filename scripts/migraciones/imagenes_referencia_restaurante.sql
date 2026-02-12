/*
 * Creación de la tabla Imagen_referencia_restaurante
 * Almacena hasta 15 imágenes de referencia por restaurante
 * Este script debe ejecutarse ANTES de restaurante_url_imagen_e_imagenes_ref.sql
 */

-- Crear tabla de imágenes de referencia
CREATE TABLE IF NOT EXISTS "Imagen_referencia_restaurante" (
    nit DECIMAL(10, 0) NOT NULL,
    url_imagen VARCHAR NOT NULL,
    orden INT NOT NULL DEFAULT 0 CHECK (orden >= 0 AND orden < 15),
    PRIMARY KEY (nit, orden),
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Crear índice para búsquedas rápidas por NIT
CREATE INDEX IF NOT EXISTS idx_imagen_ref_nit ON "Imagen_referencia_restaurante" (nit);

-- Trigger para limitar a 15 imágenes por restaurante
CREATE OR REPLACE FUNCTION verificar_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total_imagenes INT;
BEGIN
    SELECT COUNT(*) INTO total_imagenes
    FROM "Imagen_referencia_restaurante"
    WHERE nit = NEW.nit;
    
    IF total_imagenes >= 15 THEN
        RAISE EXCEPTION 'Máximo 15 imágenes de referencia por restaurante';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger solo si no existe
DROP TRIGGER IF EXISTS trigger_max_imagenes_ref ON "Imagen_referencia_restaurante";
CREATE TRIGGER trigger_max_imagenes_ref
    BEFORE INSERT ON "Imagen_referencia_restaurante"
    FOR EACH ROW
    EXECUTE FUNCTION verificar_max_imagenes_referencia();

-- Comentarios para documentación
COMMENT ON TABLE "Imagen_referencia_restaurante" IS 'Almacena imágenes de referencia de restaurantes (máximo 15 por NIT)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".nit IS 'NIT del restaurante';
COMMENT ON COLUMN "Imagen_referencia_restaurante".url_imagen IS 'URL de la imagen (Cloudinary)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".orden IS 'Orden de la imagen (0-14)';

-- Mensaje de confirmación
SELECT 'Tabla Imagen_referencia_restaurante creada exitosamente' AS status;
