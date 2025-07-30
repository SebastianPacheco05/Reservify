CREATE OR REPLACE FUNCTION get_encabezado_factura_by_id(p_id_encab_fact INTEGER)
RETURNS TABLE (
    nit NUMERIC,
    nombre_restaurante VARCHAR,
    direccion VARCHAR,
    ciudad VARCHAR,
    fecha DATE
)
LANGUAGE sql
AS $$
SELECT NIT, nombre_restaurante, direccion, ciudad, fecha
FROM "Encabezado_Factura"
WHERE id_encab_fact = p_id_encab_fact;
$$;

CREATE OR REPLACE FUNCTION list_encabezado_factura()
RETURNS TABLE (
    id_encab_fact INTEGER,
    nit NUMERIC,
    nombre_restaurante VARCHAR,
    direccion VARCHAR,
    ciudad VARCHAR,
    fecha DATE
)
LANGUAGE sql
AS $$
SELECT id_encab_fact, NIT, nombre_restaurante, direccion, ciudad, fecha
FROM "Encabezado_Factura";
$$;