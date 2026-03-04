CREATE OR REPLACE FUNCTION editar_categoria(
    p_id_categoria INT,
    p_nombre_categoria VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE "Categorias"
    SET nombre_categoria = p_nombre_categoria
    WHERE id_categoria = p_id_categoria;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la categoría con ID %', p_id_categoria;
    END IF;
END;
$$ LANGUAGE plpgsql;
