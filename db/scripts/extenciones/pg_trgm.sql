CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT set_limit(0.2); -- Permite configurar el umbral de similitud de toda la extencion

-- Crea un índice para la columna nombre_restaurante de la tabla Restaurante
CREATE INDEX idx_restaurante_nombre_trgm
ON "Restaurante"
USING gin (nombre_restaurante gin_trgm_ops); -- Crea un índice para la columna nombre_restaurante
