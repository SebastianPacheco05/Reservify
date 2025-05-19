CREATE OR REPLACE FUNCTION borrar_dueno(
    p_id_dueno INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Dueno"
    WHERE id_dueno = p_id_dueno;
END;
$$ LANGUAGE plpgsql;
