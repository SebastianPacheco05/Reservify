CREATE OR REPLACE FUNCTION existe_comentario(
    p_documento INT,
    p_nit INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM "Comentarios"
    WHERE documento = p_documento
      AND nit = p_nit;

    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

