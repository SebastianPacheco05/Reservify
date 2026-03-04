CREATE OR REPLACE FUNCTION editar_mesas(
    p_id_mesa INT,
    p_estado_de_disponibilidad BOOLEAN,
    p_cant_personas INT,
    p_nit INT,
    p_Precio DECIMAL(10, 2)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Mesas"
    SET estado_de_disponibilidad = p_estado_de_disponibilidad,
        cant_personas = p_cant_personas,
        nit = p_nit,
        Precio = p_Precio
    WHERE id_mesa = p_id_mesa;
END;
$$ LANGUAGE plpgsql;
