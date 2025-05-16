CREATE OR REPLACE FUNCTION editar_enc_fac(
    p_id_encab_fact INT,
    p_NIT INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Encabezado_Factura"
    SET NIT = p_NIT,
        nombre_restaurante = p_nombre_restaurante,
        direccion = p_direccion,
        ciudad = p_ciudad,
        fecha = p_fecha,
        id_cliente = p_id_cliente
    WHERE id_encab_fact = p_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
