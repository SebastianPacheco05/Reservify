CREATE OR REPLACE FUNCTION editar_restaurante(
    p_nit INT,
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(20),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Restaurante"
    SET direccion = p_direccion,
        nombre_restaurante = p_nombre_restaurante,
        descripcion_restaurante = p_descripcion_restaurante,
        horario_apertura = p_horario_apertura,
        horario_cierre = p_horario_cierre,
        documento = p_documento,
        id_categoria = p_id_categoria
    WHERE nit = p_nit;
END;
$$ LANGUAGE plpgsql;
