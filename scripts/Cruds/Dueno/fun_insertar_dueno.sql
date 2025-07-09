CREATE OR REPLACE FUNCTION insertar_dueno(
    p_nombre VARCHAR(20),
    p_apellido VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Dueno" ( nombre, apellido, id_rol, id_credencial)
    VALUES (p_nombre, p_apellido, p_id_rol, p_id_credencial);
END;
$$ LANGUAGE plpgsql;
