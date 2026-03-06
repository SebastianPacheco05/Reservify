-- Archivo original: db/scripts/funciones/get_documento_by_email.sql

CREATE OR REPLACE FUNCTION get_documento_by_email(p_email VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    v_documento DECIMAL;
BEGIN
    SELECT u.documento INTO v_documento
    FROM "Usuario" u
    INNER JOIN "Credenciales" cred ON u.id_credencial = cred.id_credencial
    WHERE cred.email = p_email;

    IF v_documento IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN v_documento;
END;
$$ LANGUAGE plpgsql;

