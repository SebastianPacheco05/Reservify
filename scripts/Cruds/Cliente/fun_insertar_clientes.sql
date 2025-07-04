CREATE OR REPLACE FUNCTION insertar_clientes(
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_nombre2 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_apellido2 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Cliente" (id_credencial, nombre1, nombre2, apellido1, apellido2, tipo_documento, documento, nacionalidad, telefono, id_rol)
    VALUES (p_id_credencial, p_nombre1, p_nombre2, p_apellido1, p_apellido2, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol);
    -- Exepciones en la base de datos
    IF NOT p_id_credencial THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con id_credencial: %', p_id_credencial;
    END IF;
    IF NOT p_documento THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con documento: %', p_documento;
    END IF;
    IF NOT p_telefono THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con telefono: %', p_telefono;
    END IF;
END;
$$ LANGUAGE plpgsql;
