-- Archivo original: db/scripts/funciones/update_reservation_status.sql

CREATE OR REPLACE FUNCTION update_reservation_status(
    p_id_reserva INT,
    p_nuevo_estado VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    IF p_nuevo_estado NOT IN ('pendiente', 'confirmada', 'en curso', 'finalizada', 'cancelada', 'no presentada') THEN
        RAISE EXCEPTION 'Estado de reserva inválido: %', p_nuevo_estado;
    END IF;

    UPDATE "Reserva"
    SET estado_reserva = p_nuevo_estado
    WHERE id_reserva = p_id_reserva;
    
    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'No se encontró la reserva con ID: %', p_id_reserva;
    END IF;
END;
$$ LANGUAGE plpgsql;

