CREATE OR REPLACE FUNCTION get_calculo_mensual_by_id(p_id_calculo INTEGER)
RETURNS TABLE (
    nit NUMERIC,
    mes INTEGER,
    anio INTEGER,
    total_reservas INTEGER,
    revenue NUMERIC,
    total_clientes INTEGER
)
LANGUAGE sql
AS $$
SELECT nit, mes, anio, total_reservas, revenue, total_clientes
FROM "Calculos_mensuales"
WHERE id_calculo = p_id_calculo;
$$;

CREATE OR REPLACE FUNCTION list_calculos_mensuales()
RETURNS TABLE (
    id_calculo INTEGER,
    nit NUMERIC,
    mes INTEGER,
    anio INTEGER,
    total_reservas INTEGER,
    revenue NUMERIC,
    total_clientes INTEGER
)
LANGUAGE sql
AS $$
SELECT id_calculo, nit, mes, anio, total_reservas, revenue, total_clientes
FROM "Calculos_mensuales";
$$;
