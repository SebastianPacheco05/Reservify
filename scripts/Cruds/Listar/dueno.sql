CREATE OR REPLACE FUNCTION list_duenos()
RETURNS TABLE (
    documento NUMERIC,
    nombre VARCHAR,
    apellido VARCHAR,
    id_rol INTEGER,
    id_credencial INTEGER
) LANGUAGE sql AS $$
SELECT documento, nombre, apellido, id_rol, id_credencial
FROM "Dueno";
$$;

CREATE OR REPLACE FUNCTION get_dueno_by_documento(p_documento NUMERIC)
RETURNS TABLE (
    nombre VARCHAR,
    apellido VARCHAR,
    id_rol INTEGER,
    id_credencial INTEGER
) LANGUAGE sql AS $$
SELECT nombre, apellido, id_rol, id_credencial
FROM "Dueno"
WHERE documento = p_documento;
$$;

