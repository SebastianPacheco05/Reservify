CREATE OR REPLACE FUNCTION borrar_dueño(
    p_id_dueño INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Dueño"
    WHERE id_dueño = p_id_dueño;
END;
$$ LANGUAGE plpgsql;
