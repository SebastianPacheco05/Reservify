CREATE OR REPLACE FUNCTION borrar_clientes(
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    -- Elimina un usuario (cliente) desde la tabla unificada "Usuario"
    DELETE FROM "Usuario"
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
