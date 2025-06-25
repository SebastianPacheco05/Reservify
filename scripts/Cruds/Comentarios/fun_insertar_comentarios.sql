CREATE OR REPLACE FUNCTION insertar_comentario(
    p_id_cliente INT,
    p_nit INT,
    p_comentario VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Comentarios" (id_cliente, nit, comentario)
    VALUES (p_id_cliente, p_nit, p_comentario);
END;
$$ LANGUAGE plpgsql;
