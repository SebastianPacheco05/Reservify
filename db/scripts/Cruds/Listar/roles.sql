CREATE OR REPLACE FUNCTION list_roles()
RETURNS TABLE (
    id_rol INTEGER,
    nombre_rol VARCHAR,
    descripcion VARCHAR
) LANGUAGE sql AS $$
SELECT id_rol, nombre_rol, descripcion
FROM "Roles";
$$;

CREATE OR REPLACE FUNCTION get_role_by_id(p_id_rol INTEGER)
RETURNS TABLE (
    nombre_rol VARCHAR,
    descripcion VARCHAR
) LANGUAGE sql AS $$
SELECT nombre_rol, descripcion
FROM "Roles"
WHERE id_rol = p_id_rol;
$$;

