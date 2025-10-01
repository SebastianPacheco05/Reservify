CREATE OR REPLACE FUNCTION get_dashboard_route(p_id_credencial INT)
RETURNS TEXT AS $$
DECLARE
    v_ruta TEXT;
BEGIN
    -- 1. Verificar si es Dueño
    IF EXISTS (
        SELECT 1 FROM "Dueno" d WHERE d.id_credencial = p_id_credencial
    ) THEN
        v_ruta := '/DuenoDashboard';

    -- 2. Verificar si es Empleado
    ELSIF EXISTS (
        SELECT 1 FROM "Empleado" e WHERE e.id_credencial = p_id_credencial
    ) THEN
        v_ruta := '/EmpleadoDashboard';

    -- 3. Verificar si es Cliente
    ELSIF EXISTS (
        SELECT 1 FROM "Cliente" c WHERE c.id_credencial = p_id_credencial
    ) THEN
        v_ruta := '/';

    -- 4. Fallback en caso de que no esté en ninguna tabla
    ELSE
        v_ruta := '/';
    END IF;

    RETURN v_ruta;
END;
$$ LANGUAGE plpgsql;
