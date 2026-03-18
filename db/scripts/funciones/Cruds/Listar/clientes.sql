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
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
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
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
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
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
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
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;

