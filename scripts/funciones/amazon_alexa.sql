CREATE OR REPLACE FUNCTION insertar_reserva_alexa(
    p_documento INT,
    p_id_mesa INT,
    p_id_encab_fact INT,
    p_horario TIME,
    p_fecha DATE,
    p_num_comensales INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO Reserva (documento, id_mesa, id_encab_fact, horario, fecha, num_comensales)
    VALUES (p_documento, p_id_mesa, p_id_encab_fact, p_horario, p_fecha, p_num_comensales);
END;
$$ LANGUAGE plpgsql;





