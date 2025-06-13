CREATE OR REPLACE FUNCTION borrar_categoria(
    p_id_categoria INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM "Categorias"
    WHERE id_categoria = p_id_categoria;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la categoría con ID %', p_id_categoria;
    END IF;
END;
$$ LANGUAGE plpgsql;