CREATE OR REPLACE FUNCTION editar_dueno(
    p_id_dueno INT,
    p_nombre1 VARCHAR(20),
    p_nombre2 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_apellido2 VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Dueno"
    SET nombre1 = p_nombre1,
        nombre2 = p_nombre2,
        apellido1 = p_apellido1,
        apellido2 = p_apellido2,
        id_rol = p_id_rol,
        id_credencial = p_id_credencial
    WHERE id_dueno = p_id_dueno;
END;
$$ LANGUAGE plpgsql;
