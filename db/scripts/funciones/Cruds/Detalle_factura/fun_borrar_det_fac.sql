CREATE OR REPLACE FUNCTION borrar_detalle_factura(
    p_id_det_fact INT
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM "Detalle_Factura"
    WHERE id_det_fact = p_id_det_fact;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
