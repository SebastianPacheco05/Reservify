CREATE OR REPLACE FUNCTION get_categoria_by_id(p_id_categoria INTEGER)
RETURNS TABLE (
    nombre_categoria VARCHAR
)
LANGUAGE sql
AS $$
SELECT nombre_categoria
FROM "Categorias"
WHERE id_categoria = p_id_categoria;
$$;

CREATE OR REPLACE FUNCTION list_categorias()
RETURNS TABLE (
    id_categoria INTEGER,
    nombre_categoria VARCHAR
)
LANGUAGE sql
AS $$
SELECT id_categoria, nombre_categoria
FROM "Categorias";
$$;