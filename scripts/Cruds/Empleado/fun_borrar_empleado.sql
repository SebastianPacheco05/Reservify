CREATE OR REPLACE FUNCTION borrar_empleado(
    p_id_empleado INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Empleado"
    WHERE id_empleado = p_id_empleado;
END;
$$ LANGUAGE plpgsql;
