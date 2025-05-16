CREATE OR REPLACE FUNCTION borrar_roles(
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Roles"
    WHERE id_rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;
