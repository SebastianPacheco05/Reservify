-- Tabla MAPA: coordenadas en el mapa para cada restaurante (1:1 con Restaurante).
-- Permite colocar todos los restaurantes en el mapa con lat/lng reales.
-- Si un restaurante no tiene fila en MAPA, el backend puede usar coordenadas por defecto o omitirlo.

CREATE TABLE IF NOT EXISTS "MAPA" (
    nit DECIMAL(10, 0) NOT NULL PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

COMMENT ON TABLE "MAPA" IS 'Coordenadas GPS (lat, lng) para mostrar cada restaurante en el mapa';
