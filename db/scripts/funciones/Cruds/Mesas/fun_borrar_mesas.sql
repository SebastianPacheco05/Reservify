CREATE OR REPLACE FUNCTION borrar_mesas(
    p_id_mesa INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Mesas"
    WHERE id_mesa = p_id_mesa;
END;
$$ LANGUAGE plpgsql;
