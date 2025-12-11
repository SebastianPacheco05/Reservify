/*
 * Script de migración para corregir la función registrar_factura_y_reserva
 * y actualizar la tabla Encabezado_Factura
 * 
 * Este script:
 * 1. Actualiza la restricción de forma_pago para permitir 'Pendiente'
 * 2. Recrea la función registrar_factura_y_reserva con los parámetros adicionales
 */

-- 1️⃣ Actualizar la tabla Encabezado_Factura para permitir 'Pendiente' como forma_pago
ALTER TABLE "Encabezado_Factura" 
DROP CONSTRAINT IF EXISTS "Encabezado_Factura_forma_pago_check";

ALTER TABLE "Encabezado_Factura"
ADD CONSTRAINT "Encabezado_Factura_forma_pago_check" 
CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente'));

-- 2️⃣ Recrear la función registrar_factura_y_reserva con los nuevos parámetros
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
    -- 1️⃣ Insertar en Encabezado_Factura
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
        CURRENT_DATE,  -- Cumple la restricción de la tabla
        p_documento_cliente,
        p_forma_pago,
        p_precio_total
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

-- Confirmación
SELECT 'Migración completada exitosamente' AS status;


