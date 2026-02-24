-- Agrega columna de antelación mínima (en horas) a la tabla Restaurante
ALTER TABLE "Restaurante"
ADD COLUMN IF NOT EXISTS min_anticipacion_horas INT NOT NULL DEFAULT 0 CHECK (min_anticipacion_horas >= 0);


