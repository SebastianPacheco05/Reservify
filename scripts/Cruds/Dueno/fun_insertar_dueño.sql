CREATE OR REPLACE FUNCTION insertar_dueño(
    p_id_dueño INT,
    p_nombre1 VARCHAR(20),
    p_nombre2 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_apellido2 VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Dueño" (id_dueño, nombre1, nombre2, apellido1, apellido2, id_rol, id_credencial)
    VALUES (p_id_dueño, p_nombre1, p_nombre2, p_apellido1, p_apellido2, p_id_rol, p_id_credencial);
END;
$$ LANGUAGE plpgsql;
