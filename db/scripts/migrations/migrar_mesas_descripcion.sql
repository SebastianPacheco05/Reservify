-- Migración: Mesas.descripcion + firma SQL de insertar_mesas/editar_mesas
--
-- Objetivo:
-- 1) Agregar columna "descripcion" a "Mesas"
-- 2) Actualizar las funciones public.insertar_mesas y public.editar_mesas para
--    que reciban y persistan la descripción.
--
-- Ejecución:
--   psql "postgresql://USER:PASS@HOST:5432/db_reservify" -f db/scripts/migrar_mesas_descripcion.sql

-- =============================================================================
-- 1) Columna Mesas.descripcion
-- =============================================================================
ALTER TABLE "Mesas"
    ADD COLUMN IF NOT EXISTS descripcion VARCHAR(255) NOT NULL DEFAULT 'sin dato';

-- Por si existían filas previas con null (caso raro), normalizar.
UPDATE "Mesas"
SET descripcion = 'sin dato'
WHERE descripcion IS NULL;

-- =============================================================================
-- 2) Reemplazar funciones CRUD de Mesas
-- =============================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Eliminar cualquier sobrecarga existente de insertar_mesas
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
    -- Eliminar cualquier sobrecarga existente de editar_mesas
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

CREATE OR REPLACE FUNCTION public.insertar_mesas(
    p_estado_de_disponibilidad boolean,
    p_cant_personas integer,
    p_restaurante_uid uuid,
    p_precio numeric(10, 2),
    p_descripcion varchar(255)
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

    INSERT INTO "Mesas" (
        estado_de_disponibilidad,
        cant_personas,
        restaurante_uid,
        precio,
        nit,
        descripcion
    )
    VALUES (
        p_estado_de_disponibilidad,
        p_cant_personas,
        p_restaurante_uid,
        p_precio,
        v_nit,
        COALESCE(p_descripcion, 'sin dato')
    );
END;
$function$;

COMMENT ON FUNCTION public.insertar_mesas(boolean, integer, uuid, numeric, varchar) IS
'Mesa ligada a Restaurante por UUID con descripciÃ³n.';

-- Compatibilidad retroactiva (firma antigua de 4 argumentos):
-- mantiene funcionando backends viejos que aún no envían p_descripcion.
CREATE OR REPLACE FUNCTION public.insertar_mesas(
    p_estado_de_disponibilidad boolean,
    p_cant_personas integer,
    p_restaurante_uid uuid,
    p_precio numeric(10, 2)
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM public.insertar_mesas(
        p_estado_de_disponibilidad,
        p_cant_personas,
        p_restaurante_uid,
        p_precio,
        'sin dato'
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.editar_mesas(
    p_id_mesa integer,
    p_estado_de_disponibilidad boolean,
    p_cant_personas integer,
    p_restaurante_uid uuid,
    p_precio numeric(10, 2),
    p_descripcion varchar(255)
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
        descripcion = COALESCE(p_descripcion, 'sin dato'),
        nit = v_nit
    WHERE id_mesa = p_id_mesa;
END;
$function$;

COMMENT ON FUNCTION public.editar_mesas(integer, boolean, integer, uuid, numeric, varchar) IS
'Actualiza mesa por id_mesa; nit sincronizado con Restaurante del UUID y guarda descripciÃ³n.';

-- Compatibilidad retroactiva (firma antigua de 5 argumentos).
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
BEGIN
    PERFORM public.editar_mesas(
        p_id_mesa,
        p_estado_de_disponibilidad,
        p_cant_personas,
        p_restaurante_uid,
        p_precio,
        'sin dato'
    );
END;
$function$;

