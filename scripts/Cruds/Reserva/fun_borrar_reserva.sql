CREATE OR REPLACE FUNCTION borrar_reserva(
    p_id_reserva INT
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM "Reserva"
    WHERE id_reserva = p_id_reserva;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
