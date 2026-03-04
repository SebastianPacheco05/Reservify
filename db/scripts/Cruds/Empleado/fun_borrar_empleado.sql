CREATE OR REPLACE FUNCTION borrar_empleado(
    p_documento INT
) RETURNS VOID AS $$
BEGIN
    -- Elimina un usuario con rol de empleado desde la tabla unificada "Usuario"
    DELETE FROM "Usuario"
    WHERE documento = p_documento;
END;
$$ LANGUAGE plpgsql;
