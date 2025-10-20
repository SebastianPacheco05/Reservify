CREATE OR REPLACE FUNCTION borrar_restaurante(
    p_nit INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Restaurante"
    WHERE nit = p_nit;
END;
$$ LANGUAGE plpgsql;
