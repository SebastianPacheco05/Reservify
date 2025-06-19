CREATE OR REPLACE FUNCTION editar_comentarios(
    p_id_comentario INT,
	p_comentario varchar
) RETURNS VOID AS $$
BEGIN
    UPDATE "Comentarios"
    SET comentario = p_comentario
    WHERE id_comentario = p_id_comentario;
END;
$$ LANGUAGE plpgsql;