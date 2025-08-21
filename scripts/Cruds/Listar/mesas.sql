CREATE OR REPLACE FUNCTION list_mesas()
RETURNS TABLE (
    id_mesa INTEGER,
    estado_de_disponibilidad VARCHAR,
    cant_personas INTEGER,
    nit NUMERIC,
    precio NUMERIC
) LANGUAGE sql AS $$
SELECT id_mesa, estado_de_disponibilidad, cant_personas, NIT, precio
FROM "Mesas";
$$;

CREATE OR REPLACE FUNCTION get_mesa_by_id(p_id_mesa INTEGER)
RETURNS TABLE (
    estado_de_disponibilidad VARCHAR,
    cant_personas INTEGER,
    nit NUMERIC,
    precio NUMERIC
) LANGUAGE sql AS $$
SELECT estado_de_disponibilidad, cant_personas, NIT, precio
FROM "Mesas"
WHERE id_mesa = p_id_mesa;
$$;


