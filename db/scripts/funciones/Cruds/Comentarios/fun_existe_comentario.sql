CREATE OR REPLACE FUNCTION existe_comentario(
    p_documento INT,
    p_restaurante_uid UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM "Comentarios"
    WHERE documento = p_documento
      AND restaurante_uid = p_restaurante_uid;

    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

