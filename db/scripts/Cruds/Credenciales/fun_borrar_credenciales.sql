CREATE OR REPLACE FUNCTION borrar_credenciales(
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Credenciales"
    WHERE id_credencial = p_id_credencial;
END;
$$ LANGUAGE plpgsql;
