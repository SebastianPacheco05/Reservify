CREATE OR REPLACE FUNCTION editar_reserva(
    p_id_reserva INT,
    p_id_mesa INT,
    p_id_cliente INT,
    p_id_encab_fact INT,
    p_horario TIME,
    p_fecha DATE, 
    p_estado_reserva VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar disponibilidad de la mesa (excluyendo la reserva actual)
    IF EXISTS (
        SELECT 1 FROM "Reserva"
        WHERE id_mesa = p_id_mesa
          AND fecha = p_fecha
          AND horario = p_horario
          AND id_reserva != p_id_reserva
          AND (
              estado_reserva = 'confirmada' OR 
              estado_reserva = 'en curso' OR 
              estado_reserva = 'finalizada'
          )
    ) THEN
        RAISE EXCEPTION 'La mesa ya está reservada para esta fecha y horario';
    END IF;

    UPDATE "Reserva"
    SET 
        id_mesa = p_id_mesa,
        id_cliente = p_id_cliente,
        id_encab_fact = p_id_encab_fact,
        horario = p_horario,
        fecha = p_fecha,
        estado_reserva = p_estado_reserva
    WHERE id_reserva = p_id_reserva;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
