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
BEGIN
    INSERT INTO "Detalle_Factura" (
        descripcion,
        unidades,
        precio_unitario,
        precio_total,
        forma_pago,
        id_encab_fact
    ) VALUES (
        p_descripcion,
        p_unidades,
        p_precio_unitario,
        p_precio_total,
        p_forma_pago,
        p_id_encab_fact
    ) RETURNING id_det_fact INTO v_id_det_fact;
    
    RETURN v_id_det_fact;
END;
$$ LANGUAGE plpgsql;
