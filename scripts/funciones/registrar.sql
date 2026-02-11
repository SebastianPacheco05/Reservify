-- Registro de usuario (tabla Usuario). nacionalidad y telefono opcionales; nit opcional (para rol empleado).
CREATE OR REPLACE FUNCTION registrar_usuario(
    p_email VARCHAR,
    p_password VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_tipo_documento VARCHAR,
    p_documento DECIMAL,
    p_nacionalidad VARCHAR,
    p_telefono VARCHAR,
    p_id_rol INT,
    p_nit DECIMAL DEFAULT NULL
) RETURNS INT AS $$
DECLARE
    v_id_credencial INT;
BEGIN
    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password)
    RETURNING id_credencial INTO v_id_credencial;

    INSERT INTO "Usuario" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit)
    VALUES (v_id_credencial, p_nombre, p_apellido, p_tipo_documento, p_documento, NULLIF(TRIM(p_nacionalidad), ''), NULLIF(TRIM(p_telefono), ''), p_id_rol, p_nit);

    RETURN v_id_credencial;
END;
$$ LANGUAGE plpgsql;
