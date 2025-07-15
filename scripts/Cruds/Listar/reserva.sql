CREATE OR REPLACE FUNCTION get_reserva_by_id(p_id_reserva INTEGER)
RETURNS TABLE (
    id_mesa INTEGER,
    id_encab_fact INTEGER,
    horario TIME,
    fecha DATE
)
LANGUAGE sql
AS $$
SELECT id_mesa, id_encab_fact, horario, fecha
FROM "Reserva"
WHERE id_reserva = p_id_reserva;
$$;

CREATE OR REPLACE FUNCTION list_reservas()
RETURNS TABLE (
    id_reserva INTEGER,
    id_mesa INTEGER,
    id_encab_fact INTEGER,
    horario TIME,
    fecha DATE
)
LANGUAGE sql
AS $$
SELECT id_reserva, id_mesa, id_encab_fact, horario, fecha
FROM "Reserva";
$$;
