CREATE OR REPLACE FUNCTION insertar_roles(
    p_id_rol INT,
    p_nombre_rol VARCHAR(15),
    p_descripcion VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Roles" (id_rol, nombre_rol, descripcion)
    VALUES (p_id_rol, p_nombre_rol, p_descripcion);
END;
$$ LANGUAGE plpgsql;
