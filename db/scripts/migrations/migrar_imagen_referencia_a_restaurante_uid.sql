-- Migración: Imagen_referencia_restaurante deja de usar nit y pasa a restaurante_uid (FK a Restaurante)
--
-- Objetivo:
-- 1) Añadir restaurante_uid, rellenar desde "Restaurante" por nit (si existía nit)
-- 2) Quitar PK/FK/columna nit y dejar PK (restaurante_uid, orden)
-- 3) Actualizar trigger de máximo 15 imágenes y función insertar_imagen_referencia_restaurante
--
-- Prerrequisito: "Restaurante".restaurante_uid existe y está poblado (migrar_restaurante_pk_uuid.sql).
--
-- Ejecución:
--   psql "postgresql://..." -f db/scripts/migrar_imagen_referencia_a_restaurante_uid.sql

DROP TRIGGER IF EXISTS trigger_max_imagenes_ref ON "Imagen_referencia_restaurante";

ALTER TABLE "Imagen_referencia_restaurante"
    ADD COLUMN IF NOT EXISTS restaurante_uid UUID;

DO $$
DECLARE
    tiene_nit boolean;
    pkname text;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
          AND c.relname = 'Imagen_referencia_restaurante'
          AND a.attname = 'nit'
          AND a.attnum > 0
          AND NOT a.attisdropped
    ) INTO tiene_nit;

    IF tiene_nit THEN
        UPDATE "Imagen_referencia_restaurante" i
        SET restaurante_uid = r.restaurante_uid
        FROM "Restaurante" r
        WHERE i.nit = r.nit
          AND (i.restaurante_uid IS NULL OR i.restaurante_uid IS DISTINCT FROM r.restaurante_uid);

        IF EXISTS (SELECT 1 FROM "Imagen_referencia_restaurante" WHERE restaurante_uid IS NULL) THEN
            RAISE EXCEPTION 'migrar_imagen_referencia_a_restaurante_uid: hay filas sin restaurante_uid (nit sin coincidencia en Restaurante).';
        END IF;

        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'Imagen_referencia_restaurante_nit_fkey'
              AND conrelid = '"Imagen_referencia_restaurante"'::regclass
        ) THEN
            ALTER TABLE "Imagen_referencia_restaurante" DROP CONSTRAINT "Imagen_referencia_restaurante_nit_fkey";
        END IF;

        SELECT con.conname INTO pkname
        FROM pg_constraint con
        JOIN pg_class c ON c.oid = con.conrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relname = 'Imagen_referencia_restaurante'
          AND con.contype = 'p'
        LIMIT 1;

        IF pkname IS NOT NULL THEN
            EXECUTE format('ALTER TABLE "Imagen_referencia_restaurante" DROP CONSTRAINT %I', pkname);
        END IF;

        ALTER TABLE "Imagen_referencia_restaurante" DROP COLUMN nit;

        ALTER TABLE "Imagen_referencia_restaurante"
            ALTER COLUMN restaurante_uid SET NOT NULL;

        ALTER TABLE "Imagen_referencia_restaurante"
            ADD CONSTRAINT "Imagen_referencia_restaurante_pkey" PRIMARY KEY (restaurante_uid, orden);

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'Imagen_referencia_restaurante_restaurante_uid_fkey'
              AND conrelid = '"Imagen_referencia_restaurante"'::regclass
        ) THEN
            ALTER TABLE "Imagen_referencia_restaurante"
                ADD CONSTRAINT "Imagen_referencia_restaurante_restaurante_uid_fkey"
                FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE;
        END IF;
    ELSE
        RAISE NOTICE 'migrar_imagen_referencia_a_restaurante_uid: columna nit ausente; se asume esquema ya en restaurante_uid.';
    END IF;
END $$;

DROP INDEX IF EXISTS idx_imagen_ref_nit;
CREATE INDEX IF NOT EXISTS idx_imagen_ref_restaurante_uid ON "Imagen_referencia_restaurante" (restaurante_uid);

CREATE OR REPLACE FUNCTION verificar_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total_imagenes INT;
BEGIN
    SELECT COUNT(*) INTO total_imagenes
    FROM "Imagen_referencia_restaurante"
    WHERE restaurante_uid = NEW.restaurante_uid;

    IF total_imagenes >= 15 THEN
        RAISE EXCEPTION 'Máximo 15 imágenes de referencia por restaurante';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_imagenes_ref
    BEFORE INSERT ON "Imagen_referencia_restaurante"
    FOR EACH ROW
    EXECUTE FUNCTION verificar_max_imagenes_referencia();

CREATE OR REPLACE FUNCTION insertar_imagen_referencia_restaurante(
    p_restaurante_uid UUID,
    p_url_imagen VARCHAR,
    p_orden INT DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Imagen_referencia_restaurante" (restaurante_uid, url_imagen, orden)
    VALUES (p_restaurante_uid, p_url_imagen, p_orden);
END;
$$ LANGUAGE plpgsql;
