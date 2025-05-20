CREATE OR REPLACE FUNCTION insertar_mesas(
    p_estado_de_disponibilidad BOOLEAN,
    p_cant_personas INT,
    p_NIT INT,
    p_Precio DECIMAL(10, 2)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, NIT, Precio)
    VALUES (p_estado_de_disponibilidad, p_cant_personas, p_NIT, p_Precio);
END;
$$ LANGUAGE plpgsql;
