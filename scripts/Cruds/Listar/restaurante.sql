CREATE OR REPLACE FUNCTION list_restaurantes()
RETURNS TABLE (
    nit NUMERIC,
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    descripcion_restaurante VARCHAR,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC
) LANGUAGE sql AS $$
SELECT NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento
FROM "Restaurante";
$$;

CREATE OR REPLACE FUNCTION get_restaurante_by_nit(p_nit NUMERIC)
RETURNS TABLE (
    nit NUMERIC,
    direccion VARCHAR,
    nombre_restaurante VARCHAR,
    descripcion_restaurante VARCHAR,
    horario_apertura TIME,
    horario_cierre TIME,
    documento NUMERIC
) LANGUAGE sql AS $$
SELECT NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento
FROM "Restaurante"
WHERE NIT = p_nit;
$$;