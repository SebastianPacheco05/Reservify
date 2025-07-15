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
SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol
FROM "Cliente";
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
SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol
FROM "Cliente"
WHERE documento = p_documento;
$$;

