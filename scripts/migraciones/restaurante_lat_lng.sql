-- Añade latitud y longitud a la tabla Restaurante para mostrar cada uno en el mapa.
-- Si ya existen las columnas (p. ej. por creacion_tablas.sql nuevo), no hace nada.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Restaurante' AND column_name = 'lat'
    ) THEN
        ALTER TABLE "Restaurante" ADD COLUMN lat DOUBLE PRECISION;
        COMMENT ON COLUMN "Restaurante".lat IS 'Latitud para mostrar el restaurante en el mapa';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Restaurante' AND column_name = 'lng'
    ) THEN
        ALTER TABLE "Restaurante" ADD COLUMN lng DOUBLE PRECISION;
        COMMENT ON COLUMN "Restaurante".lng IS 'Longitud para mostrar el restaurante en el mapa';
    END IF;
END $$;
