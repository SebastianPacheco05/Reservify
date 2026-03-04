CREATE OR REPLACE FUNCTION editar_enc_fac(
    p_id_encab_fact INT,
    p_nit INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Encabezado_Factura"
    SET nit = p_nit,
        nombre_restaurante = p_nombre_restaurante,
        direccion = p_direccion,
        ciudad = p_ciudad,
        fecha = p_fecha,
        documento = p_documento
    WHERE id_encab_fact = p_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
