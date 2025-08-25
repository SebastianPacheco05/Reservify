CREATE OR REPLACE FUNCTION registrar_cliente(
    p_email VARCHAR,
    p_password VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_tipo_documento VARCHAR,
    p_documento DECIMAL,
    p_nacionalidad VARCHAR,
    p_telefono VARCHAR,
    p_id_rol INT
) RETURNS INT AS $$
DECLARE
    v_id_credencial INT;
BEGIN
    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password)
    RETURNING id_credencial INTO v_id_credencial;

    INSERT INTO "Cliente" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol)
    VALUES (v_id_credencial, p_nombre, p_apellido, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol);

    RETURN v_id_credencial;
END;
$$ LANGUAGE plpgsql;

