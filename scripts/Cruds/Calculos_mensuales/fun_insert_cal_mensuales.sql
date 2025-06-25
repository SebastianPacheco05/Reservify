CREATE OR REPLACE FUNCTION insertar_calculo_mensual(
    p_nit INT,
    p_mes INT,
    p_anio INT,
    p_total_reservas INT,
    p_revenue DECIMAL,
    p_total_clientes INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "Calculos_mensuales" (NIT, mes, anio, total_reservas, revenue, total_clientes)
    VALUES (p_nit, p_mes, p_anio, p_total_reservas, p_revenue, p_total_clientes);
END;
$$ LANGUAGE plpgsql;
