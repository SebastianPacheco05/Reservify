CREATE OR REPLACE FUNCTION editar_credenciales(
    p_id_credencial INT,
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Credenciales"
    SET email = p_email,
        password = p_password
    WHERE id_credencial = p_id_credencial;
END;
$$ LANGUAGE plpgsql;
