CREATE OR REPLACE FUNCTION registrar_factura_y_reserva(
    p_nit DECIMAL(10,0),
    p_nombre_restaurante VARCHAR,
    p_direccion VARCHAR,
    p_ciudad VARCHAR,
    p_documento_cliente DECIMAL(10,0),
    p_id_mesa INT,
    p_num_comensales INT,
    p_horario TIME,
    p_fecha DATE
) RETURNS INT AS $$
DECLARE
    v_id_encab_fact INT;
BEGIN
    -- 1️⃣ Insertar en Encabezado_Factura
    INSERT INTO "Encabezado_Factura" (
        nit,
        nombre_restaurante,
        direccion,
        ciudad,
        fecha,
        documento
    )
    VALUES (
        p_nit,
        p_nombre_restaurante,
        p_direccion,
        p_ciudad,
        CURRENT_DATE,  -- Cumple la restricción de la tabla
        p_documento_cliente
    )
    RETURNING id_encab_fact INTO v_id_encab_fact;

    -- 2️⃣ Insertar en Reserva con el id_encab_fact recién creado
    INSERT INTO "Reserva" (
        id_mesa,
        documento,
        id_encab_fact,
        estado_reserva,
        num_comensales,
        horario,
        fecha
    )
    VALUES (
        p_id_mesa,
        p_documento_cliente,
        v_id_encab_fact,
        'pendiente',  -- Estado inicial
        p_num_comensales,
        p_horario,
        p_fecha
    );

    -- 3️⃣ Retornar el id del encabezado de factura
    RETURN v_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
