CREATE OR REPLACE FUNCTION editar_restaurante(
    p_restaurante_uid UUID,
    p_nit INT,
    p_direccion VARCHAR(255),
    p_nombre_restaurante VARCHAR(50),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_documento INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    IF p_horario_apertura = p_horario_cierre THEN
        RAISE EXCEPTION 'El horario de apertura no puede ser igual al horario de cierre.';
    END IF;

    IF p_horario_apertura > p_horario_cierre
       AND ((p_horario_cierre + INTERVAL '24 hours') - p_horario_apertura) > INTERVAL '8 hours' THEN
        RAISE EXCEPTION 'Cuando el horario cruza medianoche, la duración máxima permitida es de 8 horas.';
    END IF;

    UPDATE "Restaurante"
    SET direccion = p_direccion,
        nombre_restaurante = p_nombre_restaurante,
        descripcion_restaurante = p_descripcion_restaurante,
        horario_apertura = p_horario_apertura,
        horario_cierre = p_horario_cierre,
        documento = p_documento,
        id_categoria = p_id_categoria
    WHERE restaurante_uid = p_restaurante_uid;
END;
$$ LANGUAGE plpgsql;
