CREATE OR REPLACE FUNCTION insertar_reserva(
    p_id_mesa INT,
    p_id_cliente INT,
    p_id_encab_fact INT,
    p_horario TIME,
    p_fecha DATE
) RETURNS INT AS $$
DECLARE
    v_id_reserva INT;
BEGIN
    -- Verificar disponibilidad de la mesa
    IF EXISTS (
        SELECT 1 FROM "Reserva"
        WHERE id_mesa = p_id_mesa
        AND fecha = p_fecha
        AND horario = p_horario
    ) THEN
        RAISE EXCEPTION 'La mesa ya está reservada para esta fecha y horario';
    END IF;

    INSERT INTO "Reserva" (
        id_mesa,
        id_cliente,
        id_encab_fact,
        horario,
        fecha
    ) VALUES (
        p_id_mesa,
        p_id_cliente,
        p_id_encab_fact,
        p_horario,
        p_fecha
    ) RETURNING id_reserva INTO v_id_reserva;
    
    RETURN v_id_reserva;
END;
$$ LANGUAGE plpgsql;
