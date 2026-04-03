-- Inserta una fila por elemento en los arreglos (lineas de detalle).
CREATE OR REPLACE FUNCTION insertar_detalle_factura(
    p_descripcion VARCHAR(100)[],
    p_unidades INT[],
    p_precio_unitario DECIMAL(10,2)[],
    p_precio_total DECIMAL(10,2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS INT AS $$
DECLARE
    v_id_det_fact INT;
    i INT;
    n INT;
BEGIN
    IF p_descripcion IS NULL OR array_length(p_descripcion, 1) IS NULL THEN
        RETURN NULL;
    END IF;

    n := array_length(p_descripcion, 1);
    FOR i IN 1..n LOOP
        INSERT INTO "Detalle_Factura" (
            descripcion,
            unidades,
            precio_unitario,
            precio_total,
            forma_pago,
            id_encab_fact
        ) VALUES (
            COALESCE(p_descripcion[i], ''),
            COALESCE(p_unidades[i], 1),
            COALESCE(p_precio_unitario[i], 0),
            COALESCE(p_precio_unitario[i], 0) * COALESCE(p_unidades[i], 1),
            p_forma_pago,
            p_id_encab_fact
        ) RETURNING id_det_fact INTO v_id_det_fact;
    END LOOP;

    RETURN v_id_det_fact;
END;
$$ LANGUAGE plpgsql;
