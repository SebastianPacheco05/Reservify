/*
 * FunciÃ³n para confirmar una reserva cuando el pago ha sido aprobado
 * Archivo original: db/scripts/funciones/confirmar_reserva_por_pago.sql
 */

CREATE OR REPLACE FUNCTION confirmar_reserva_por_pago(
    p_id_encab_fact INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_reservas_actualizadas INT;
BEGIN
    UPDATE "Reserva"
    SET estado_reserva = 'confirmada'
    WHERE id_encab_fact = p_id_encab_fact
      AND estado_reserva = 'pendiente';
    
    GET DIAGNOSTICS v_reservas_actualizadas = ROW_COUNT;
    
    IF v_reservas_actualizadas > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

