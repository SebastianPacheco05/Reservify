CREATE OR REPLACE FUNCTION list_empleados()
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER,
    nit NUMERIC
) LANGUAGE sql AS $$
SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit
FROM "Empleado";
$$;

CREATE OR REPLACE FUNCTION get_empleado_by_documento(p_documento NUMERIC)
RETURNS TABLE (
    id_credencial INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    tipo_documento VARCHAR,
    documento NUMERIC,
    nacionalidad VARCHAR,
    telefono VARCHAR,
    id_rol INTEGER,
    nit NUMERIC
) LANGUAGE sql AS $$
SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, nit
FROM "Empleado"
WHERE documento = p_documento;
$$;
