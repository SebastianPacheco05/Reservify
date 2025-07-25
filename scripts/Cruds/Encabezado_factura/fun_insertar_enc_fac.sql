CREATE OR REPLACE FUNCTION insertar_enc_fac(
    p_NIT INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Encabezado_Factura" (NIT, nombre_restaurante, direccion, ciudad, fecha, documento)
    VALUES (p_NIT, p_nombre_restaurante, p_direccion, p_ciudad, p_fecha, p_documento);
END;
$$ LANGUAGE plpgsql;
