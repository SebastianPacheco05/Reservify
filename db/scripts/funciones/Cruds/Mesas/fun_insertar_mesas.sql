-- insertar_mesas: UNA sola firma en public — (boolean, integer, uuid, numeric(10,2), varchar(255)).
-- No definir otra función con el mismo nombre y distintos tipos: desde Python/SQLAlchemy el UUID
-- llega como texto y PostgreSQL puede marcarlo "unknown" y lanzar AmbiguousFunction si hay sobrecargas.
--
-- Sincroniza nit con "Restaurante" para mantener la FK Mesas(nit) -> Restaurante(nit).

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

    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, restaurante_uid, precio, nit, descripcion)
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
'Mesa ligada a Restaurante por UUID con descripciÃ³n. NO crear otra sobrecarga con el mismo nombre.';

-- Compatibilidad con cliente legacy (sin descripción).
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
