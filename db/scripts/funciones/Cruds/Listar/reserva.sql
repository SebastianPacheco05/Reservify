CREATE OR REPLACE FUNCTION get_reserva_by_id(p_id_reserva INTEGER)
RETURNS TABLE (
    id_mesa INTEGER,
    id_encab_fact INTEGER,
    horario TIME,
    fecha DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id_mesa, id_encab_fact, horario, fecha
    FROM "Reserva"
    WHERE id_reserva = p_id_reserva;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;

CREATE OR REPLACE FUNCTION list_reservas()
RETURNS TABLE (
    id_reserva INTEGER,
    id_mesa INTEGER,
    id_encab_fact INTEGER,
    horario TIME,
    fecha DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id_reserva, id_mesa, id_encab_fact, horario, fecha
    FROM "Reserva";
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;
