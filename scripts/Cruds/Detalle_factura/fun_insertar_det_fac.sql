CREATE OR REPLACE FUNCTION insertar_det_fac(
    p_id_det_fact INT,
    p_descripcion VARCHAR(100),
    p_unidades INT,
    p_precio_unitario DECIMAL(10, 2),
    p_precio_total DECIMAL(10, 2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Detalle_Factura" (id_det_fact, descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact)
    VALUES (p_id_det_fact, p_descripcion, p_unidades, p_precio_unitario, p_precio_total, p_forma_pago, p_id_encab_fact);
END;
$$ LANGUAGE plpgsql;
