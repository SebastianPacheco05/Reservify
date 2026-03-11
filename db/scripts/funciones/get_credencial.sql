-- Obtener id_credencial por email (util para recuperación de contraseña)
CREATE OR REPLACE FUNCTION fn_auth_get_credencial_id_by_email(p_email VARCHAR)
RETURNS INT
LANGUAGE sql
STABLE
AS $$
    SELECT c.id_credencial
    FROM "Credenciales" c
    WHERE LOWER(c.email) = LOWER(p_email)
    LIMIT 1;
$$;


-- Insertar código de recuperación y devolver el id generado
CREATE OR REPLACE FUNCTION fn_auth_insert_password_reset_code(
    p_id_credencial INT,
    p_code_hash VARCHAR,
    p_expires_at TIMESTAMP
)
RETURNS INT
LANGUAGE sql
AS $$
    INSERT INTO "Password_Reset_Codes"(id_credencial, code_hash, expires_at, used)
    VALUES (p_id_credencial, p_code_hash, p_expires_at, FALSE)
    RETURNING id;
$$;