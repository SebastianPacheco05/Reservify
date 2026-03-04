CREATE OR REPLACE FUNCTION editar_roles(
    p_id_rol INT,
    p_nombre_rol VARCHAR(15),
    p_descripcion VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Roles"
    SET nombre_rol = p_nombre_rol,
        descripcion = p_descripcion
    WHERE id_rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;
