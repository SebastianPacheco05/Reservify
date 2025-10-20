CREATE OR REPLACE FUNCTION insertar_restaurante(
    p_nit DECIMAL(10, 0),
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(20),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Restaurante" (nit, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento, id_categoria)
    VALUES (p_nit, p_direccion, p_nombre_restaurante, p_descripcion_restaurante, p_horario_apertura, p_horario_cierre, p_documento, p_id_categoria);
END;
$$ LANGUAGE plpgsql;
