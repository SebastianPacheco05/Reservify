CREATE OR REPLACE FUNCTION borrar_restaurante(
    p_NIT INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Restaurante"
    WHERE NIT = p_NIT;
END;
$$ LANGUAGE plpgsql;
