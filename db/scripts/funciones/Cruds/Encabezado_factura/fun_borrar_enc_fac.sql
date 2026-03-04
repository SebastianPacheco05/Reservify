CREATE OR REPLACE FUNCTION borrar_enc_fac(
    p_id_encab_fact INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Encabezado_Factura"
    WHERE id_encab_fact = p_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
