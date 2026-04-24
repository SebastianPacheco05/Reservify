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
    SELECT
        id_mesa::INTEGER,
        id_encab_fact::INTEGER,
        horario::TIME,
        fecha::DATE
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
    SELECT
        id_reserva::INTEGER,
        id_mesa::INTEGER,
        id_encab_fact::INTEGER,
        horario::TIME,
        fecha::DATE
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


CREATE OR REPLACE FUNCTION list_reservas_por_documento(
    p_documento NUMERIC,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id_reserva INTEGER,
    horario TEXT,
    fecha TEXT,
    estado_reserva TEXT,
    num_comensales INTEGER,
    motivo_cancelacion TEXT,
    nombre_restaurante VARCHAR,
    nit NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id_reserva::INTEGER,
        r.horario::TEXT,
        r.fecha::TEXT,
        r.estado_reserva::TEXT,
        r.num_comensales::INTEGER,
        r.motivo_cancelacion::TEXT,
        rest.nombre_restaurante::VARCHAR,
        rest.nit::NUMERIC
    FROM "Reserva" r
    JOIN "Mesas" m ON r.id_mesa = m.id_mesa
    JOIN "Restaurante" rest ON m.nit = rest.nit
    WHERE r.documento = p_documento
    ORDER BY r.fecha DESC, r.horario DESC
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 500);
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
