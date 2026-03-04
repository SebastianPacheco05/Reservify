CREATE OR REPLACE FUNCTION insertar_credenciales(
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password);
END;
$$ LANGUAGE plpgsql;
