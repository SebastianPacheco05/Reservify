CREATE OR REPLACE FUNCTION borrar_dueno(
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Dueno"
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
