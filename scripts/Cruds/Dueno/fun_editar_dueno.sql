CREATE OR REPLACE FUNCTION editar_dueno(
    p_documento INT,
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Dueno"
    SET nombre = p_nombre,
        apellido = p_apellido,
        id_rol = p_id_rol,
        id_credencial = p_id_credencial
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
