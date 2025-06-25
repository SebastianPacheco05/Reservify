CREATE OR REPLACE FUNCTION borrar_comentarios(
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;
END;
$$ LANGUAGE plpgsql;
