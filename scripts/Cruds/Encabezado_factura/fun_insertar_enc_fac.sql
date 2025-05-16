CREATE OR REPLACE FUNCTION insertar_enc_fac(
    p_id_encab_fact INT,
    p_NIT INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Encabezado_Factura" (id_encab_fact, NIT, nombre_restaurante, direccion, ciudad, fecha, id_cliente)
    VALUES (p_id_encab_fact, p_NIT, p_nombre_restaurante, p_direccion, p_ciudad, p_fecha, p_id_cliente);
END;
$$ LANGUAGE plpgsql;
