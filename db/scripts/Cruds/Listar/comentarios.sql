CREATE OR REPLACE FUNCTION get_comentario_by_id(p_id_comentario INTEGER)
RETURNS TABLE (
    comentario TEXT
)
LANGUAGE sql
AS $$
SELECT comentario
FROM "Comentarios"
WHERE id_comentario = p_id_comentario;
$$;

CREATE OR REPLACE FUNCTION list_comentarios()
RETURNS TABLE (
    id_comentario INTEGER,
    comentario TEXT
)
LANGUAGE sql
AS $$
SELECT id_comentario, comentario
FROM "Comentarios";
$$;