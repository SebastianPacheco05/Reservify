CREATE OR REPLACE FUNCTION editar_calculo_mensual(
    p_id_calculo INT,
    p_nit INT,
    p_mes INT,
    p_anio INT,
    p_total_reservas INT,
    p_revenue DECIMAL,
    p_total_clientes INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE "Calculos_mensuales"
    SET nit = p_nit,
        mes = p_mes,
        anio = p_anio,
        total_reservas = p_total_reservas,
        revenue = p_revenue,
        total_clientes = p_total_clientes
    WHERE id_calculo = p_id_calculo;
END;
$$ LANGUAGE plpgsql;
