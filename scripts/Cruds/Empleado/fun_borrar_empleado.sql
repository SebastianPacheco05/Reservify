CREATE OR REPLACE FUNCTION borrar_empleado(
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Empleado"
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
