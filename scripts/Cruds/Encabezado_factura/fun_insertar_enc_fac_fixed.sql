-- Función corregida para insertar encabezado de factura y devolver el ID
CREATE OR REPLACE FUNCTION insertar_enc_fac(
    p_nit INT,
    p_nombre_restaurante VARCHAR(50),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_documento INT
) RETURNS INT AS $$
DECLARE
    v_id_encab_fact INT;
BEGIN
    INSERT INTO "Encabezado_Factura" (nit, nombre_restaurante, direccion, ciudad, fecha, documento)
    VALUES (p_nit, p_nombre_restaurante, p_direccion, p_ciudad, p_fecha, p_documento)
    RETURNING id_encab_fact INTO v_id_encab_fact;
    
    RETURN v_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
