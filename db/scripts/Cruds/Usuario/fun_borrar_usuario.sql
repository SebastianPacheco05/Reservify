CREATE OR REPLACE FUNCTION borrar_usuario(p_documento INT) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Usuario" WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
