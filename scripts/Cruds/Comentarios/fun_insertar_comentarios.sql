CREATE OR REPLACE FUNCTION insertar_comentario(
    p_documento INT,
    p_nit INT,
    p_comentario VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Comentarios" (documento, nit, comentario)
    VALUES (p_documento, p_nit, p_comentario);
END;
$$ LANGUAGE plpgsql;
