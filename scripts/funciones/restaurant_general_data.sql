CREATE OR REPLACE FUNCTION obtener_estadisticas_dueno(p_documento_dueno DECIMAL)
RETURNS TABLE (
    total_restaurantes INT,
    reservas_activas INT,
    visitantes_mes INT,
    total_reservas_mes INT,
    revenue_mes DECIMAL,
    total_clientes_mes INT
) AS $$
BEGIN
    -- Cantidad de restaurantes del dueño
    SELECT COUNT(*)
    INTO total_restaurantes
    FROM "Restaurante"
    WHERE documento = p_documento_dueno;

    -- Reservas activas (pendiente, confirmada, en curso)
    SELECT COUNT(*)
    INTO reservas_activas
    FROM "Reserva" r
    JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    JOIN "Restaurante" rest ON m."NIT" = rest."NIT"
    WHERE rest.documento = p_documento_dueno
      AND r.estado_reserva IN ('pendiente', 'confirmada', 'en curso');

    -- Visitantes mensuales (suma de num_comensales en el mes actual)
    SELECT COALESCE(SUM(r.num_comensales), 0)
    INTO visitantes_mes
    FROM "Reserva" r
    JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    JOIN "Restaurante" rest ON m."NIT" = rest."NIT"
    WHERE rest.documento = p_documento_dueno
      AND DATE_TRUNC('month', r.fecha) = DATE_TRUNC('month', CURRENT_DATE);

    -- Calculos mensuales (sumados de todos los restaurantes del dueño en el mes actual)
    SELECT 
        COALESCE(SUM(c.total_reservas), 0),
        COALESCE(SUM(c.revenue), 0),
        COALESCE(SUM(c.total_clientes), 0)
    INTO total_reservas_mes, revenue_mes, total_clientes_mes
    FROM "Calculos_mensuales" c
    JOIN "Restaurante" rest ON c."NIT" = rest."NIT"
    WHERE rest.documento = p_documento_dueno
      AND c.mes = EXTRACT(MONTH FROM CURRENT_DATE)
      AND c.anio = EXTRACT(YEAR FROM CURRENT_DATE);

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
