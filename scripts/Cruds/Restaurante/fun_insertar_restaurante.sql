CREATE OR REPLACE FUNCTION insertar_restaurante(
    p_NIT INT,
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(20),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_id_dueno INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Restaurante" (NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, id_dueno)
    VALUES (p_NIT, p_direccion, p_nombre_restaurante, p_descripcion_restaurante, p_horario_apertura, p_horario_cierre, p_id_dueno);
END;
$$ LANGUAGE plpgsql;
