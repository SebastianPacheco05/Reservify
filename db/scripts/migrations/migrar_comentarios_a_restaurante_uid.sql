-- Migración: "Comentarios" deja de usar nit y referencia Restaurante por restaurante_uid
--
-- Alinea la tabla con el API público (/comentarios/restaurante/{restaurante_uid}) y las funciones
-- insertar_comentario / existe_comentario del repositorio.
--
-- Prerrequisito: "Restaurante".restaurante_uid (migrar_restaurante_pk_uuid.sql).
--
-- Ejecución:
--   psql "postgresql://..." -f db/scripts/migrar_comentarios_a_restaurante_uid.sql

DO $$
DECLARE
    tiene_nit boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
          AND c.relname = 'Comentarios'
          AND a.attname = 'nit'
          AND a.attnum > 0
          AND NOT a.attisdropped
    ) INTO tiene_nit;

    IF NOT tiene_nit THEN
        RAISE NOTICE 'migrar_comentarios_a_restaurante_uid: sin columna nit; se asume esquema ya en restaurante_uid.';
        RETURN;
    END IF;

    ALTER TABLE "Comentarios"
        ADD COLUMN IF NOT EXISTS restaurante_uid UUID;

    UPDATE "Comentarios" c
    SET restaurante_uid = r.restaurante_uid
    FROM "Restaurante" r
    WHERE c.nit = r.nit
      AND (c.restaurante_uid IS NULL OR c.restaurante_uid IS DISTINCT FROM r.restaurante_uid);

    IF EXISTS (SELECT 1 FROM "Comentarios" WHERE restaurante_uid IS NULL) THEN
        RAISE EXCEPTION 'migrar_comentarios_a_restaurante_uid: hay comentarios sin restaurante_uid (nit huérfano).';
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Comentarios_nit_fkey'
          AND conrelid = '"Comentarios"'::regclass
    ) THEN
        ALTER TABLE "Comentarios" DROP CONSTRAINT "Comentarios_nit_fkey";
    END IF;

    ALTER TABLE "Comentarios" DROP COLUMN nit;

    ALTER TABLE "Comentarios"
        ALTER COLUMN restaurante_uid SET NOT NULL;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Comentarios_restaurante_uid_fkey'
          AND conrelid = '"Comentarios"'::regclass
    ) THEN
        ALTER TABLE "Comentarios"
            ADD CONSTRAINT "Comentarios_restaurante_uid_fkey"
            FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_comentarios_restaurante_uid ON "Comentarios" (restaurante_uid);

-- Funciones alineadas con backend (nombres singulares donde aplica)
CREATE OR REPLACE FUNCTION insertar_comentario(
    p_documento INT,
    p_restaurante_uid UUID,
    p_comentario TEXT,
    p_calificacion INT DEFAULT 5
) RETURNS VOID AS $$
DECLARE
    v_rating NUMERIC(3, 1);
    v_reviews INT;
BEGIN
    IF p_calificacion < 1 OR p_calificacion > 5 THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5';
    END IF;

    IF EXISTS (
        SELECT 1 FROM "Comentarios"
        WHERE documento = p_documento AND restaurante_uid = p_restaurante_uid
    ) THEN
        RAISE EXCEPTION 'Ya has dejado una reseña para este restaurante';
    END IF;

    INSERT INTO "Comentarios" (documento, restaurante_uid, comentario, calificacion)
    VALUES (p_documento, p_restaurante_uid, p_comentario, p_calificacion);

    SELECT
        COALESCE(AVG(calificacion), 0)::NUMERIC(3, 1),
        COUNT(*)
    INTO v_rating, v_reviews
    FROM "Comentarios"
    WHERE restaurante_uid = p_restaurante_uid;

    UPDATE "Restaurante"
    SET rating = v_rating, reviews = v_reviews
    WHERE restaurante_uid = p_restaurante_uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION existe_comentario(
    p_documento INT,
    p_restaurante_uid UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM "Comentarios"
    WHERE documento = p_documento
      AND restaurante_uid = p_restaurante_uid;

    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION editar_comentario(
    p_id_comentario INT,
    p_comentario VARCHAR
) RETURNS VOID AS $$
BEGIN
    UPDATE "Comentarios"
    SET comentario = p_comentario
    WHERE id_comentario = p_id_comentario;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_comentario(p_id_comentario INT) RETURNS VOID AS $$
DECLARE
    v_uid UUID;
    v_rating NUMERIC(3, 1);
    v_reviews INT;
BEGIN
    SELECT restaurante_uid INTO v_uid
    FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    DELETE FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    IF v_uid IS NOT NULL THEN
        SELECT
            COALESCE(AVG(calificacion), 0)::NUMERIC(3, 1),
            COUNT(*)
        INTO v_rating, v_reviews
        FROM "Comentarios"
        WHERE restaurante_uid = v_uid;

        UPDATE "Restaurante"
        SET rating = v_rating, reviews = v_reviews
        WHERE restaurante_uid = v_uid;
    END IF;
END;
$$ LANGUAGE plpgsql;
