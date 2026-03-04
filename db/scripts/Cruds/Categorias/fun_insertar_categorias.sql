CREATE OR REPLACE FUNCTION insertar_categoria(
    p_nombre_categoria VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "Categorias" (nombre_categoria)
    VALUES (p_nombre_categoria);
END;
$$ LANGUAGE plpgsql;
