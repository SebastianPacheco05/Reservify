CREATE OR REPLACE FUNCTION borrar_comentario(p_id_comentario INT) RETURNS VOID AS $$
DECLARE
    v_uid UUID;
    v_rating NUMERIC(3, 1);
    v_reviews INT;
BEGIN
    SELECT restaurante_uid INTO v_uid
    FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    DELETE FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;

    IF v_uid IS NOT NULL THEN
        SELECT
            COALESCE(AVG(calificacion), 0)::NUMERIC(3, 1),
            COUNT(*)
        INTO v_rating, v_reviews
        FROM "Comentarios"
        WHERE restaurante_uid = v_uid;

        UPDATE "Restaurante"
        SET rating = v_rating, reviews = v_reviews
        WHERE restaurante_uid = v_uid;
    END IF;
END;
$$ LANGUAGE plpgsql;
