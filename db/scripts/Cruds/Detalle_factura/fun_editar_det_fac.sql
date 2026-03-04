CREATE OR REPLACE FUNCTION editar_detalle_factura(
    p_id_det_fact INT,
    p_descripcion VARCHAR(100),
    p_unidades INT,
    p_precio_unitario DECIMAL(10,2),
    p_precio_total DECIMAL(10,2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE "Detalle_Factura"
    SET 
        descripcion = p_descripcion,
        unidades = p_unidades,
        precio_unitario = p_precio_unitario,
        precio_total = p_precio_total,
        forma_pago = p_forma_pago,
        id_encab_fact = p_id_encab_fact
    WHERE id_det_fact = p_id_det_fact;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
