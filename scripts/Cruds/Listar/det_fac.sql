CREATE OR REPLACE FUNCTION get_detalle_factura_by_id(p_id_det_fact INTEGER)
RETURNS TABLE (
    descripcion VARCHAR[],
    unidades INTEGER[],
    precio_unitario NUMERIC[],
    precio_total NUMERIC,
    forma_pago VARCHAR,
    id_encab_fact INTEGER
)
LANGUAGE sql
AS $$
SELECT descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact
FROM "Detalle_Factura"
WHERE id_det_fact = p_id_det_fact;
$$;

CREATE OR REPLACE FUNCTION list_detalle_factura()
RETURNS TABLE (
    id_det_fact INTEGER,
    descripcion VARCHAR[],
    unidades INTEGER[],
    precio_unitario NUMERIC[],
    precio_total NUMERIC,
    forma_pago VARCHAR,
    id_encab_fact INTEGER
)
LANGUAGE sql
AS $$
SELECT id_det_fact, descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact
FROM "Detalle_Factura";
$$;
