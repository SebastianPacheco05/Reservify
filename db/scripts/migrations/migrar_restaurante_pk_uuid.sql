-- Migración: Restaurante deja de usar NIT como PK
-- Objetivo:
-- 1) agregar restaurante_uid UUID aleatorio
-- 2) convertir restaurante_uid en PRIMARY KEY
-- 3) mantener nit como UNIQUE (dato de negocio)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "Restaurante"
ADD COLUMN IF NOT EXISTS restaurante_uid UUID;

-- Asegura que futuros inserts generen el UUID automático.
ALTER TABLE "Restaurante"
ALTER COLUMN restaurante_uid SET DEFAULT gen_random_uuid();

UPDATE "Restaurante"
SET restaurante_uid = gen_random_uuid()
WHERE restaurante_uid IS NULL;

ALTER TABLE "Restaurante"
ALTER COLUMN restaurante_uid SET NOT NULL;

-- 1) Primero eliminamos las FK que dependen de la PK vieja.
--    Antes la PK era (nit), por eso estas restricciones apuntaban indirectamente a la PK.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Imagen_referencia_restaurante_nit_fkey'
    ) THEN
        ALTER TABLE "Imagen_referencia_restaurante"
        DROP CONSTRAINT "Imagen_referencia_restaurante_nit_fkey";
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Mesas_nit_fkey'
    ) THEN
        ALTER TABLE "Mesas"
        DROP CONSTRAINT "Mesas_nit_fkey";
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Encabezado_Factura_nit_fkey'
    ) THEN
        ALTER TABLE "Encabezado_Factura"
        DROP CONSTRAINT "Encabezado_Factura_nit_fkey";
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Calculos_mensuales_nit_fkey'
    ) THEN
        ALTER TABLE "Calculos_mensuales"
        DROP CONSTRAINT "Calculos_mensuales_nit_fkey";
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Comentarios_nit_fkey'
    ) THEN
        ALTER TABLE "Comentarios"
        DROP CONSTRAINT "Comentarios_nit_fkey";
    END IF;
END $$;

-- 2) Cambiamos la PK de Restaurante (de nit -> restaurante_uid).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Restaurante_pkey'
          AND conrelid = '"Restaurante"'::regclass
    ) THEN
        ALTER TABLE "Restaurante" DROP CONSTRAINT "Restaurante_pkey";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Restaurante_pkey'
          AND conrelid = '"Restaurante"'::regclass
    ) THEN
        ALTER TABLE "Restaurante" ADD CONSTRAINT "Restaurante_pkey" PRIMARY KEY (restaurante_uid);
    END IF;
END $$;

-- 3) Dejamos nit como UNIQUE para conservar la integridad referencial con las FKs existentes.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'restaurante_nit_key'
          AND conrelid = '"Restaurante"'::regclass
    ) THEN
        ALTER TABLE "Restaurante" ADD CONSTRAINT restaurante_nit_key UNIQUE (nit);
    END IF;
END $$;

-- 4) Recreamos las FK apuntando a Restaurante(nit) (ahora UNIQUE).
--    Nota: en tu caso no es necesario mover las columnas a restaurante_uid todavía.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Imagen_referencia_restaurante_nit_fkey'
    ) THEN
        ALTER TABLE "Imagen_referencia_restaurante"
        ADD CONSTRAINT "Imagen_referencia_restaurante_nit_fkey"
        FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Mesas_nit_fkey'
    ) THEN
        ALTER TABLE "Mesas"
        ADD CONSTRAINT "Mesas_nit_fkey"
        FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Encabezado_Factura_nit_fkey'
    ) THEN
        ALTER TABLE "Encabezado_Factura"
        ADD CONSTRAINT "Encabezado_Factura_nit_fkey"
        FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Calculos_mensuales_nit_fkey'
    ) THEN
        ALTER TABLE "Calculos_mensuales"
        ADD CONSTRAINT "Calculos_mensuales_nit_fkey"
        FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Comentarios_nit_fkey'
    ) THEN
        ALTER TABLE "Comentarios"
        ADD CONSTRAINT "Comentarios_nit_fkey"
        FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
    END IF;
END $$;
