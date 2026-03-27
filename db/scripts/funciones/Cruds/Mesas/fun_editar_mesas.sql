-- editar_mesas: UNA sola firma — (integer, boolean, integer, uuid, numeric(10,2), varchar(255)).
-- Ver comentario en fun_insertar_mesas.sql: no añadir sobrecargas con el mismo nombre.

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
'Actualiza mesa; nit sincronizado con Restaurante del UUID y guarda descripción. NO añadir sobrecargas.';

-- Compatibilidad con cliente legacy (sin descripción).
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
