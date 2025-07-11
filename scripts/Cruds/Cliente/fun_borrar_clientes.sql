CREATE OR REPLACE FUNCTION borrar_clientes(
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Cliente"
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
