CREATE OR REPLACE FUNCTION insertar_clientes(
    p_id_credencial INT,
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Cliente" (id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol)
    VALUES (p_id_credencial, p_nombre, p_apellido, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol);
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
