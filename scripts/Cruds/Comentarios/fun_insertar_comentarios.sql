CREATE OR REPLACE FUNCTION insertar_comentario(
    p_id_cliente VARCHAR(100),
    p_id_restaurante VARCHAR(255),
    p_comentario VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Comentarios" (id_cliente, id_restaurante, comentario)
    VALUES (p_id_cliente, p_id_restaurante, p_comentario);
END;
$$ LANGUAGE plpgsql;
