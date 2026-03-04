CREATE OR REPLACE FUNCTION insertar_comentario(
    p_documento INT,
    p_nit INT,
    p_comentario TEXT,
    p_calificacion INT DEFAULT 5
) RETURNS VOID AS $$
BEGIN
    -- Verificar que la calificación esté entre 1 y 5
    IF p_calificacion < 1 OR p_calificacion > 5 THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5';
    END IF;
    
    -- Verificar si el usuario ya tiene un comentario para este restaurante
    IF EXISTS (
        SELECT 1 FROM "Comentarios" 
        WHERE documento = p_documento AND nit = p_nit
    ) THEN
        RAISE EXCEPTION 'Ya has dejado una reseña para este restaurante';
    END IF;
    
    INSERT INTO "Comentarios" (documento, nit, comentario, calificacion)
    VALUES (p_documento, p_nit, p_comentario, p_calificacion);
END;
$$ LANGUAGE plpgsql;
