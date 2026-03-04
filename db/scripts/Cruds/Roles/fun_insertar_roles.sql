CREATE OR REPLACE FUNCTION insertar_roles(
    p_nombre_rol VARCHAR(15),
    p_descripcion VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Roles" (nombre_rol, descripcion)
    VALUES (p_nombre_rol, p_descripcion);
END;
$$ LANGUAGE plpgsql;


