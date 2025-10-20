-- Función para obtener el documento del cliente a partir del email
-- Esta función es segura ya que solo devuelve el documento si el email existe y pertenece a un cliente
CREATE OR REPLACE FUNCTION get_documento_by_email(p_email VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    v_documento DECIMAL;
BEGIN
    -- Buscar el documento del cliente usando el email
    SELECT c.documento INTO v_documento
    FROM "Cliente" c
    INNER JOIN "Credenciales" cred ON c.id_credencial = cred.id_credencial
    WHERE cred.email = p_email;
    
    -- Si no se encuentra el documento, devolver NULL
    IF v_documento IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN v_documento;
END;
$$ LANGUAGE plpgsql;
