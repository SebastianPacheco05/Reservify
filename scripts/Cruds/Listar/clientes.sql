CREATE OR REPLACE FUNCTION list_clientes()
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER
) LANGUAGE sql AS $$
SELECT u.id_credencial,
       u.nombre,
       u.apellido,
       u.tipo_documento,
       u.documento,
       u.nacionalidad,
       u.telefono,
       u.id_rol
FROM "Usuario" u
JOIN "Roles" r ON u.id_rol = r.id_rol
WHERE LOWER(TRIM(r.nombre_rol)) = 'cliente';
$$;

CREATE OR REPLACE FUNCTION get_cliente_by_documento(p_documento NUMERIC)
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER
) LANGUAGE sql AS $$
SELECT u.id_credencial,
       u.nombre,
       u.apellido,
       u.tipo_documento,
       u.documento,
       u.nacionalidad,
       u.telefono,
       u.id_rol
FROM "Usuario" u
JOIN "Roles" r ON u.id_rol = r.id_rol
WHERE LOWER(TRIM(r.nombre_rol)) = 'cliente'
  AND u.documento = p_documento;
$$;

