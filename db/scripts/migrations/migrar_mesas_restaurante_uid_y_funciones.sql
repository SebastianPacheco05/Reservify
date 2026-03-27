-- Migración: Mesas.restaurante_uid + funciones insertar_mesas / editar_mesas (una sola firma)
--
-- Objetivo:
-- 1) Garantizar columna restaurante_uid en "Mesas", alineada con "Restaurante".restaurante_uid
-- 2) Índice y FK para integridad referencial
-- 3) Eliminar TODAS las sobrecargas de insertar_mesas y editar_mesas en public (evita AmbiguousFunction
--    cuando el driver envía el UUID como texto / tipo unknown)
-- 4) Dejar una única firma por nombre: (boolean, integer, uuid, numeric(10,2)) y (integer, boolean, integer, uuid, numeric)
--
-- Prerrequisito recomendado: haber aplicado migrar_restaurante_pk_uuid.sql (Restaurante.restaurante_uid PK).
--
-- Ejecución (ejemplo):
--   psql "postgresql://USER:PASS@HOST:5432/db_reservify" -f db/scripts/migrar_mesas_restaurante_uid_y_funciones.sql

-- =============================================================================
-- 1) Columna restaurante_uid en Mesas
-- =============================================================================
ALTER TABLE "Mesas"
    ADD COLUMN IF NOT EXISTS restaurante_uid UUID;

-- 2) Rellenar desde Restaurante por nit (misma fila de negocio)
UPDATE "Mesas" m
SET restaurante_uid = r.restaurante_uid
FROM "Restaurante" r
WHERE m.nit = r.nit
  AND (m.restaurante_uid IS DISTINCT FROM r.restaurante_uid);

-- 3) No continuar si quedan mesas sin UID resoluble
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Mesas" WHERE restaurante_uid IS NULL) THEN
        RAISE EXCEPTION
            'migrar_mesas_restaurante_uid_y_funciones: hay filas en "Mesas" sin restaurante_uid (nit sin coincidencia en "Restaurante"). Corrige datos y reintenta.';
    END IF;
END $$;

ALTER TABLE "Mesas"
    ALTER COLUMN restaurante_uid SET NOT NULL;

-- 4) FK e índice (idempotente)
DO $$
DECLARE
    mesas_oid oid;
BEGIN
    SELECT c.oid
    INTO mesas_oid
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'Mesas';

    IF mesas_oid IS NULL THEN
        RAISE EXCEPTION 'migrar_mesas_restaurante_uid_y_funciones: no se encontró la tabla public.Mesas.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'mesas_restaurante_uid_fkey'
          AND conrelid = mesas_oid
    ) THEN
        ALTER TABLE "Mesas"
            ADD CONSTRAINT mesas_restaurante_uid_fkey
            FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_mesas_restaurante_uid ON "Mesas" (restaurante_uid);

-- =============================================================================
-- 5) Quitar sobrecargas antiguas (p. ej. misma función con text/bigint en lugar de uuid)
-- =============================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE p.proname = 'insertar_mesas'
          AND n.nspname = 'public'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.sig::text || ' CASCADE';
    END LOOP;
END $$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE p.proname = 'editar_mesas'
          AND n.nspname = 'public'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.sig::text || ' CASCADE';
    END LOOP;
END $$;

-- =============================================================================
-- 6) Funciones canónicas (firma única; nit se obtiene del restaurante para no romper FK Mesas_nit_fkey)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.insertar_mesas(
    p_estado_de_disponibilidad boolean,
    p_cant_personas integer,
    p_restaurante_uid uuid,
    p_precio numeric(10, 2)
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    v_nit bigint;
BEGIN
    SELECT r.nit
    INTO STRICT v_nit
    FROM "Restaurante" r
    WHERE r.restaurante_uid = p_restaurante_uid;

    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, restaurante_uid, precio, nit)
    VALUES (p_estado_de_disponibilidad, p_cant_personas, p_restaurante_uid, p_precio, v_nit);
END;
$function$;

COMMENT ON FUNCTION public.insertar_mesas(boolean, integer, uuid, numeric) IS
'Mesa ligada a Restaurante por UUID. NO crear otra sobrecarga con el mismo nombre: el cliente SQL envía uuid como texto y PostgreSQL no podría resolver la llamada.';

CREATE OR REPLACE FUNCTION public.editar_mesas(
    p_id_mesa integer,
    p_estado_de_disponibilidad boolean,
    p_cant_personas integer,
    p_restaurante_uid uuid,
    p_precio numeric(10, 2)
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    v_nit bigint;
BEGIN
    SELECT r.nit
    INTO STRICT v_nit
    FROM "Restaurante" r
    WHERE r.restaurante_uid = p_restaurante_uid;

    UPDATE "Mesas"
    SET estado_de_disponibilidad = p_estado_de_disponibilidad,
        cant_personas = p_cant_personas,
        restaurante_uid = p_restaurante_uid,
        precio = p_precio,
        nit = v_nit
    WHERE id_mesa = p_id_mesa;
END;
$function$;

COMMENT ON FUNCTION public.editar_mesas(integer, boolean, integer, uuid, numeric) IS
'Actualiza mesa por id_mesa; nit se sincroniza con el restaurante del UUID. NO añadir sobrecargas de editar_mesas.';
