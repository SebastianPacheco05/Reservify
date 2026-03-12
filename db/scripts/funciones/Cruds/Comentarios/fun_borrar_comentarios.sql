CREATE OR REPLACE FUNCTION borrar_comentarios(
    p_id_comentario INT
) RETURNS VOID AS $$
DECLARE
    v_nit INT;
    v_rating NUMERIC(3,1);
    v_reviews INT;
BEGIN
    -- Obtener el NIT del comentario antes de borrarlo
    SELECT nit INTO v_nit
    FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    -- Borrar comentario
    DELETE FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    -- Si encontramos un NIT, recalcular rating y reseñas
    IF v_nit IS NOT NULL THEN
        SELECT 
            COALESCE(AVG(calificacion), 0)::NUMERIC(3,1),
            COUNT(*)
        INTO v_rating, v_reviews
        FROM "Comentarios"
        WHERE nit = v_nit;

        UPDATE "Restaurante"
        SET
            rating = v_rating,
            reviews = v_reviews
        WHERE nit = v_nit;
    END IF;
END;
$$ LANGUAGE plpgsql;
