-- FunciÃ³n para registrar factura y reserva en una sola operaciÃ³n
-- Archivo original: db/scripts/funciones/reservar.sql

CREATE OR REPLACE FUNCTION registrar_factura_y_reserva(
    p_nit DECIMAL(10,0),
    p_nombre_restaurante VARCHAR,
    p_direccion VARCHAR,
    p_ciudad VARCHAR,
    p_documento_cliente DECIMAL(10,0),
    p_id_mesa INT,
    p_num_comensales INT,
    p_horario TIME,
    p_fecha DATE,
    p_forma_pago VARCHAR,
    p_precio_total DECIMAL(10,2)
) RETURNS INT AS $$
DECLARE
    v_id_encab_fact INT;
BEGIN
    INSERT INTO "Encabezado_Factura" (
        nit,
        nombre_restaurante,
        direccion,
        ciudad,
        fecha,
        documento,
        forma_pago,
        precio_total
    )
    VALUES (
        p_nit,
        p_nombre_restaurante,
        p_direccion,
        p_ciudad,
        CURRENT_DATE,
        p_documento_cliente,
        p_forma_pago,
        p_precio_total
    )
    RETURNING id_encab_fact INTO v_id_encab_fact;

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
        'pendiente',
        p_num_comensales,
        p_horario,
        p_fecha
    );

    RETURN v_id_encab_fact;
END;
$$ LANGUAGE plpgsql;

