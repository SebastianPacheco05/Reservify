/*
 * Función para confirmar una reserva cuando el pago ha sido aprobado
 * Esta función actualiza el estado de la reserva de 'pendiente' a 'confirmada'
 * basándose en el id_encab_fact (ID del encabezado de factura)
 * 
 * Parámetros:
 *   p_id_encab_fact: ID del encabezado de factura asociado a la reserva
 * 
 * Retorna:
 *   true si la reserva fue actualizada correctamente
 *   false si no se encontró una reserva pendiente con ese id_encab_fact
 */

CREATE OR REPLACE FUNCTION confirmar_reserva_por_pago(
    p_id_encab_fact INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_reservas_actualizadas INT;
BEGIN
    -- Actualizar el estado de la reserva de 'pendiente' a 'confirmada'
    -- Solo si existe una reserva con estado 'pendiente' para ese id_encab_fact
    UPDATE "Reserva"
    SET estado_reserva = 'confirmada'
    WHERE id_encab_fact = p_id_encab_fact
      AND estado_reserva = 'pendiente';
    
    -- Obtener el número de filas actualizadas
    GET DIAGNOSTICS v_reservas_actualizadas = ROW_COUNT;
    
    -- Si se actualizó al menos una reserva, retornar true
    IF v_reservas_actualizadas > 0 THEN
        RETURN TRUE;
    ELSE
        -- Si no se encontró ninguna reserva pendiente, retornar false
        RETURN FALSE;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, hacer rollback y retornar false
        RAISE EXCEPTION 'Error al confirmar la reserva: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

