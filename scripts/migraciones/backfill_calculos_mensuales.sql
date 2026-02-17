-- Backfill Calculos_mensuales desde Reserva y Encabezado_Factura
-- Inserta registros para los últimos 24 meses por restaurante.
-- Ejecutar manualmente cuando Calculos_mensuales esté vacío.
-- Fecha: 2025

INSERT INTO "Calculos_mensuales" (nit, mes, anio, total_reservas, revenue, total_clientes)
SELECT
    m.nit,
    EXTRACT(MONTH FROM r.fecha)::INT AS mes,
    EXTRACT(YEAR FROM r.fecha)::INT AS anio,
    COUNT(r.id_reserva)::INT AS total_reservas,
    COALESCE(SUM(ef.precio_total), 0)::DECIMAL(10,2) AS revenue,
    COUNT(DISTINCT r.documento)::INT AS total_clientes
FROM "Reserva" r
JOIN "Mesas" m ON r.id_mesa = m.id_mesa
LEFT JOIN "Encabezado_Factura" ef ON r.id_encab_fact = ef.id_encab_fact
WHERE r.fecha >= CURRENT_DATE - INTERVAL '24 months'
  AND NOT EXISTS (
    SELECT 1 FROM "Calculos_mensuales" c
    WHERE c.nit = m.nit AND c.mes = EXTRACT(MONTH FROM r.fecha) AND c.anio = EXTRACT(YEAR FROM r.fecha)
  )
GROUP BY m.nit, EXTRACT(MONTH FROM r.fecha), EXTRACT(YEAR FROM r.fecha);

SELECT 'Backfill Calculos_mensuales completado' AS status;
