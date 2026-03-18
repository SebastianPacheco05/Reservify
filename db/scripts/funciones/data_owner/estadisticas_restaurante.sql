/* Archivo original: db/scripts/funciones/estadisticas_restaurante.sql */

CREATE OR REPLACE FUNCTION obtener_estadisticas_restaurante(p_nit DECIMAL)
RETURNS TABLE (
    total_restaurantes INT,
    reservas_activas INT,
    visitantes_mes INT,
    total_reservas_mes INT,
    revenue_mes DECIMAL,
    total_clientes_mes INT
) AS $$
BEGIN
    total_restaurantes := 1;

    SELECT COUNT(*)
    INTO reservas_activas
    FROM "Reserva" r
    JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    JOIN "Restaurante" rest ON m."nit" = rest."nit"
    WHERE rest.nit = p_nit
      AND r.estado_reserva IN ('pendiente', 'confirmada', 'en curso');

    SELECT COALESCE(SUM(r.num_comensales), 0)
    INTO visitantes_mes
    FROM "Reserva" r
    JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    JOIN "Restaurante" rest ON m."nit" = rest."nit"
    WHERE rest.nit = p_nit
      AND DATE_TRUNC('month', r.fecha) = DATE_TRUNC('month', CURRENT_DATE);

    total_reservas_mes := 0;
    revenue_mes := 0;
    total_clientes_mes := 0;
    SELECT
        COALESCE(c.total_reservas, 0),
        COALESCE(c.revenue, 0),
        COALESCE(c.total_clientes, 0)
    INTO total_reservas_mes, revenue_mes, total_clientes_mes
    FROM "Calculos_mensuales" c
    WHERE c.nit = p_nit
      AND c.mes = EXTRACT(MONTH FROM CURRENT_DATE)
      AND c.anio = EXTRACT(YEAR FROM CURRENT_DATE);

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

