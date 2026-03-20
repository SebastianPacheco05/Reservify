CREATE OR REPLACE FUNCTION insertar_mesas(
    p_estado_de_disponibilidad BOOLEAN,
    p_cant_personas INT,
    p_restaurante_uid UUID,
    p_Precio DECIMAL(10, 2)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, restaurante_uid, Precio)
    VALUES (p_estado_de_disponibilidad, p_cant_personas, p_restaurante_uid, p_Precio);
END;
$$ LANGUAGE plpgsql;
