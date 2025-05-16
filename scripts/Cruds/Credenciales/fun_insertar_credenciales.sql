CREATE OR REPLACE FUNCTION insertar_credenciales(
    p_id_credencial INT,
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Credenciales" (id_credencial, email, password)
    VALUES (p_id_credencial, p_email, p_password);
END;
$$ LANGUAGE plpgsql;
